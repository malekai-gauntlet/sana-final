import * as SecureStore from 'expo-secure-store';
import * as LocalAuthentication from 'expo-local-authentication';
import { Alert } from 'react-native';

interface LoginResponse {
  token: string;
  user: {
    id: number;
    email: string;
  };
}

// Mock data for development
const MOCK_TOKEN = 'mock_primary_token_12345';
const MOCK_EXPIRY = Date.now() + 24 * 60 * 60 * 1000; // 24 hours from now

class AuthService {
  private baseUrl = 'http://localhost/member_portal/api'; // Remove the :3000
  private static readonly PRIMARY_TOKEN_KEY = 'primary_token';
  private static readonly BIOMETRIC_ENABLED_KEY = 'biometric_enabled';
  private static readonly STORED_EMAIL_KEY = 'stored_email';
  private static readonly STORED_PASSWORD_KEY = 'stored_password';
  private static readonly PIN_KEY = 'auth_pin';
  private static readonly MAX_PIN_ATTEMPTS = 3;
  private static readonly PIN_ATTEMPT_COUNT_KEY = 'pin_attempt_count';
  private static readonly PIN_LOCKOUT_TIME_KEY = 'pin_lockout_time';

  async isBiometricAvailable(): Promise<boolean> {
    const available = await LocalAuthentication.hasHardwareAsync();
    const types = await LocalAuthentication.supportedAuthenticationTypesAsync();
    return available && types.length > 0;
  }

  async isBiometricEnabled(): Promise<boolean> {
    const enabled = await SecureStore.getItemAsync(AuthService.BIOMETRIC_ENABLED_KEY);
    return enabled === 'true';
  }

  async enableBiometric(email: string, password: string, pin: string): Promise<boolean> {
    try {
      // Check if biometric is available
      if (!await this.isBiometricAvailable()) {
        return false;
      }

      // Validate PIN format (4-6 digits)
      if (!/^\d{4,6}$/.test(pin)) {
        return false;
      }

      // Store credentials securely
      await SecureStore.setItemAsync(AuthService.STORED_EMAIL_KEY, email);
      await SecureStore.setItemAsync(AuthService.STORED_PASSWORD_KEY, password);
      await SecureStore.setItemAsync(AuthService.PIN_KEY, pin);
      await SecureStore.setItemAsync(AuthService.BIOMETRIC_ENABLED_KEY, 'true');
      await SecureStore.deleteItemAsync(AuthService.PIN_ATTEMPT_COUNT_KEY);
      await SecureStore.deleteItemAsync(AuthService.PIN_LOCKOUT_TIME_KEY);

      return true;
    } catch (error) {
      console.error('Error enabling biometric:', error);
      return false;
    }
  }

  async authenticateWithBiometric(): Promise<boolean> {
    try {
      // Check if biometric is enabled
      if (!await this.isBiometricEnabled()) {
        return false;
      }

      // Authenticate with biometric
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Log in with Face ID',
        fallbackLabel: 'Use PIN',
        cancelLabel: 'Cancel',
        disableDeviceFallback: true, // We'll handle PIN fallback ourselves
      });

      if (!result.success) {
        return false;
      }

      // Get stored credentials
      const email = await SecureStore.getItemAsync(AuthService.STORED_EMAIL_KEY);
      const password = await SecureStore.getItemAsync(AuthService.STORED_PASSWORD_KEY);

      if (!email || !password) {
        return false;
      }

