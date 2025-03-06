import { Alert } from 'react-native';
import { authService } from './AuthService';
import { carePlatformClient } from './CarePlatformClient';

// Error types for better error handling
export enum ErrorTypes {
  NETWORK_ERROR = 'network_error',
  AUTHENTICATION_ERROR = 'auth_error',
  MESSAGE_SEND_FAILED = 'message_send_failed'
}

export interface Attachment {
  id: string;
  type: 'image' | 'questionnaire';
  url?: string;
  data?: any; // For questionnaire data
}

export interface Message {
  id: string;
  text: string;
  author: {
    id: string;
    type: 'patient' | 'provider' | 'system';
    name: string;
  };
  timestamp: string;
  attachments?: Attachment[];
  replyTo?: string; // ID of the message this is replying to (for threaded messages)
  messageType?: 'text' | 'questionnaire' | 'referral';
}

/**
 * Service for handling messages AFTER a care request has been created.
 * This should NOT be used during the initial care request creation.
 */
class MessagingService {
  private baseUrl = 'http://localhost/patient_api';

  private getHeaders(token: string): HeadersInit {
    return {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'X-Care-Platform-Authenticate': token
    };
  }

  async getMessages(careRequestId: string): Promise<Message[]> {
    try {
      console.log('📱 [MessagingService] Starting getMessages...');
      console.log('📱 [MessagingService] Care Request ID:', careRequestId);
      
      const carePlatformToken = await carePlatformClient.getCareToken();
      console.log('📱 [MessagingService] Care Platform Token exists:', !!carePlatformToken);
      console.log('📱 [MessagingService] Care Platform Token prefix:', carePlatformToken ? `${carePlatformToken.substring(0, 10)}...` : 'none');
      
      if (!carePlatformToken) {
        console.error('📱 ❌ [MessagingService] No care platform token found');
        throw new Error(ErrorTypes.AUTHENTICATION_ERROR);
      }

      const url = `${this.baseUrl}/care_requests/${careRequestId}/stacks`;
      console.log('📱 [MessagingService] Fetching from URL:', url);

      const response = await fetch(url, {
        method: 'GET',
        headers: this.getHeaders(carePlatformToken)
      });

      console.log('📱 [MessagingService] Response status:', response.status);
      console.log('📱 [MessagingService] Response OK:', response.ok);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('📱 ❌ [MessagingService] API Error Response:', errorText);
        
        if (response.status === 401) {
          throw new Error(ErrorTypes.AUTHENTICATION_ERROR);
        }
        throw new Error(ErrorTypes.NETWORK_ERROR);
      }

      const data = await response.json();
      console.log('📱 [MessagingService] Response data structure:', Object.keys(data));
      console.log('📱 [MessagingService] Number of messages:', (data.messages || []).length);
      console.log('📱 [MessagingService] First message (if exists):', data.messages?.[0] ? JSON.stringify(data.messages[0], null, 2) : 'No messages');
      
      return data.messages || [];
    } catch (error: any) {
      console.error('📱 ❌ [MessagingService] Error in getMessages:', error);
      console.error('📱 ❌ [MessagingService] Error stack:', error.stack);
      
      if (error.message === ErrorTypes.AUTHENTICATION_ERROR) {
        Alert.alert('Authentication Error', 'Please log in again to continue.');
      } else {
        Alert.alert('Error', 'Failed to fetch messages. Please check your connection and try again.');
      }
      return [];
    }
  }

  async sendMessage(
    careRequestId: string,
    text: string,
    attachments?: Attachment[],
    replyTo?: string
  ): Promise<Message | null> {
    try {
      console.log('📱 [MessagingService] Starting sendMessage...');
      console.log('📱 [MessagingService] Care Request ID:', careRequestId);
      console.log('📱 [MessagingService] Message text:', text);
      console.log('📱 [MessagingService] Has attachments:', !!attachments);
      console.log('📱 [MessagingService] Replying to:', replyTo || 'none');
      
      const carePlatformToken = await carePlatformClient.getCareToken();
      console.log('📱 [MessagingService] Care Platform Token exists:', !!carePlatformToken);
      
      if (!carePlatformToken) {
        console.error('📱 ❌ [MessagingService] No care platform token found');
        throw new Error(ErrorTypes.AUTHENTICATION_ERROR);
      }

      const url = `${this.baseUrl}/care_requests/${careRequestId}/stacks`;
      console.log('📱 [MessagingService] Sending to URL:', url);

      const body = {
        message: {
          text,
          attachments,
          reply_to: replyTo
        }
      };
      console.log('�� [MessagingService] Request body:', JSON.stringify(body, null, 2));

      const response = await fetch(url, {
        method: 'POST',
        headers: this.getHeaders(carePlatformToken),
        body: JSON.stringify(body)
      });

      console.log('📱 [MessagingService] Response status:', response.status);
      console.log('📱 [MessagingService] Response OK:', response.ok);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('📱 ❌ [MessagingService] API Error Response:', errorText);
        
        if (response.status === 401) {
          throw new Error(ErrorTypes.AUTHENTICATION_ERROR);
        }
        throw new Error(ErrorTypes.MESSAGE_SEND_FAILED);
      }

      const data = await response.json();
      console.log('📱 [MessagingService] Response data:', JSON.stringify(data, null, 2));
      
      return data.message;
    } catch (error: any) {
      console.error('📱 ❌ [MessagingService] Error in sendMessage:', error);
      console.error('📱 ❌ [MessagingService] Error stack:', error.stack);
      
      if (error.message === ErrorTypes.AUTHENTICATION_ERROR) {
        Alert.alert('Authentication Error', 'Please log in again to continue.');
      } else {
        Alert.alert('Error', 'Failed to send message. Please check your connection and try again.');
      }
      return null;
    }
  }
}

// Export a single instance to be used throughout the app
export const messagingService = new MessagingService(); 