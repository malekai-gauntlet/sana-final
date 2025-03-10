import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, Image, Alert } from 'react-native';
import { useState, useEffect, useRef } from 'react';
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { careRequestService, type Message, type Attachment } from '../services/CareRequestService';
import * as ImagePicker from 'expo-image-picker';
import { QuestionnaireForm } from '../components/QuestionnaireForm';

// Header component
const Header = ({ onSendQuestionnaire }: { onSendQuestionnaire: () => void }) => (
  <View style={styles.header}>
    <TouchableOpacity 
      style={styles.backButton} 
      onPress={() => router.back()}
    >
      <Ionicons name="chevron-back" size={28} color="#007AFF" />
      <Text style={styles.backText}>Messages</Text>
    </TouchableOpacity>
    <TouchableOpacity 
      style={styles.questionnaireButton}
      onPress={onSendQuestionnaire}
    >
      <Ionicons name="clipboard-outline" size={24} color="#007AFF" />
    </TouchableOpacity>
  </View>
);

// Add the QuestionnaireCard component
const QuestionnaireCard = ({ onPress }: { onPress: () => void }) => (
  <TouchableOpacity 
    style={styles.questionnaireCard} 
    onPress={onPress}
    activeOpacity={0.7}
  >
    <View style={styles.questionnaireCardContent}>
      <View style={styles.questionnaireCardLeft}>
        <Ionicons name="document-text-outline" size={22} color="#000" />
        <Text style={styles.questionnaireCardTitle}>Questionnaire</Text>
        <Text style={styles.questionnaireCardStatus}>Not started</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color="#8E8E93" />
    </View>
  </TouchableOpacity>
);

// Update the QuestionnaireMessage component
const QuestionnaireMessage = ({ data, isProvider }: { data: any, isProvider: boolean }) => {
  const [status, setStatus] = useState('not_started'); // 'not_started' | 'in_progress' | 'completed'

  const handleSubmit = (answers: { [key: string]: string }) => {
    console.log('Questionnaire answers:', answers);
    setStatus('completed');
  };

  return (
    <View style={[
      styles.questionnaireBubble,
      isProvider ? styles.providerBubble : styles.patientBubble
    ]}>
      {status === 'not_started' && (
        <QuestionnaireCard onPress={() => setStatus('in_progress')} />
      )}
      {status === 'in_progress' && (
        <QuestionnaireForm 
          questions={data.questions}
          onSubmit={handleSubmit}
        />
      )}
      {status === 'completed' && (
        <Text style={[
          styles.messageText,
          isProvider ? styles.providerText : styles.patientText
        ]}>
          Thank you for completing the questionnaire!
        </Text>
      )}
    </View>
  );
};

// Image message component
const ImageMessage = ({ url, isProvider }: { url: string, isProvider: boolean }) => (
  <View style={[
    styles.imageBubble,
    isProvider ? styles.providerBubble : styles.patientBubble
  ]}>
    <Image
      source={{ uri: url }}
      style={styles.messageImage}
      resizeMode="cover"
    />
  </View>
);

