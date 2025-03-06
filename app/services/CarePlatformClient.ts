import { Alert } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { authService } from './AuthService';
import { Message, Attachment } from './CareRequestService';

interface TokenResponse {
  access_token: string;
  expires_at: number;
}

// Types
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
  private baseUrl = 'http://localhost/patient_api';
  private memberPortalUrl = 'http://localhost/member_portal/api';

  private static readonly CARE_TOKEN_KEY = 'care_platform_token';
  private static readonly CARE_TOKEN_EXPIRY_KEY = 'care_platform_token_expiry';

  private getHeaders(token: string): HeadersInit {
    return {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'X-Care-Platform-Authenticate': token
    };
  }

  // Get all conversations (care requests) for the current user
  async getConversations(): Promise<Conversation[]> {
    try {
      const carePlatformToken = await this.getCareToken();
      if (!carePlatformToken) {
        throw new Error('No care platform token available');
      }

      const response = await fetch(`${this.baseUrl}/care_requests`, {
        method: 'GET',
        headers: this.getHeaders(carePlatformToken)
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Authentication failed');
        }
        throw new Error('Failed to fetch conversations');
      }

      const data = await response.json();
      return data.care_requests.map((request: any) => ({
        id: request.id,
        provider: {
          id: request.provider?.id || '',
          name: request.provider?.name || 'Unknown Provider',
          role: request.provider?.role || ''
        },
        lastMessage: request.last_message,
        unread: request.patient_unread_messages || false
      }));
    } catch (error: any) {
      console.error('Failed to fetch conversations:', error);
      Alert.alert('Error', 'Failed to load conversations. Please try again.');
      return [];
    }
  }

  // Get messages for a specific conversation
  async getMessages(careRequestId: string): Promise<Message[]> {
    try {
      const carePlatformToken = await this.getCareToken();
      if (!carePlatformToken) {
        throw new Error('No care platform token available');
      }

      const response = await fetch(`${this.baseUrl}/care_requests/${careRequestId}/stacks`, {
        method: 'GET',
        headers: this.getHeaders(carePlatformToken)
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Authentication failed');
        }
        throw new Error('Failed to fetch messages');
      }

      const data = await response.json();
      return data.messages || [];
    } catch (error: any) {
      console.error('Failed to fetch messages:', error);
      Alert.alert('Error', 'Failed to load messages. Please try again.');
      return [];
    }
  }

  // Send a new message in a conversation
  async sendMessage(
    careRequestId: string,
    text: string,
    attachments?: Attachment[],
    replyTo?: string
  ): Promise<Message | null> {
    try {
      const carePlatformToken = await this.getCareToken();
      if (!carePlatformToken) {
        throw new Error('No care platform token available');
      }

      const response = await fetch(`${this.baseUrl}/care_requests/${careRequestId}/stacks`, {
        method: 'POST',
        headers: this.getHeaders(carePlatformToken),
        body: JSON.stringify({
          message: {
            text,
            attachments,
            reply_to: replyTo
          }
        })
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Authentication failed');
        }
        throw new Error('Failed to send message');
      }

      const data = await response.json();
      return data.message;
    } catch (error: any) {
      console.error('Failed to send message:', error);
      Alert.alert('Error', 'Failed to send message. Please try again.');
      return null;
    }
  }

  // Get Care Platform token, refreshing if necessary
  async getCareToken(): Promise<string> {
    try {
      // Check if we have a stored token and it's not expired
      const storedToken = await SecureStore.getItemAsync(CarePlatformClient.CARE_TOKEN_KEY);
      const expiryTimestamp = await SecureStore.getItemAsync(CarePlatformClient.CARE_TOKEN_EXPIRY_KEY);
      
      if (storedToken && expiryTimestamp) {
        const expiryTime = parseInt(expiryTimestamp, 10);
        // Add 1-minute buffer to expiry check
        if (Date.now() < expiryTime - 60000) {
          return storedToken;
        }
      }

      // Get a new token
      const authToken = await authService.getPrimaryToken();
      if (!authToken) {
        throw new Error('No primary auth token available');
      }

      const response = await fetch(`${this.memberPortalUrl}/care_requests/get_token`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': authToken
        }
      });

      if (!response.ok) {
        throw new Error('Failed to get care platform token');
      }

      const data: TokenResponse = await response.json();
      
      // Ensure values are strings before storing
      const tokenString = String(data.access_token);
      const expiryString = String(data.expires_at);
      
      // Store the new token and expiry
      await SecureStore.setItemAsync(CarePlatformClient.CARE_TOKEN_KEY, tokenString);
      await SecureStore.setItemAsync(CarePlatformClient.CARE_TOKEN_EXPIRY_KEY, expiryString);

      return tokenString;
    } catch (error: any) {
      console.error('Failed to get care token:', error);
      throw error;
    }
  }

  // Clear stored tokens (e.g., on logout)
  async clearTokens(): Promise<void> {
    await SecureStore.deleteItemAsync(CarePlatformClient.CARE_TOKEN_KEY);
    await SecureStore.deleteItemAsync(CarePlatformClient.CARE_TOKEN_EXPIRY_KEY);
  }
}

// Export a single instance to be used throughout the app
export const carePlatformClient = new CarePlatformClient(); 