      // Login with stored credentials
      return this.login(email, password);
    } catch (error) {
      console.error('Biometric authentication error:', error);
      return false;
    }
  }

  async authenticateWithPIN(pin: string): Promise<boolean> {
    try {
      // Check if locked out
      const lockoutTime = await SecureStore.getItemAsync(AuthService.PIN_LOCKOUT_TIME_KEY);
      if (lockoutTime) {
        const lockoutUntil = parseInt(lockoutTime, 10);
        if (Date.now() < lockoutUntil) {
          const minutesLeft = Math.ceil((lockoutUntil - Date.now()) / (1000 * 60));
          throw new Error(`Too many attempts. Try again in ${minutesLeft} minutes.`);
        } else {
          // Lockout period expired, reset attempts
          await SecureStore.deleteItemAsync(AuthService.PIN_ATTEMPT_COUNT_KEY);
          await SecureStore.deleteItemAsync(AuthService.PIN_LOCKOUT_TIME_KEY);
        }
      }

      // Get stored PIN and attempt count
      const storedPIN = await SecureStore.getItemAsync(AuthService.PIN_KEY);
      const attemptCount = parseInt(await SecureStore.getItemAsync(AuthService.PIN_ATTEMPT_COUNT_KEY) || '0', 10);

      if (attemptCount >= AuthService.MAX_PIN_ATTEMPTS) {
        // Set 1 hour lockout
        const lockoutUntil = Date.now() + (60 * 60 * 1000);
        await SecureStore.setItemAsync(AuthService.PIN_LOCKOUT_TIME_KEY, lockoutUntil.toString());
        throw new Error('Too many attempts. Try again in 60 minutes.');
      }

      if (pin !== storedPIN) {
        // Increment attempt count
        await SecureStore.setItemAsync(
          AuthService.PIN_ATTEMPT_COUNT_KEY,
          (attemptCount + 1).toString()
        );
        const remainingAttempts = AuthService.MAX_PIN_ATTEMPTS - (attemptCount + 1);
        throw new Error(`Invalid PIN. ${remainingAttempts} attempts remaining.`);
      }

      // PIN is correct, reset attempt count
      await SecureStore.deleteItemAsync(AuthService.PIN_ATTEMPT_COUNT_KEY);
      await SecureStore.deleteItemAsync(AuthService.PIN_LOCKOUT_TIME_KEY);

      // Get stored credentials
      const email = await SecureStore.getItemAsync(AuthService.STORED_EMAIL_KEY);
      const password = await SecureStore.getItemAsync(AuthService.STORED_PASSWORD_KEY);

      if (!email || !password) {
        return false;
      }

      // Login with stored credentials
      return this.login(email, password);
    } catch (error) {
      throw error;
    }
  }

  async disableBiometric(): Promise<void> {
    await SecureStore.deleteItemAsync(AuthService.BIOMETRIC_ENABLED_KEY);
    await SecureStore.deleteItemAsync(AuthService.STORED_EMAIL_KEY);
    await SecureStore.deleteItemAsync(AuthService.STORED_PASSWORD_KEY);
    await SecureStore.deleteItemAsync(AuthService.PIN_KEY);
    await SecureStore.deleteItemAsync(AuthService.PIN_ATTEMPT_COUNT_KEY);
    await SecureStore.deleteItemAsync(AuthService.PIN_LOCKOUT_TIME_KEY);
  }

  async login(email: string, password: string): Promise<boolean> {
    try {
      const url = `${this.baseUrl}/session`;
      console.log('🔐 Login Request:', { url, email });
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      // Log response details
      console.log('🔐 Login Response Status:', response.status);
      const responseText = await response.text();
      console.log('🔐 Login Response:', responseText);

      if (!response.ok) {
        console.log('❌ Login failed:', response.status, responseText);
        return false;
      }

      const data: LoginResponse = JSON.parse(responseText);
      await SecureStore.setItemAsync(AuthService.PRIMARY_TOKEN_KEY, data.token);
      console.log('✅ Login successful, token stored');
      return true;
    } catch (error) {
      console.error('❌ Login error:', error);
      return false;
    }
  }

  async logout(): Promise<void> {
    try {
      // Just clear the token locally
      await SecureStore.deleteItemAsync(AuthService.PRIMARY_TOKEN_KEY);
    } catch (error) {
      console.error('Logout error:', error);
    }
  }

  async getPrimaryToken(): Promise<string | null> {
    const token = await SecureStore.getItemAsync(AuthService.PRIMARY_TOKEN_KEY);
    return token || null;
  }

  async isAuthenticated(): Promise<boolean> {
    const token = await this.getPrimaryToken();
    return !!token;
  }

  // Add signup method
  async signup(name: string, email: string, password: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });

      if (!response.ok) {
        return false;
      }

      // After successful signup, log the user in
      return this.login(email, password);
    } catch (error) {
      console.error('Signup error:', error);
      return false;
    }
  }

  // Add this debug method
  async debugToken(): Promise<void> {
    try {
      const token = await SecureStore.getItemAsync(AuthService.PRIMARY_TOKEN_KEY);
      console.log('Stored token:', token);
    } catch (error) {
      console.error('Error checking token:', error);
    }
  }
}

// Export a single instance to be used throughout the app
export const authService = new AuthService(); 