// Message bubble component
const MessageBubble = ({ message, onReply }: { message: Message, onReply?: (message: Message) => void }) => {
  const isProvider = message.author.type === 'provider' || message.author.type === 'system';
  
  return (
    <View style={[
      styles.messageBubbleContainer,
      isProvider ? styles.providerMessage : styles.patientMessage
    ]}>
      {message.replyTo && (
        <View style={styles.replyContainer}>
          <Text style={styles.replyText}>
            <Ionicons name="return-up-back" size={12} color="#8E8E93" />
            {' '}Replying to message
          </Text>
        </View>
      )}
      <View style={[
        styles.messageBubble,
        isProvider ? styles.providerBubble : styles.patientBubble
      ]}>
        {message.text && (
          <Text style={[
            styles.messageText,
            isProvider ? styles.providerText : styles.patientText
          ]}>
            {message.text}
          </Text>
        )}
        
        {message.attachments?.map((attachment) => (
          <View key={attachment.id}>
            {attachment.type === 'questionnaire' && (
              <QuestionnaireMessage data={attachment.data} isProvider={isProvider} />
            )}
            {attachment.type === 'image' && attachment.url && (
              <ImageMessage url={attachment.url} isProvider={isProvider} />
            )}
          </View>
        ))}

        <View style={styles.messageFooter}>
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
          {onReply && (
            <TouchableOpacity
              style={styles.replyButton}
              onPress={() => onReply(message)}
            >
              <Ionicons 
                name="return-up-back" 
                size={16} 
                color={isProvider ? '#8E8E93' : 'rgba(255, 255, 255, 0.7)'} 
              />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
};

export default function ChatScreen() {
  const { id, isNewRequest } = useLocalSearchParams();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [replyingTo, setReplyingTo] = useState<Message | null>(null);

  useEffect(() => {
    requestPermissions();
    
    // Only load messages if this is not a new care request
    if (isNewRequest !== 'true') {
      loadMessages();
    } else {
      // Show welcome message for new care requests
      setMessages([{
        id: 'welcome',
        text: 'Thank you for your care request. A provider will respond to you shortly.',
        author: {
          id: 'system',
          type: 'system',
          name: 'System'
        },
        timestamp: new Date().toISOString(),
        messageType: 'text'
      }]);
    }
  }, [id, isNewRequest]); // Add id to dependencies

  const requestPermissions = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Sorry, we need camera roll permissions to upload images!');
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: 'images',
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  const loadMessages = async () => {
    try {
      setIsLoading(true);
      const fetchedMessages = await careRequestService.getMessages(id as string);
      if (fetchedMessages && fetchedMessages.length > 0) {
        // Sort messages by timestamp in ascending order (oldest first)
        const sortedMessages = [...fetchedMessages].sort((a, b) => 
          new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
        );
        setMessages(sortedMessages);
      } else {
        // If no messages, show a default message
        setMessages([{
          id: 'default',
          text: 'No messages in this conversation yet.',
          author: {
            id: 'system',
            type: 'system',
            name: 'System'
          },
          timestamp: new Date().toISOString(),
          messageType: 'text'
        }]);
      }
    } catch (error) {
      console.error('Error loading messages:', error);
      // Show error message in the chat
      setMessages([{
        id: 'error',
        text: 'Failed to load messages. Please try again.',
        author: {
          id: 'system',
          type: 'system',
          name: 'System'
        },
        timestamp: new Date().toISOString(),
        messageType: 'text'
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReply = (message: Message) => {
    setReplyingTo(message);
  };

  const handleSend = async () => {
    if (!newMessage.trim() && !selectedImage) return;

    // Create a temporary message object for immediate UI update
    const tempMessage: Message = {
      id: `temp-${Date.now()}`,
      text: newMessage.trim(),
      author: {
        id: 'current-user', // This should be replaced with actual user ID
        type: 'patient',
        name: 'You' // This should be replaced with actual user name
      },
      timestamp: new Date().toISOString(),
      messageType: 'text',
      attachments: selectedImage ? [{
        id: Date.now().toString(),
        type: 'image',
        url: selectedImage
      }] : undefined,
      replyTo: replyingTo?.id
    };

    // Immediately update UI
    setMessages(prev => [...prev, tempMessage]);
    setNewMessage('');
    setReplyingTo(null);
    if (selectedImage) {
      setSelectedImage(null);
    }

    // Scroll to bottom after sending
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);

    // TODO: Server communication temporarily disabled - will be implemented later
    /*
    // Try to send to server in the background
    try {
      const serverMessage = await careRequestService.sendMessage(
        id as string,
        tempMessage.text,
        tempMessage.attachments,
        tempMessage.replyTo
      );

      if (serverMessage) {
        // Replace temporary message with server message
        setMessages(prev => 
          prev.map(msg => msg.id === tempMessage.id ? serverMessage : msg)
        );
      }
    } catch (error) {
      console.error('Failed to send message to server:', error);
      // Optionally show an error message to user but keep the message in UI
      Alert.alert(
        'Warning',
        'Message shown in chat but failed to send to server. Please check your connection.',
        [{ text: 'OK' }]
      );
    }
    */
  };

  // Add a test function to simulate receiving a questionnaire (add this inside ChatScreen component)
  const simulateReceivedQuestionnaire = () => {
    const questionnaireMessage: Message = {
      id: `questionnaire-${Date.now()}`,
      text: '',
      author: {
        id: 'provider-1',
        type: 'provider',
        name: 'Dr. Devin Brown'
      },
      timestamp: new Date().toISOString(),
      messageType: 'questionnaire',
      attachments: [{
        id: 'questionnaire-1',
        type: 'questionnaire',
        data: {
          questions: [
            {
              id: '1',
              type: 'text',
              text: 'How are you feeling today?'
            },
            {
              id: '2',
              type: 'multiple_choice',
              text: 'Rate your pain level:',
              options: ['None', 'Mild', 'Moderate', 'Severe']
            }
          ]
        }
      }]
    };
    setMessages(prev => [...prev, questionnaireMessage]);
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <View style={styles.safeArea}>
        <Header onSendQuestionnaire={simulateReceivedQuestionnaire} />
        <ScrollView
          ref={scrollViewRef}
          style={styles.messagesList}
          contentContainerStyle={styles.messagesContent}
          onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: false })}
        >
          {messages.map((message) => (
            <MessageBubble 
              key={message.id} 
              message={message}
              onReply={handleReply}
            />
          ))}
        </ScrollView>

        {replyingTo && (
          <View style={styles.replyingToContainer}>
            <Text style={styles.replyingToText}>
              Replying to: {replyingTo.text.substring(0, 50)}
              {replyingTo.text.length > 50 ? '...' : ''}
            </Text>
            <TouchableOpacity
              style={styles.cancelReplyButton}
              onPress={() => setReplyingTo(null)}
            >
              <Ionicons name="close-circle" size={20} color="#8E8E93" />
            </TouchableOpacity>
          </View>
        )}

        {selectedImage && (
          <View style={styles.selectedImageContainer}>
            <Image source={{ uri: selectedImage }} style={styles.selectedImagePreview} />
            <TouchableOpacity 
              style={styles.removeImageButton}
              onPress={() => setSelectedImage(null)}
            >
              <Ionicons name="close-circle" size={24} color="#FF3B30" />
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.inputContainer}>
          <TouchableOpacity 
            style={styles.attachButton}
            onPress={pickImage}
          >
            <Ionicons name="image" size={24} color="#007AFF" />
          </TouchableOpacity>
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
            style={[styles.sendButton, (!newMessage.trim() && !selectedImage) && styles.sendButtonDisabled]} 
            onPress={handleSend}
            disabled={!newMessage.trim() && !selectedImage}
          >
            <Ionicons 
              name="send" 
              size={24} 
              color={(newMessage.trim() || selectedImage) ? '#007AFF' : '#8E8E93'} 
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
    justifyContent: 'space-between',
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
  questionnaireBubble: {
    marginTop: 8,
    padding: 12,
    borderRadius: 12,
  },
  questionContainer: {
    marginBottom: 16,
  },
  questionText: {
    fontSize: 16,
    marginBottom: 8,
  },
  optionsContainer: {
    gap: 8,
  },
  optionButton: {
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
  },
  providerOptionButton: {
    borderColor: '#8E8E93',
    backgroundColor: 'transparent',
  },
  patientOptionButton: {
    borderColor: 'rgba(255, 255, 255, 0.3)',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  optionText: {
    fontSize: 14,
  },
  textInput: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 8,
    fontSize: 14,
    minHeight: 40,
  },
  providerTextInput: {
    borderColor: '#8E8E93',
    backgroundColor: '#FFFFFF',
    color: '#000000',
  },
  patientTextInput: {
    borderColor: 'rgba(255, 255, 255, 0.3)',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    color: '#FFFFFF',
  },
  imageBubble: {
    marginTop: 8,
    borderRadius: 12,
    overflow: 'hidden',
  },
  messageImage: {
    width: 200,
    height: 200,
    borderRadius: 12,
  },
  replyContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    padding: 4,
    borderRadius: 4,
    marginBottom: 4,
  },
  replyText: {
    fontSize: 12,
    color: '#8E8E93',
  },
  attachButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  selectedImageContainer: {
    padding: 8,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E5EA',
  },
  selectedImagePreview: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  removeImageButton: {
    position: 'absolute',
    top: 0,
    right: 0,
    padding: 4,
  },
  messageFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  replyButton: {
    padding: 4,
  },
  replyingToContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F2F2F7',
    padding: 8,
    borderTopWidth: 1,
    borderTopColor: '#E5E5EA',
  },
  replyingToText: {
    flex: 1,
    fontSize: 14,
    color: '#8E8E93',
    marginRight: 8,
  },
  cancelReplyButton: {
    padding: 4,
  },
  questionnaireCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    overflow: 'hidden',
    marginVertical: 4,
  },
  questionnaireCardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  questionnaireCardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  questionnaireCardTitle: {
    fontSize: 16,
    color: '#000000',
    fontWeight: '500',
    marginRight: 8,
  },
  questionnaireCardStatus: {
    fontSize: 14,
    color: '#8E8E93',
  },
  questionnaireButton: {
    padding: 8,
    borderRadius: 8,
  },
}); 