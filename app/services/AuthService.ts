import * as SecureStore from 'expo-secure-store';

interface LoginResponse {
  access_token: string;
  expires_at: number;
}

// Mock data for development
const MOCK_TOKEN = 'mock_primary_token_12345';
const MOCK_EXPIRY = Date.now() + 24 * 60 * 60 * 1000; // 24 hours from now

class AuthService {
  private baseUrl = 'http://localhost:3000/member_portal/api'; // Keep for future use
  private static readonly PRIMARY_TOKEN_KEY = 'primary_token';

  async login(email: string, password: string): Promise<boolean> {
    try {
      // Mock successful login
      if (email && password) {
        const mockResponse: LoginResponse = {
          access_token: MOCK_TOKEN,
          expires_at: MOCK_EXPIRY
        };
        
        await SecureStore.setItemAsync(AuthService.PRIMARY_TOKEN_KEY, mockResponse.access_token);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
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
}

// Export a single instance to be used throughout the app
export const authService = new AuthService(); 