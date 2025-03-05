import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Pressable, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useState, useEffect } from 'react';
import { carePlatformClient, type Conversation } from '../services/CarePlatformClient';
import { router } from 'expo-router';

// Types
interface SortingOptionsProps {
  activeSort: string;
  onSortChange: (sort: string) => void;
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

// Conversation list item component
const ConversationItem = ({ conversation }: ConversationItemProps) => (
  <TouchableOpacity 
    style={styles.conversationItem}
    onPress={() => router.push(`/(chat)/${conversation.id}`)}
  >
    <View style={styles.avatarContainer}>
      <View style={styles.avatar}>
        <Ionicons name="person" size={24} color="#FFFFFF" />
      </View>
      {/* Online indicator removed as we don't have this in the API yet */}
    </View>
    <View style={styles.conversationContent}>
      <View style={styles.conversationHeader}>
        <Text style={styles.conversationName}>{conversation.provider.name}</Text>
        <Text style={styles.conversationTime}>
          {conversation.lastMessage?.timestamp || 'No messages'}
        </Text>
      </View>
      <Text style={styles.conversationRole}>{conversation.provider.role}</Text>
      <Text 
        style={[
          styles.conversationMessage,
          conversation.unread && styles.conversationMessageUnread
        ]}
        numberOfLines={1}
      >
        {conversation.lastMessage?.text || 'No messages yet'}
      </Text>
    </View>
  </TouchableOpacity>
);

export default function MessagesScreen() {
  const [activeSort, setActiveSort] = useState('recent');
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadConversations();
  }, []);

  const loadConversations = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await carePlatformClient.getConversations();
      setConversations(data);
    } catch (err) {
      setError('Failed to load conversations. Please try again.');
      console.error('Error loading conversations:', err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={loadConversations}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <SearchBar />
      <SortingOptions activeSort={activeSort} onSortChange={setActiveSort} />
      <ScrollView style={styles.conversationList}>
        {conversations.map((conversation) => (
          <ConversationItem key={conversation.id} conversation={conversation} />
        ))}
        {conversations.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No conversations yet</Text>
          </View>
        )}
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
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F2F2F7',
  },
  errorText: {
    color: '#FF3B30',
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyStateText: {
    color: '#8E8E93',
    fontSize: 16,
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