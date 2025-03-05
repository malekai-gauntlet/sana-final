import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import { router } from 'expo-router';

export default function LoginScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSignup = () => {
    router.push('/(auth)/signup');
  };

  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        <View style={styles.formContainer}>
          <Text style={styles.label}>Username</Text>
          <TextInput
            style={styles.input}
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
            placeholder="Enter your username"
          />

          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoCapitalize="none"
            placeholder="Enter your password"
          />

          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Sign In</Text>
          </TouchableOpacity>

          <View style={styles.forgotLinksContainer}>
            <TouchableOpacity style={styles.linkContainer}>
              <Text style={styles.link}>Forgot username?</Text>
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
    backgroundColor: '#5A2ED2',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 32,
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
}); 