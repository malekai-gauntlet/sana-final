import { Alert } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { authService } from './AuthService';

interface TokenResponse {
  access_token: string;
  expires_at: number;
}

// Types
export interface Message {
  id: string;
  text: string;
  author: {
    id: string;
    type: 'patient' | 'provider' | 'system';
    name: string;
  };
  timestamp: string;
}

export interface Conversation {
  id: string;
  provider: {
    id: string;
    name: string;
    role: string;
  };
  lastMessage?: Message;
  unread: boolean;
}

// Mock data for development
const MOCK_CONVERSATIONS: Conversation[] = [
  {
    id: '1',
    provider: {
      id: 'doc1',
      name: 'Dr. Sarah Johnson',
      role: 'Primary Care Physician'
    },
    lastMessage: {
      id: '123',
      text: 'How long have you been experiencing these headaches?',
      author: {
        id: 'doc1',
        type: 'provider',
        name: 'Dr. Sarah Johnson'
      },
      timestamp: new Date(Date.now() - 22 * 60 * 60 * 1000).toISOString()
    },
    unread: true
  },
  {
    id: '2',
    provider: {
      id: 'doc2',
      name: 'Dr. Michael Chen',
      role: 'Dermatologist'
    },
    lastMessage: {
      id: '456',
      text: 'Your test results look normal. No need for concern.',
      author: {
        id: 'doc2',
        type: 'provider',
        name: 'Dr. Michael Chen'
      },
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
    },
    unread: false
  },
  {
    id: '3',
    provider: {
      id: 'doc3',
      name: 'Dr. Emily Martinez',
      role: 'Nutritionist'
    },
    lastMessage: {
      id: '789',
      text: 'Here is your personalized meal plan for the next week.',
      author: {
        id: 'doc3',
        type: 'provider',
        name: 'Dr. Emily Martinez'
      },
      timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
    },
    unread: false
  }
];

const MOCK_MESSAGES: { [key: string]: Message[] } = {
  '1': [
    {
      id: '1',
      text: 'Hello! How can I help you today?',
      author: {
        id: 'doc1',
        type: 'provider',
        name: 'Dr. Sarah Johnson'
      },
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: '2',
      text: 'I have been experiencing headaches',
      author: {
        id: 'patient1',
        type: 'patient',
        name: 'John Doe'
      },
      timestamp: new Date(Date.now() - 23 * 60 * 60 * 1000).toISOString()
    },
    {
      id: '3',
      text: 'How long have you been experiencing these headaches?',
      author: {
        id: 'doc1',
        type: 'provider',
        name: 'Dr. Sarah Johnson'
      },
      timestamp: new Date(Date.now() - 22 * 60 * 60 * 1000).toISOString()
    }
  ],
  '2': [
    {
      id: '4',
      text: 'I received your skin test results',
      author: {
        id: 'doc2',
        type: 'provider',
        name: 'Dr. Michael Chen'
      },
      timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: '5',
      text: 'Your test results look normal. No need for concern.',
      author: {
        id: 'doc2',
        type: 'provider',
        name: 'Dr. Michael Chen'
      },
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
    }
  ],
  '3': [
    {
      id: '6',
      text: 'Here is your personalized meal plan for the next week.',
      author: {
        id: 'doc3',
        type: 'provider',
        name: 'Dr. Emily Martinez'
      },
      timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
    }
  ]
};

class CarePlatformClient {
  private baseUrl = 'http://localhost:3000/patient_api';  // Keep for future use
  private memberPortalUrl = 'http://localhost:3000/member_portal/api';

  private static readonly CARE_TOKEN_KEY = 'care_platform_token';
  private static readonly CARE_TOKEN_EXPIRY_KEY = 'care_platform_token_expiry';

  // Get all conversations (care requests) for the current user
  async getConversations(): Promise<Conversation[]> {
    // Return mock conversations for now
    return MOCK_CONVERSATIONS;
  }

  // Get messages for a specific conversation
  async getMessages(careRequestId: string): Promise<Message[]> {
    // Return mock messages for the conversation
    return MOCK_MESSAGES[careRequestId] || [];
  }

  // Send a new message in a conversation
  async sendMessage(careRequestId: string, text: string): Promise<Message | null> {
    try {
      const newMessage: Message = {
        id: Date.now().toString(),
        text,
        author: {
          id: 'patient1',
          type: 'patient',
          name: 'John Doe'
        },
        timestamp: new Date().toISOString()
      };

      // Add to mock messages
      if (!MOCK_MESSAGES[careRequestId]) {
        MOCK_MESSAGES[careRequestId] = [];
      }
      MOCK_MESSAGES[careRequestId].push(newMessage);

      // Update last message in conversation
      const conversation = MOCK_CONVERSATIONS.find(c => c.id === careRequestId);
      if (conversation) {
        conversation.lastMessage = newMessage;
      }

      return newMessage;
    } catch (error) {
      console.error('Failed to send message:', error);
      Alert.alert('Error', 'Failed to send message');
      return null;
    }
  }

  // Get Care Platform token, refreshing if necessary
  private async getCareToken(): Promise<string> {
    return 'mock_care_token_12345'; // Mock token for now
  }
}

// Export a single instance to be used throughout the app
export const carePlatformClient = new CarePlatformClient(); 