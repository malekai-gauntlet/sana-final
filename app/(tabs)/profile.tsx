import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { authService } from '../services/AuthService';

// Profile Header Component
const ProfileHeader = () => (
  <View style={styles.headerContainer}>
    <View style={styles.avatarContainer}>
      <Image
        source={{ uri: 'https://via.placeholder.com/100' }}
        style={styles.avatar}
      />
      <TouchableOpacity style={styles.editAvatarButton}>
        <Ionicons name="camera" size={20} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
    <View style={styles.profileInfo}>
      <Text style={styles.name}>John Doe</Text>
      <Text style={styles.memberId}>Member ID: 123456789</Text>
      <Text style={styles.planType}>Premium Health Plan</Text>
    </View>
  </View>
);

// Section Header Component
const SectionHeader = ({ title, action }: { title: string; action?: string }) => (
  <View style={styles.sectionHeader}>
    <Text style={styles.sectionTitle}>{title}</Text>
    {action && (
      <TouchableOpacity>
        <Text style={styles.actionText}>{action}</Text>
      </TouchableOpacity>
    )}
  </View>
);

// Info Item Component
const InfoItem = ({ icon, label, value }: { icon: keyof typeof Ionicons.glyphMap; label: string; value: string }) => (
  <View style={styles.infoItem}>
    <View style={styles.infoIcon}>
      <Ionicons name={icon} size={24} color="#007AFF" />
    </View>
    <View style={styles.infoContent}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
    <Ionicons name="chevron-forward" size={20} color="#8E8E93" />
  </View>
);

// Integration Card Component
const IntegrationCard = ({ 
  name, 
  icon, 
  status, 
  description 
}: { 
  name: string; 
  icon: keyof typeof Ionicons.glyphMap; 
  status: 'connected' | 'disconnected'; 
  description: string;
}) => (
  <TouchableOpacity style={styles.integrationCard}>
    <View style={styles.integrationHeader}>
      <View style={styles.integrationIcon}>
        <Ionicons name={icon} size={24} color="#007AFF" />
      </View>
      <View style={styles.integrationInfo}>
        <Text style={styles.integrationName}>{name}</Text>
        <View style={[
          styles.statusBadge,
          status === 'connected' ? styles.connectedBadge : styles.disconnectedBadge
        ]}>
          <View style={[
            styles.statusDot,
            status === 'connected' ? styles.connectedDot : styles.disconnectedDot
          ]} />
          <Text style={[
            styles.statusText,
            status === 'connected' ? styles.connectedText : styles.disconnectedText
          ]}>
            {status === 'connected' ? 'Connected' : 'Disconnected'}
          </Text>
        </View>
      </View>
    </View>
    <Text style={styles.integrationDescription}>{description}</Text>
  </TouchableOpacity>
);

export default function ProfileScreen() {
  const handleSignOut = async () => {
    await authService.logout();
    router.replace('/(auth)/login');
  };

  return (
    <ScrollView style={styles.container}>
      <ProfileHeader />
      
      <View style={styles.section}>
        <SectionHeader title="Personal Information" action="Edit" />
        <InfoItem
          icon="mail-outline"
          label="Email"
          value="john.doe@example.com"
        />
        <InfoItem
          icon="call-outline"
          label="Phone"
          value="(555) 123-4567"
        />
        <InfoItem
          icon="location-outline"
          label="Address"
          value="123 Health St, Medical City, MC 12345"
        />
      </View>

      <View style={styles.section}>
        <SectionHeader title="Health Information" action="Edit" />
        <InfoItem
          icon="medical-outline"
          label="Primary Care"
          value="Dr. Sarah Johnson"
        />
        <InfoItem
          icon="fitness-outline"
          label="Blood Type"
          value="A+"
        />
        <InfoItem
          icon="warning-outline"
          label="Allergies"
          value="None reported"
        />
      </View>

      <View style={styles.section}>
        <SectionHeader title="Settings" />
        <InfoItem
          icon="notifications-outline"
          label="Notifications"
          value="Enabled"
        />
        <InfoItem
          icon="lock-closed-outline"
          label="Privacy"
          value="View settings"
        />
        <InfoItem
          icon="language-outline"
          label="Language"
          value="English"
        />
      </View>

      <View style={styles.section}>
        <SectionHeader title="Health Integrations" />
        <IntegrationCard
          name="Apple Health"
          icon="fitness"
          status="connected"
          description="Sync your health and activity data"
        />
        <IntegrationCard
          name="Headspace"
          icon="heart"
          status="disconnected"
          description="Connect for meditation and mindfulness"
        />
      </View>

      <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
        <Text style={styles.signOutText}>Sign Out</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  headerContainer: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  editAvatarButton: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    backgroundColor: '#007AFF',
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  profileInfo: {
    alignItems: 'center',
  },
  name: {
    fontSize: 24,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 4,
  },
  memberId: {
    fontSize: 14,
    color: '#8E8E93',
    marginBottom: 4,
  },
  planType: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '500',
  },
  section: {
    backgroundColor: '#FFFFFF',
    marginTop: 20,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#E5E5EA',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000000',
  },
  actionText: {
    color: '#007AFF',
    fontSize: 16,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E5EA',
  },
  infoIcon: {
    width: 32,
    alignItems: 'center',
    marginRight: 12,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 16,
    color: '#000000',
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 14,
    color: '#8E8E93',
  },
  integrationCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  integrationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  integrationIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#007AFF10',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  integrationInfo: {
    flex: 1,
  },
  integrationName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 4,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  connectedBadge: {
    backgroundColor: '#34C75910',
  },
  disconnectedBadge: {
    backgroundColor: '#FF3B3010',
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 4,
  },
  connectedDot: {
    backgroundColor: '#34C759',
  },
  disconnectedDot: {
    backgroundColor: '#FF3B30',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  connectedText: {
    color: '#34C759',
  },
  disconnectedText: {
    color: '#FF3B30',
  },
  integrationDescription: {
    fontSize: 14,
    color: '#8E8E93',
  },
  signOutButton: {
    margin: 16,
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FF3B30',
  },
  signOutText: {
    color: '#FF3B30',
    fontSize: 16,
    fontWeight: '600',
  },
}); 