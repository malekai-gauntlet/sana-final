import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Placeholder component for the search bar
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

// Placeholder component for health metrics
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

// Placeholder component for recent messages
const RecentMessages = () => (
  <View style={styles.sectionContainer}>
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>Recent Messages</Text>
      <TouchableOpacity>
        <Text style={styles.viewAllText}>View All</Text>
      </TouchableOpacity>
    </View>
    <View style={styles.messagesList}>
      <View style={styles.messageCard}>
        <View style={styles.messageAvatar}>
          <Ionicons name="person-circle-outline" size={40} color="#8E8E93" />
        </View>
        <View style={styles.messageInfo}>
          <Text style={styles.messageSender}>Dr. Sarah Johnson</Text>
          <Text style={styles.messagePreview}>Your test results are ready...</Text>
          <Text style={styles.messageTime}>2h ago</Text>
        </View>
      </View>
      <View style={styles.messageCard}>
        <View style={styles.messageAvatar}>
          <Ionicons name="person-circle-outline" size={40} color="#8E8E93" />
        </View>
        <View style={styles.messageInfo}>
          <Text style={styles.messageSender}>Nurse Practitioner</Text>
          <Text style={styles.messagePreview}>Following up on your last visit...</Text>
          <Text style={styles.messageTime}>Yesterday</Text>
        </View>
      </View>
    </View>
  </View>
);

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
      <HealthMetrics />
      <UpcomingAppointments />
      <RecentMessages />
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
}); 