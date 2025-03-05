import { View, Text, StyleSheet, TextInput, TouchableOpacity, ActivityIndicator, Alert, Modal } from 'react-native';
import { useState, useEffect } from 'react';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { authService } from '../services/AuthService';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [pin, setPin] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [biometricAvailable, setBiometricAvailable] = useState(false);
  const [biometricEnabled, setBiometricEnabled] = useState(false);
  const [showPinModal, setShowPinModal] = useState(false);
  const [isPinSetup, setIsPinSetup] = useState(false);
  const [pinError, setPinError] = useState('');

  useEffect(() => {
    checkBiometric();
  }, []);

  const checkBiometric = async () => {
    const available = await authService.isBiometricAvailable();
    const enabled = await authService.isBiometricEnabled();
    setBiometricAvailable(available);
    setBiometricEnabled(enabled);

    // If biometric is enabled, try to authenticate immediately
    if (available && enabled) {
      handleBiometricAuth();
    }
  };

  const handleSignup = () => {
    router.push('/(auth)/signup');
  };

  const handleBiometricAuth = async () => {
    setIsLoading(true);
    try {
      const success = await authService.authenticateWithBiometric();
      if (success) {
        router.replace('/(tabs)');
      } else {
        // If biometric fails, show PIN modal
        setShowPinModal(true);
      }
    } catch (error) {
      console.error('Biometric auth error:', error);
      // Show PIN modal on error
      setShowPinModal(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePinSubmit = async () => {
    if (pin.length < 4 || pin.length > 6) {
      setPinError('PIN must be 4-6 digits');
      return;
    }

    setIsLoading(true);
    setPinError('');

    try {
      if (isPinSetup) {
        // Setting up new PIN
        const success = await authService.enableBiometric(email, password, pin);
        if (success) {
          router.replace('/(tabs)');
        } else {
          setPinError('Failed to set up PIN');
        }
      } else {
        // Authenticating with existing PIN
        const success = await authService.authenticateWithPIN(pin);
        if (success) {
          router.replace('/(tabs)');
        }
      }
    } catch (error) {
      setPinError(error instanceof Error ? error.message : 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignIn = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password');
      return;
    }

    setIsLoading(true);
    try {
      const success = await authService.login(email, password);
      if (success) {
        // Add this line to verify token
        await authService.debugToken();
        
        if (biometricAvailable && !biometricEnabled) {
          Alert.alert(
            'Enable Face ID',
            'Would you like to enable Face ID for faster login? You\'ll also set up a PIN as a backup.',
            [
              {
                text: 'Not Now',
                style: 'cancel',
                onPress: () => router.replace('/(tabs)')
              },
              {
                text: 'Enable',
                onPress: () => {
                  setIsPinSetup(true);
                  setShowPinModal(true);
                }
              }
            ]
          );
        } else {
          router.replace('/(tabs)');
        }
      } else {
        Alert.alert('Error', 'Invalid email or password');
      }
    } catch (error) {
      Alert.alert('Error', 'Something went wrong. Please try again.');
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        <View style={styles.formContainer}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            autoComplete="email"
            placeholder="Enter your email"
          />

          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoCapitalize="none"
            autoComplete="password"
            placeholder="Enter your password"
          />

          <TouchableOpacity 
            style={[styles.button, isLoading && styles.buttonDisabled]} 
            onPress={handleSignIn}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.buttonText}>Sign In</Text>
            )}
          </TouchableOpacity>

          {biometricAvailable && biometricEnabled && (
            <TouchableOpacity 
              style={styles.biometricButton}
              onPress={handleBiometricAuth}
              disabled={isLoading}
            >
              <Ionicons name="finger-print-outline" size={24} color="#007AFF" />
              <Text style={styles.biometricText}>Sign in with Face ID</Text>
            </TouchableOpacity>
          )}

          <View style={styles.forgotLinksContainer}>
            <TouchableOpacity style={styles.linkContainer}>
              <Text style={styles.link}>Forgot email?</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.linkContainer}>
              <Text style={styles.link}>Forgot password?</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <TouchableOpacity style={styles.setupAccount} onPress={handleSignup}>
        <Text style={styles.link}>Set up your account</Text>
      </TouchableOpacity>

      <Modal
        visible={showPinModal}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {isPinSetup ? 'Set Up PIN' : 'Enter PIN'}
            </Text>
            <Text style={styles.modalSubtitle}>
              {isPinSetup 
                ? 'Create a 4-6 digit PIN as a backup for Face ID'
                : 'Enter your PIN to continue'}
            </Text>
            
            <TextInput
              style={styles.pinInput}
              value={pin}
              onChangeText={setPin}
              keyboardType="numeric"
              secureTextEntry
              maxLength={6}
              placeholder="Enter PIN"
              autoFocus
            />

            {pinError ? (
              <Text style={styles.errorText}>{pinError}</Text>
            ) : null}

            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={styles.modalButton}
                onPress={() => {
                  setShowPinModal(false);
                  setPin('');
                  setPinError('');
                }}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.modalButton, styles.modalButtonPrimary]}
                onPress={handlePinSubmit}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text style={styles.modalButtonTextPrimary}>
                    {isPinSetup ? 'Set PIN' : 'Continue'}
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  formContainer: {
    padding: 24,
  },
  label: {
    fontSize: 17,
    color: '#666',
    marginBottom: 8,
    fontWeight: '400',
  },
  input: {
    borderWidth: 1,
    borderColor: '#E1E1E1',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
    fontSize: 17,
    backgroundColor: '#FFFFFF',
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 32,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '600',
  },
  forgotLinksContainer: {
    gap: 16,
    alignItems: 'center',
  },
  linkContainer: {
    alignItems: 'center',
  },
  link: {
    color: '#007AFF',
    fontSize: 17,
    fontWeight: '400',
  },
  setupAccount: {
    alignItems: 'center',
    paddingBottom: 40,
  },
  biometricButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    marginTop: 8,
  },
  biometricText: {
    color: '#007AFF',
    fontSize: 17,
    fontWeight: '400',
    marginLeft: 8,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    width: '85%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  modalSubtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 24,
    textAlign: 'center',
  },
  pinInput: {
    borderWidth: 1,
    borderColor: '#E1E1E1',
    padding: 16,
    borderRadius: 12,
    fontSize: 24,
    width: '100%',
    textAlign: 'center',
    letterSpacing: 8,
    marginBottom: 16,
  },
  errorText: {
    color: '#FF3B30',
    marginBottom: 16,
    textAlign: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 8,
  },
  modalButton: {
    flex: 1,
    padding: 16,
    alignItems: 'center',
    marginHorizontal: 8,
  },
  modalButtonPrimary: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
  },
  modalButtonText: {
    color: '#007AFF',
    fontSize: 17,
    fontWeight: '600',
  },
  modalButtonTextPrimary: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '600',
  },
}); 