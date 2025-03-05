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
  status: 'pending' | 'active' | 'completed';
  createdAt: string;
}

class CareRequestService {
  private baseUrl = 'http://localhost/member_portal/api';

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
