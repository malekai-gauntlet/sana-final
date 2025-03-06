import { careRequestService, type CareRequest } from './CareRequestService';

export type ActivityType = 'questionnaire' | 'referral';

export interface Activity {
  id: string;
  type: ActivityType;
  title: string;
  status: 'not_started' | 'in_progress' | 'completed';
  careRequestId: string;
  createdAt: string;
  // Additional fields for specific activity types
  questionSetId?: string;
  referralId?: string;
}

interface QuestionSet {
  id: string;
  status: 'not_started' | 'in_progress' | 'completed';
  careRequestId: string;
  createdAt: string;
}

interface Referral {
  id: string;
  status: string;
  careRequestId: string;
  createdAt: string;
  unreadMessages: boolean;
}

class ActivityService {
  private baseUrl = 'http://localhost/patient_api';

  async getActivities(): Promise<Activity[]> {
    try {
      // Get care requests to extract activities
      const careRequests = await careRequestService.getCareRequests();
      
      const activities: Activity[] = [];
      
      if (careRequests) {
        for (const request of careRequests) {
          // Get question sets for this care request
          try {
            const response = await fetch(`${this.baseUrl}/care_requests/${request.id}/question_sets`, {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
                // Add auth headers here
              }
            });
            
            if (response.ok) {
              const data = await response.json();
              const questionSets = data.question_sets || [];
              
              // Add each question set as an activity
              questionSets.forEach((qs: QuestionSet) => {
                activities.push({
                  id: `questionnaire-${qs.id}`,
                  type: 'questionnaire',
                  title: 'Health Questionnaire',
                  status: qs.status,
                  careRequestId: request.id,
                  createdAt: qs.createdAt,
                  questionSetId: qs.id
                });
              });
            }
          } catch (error) {
            console.error('Failed to fetch question sets:', error);
          }
          
          // Get referrals for this care request
          try {
            const response = await fetch(`${this.baseUrl}/care_requests/${request.id}/referrals`, {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
                // Add auth headers here
              }
            });
            
            if (response.ok) {
              const data = await response.json();
              const referrals = data.referrals || [];
              
              // Add each referral as an activity
              referrals.forEach((ref: Referral) => {
                activities.push({
                  id: `referral-${ref.id}`,
                  type: 'referral',
                  title: 'Medical Referral',
                  status: ref.unreadMessages ? 'not_started' : 'completed',
                  careRequestId: request.id,
                  createdAt: ref.createdAt,
                  referralId: ref.id
                });
              });
            }
          } catch (error) {
            console.error('Failed to fetch referrals:', error);
          }
        }
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

  // Update a question set's status
  async updateQuestionSetStatus(questionSetId: string, status: Activity['status']): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/question_sets/${questionSetId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          // Add auth headers here
        },
        body: JSON.stringify({ status })
      });
      
      return response.ok;
    } catch (error) {
      console.error('Failed to update question set status:', error);
      return false;
    }
  }

  // Mark a referral message as read
  async markReferralMessageRead(referralMessageId: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/referral_messages/${referralMessageId}/mark_read`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Add auth headers here
        }
      });
      
      return response.ok;
    } catch (error) {
      console.error('Failed to mark referral message as read:', error);
      return false;
    }
  }
}

export const activityService = new ActivityService(); 