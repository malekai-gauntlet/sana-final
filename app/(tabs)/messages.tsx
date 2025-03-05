import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';

// Types
interface SortingOptionsProps {
  activeSort: string;
  onSortChange: (sort: string) => void;
}

interface Conversation {
  id: string;
  name: string;
  role: string;
  lastMessage: string;
  timestamp: string;
  unread: boolean;
  online: boolean;
}

interface ConversationItemProps {
  conversation: Conversation;
}

// Placeholder component for the search bar
const SearchBar = () => (
  <View style={styles.searchContainer}>
    <Ionicons name="search-outline" size={20} color="#8E8E93" />
    <TextInput
      style={styles.searchInput}
      placeholder="Search conversations..."
      placeholderTextColor="#8E8E93"
    />
  </View>
);

// Placeholder component for sorting options
const SortingOptions = ({ activeSort, onSortChange }: SortingOptionsProps) => (
  <View style={styles.sortingContainer}>
    <Pressable
      style={[styles.sortButton, activeSort === 'recent' && styles.sortButtonActive]}
      onPress={() => onSortChange('recent')}>
      <Text style={[styles.sortButtonText, activeSort === 'recent' && styles.sortButtonTextActive]}>
        Recent
      </Text>
    </Pressable>
    <Pressable
      style={[styles.sortButton, activeSort === 'unread' && styles.sortButtonActive]}
      onPress={() => onSortChange('unread')}>
      <Text style={[styles.sortButtonText, activeSort === 'unread' && styles.sortButtonTextActive]}>
        Unread
      </Text>
    </Pressable>
    <Pressable
      style={[styles.sortButton, activeSort === 'provider' && styles.sortButtonActive]}
      onPress={() => onSortChange('provider')}>
      <Text style={[styles.sortButtonText, activeSort === 'provider' && styles.sortButtonTextActive]}>
        Provider
      </Text>
    </Pressable>
  </View>
);

// Placeholder data for conversations
const CONVERSATIONS = [
  {
    id: '1',
    name: 'Dr. Sarah Johnson',
    role: 'Primary Care Physician',
    lastMessage: 'Your test results look good. Let me know if you have any questions.',
    timestamp: '2m ago',
    unread: true,
    online: true,
  },
  {
    id: '2',
    name: 'Dr. Michael Chen',
    role: 'Cardiologist',
    lastMessage: 'Please remember to take your medication as prescribed.',
    timestamp: '1h ago',
    unread: false,
    online: false,
  },
  {
    id: '3',
    name: 'Nurse Williams',
    role: 'Registered Nurse',
    lastMessage: 'How are you feeling after the procedure?',
    timestamp: '3h ago',
    unread: true,
    online: true,
  },
  {
    id: '4',
    name: 'Dr. Emily Rodriguez',
    role: 'Dermatologist',
    lastMessage: 'Your prescription has been sent to the pharmacy.',
    timestamp: 'Yesterday',
    unread: false,
    online: false,
  },
  {
    id: '5',
    name: 'Dr. James Wilson',
    role: 'Neurologist',
    lastMessage: 'Let\'s schedule a follow-up appointment next month.',
    timestamp: 'Yesterday',
    unread: false,
    online: false,
  },
];

// Conversation list item component
const ConversationItem = ({ conversation }: ConversationItemProps) => (
  <TouchableOpacity style={styles.conversationItem}>
    <View style={styles.avatarContainer}>
      <View style={styles.avatar}>
        <Ionicons name="person" size={24} color="#FFFFFF" />
      </View>
      {conversation.online && <View style={styles.onlineIndicator} />}
    </View>
    <View style={styles.conversationContent}>
      <View style={styles.conversationHeader}>
        <Text style={styles.conversationName}>{conversation.name}</Text>
        <Text style={styles.conversationTime}>{conversation.timestamp}</Text>
      </View>
      <Text style={styles.conversationRole}>{conversation.role}</Text>
      <Text 
        style={[
          styles.conversationMessage,
          conversation.unread && styles.conversationMessageUnread
        ]}
        numberOfLines={1}
      >
        {conversation.lastMessage}
      </Text>
    </View>
  </TouchableOpacity>
);

export default function MessagesScreen() {
  const [activeSort, setActiveSort] = useState('recent');

  return (
    <View style={styles.container}>
      <SearchBar />
      <SortingOptions activeSort={activeSort} onSortChange={setActiveSort} />
      <ScrollView style={styles.conversationList}>
        {CONVERSATIONS.map((conversation) => (
          <ConversationItem key={conversation.id} conversation={conversation} />
        ))}
      </ScrollView>
      <TouchableOpacity style={styles.newMessageButton}>
        <Ionicons name="create" size={24} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
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
  sortingContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  sortButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 15,
    marginRight: 8,
    backgroundColor: '#FFFFFF',
  },
  sortButtonActive: {
    backgroundColor: '#007AFF',
  },
  sortButtonText: {
    fontSize: 14,
    color: '#8E8E93',
  },
  sortButtonTextActive: {
    color: '#FFFFFF',
  },
  conversationList: {
    flex: 1,
  },
  conversationItem: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 12,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#8E8E93',
    alignItems: 'center',
    justifyContent: 'center',
  },
  onlineIndicator: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#34C759',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  conversationContent: {
    flex: 1,
  },
  conversationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  conversationName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
  },
  conversationTime: {
    fontSize: 12,
    color: '#8E8E93',
  },
  conversationRole: {
    fontSize: 14,
    color: '#8E8E93',
    marginBottom: 4,
  },
  conversationMessage: {
    fontSize: 14,
    color: '#8E8E93',
  },
  conversationMessageUnread: {
    color: '#000000',
    fontWeight: '500',
  },
  newMessageButton: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#007AFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
}); 