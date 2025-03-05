import { Alert } from 'react-native';
import { authService } from './AuthService';

export type CareRequestType = 
  | 'sick'
  | 'checkup'
  | 'injury'
  | 'chronic'
  | 'mental_health'
  | 'specialist_referral'
  | 'prescription_refill'
  | 'imaging'
  | 'surgery'
  | 'other';

export interface CareRequest {
  id: string;
  type: CareRequestType;
  title: string;
  lastMessage: {
    id: number;
    sentAt: string;
    text: string;
    author: {
      kind: string;
    };
  };
  isLocked: boolean;
  patientUnreadMessages: boolean;
  patientUnreadReferralMessages: boolean;
  providers: any[];
  inboxPreviewTitle: string;
}

class CareRequestService {
  private baseUrl = 'http://localhost/member_portal/api';

  async getCareRequests(): Promise<CareRequest[] | null> {
    console.log('🚀 Starting getCareRequests...');
    try {
      // First check if user is authenticated
      console.log('👤 Checking authentication...');
      const isAuthenticated = await authService.isAuthenticated();
      console.log('👤 Is user authenticated:', isAuthenticated);

      if (!isAuthenticated) {
        console.error('❌ Authentication check failed');
        throw new Error('User is not authenticated');
      }

      console.log('🔑 Fetching auth token...');
      const authToken = await authService.getPrimaryToken();
      console.log('🔑 Auth Token present:', !!authToken);
      console.log('🔑 Auth Token length:', authToken?.length || 0);
      console.log('🔑 Auth Token prefix:', authToken?.substring(0, 10) + '...');

      if (!authToken) {
        console.error('❌ No auth token found');
        // Debug: Check token directly from SecureStore
        await authService.debugToken();
        throw new Error('No authentication token found');
      }
      
      console.log('🌐 Making API request to:', `${this.baseUrl}/care_requests`);
      const response = await fetch(`${this.baseUrl}/care_requests`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': authToken
        }
      });

      console.log('📥 Response status:', response.status);
      console.log('📥 Response ok:', response.ok);

      if (!response.ok) {
        console.error('❌ API request failed with status:', response.status);
        const errorText = await response.text();
        console.error('❌ Error response:', errorText);
        throw new Error(`Failed to fetch care requests: ${response.status}`);
      }

      const data = await response.json();
      console.log('📦 Raw response data:', JSON.stringify(data, null, 2));
      
      // Access the nested careRequests array
      const careRequests = data.care_requests?.careRequests || [];
      console.log('📦 Processed care requests:', careRequests);
      
      return careRequests;
    } catch (error) {
      console.error('❌ getCareRequests error:', error);
      console.error('❌ Error stack:', error.stack);
      Alert.alert('Error', 'Failed to fetch care requests. Please try again.');
      return null;
    }
  }

  async createCareRequest(type: CareRequestType): Promise<CareRequest | null> {
    try {
      // First check if user is authenticated
      const isAuthenticated = await authService.isAuthenticated();
      console.log('👤 Is user authenticated:', isAuthenticated);

      if (!isAuthenticated) {
        throw new Error('User is not authenticated');
      }

      const authToken = await authService.getPrimaryToken();
      console.log('🔑 Auth Token present:', !!authToken);
      console.log('🔑 Auth Token length:', authToken?.length || 0);

      if (!authToken) {
        // Debug: Check token directly from SecureStore
        await authService.debugToken();
        throw new Error('No authentication token found');
      }

      const requestBody = {
        type: type,
        title: "Test Care Request",
        content: "This is a test care request"
      };
      
      const response = await fetch(`${this.baseUrl}/care_requests`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': authToken
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        throw new Error(`Failed to create care request: ${response.status}`);
      }

      const data = await response.json();
      return data.care_request;
    } catch (error) {
      console.error('❌ Error:', error);
      Alert.alert('Error', 'Failed to create care request. Please try again.');
      return null;
    }
  }
}

export const careRequestService = new CareRequestService();
