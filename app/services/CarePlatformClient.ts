import { Alert } from 'react-native';
import * as SecureStore from 'expo-secure-store';

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

class CarePlatformClient {
  private baseUrl = 'https://api.sanabenefits.com/patient_api';  // Production URL - we'll need to make this configurable
  private memberPortalUrl = 'https://api.sanabenefits.com/member_portal/api';

  private static readonly TOKEN_KEY = 'care_platform_token';
  private static readonly TOKEN_EXPIRY_KEY = 'care_platform_token_expiry';

  // Get all conversations (care requests) for the current user
  async getConversations(): Promise<Conversation[]> {
    try {
      const response = await fetch(`${this.baseUrl}/care_requests`, {
        headers: {
          'Authorization': `Bearer ${await this.getCareToken()}`,
          'Content-Type': 'application/json',
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Failed to fetch conversations:', error);
      Alert.alert('Error', 'Failed to fetch conversations');
      return [];
    }
  }

  // Get messages for a specific conversation
  async getMessages(careRequestId: string): Promise<Message[]> {
    try {
      const response = await fetch(`${this.baseUrl}/conversations/${careRequestId}/messages`, {
        headers: {
          'Authorization': `Bearer ${await this.getCareToken()}`,
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Failed to fetch messages:', error);
      Alert.alert('Error', 'Failed to fetch messages');
      return [];
    }
  }

  // Send a new message in a conversation
  async sendMessage(careRequestId: string, text: string): Promise<Message | null> {
    try {
      const response = await fetch(`${this.baseUrl}/conversations/${careRequestId}/messages`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${await this.getCareToken()}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Failed to send message:', error);
      Alert.alert('Error', 'Failed to send message');
      return null;
    }
  }

  // Get Care Platform token, refreshing if necessary
  private async getCareToken(): Promise<string> {
    const token = await SecureStore.getItemAsync(CarePlatformClient.TOKEN_KEY);
    const expiryStr = await SecureStore.getItemAsync(CarePlatformClient.TOKEN_EXPIRY_KEY);
    const expiryTime = expiryStr ? parseInt(expiryStr, 10) : 0;

    // If token exists and isn't expired, return it
    if (token && expiryTime > Date.now()) {
      return token;
    }

    // Otherwise, get a new token
    try {
      const response = await fetch(`${this.memberPortalUrl}/care_requests/get_token`, {
        headers: {
          'Authorization': `Bearer ${await this.getPrimaryToken()}`,
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: TokenResponse = await response.json();
      
      // Store the new token and expiry
      await SecureStore.setItemAsync(CarePlatformClient.TOKEN_KEY, data.access_token);
      await SecureStore.setItemAsync(CarePlatformClient.TOKEN_EXPIRY_KEY, data.expires_at.toString());

      return data.access_token;
    } catch (error) {
      console.error('Failed to get care token:', error);
      throw new Error('Failed to get care token');
    }
  }

  // Get primary authentication token from secure storage
  private async getPrimaryToken(): Promise<string> {
    const token = await SecureStore.getItemAsync('primary_token');
    if (!token) {
      throw new Error('No primary token found - user may need to log in');
    }
    return token;
  }
}

// Export a single instance to be used throughout the app
export const carePlatformClient = new CarePlatformClient(); 