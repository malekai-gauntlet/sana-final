import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { careRequestService, type CareRequestType, type CareRequest } from '../services/CareRequestService';
import { ConsentModal } from '../components/ConsentModal';

// Types
interface CareOption {
  id: string;
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  type: CareRequestType;
}

// Care options data
const CARE_OPTIONS: CareOption[] = [
  { id: '1', title: 'I feel sick', icon: 'medical-outline', type: 'sick' },
  { id: '2', title: 'I\'d like an Annual Health Check-Up', icon: 'fitness-outline', type: 'checkup' },
  { id: '3', title: 'I have an injury', icon: 'bandage-outline', type: 'injury' },
  { id: '4', title: 'I have a chronic health concern', icon: 'pulse-outline', type: 'chronic' },
  { id: '5', title: 'I have a mental health concern', icon: 'heart-outline', type: 'mental_health' },
  { id: '6', title: 'I need a referral to a medical specialist', icon: 'people-outline', type: 'specialist_referral' },
  { id: '7', title: 'I need a prescription refill', icon: 'medical-outline', type: 'prescription_refill' },
  { id: '8', title: 'I need to plan an X-ray, ultrasound, or other imaging', icon: 'scan-outline', type: 'imaging' },
  { id: '9', title: 'I need to plan surgery', icon: 'cut-outline', type: 'surgery' },
  { id: '10', title: 'It\'s something else', icon: 'help-circle-outline', type: 'other' },
];

// Search Bar Component
const SearchBar = () => (
  <View style={styles.searchContainer}>
    <Ionicons name="search-outline" size={20} color="#8E8E93" />
    <TextInput
      style={styles.searchInput}
      placeholder="Search appointments, messages, records..."
      placeholderTextColor="#8E8E93"
    />
  </View>
);

// Welcome Section Component
const WelcomeSection = () => (
  <View style={styles.welcomeContainer}>
    <Text style={styles.welcomeTitle}>How can we help?</Text>
    <Text style={styles.welcomeSubtitle}>Tell a provider what you need.</Text>
  </View>
);

// Care Option Component
const CareOption = ({ option }: { option: CareOption }) => {
  const [showConsent, setShowConsent] = useState(false);

  const handlePress = () => {
    setShowConsent(true);
  };

  const handleConsentSubmit = async () => {
    try {
      const careRequest = await careRequestService.createCareRequest(option.type);
      if (careRequest) {
        setShowConsent(false);
        router.push(`/(chat)/${careRequest.id}`);
      }
    } catch (error) {
      console.error('Failed to create care request:', error);
      Alert.alert('Error', 'Failed to create care request. Please try again.');
    }
  };

  return (
    <>
      <TouchableOpacity style={styles.careOptionCard} onPress={handlePress}>
        <View style={styles.careOptionContent}>
          <Ionicons name={option.icon} size={24} color="#007AFF" style={styles.careOptionIcon} />
          <Text style={styles.careOptionTitle}>{option.title}</Text>
          <Ionicons name="chevron-forward" size={20} color="#8E8E93" />
        </View>
      </TouchableOpacity>

      <ConsentModal
        visible={showConsent}
        onClose={() => setShowConsent(false)}
        onSubmit={handleConsentSubmit}
      />
    </>
  );
};

// Get Care Section Component
const GetCareSection = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const displayedOptions = isExpanded ? CARE_OPTIONS : CARE_OPTIONS.slice(0, 3);

  return (
    <View style={styles.getCareContainer}>
      <Text style={styles.getCareTitle}>Get care now</Text>
      {displayedOptions.map((option) => (
        <CareOption key={option.id} option={option} />
      ))}
      <TouchableOpacity 
        style={styles.showMoreButton}
        onPress={() => setIsExpanded(!isExpanded)}
      >
        <Text style={styles.showMoreText}>
          {isExpanded ? 'Show Less' : 'Show More Options'}
        </Text>
        <Ionicons 
          name={isExpanded ? 'chevron-up' : 'chevron-down'} 
          size={20} 
          color="#007AFF" 
        />
      </TouchableOpacity>
    </View>
  );
};

