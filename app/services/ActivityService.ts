import { careRequestService, type CareRequest } from './CareRequestService';

export type ActivityType = 'questionnaire' | 'referral';

export interface Activity {
  id: string;
  type: ActivityType;
  title: string;
  status: 'not_started' | 'in_progress' | 'completed';
  careRequestId: string;
  createdAt: string;
}

class ActivityService {
  async getActivities(): Promise<Activity[]> {
    try {
      // Get care requests to extract activities
      const careRequests = await careRequestService.getCareRequests();
      
      const activities: Activity[] = [];
      
      // Extract activities from care requests
      if (careRequests) {
        careRequests.forEach(request => {
          // Check for questionnaires in the care request
          if (request.lastMessage && 'messageType' in request.lastMessage && request.lastMessage.messageType === 'questionnaire') {
            activities.push({
              id: `questionnaire-${request.id}`,
              type: 'questionnaire',
              title: 'Health Questionnaire',
              status: 'not_started', // This should be fetched from the server in a real implementation
              careRequestId: request.id,
              createdAt: request.lastMessage.sentAt
            });
          }
          
          // Check for referrals
          if (request.patientUnreadReferralMessages) {
            activities.push({
              id: `referral-${request.id}`,
              type: 'referral',
              title: 'Medical Referral',
              status: 'not_started', // This should be fetched from the server in a real implementation
              careRequestId: request.id,
              createdAt: request.lastMessage.sentAt
            });
          }
        });
      }
      
      // Sort by most recent first
      return activities.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    } catch (error) {
      console.error('Failed to fetch activities:', error);
      return [];
    }
  }
}

export const activityService = new ActivityService(); 