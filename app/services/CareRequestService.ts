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
  private baseUrl = 'http://localhost/patient_api';

  // Create a new care request
  async createCareRequest(type: CareRequestType): Promise<CareRequest | null> {
    try {
      console.log('🏥 Creating care request:', { type });
      
      // Simplify the request body to match exactly what we see working
      const requestBody = { type };
      console.log('📤 Request body:', requestBody);

      const response = await fetch(`${this.baseUrl}/care_requests`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });

      console.log('📥 Response status:', response.status);
      const responseText = await response.text();
      console.log('📥 Response body:', responseText);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = JSON.parse(responseText);
      return data;
    } catch (error) {
      console.error('❌ Failed to create care request:', error);
      Alert.alert('Error', 'Failed to create care request. Please try again.');
      return null;
    }
  }

  // Get care request details
  async getCareRequest(id: string): Promise<CareRequest | null> {
    try {
      const token = await authService.getPrimaryToken();
      if (!token) {
        throw new Error('No authentication token found');
      }

      // Use the exact endpoint from the routes
      const response = await fetch(`${this.baseUrl}/care_requests/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Failed to get care request:', error);
      return null;
    }
  }

  // Submit consent for a care request
  async submitConsent(careRequestId: string): Promise<boolean> {
    try {
      // In the future, this will make a real API call to /patient_api/consent-forms/{id}/signatures
      return true;
    } catch (error) {
      console.error('Failed to submit consent:', error);
      Alert.alert('Error', 'Failed to submit consent. Please try again.');
      return false;
    }
  }
}

// Export a single instance to be used throughout the app
export const careRequestService = new CareRequestService(); 