import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Pressable, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useState, useEffect } from 'react';
import { careRequestService, type CareRequest } from '../services/CareRequestService';
import { router } from 'expo-router';

// Types
type SortType = 'recent' | 'unread';

interface SortingOptionsProps {
  activeSort: SortType;
  onSortChange: (sort: SortType) => void;
}

// Search Bar Component
const SearchBar = () => (
  <View style={styles.searchContainer}>
    <Ionicons name="search-outline" size={20} color="#8E8E93" />
    <TextInput
      style={styles.searchInput}
      placeholder="Search messages..."
      placeholderTextColor="#8E8E93"
    />
  </View>
);

// Sorting Options Component
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
  </View>
);

// Conversation Item Component
const ConversationItem = ({ conversation }: { conversation: CareRequest }) => {
  const handlePress = () => {
    router.push({
      pathname: "/(chat)/[id]",
      params: { 
        id: conversation.id,
        isNewRequest: 'false'
      }
    });
  };

  return (
    <TouchableOpacity onPress={handlePress} style={styles.conversationItem}>
      <View style={styles.conversationContent}>
        <View style={styles.conversationHeader}>
          <Text style={styles.conversationName}>{conversation.title}</Text>
          <Text style={styles.conversationTime}>
            {new Date(conversation.lastMessage.sentAt).toLocaleTimeString('en-US', {
              hour: 'numeric',
              minute: '2-digit',
              hour12: true
            })}
          </Text>
        </View>
        <Text style={styles.messagePreview} numberOfLines={2}>
          {conversation.lastMessage.text}
        </Text>
        {conversation.patientUnreadMessages && (
          <View style={styles.unreadIndicator} />
        )}
      </View>
    </TouchableOpacity>
  );
};

export default function MessagesScreen() {
  const [activeSort, setActiveSort] = useState<SortType>('recent');
  const [conversations, setConversations] = useState<CareRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadConversations();
  }, []);

  const loadConversations = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await careRequestService.getCareRequests();
      setConversations(data || []);
    } catch (err) {
      setError('Failed to load conversations. Please try again.');
      console.error('Error loading conversations:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Sort and filter conversations based on active sort
  const getSortedConversations = () => {
    if (!conversations) return [];

    let sortedConversations = [...conversations];

    switch (activeSort) {
      case 'recent':
        // Sort by most recent message
        return sortedConversations.sort((a, b) => 
          new Date(b.lastMessage.sentAt).getTime() - new Date(a.lastMessage.sentAt).getTime()
        );
      case 'unread':
        // Filter to show only unread messages first, then sort by date
        return sortedConversations
          .sort((a, b) => 
            new Date(b.lastMessage.sentAt).getTime() - new Date(a.lastMessage.sentAt).getTime()
          )
          .sort((a, b) => {
            if (a.patientUnreadMessages && !b.patientUnreadMessages) return -1;
            if (!a.patientUnreadMessages && b.patientUnreadMessages) return 1;
            return 0;
          });
      default:
        return sortedConversations;
    }
  };

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#1D363F" />
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

  const sortedConversations = getSortedConversations();

  return (
    <View style={styles.container}>
      <SearchBar />
      <SortingOptions activeSort={activeSort} onSortChange={setActiveSort} />
      <ScrollView style={styles.conversationList}>
        {sortedConversations.map((conversation) => (
          <ConversationItem key={conversation.id} conversation={conversation} />
        ))}
        {sortedConversations.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No conversations yet</Text>
          </View>
        )}
      </ScrollView>
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
    backgroundColor: '#1D363F',
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
    backgroundColor: '#1D363F',
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
  messagePreview: {
    fontSize: 14,
    color: '#8E8E93',
    marginTop: 2,
  },
  unreadIndicator: {
    position: 'absolute',
    right: 0,
    top: '50%',
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ECC749',
    transform: [{ translateY: -4 }],
  },
}); 