// Health Metrics Component
const HealthMetrics = () => (
  <View style={styles.sectionContainer}>
    <Text style={styles.sectionTitle}>Health Overview</Text>
    <View style={styles.metricsGrid}>
      <View style={styles.metricCard}>
        <Text style={styles.metricValue}>120/80</Text>
        <Text style={styles.metricLabel}>Blood Pressure</Text>
      </View>
      <View style={styles.metricCard}>
        <Text style={styles.metricValue}>72</Text>
        <Text style={styles.metricLabel}>Heart Rate</Text>
      </View>
      <View style={styles.metricCard}>
        <Text style={styles.metricValue}>7.2h</Text>
        <Text style={styles.metricLabel}>Sleep</Text>
      </View>
      <View style={styles.metricCard}>
        <Text style={styles.metricValue}>8,234</Text>
        <Text style={styles.metricLabel}>Steps</Text>
      </View>
    </View>
  </View>
);

// Placeholder component for upcoming appointments
const UpcomingAppointments = () => (
  <View style={styles.sectionContainer}>
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>Upcoming Appointments</Text>
      <TouchableOpacity>
        <Text style={styles.viewAllText}>View All</Text>
      </TouchableOpacity>
    </View>
    <View style={styles.appointmentsList}>
      <View style={styles.appointmentCard}>
        <View style={styles.appointmentInfo}>
          <Text style={styles.appointmentTitle}>Dr. Sarah Johnson</Text>
          <Text style={styles.appointmentType}>Annual Check-up</Text>
          <Text style={styles.appointmentTime}>Tomorrow at 10:00 AM</Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color="#8E8E93" />
      </View>
      <View style={styles.appointmentCard}>
        <View style={styles.appointmentInfo}>
          <Text style={styles.appointmentTitle}>Dr. Michael Chen</Text>
          <Text style={styles.appointmentType}>Virtual Consultation</Text>
          <Text style={styles.appointmentTime}>Feb 28 at 2:30 PM</Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color="#8E8E93" />
      </View>
    </View>
  </View>
);

