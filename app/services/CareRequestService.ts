import { Alert } from 'react-native';
import { carePlatformClient } from './CarePlatformClient';

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
  // Create a new care request
  async createCareRequest(type: CareRequestType): Promise<CareRequest | null> {
    try {
      // In the future, this will make a real API call to /patient_api/care_requests
      const mockCareRequest: CareRequest = {
        id: Date.now().toString(),
        type,
        status: 'pending',
        createdAt: new Date().toISOString()
      };

      return mockCareRequest;
    } catch (error) {
      console.error('Failed to create care request:', error);
      Alert.alert('Error', 'Failed to create care request. Please try again.');
      return null;
    }
  }

  // Get care request details
  async getCareRequest(id: string): Promise<CareRequest | null> {
    try {
      // In the future, this will make a real API call to /patient_api/care_requests/{id}
      return {
        id,
        type: 'sick',
        status: 'pending',
        createdAt: new Date().toISOString()
      };
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