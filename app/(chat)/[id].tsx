import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { useState, useEffect, useRef } from 'react';
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { messagingService, type Message } from '../services/MessagingService';

// Header component
const Header = () => (
  <View style={styles.header}>
    <TouchableOpacity 
      style={styles.backButton} 
      onPress={() => router.back()}
    >
      <Ionicons name="chevron-back" size={28} color="#007AFF" />
      <Text style={styles.backText}>Messages</Text>
    </TouchableOpacity>
  </View>
);

// Message bubble component
const MessageBubble = ({ message }: { message: Message }) => {
  const isProvider = message.author.type === 'provider';
  
  return (
    <View style={[
      styles.messageBubbleContainer,
      isProvider ? styles.providerMessage : styles.patientMessage
    ]}>
      <View style={[
        styles.messageBubble,
        isProvider ? styles.providerBubble : styles.patientBubble
      ]}>
        <Text style={[
          styles.messageText,
          isProvider ? styles.providerText : styles.patientText
        ]}>
          {message.text}
        </Text>
        <Text style={[
          styles.messageTime,
          isProvider ? styles.providerTime : styles.patientTime
        ]}>
          {new Date(message.timestamp).toLocaleTimeString([], { 
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
          })}
        </Text>
      </View>
    </View>
  );
};

export default function ChatScreen() {
  const { id } = useLocalSearchParams();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    loadMessages();
  }, []);

  const loadMessages = async () => {
    try {
      setIsLoading(true);
      const fetchedMessages = await messagingService.getMessages(id as string);
      // Sort messages by timestamp in ascending order (oldest first)
      const sortedMessages = [...fetchedMessages].sort((a, b) => 
        new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
      );
      setMessages(sortedMessages);
    } catch (error) {
      console.error('Error loading messages:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSend = async () => {
    if (!newMessage.trim()) return;

    const message = await messagingService.sendMessage(id as string, newMessage.trim());
    if (message) {
      setMessages(prev => [...prev, message]);
      setNewMessage('');
      // Scroll to bottom after sending
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <View style={styles.safeArea}>
        <Header />
        <ScrollView
          ref={scrollViewRef}
          style={styles.messagesList}
          contentContainerStyle={styles.messagesContent}
          onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: false })}
        >
          {messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))}
        </ScrollView>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={newMessage}
            onChangeText={setNewMessage}
            placeholder="Type a message..."
            multiline
            maxLength={1000}
            placeholderTextColor="#8E8E93"
          />
          <TouchableOpacity 
            style={[styles.sendButton, !newMessage.trim() && styles.sendButtonDisabled]} 
            onPress={handleSend}
            disabled={!newMessage.trim()}
          >
            <Ionicons 
              name="send" 
              size={24} 
              color={newMessage.trim() ? '#007AFF' : '#8E8E93'} 
            />
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  safeArea: {
    flex: 1,
    paddingTop: Platform.OS === 'ios' ? 44 : 16, // Add safe area padding for notch
  },
  header: {
    height: 44,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
    backgroundColor: '#F2F2F7',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 44,
    paddingHorizontal: 8,
  },
  backText: {
    fontSize: 17,
    color: '#007AFF',
    marginLeft: -4,
  },
  messagesList: {
    flex: 1,
  },
  messagesContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 16,
  },
  messageBubbleContainer: {
    flexDirection: 'row',
    marginVertical: 4, // Reduce vertical spacing between messages
  },
  providerMessage: {
    justifyContent: 'flex-start',
  },
  patientMessage: {
    justifyContent: 'flex-end',
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 20,
  },
  providerBubble: {
    backgroundColor: '#E9E9EB',
    borderTopLeftRadius: 4,
  },
  patientBubble: {
    backgroundColor: '#007AFF',
    borderTopRightRadius: 4,
  },
  messageText: {
    fontSize: 16,
    marginBottom: 4,
  },
  providerText: {
    color: '#000000',
  },
  patientText: {
    color: '#FFFFFF',
  },
  messageTime: {
    fontSize: 12,
    alignSelf: 'flex-end',
  },
  providerTime: {
    color: '#8E8E93',
  },
  patientTime: {
    color: 'rgba(255, 255, 255, 0.7)',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 12, // Slightly reduce padding
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E5EA',
    alignItems: 'flex-end',
  },
  input: {
    flex: 1,
    backgroundColor: '#F2F2F7',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    paddingRight: 40,
    marginRight: 8,
    maxHeight: 100,
    minHeight: 36, // Add minimum height
    fontSize: 16,
    color: '#000000',
  },
  sendButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
}); 