// Replace RecentMessages component with CareRequests
const CareRequests = () => {
  const [careRequests, setCareRequests] = useState<CareRequest[]>([]);
  const [loading, setLoading] = useState(false);

  const handleFetchRequests = async () => {
    console.log('🔄 Starting fetch request operation...');
    setLoading(true);
    
    try {
      const requests = await careRequestService.getCareRequests();
      if (Array.isArray(requests)) {
        setCareRequests(requests);
      }
    } catch (error) {
      console.error('❌ Error in handleFetchRequests:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return `Today at ${date.toLocaleTimeString('en-US', { 
        hour: 'numeric',
        minute: '2-digit',
        hour12: true 
      })}`;
    } catch (error) {
      console.error('❌ Error formatting time:', dateString, error);
      return '';
    }
  };

  return (
    <View style={styles.sectionContainer}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>My Care Requests</Text>
        <TouchableOpacity 
          onPress={handleFetchRequests}
          style={styles.fetchButton}
          disabled={loading}
        >
          <Text style={styles.fetchButtonText}>
            Get Care Now
          </Text>
        </TouchableOpacity>
      </View>
      <View style={styles.careRequestsList}>
        {careRequests.map((request) => (
          <TouchableOpacity key={request.id} style={styles.careRequestCard}>
            <View style={styles.careRequestInfo}>
              <View style={styles.careRequestHeader}>
                <Text style={styles.careRequestTitle}>
                  {request.title}
                </Text>
                {request.patientUnreadMessages && (
                  <View style={styles.newBadge}>
                    <Text style={styles.newBadgeText}>New</Text>
                  </View>
                )}
              </View>
              <Text style={styles.careRequestSubtitle}>
                Automated Message
              </Text>
              <Text style={styles.careRequestTime}>
                {formatTime(request.lastMessage.sentAt)}
              </Text>
              <Text style={styles.careRequestMessage}>
                We have received your care request!
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#8E8E93" />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

// Placeholder component for quick actions
const QuickActions = () => (
  <View style={styles.sectionContainer}>
    <Text style={styles.sectionTitle}>Quick Actions</Text>
    <View style={styles.quickActionsGrid}>
      <TouchableOpacity style={styles.actionButton}>
        <Ionicons name="calendar" size={24} color="#007AFF" />
        <Text style={styles.actionButtonText}>Book{'\n'}Appointment</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.actionButton}>
        <Ionicons name="chatbubbles" size={24} color="#007AFF" />
        <Text style={styles.actionButtonText}>Message{'\n'}Provider</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.actionButton}>
        <Ionicons name="document-text" size={24} color="#007AFF" />
        <Text style={styles.actionButtonText}>Health{'\n'}Records</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.actionButton}>
        <Ionicons name="videocam" size={24} color="#007AFF" />
        <Text style={styles.actionButtonText}>Virtual{'\n'}Care</Text>
      </TouchableOpacity>
    </View>
  </View>
);

export default function HomeScreen() {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <SearchBar />
      <WelcomeSection />
      <GetCareSection />
      <HealthMetrics />
      <UpcomingAppointments />
      <CareRequests />
      <QuickActions />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    margin: 16,
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
  },
  welcomeContainer: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 8,
  },
  welcomeSubtitle: {
    fontSize: 17,
    color: '#8E8E93',
  },
  getCareContainer: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    marginBottom: 20,
  },
  getCareTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 16,
  },
  careOptionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  careOptionContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  careOptionIcon: {
    marginRight: 12,
  },
  careOptionTitle: {
    fontSize: 17,
    color: '#000000',
    flex: 1,
  },
  sectionContainer: {
    backgroundColor: '#FFFFFF',
    margin: 16,
    marginTop: 0,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 12,
  },
  viewAllText: {
    color: '#007AFF',
    fontSize: 14,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  metricCard: {
    width: '48%',
    backgroundColor: '#F2F2F7',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  metricValue: {
    fontSize: 24,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 4,
  },
  metricLabel: {
    fontSize: 14,
    color: '#8E8E93',
  },
  appointmentsList: {
    gap: 12,
  },
  appointmentCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F2F2F7',
    padding: 12,
    borderRadius: 8,
  },
  appointmentInfo: {
    flex: 1,
  },
  appointmentTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000000',
    marginBottom: 4,
  },
  appointmentType: {
    fontSize: 14,
    color: '#8E8E93',
    marginBottom: 2,
  },
  appointmentTime: {
    fontSize: 14,
    color: '#007AFF',
  },
  messagesList: {
    gap: 12,
  },
  messageCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F2F2F7',
    padding: 12,
    borderRadius: 8,
  },
  messageAvatar: {
    marginRight: 12,
  },
  messageInfo: {
    flex: 1,
  },
  messageSender: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000000',
    marginBottom: 4,
  },
  messagePreview: {
    fontSize: 14,
    color: '#8E8E93',
    marginBottom: 2,
  },
  messageTime: {
    fontSize: 12,
    color: '#8E8E93',
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionButton: {
    width: '48%',
    backgroundColor: '#F2F2F7',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    alignItems: 'center',
  },
  actionButtonText: {
    fontSize: 14,
    color: '#000000',
    marginTop: 8,
    textAlign: 'center',
  },
  showMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    marginTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#E5E5EA',
  },
  showMoreText: {
    color: '#007AFF',
    fontSize: 16,
    marginRight: 4,
  },
  fetchButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  fetchButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
  careRequestsList: {
    gap: 12,
  },
  careRequestCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F2F2F7',
    padding: 16,
    borderRadius: 8,
  },
  careRequestInfo: {
    flex: 1,
  },
  careRequestHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  careRequestTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000000',
    marginBottom: 4,
  },
  careRequestSubtitle: {
    fontSize: 14,
    color: '#8E8E93',
    marginBottom: 2,
  },
  careRequestTime: {
    fontSize: 12,
    color: '#8E8E93',
    marginBottom: 2,
  },
  careRequestMessage: {
    fontSize: 14,
    color: '#8E8E93',
  },
  newBadge: {
    backgroundColor: '#FF3B30',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    marginLeft: 8,
  },
  newBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '500',
  },
}); 