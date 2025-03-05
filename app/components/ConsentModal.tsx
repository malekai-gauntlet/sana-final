import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  Pressable,
  Linking
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Checkbox from 'expo-checkbox';

interface ConsentModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: () => void;
}

export const ConsentModal = ({ visible, onClose, onSubmit }: ConsentModalProps) => {
  const [privacyChecked, setPrivacyChecked] = useState(false);
  const [consentChecked, setConsentChecked] = useState(false);

  const handleSubmit = () => {
    if (!privacyChecked || !consentChecked) {
      alert('Please acknowledge both items before proceeding.');
      return;
    }
    onSubmit();
  };

  const openPrivacyPolicy = () => {
    Linking.openURL('https://sanacare.com/privacy-policy');
  };

  const openConsentPolicy = () => {
    Linking.openURL('https://sanacare.com/telehealth-consent');
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          {/* Close button */}
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Ionicons name="close" size={24} color="#000" />
          </TouchableOpacity>

          {/* Title */}
          <Text style={styles.title}>
            First, we need your permission to treat you.
          </Text>

          {/* Subtitle */}
          <Text style={styles.subtitle}>
            Once you give your consent and acknowledge our privacy practices, we can get started.
          </Text>

          {/* Privacy Policy Checkbox */}
          <View style={styles.checkboxContainer}>
            <Checkbox
              value={privacyChecked}
              onValueChange={setPrivacyChecked}
              style={styles.checkbox}
              color={privacyChecked ? '#007AFF' : undefined}
            />
            <Text style={styles.checkboxText}>
              I acknowledge receipt of this{' '}
              <Text style={styles.link} onPress={openPrivacyPolicy}>
                Privacy Policy
              </Text>
            </Text>
          </View>

          {/* Consent Text */}
          <Text style={styles.consentText}>
            By consenting to care with Sana Care, you agree to the{' '}
            <Text style={styles.link} onPress={openConsentPolicy}>
              Sana Care Consent to Telehealth
            </Text>
            {' '}policy.
          </Text>

          {/* Consent Checkbox */}
          <View style={styles.checkboxContainer}>
            <Checkbox
              value={consentChecked}
              onValueChange={setConsentChecked}
              style={styles.checkbox}
              color={consentChecked ? '#007AFF' : undefined}
            />
            <Text style={styles.checkboxText}>
              I consent to care from Sana Care and understand my consent will remain in effect unless I withdraw it. I may withdraw my consent at any time
            </Text>
          </View>

          {/* Buttons */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={onClose}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.submitButton,
                (!privacyChecked || !consentChecked) && styles.submitButtonDisabled
              ]}
              onPress={handleSubmit}
              disabled={!privacyChecked || !consentChecked}
            >
              <Text style={styles.submitButtonText}>Submit and send</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 24,
    width: '100%',
    maxWidth: 500,
  },
  closeButton: {
    position: 'absolute',
    right: 16,
    top: 16,
    zIndex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 12,
    color: '#000',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 24,
    lineHeight: 22,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
    gap: 12,
  },
  checkbox: {
    marginTop: 4,
  },
  checkboxText: {
    flex: 1,
    fontSize: 14,
    color: '#000',
    lineHeight: 20,
  },
  consentText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
    lineHeight: 20,
  },
  link: {
    color: '#007AFF',
    textDecorationLine: 'underline',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    marginTop: 24,
  },
  cancelButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '500',
  },
  submitButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  submitButtonDisabled: {
    backgroundColor: '#B4D8FE',
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
}); 