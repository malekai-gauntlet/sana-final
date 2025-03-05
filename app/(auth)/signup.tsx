import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import { router } from 'expo-router';

export default function SignupScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignIn = () => {
    router.back();
  };

  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        <View style={styles.formContainer}>
          <Text style={styles.label}>Name</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Enter your name"
          />

          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            placeholder="Enter your email"
          />

          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoCapitalize="none"
            placeholder="Create a password"
          />

          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Create Account</Text>
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity style={styles.setupAccount} onPress={handleSignIn}>
        <Text style={styles.link}>Already have an account? Sign in</Text>
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