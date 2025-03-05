import { carePlatformClient } from './CarePlatformClient';

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

// Mock data for development
const MOCK_MESSAGES: Message[] = [
  {
    id: '1',
    text: 'Hello! How can I help you today?',
    author: {
      id: 'doc1',
      type: 'provider',
      name: 'Dr. Smith'
    },
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString() // 24 hours ago
  },
  {
    id: '2',
    text: 'I have been experiencing headaches',
    author: {
      id: 'patient1',
      type: 'patient',
      name: 'John Doe'
    },
    timestamp: new Date(Date.now() - 23 * 60 * 60 * 1000).toISOString() // 23 hours ago
  },
  {
    id: '3',
    text: 'How long have you been experiencing these headaches?',
    author: {
      id: 'doc1',
      type: 'provider',
      name: 'Dr. Smith'
    },
    timestamp: new Date(Date.now() - 22 * 60 * 60 * 1000).toISOString() // 22 hours ago
  }
];

class MessagingService {
  private messages: Message[] = [...MOCK_MESSAGES];

  async getMessages(careRequestId: string): Promise<Message[]> {
    try {
      // In the future, this will use carePlatformClient.getMessages()
      return this.messages.sort((a, b) => 
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );
    } catch (error) {
      console.error('Failed to fetch messages:', error);
      return [];
    }
  }

  async sendMessage(careRequestId: string, text: string): Promise<Message | null> {
    try {
      // Create a new mock message
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

      // Add to mock database
      this.messages.push(newMessage);
      return newMessage;
    } catch (error) {
      console.error('Failed to send message:', error);
      return null;
    }
  }
}

// Export a single instance to be used throughout the app
export const messagingService = new MessagingService(); 