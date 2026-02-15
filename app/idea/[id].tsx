import { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Share,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { useIdeaStore, Idea, CATEGORY_LABELS, CATEGORY_COLORS } from '../../src/store/ideaStore';
import { colors, spacing, radius, fontSize, fontWeight, shadows } from '../../src/ui/theme';

export default function IdeaDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { ideas, toggleFavorite, toggleImplemented, deleteIdea } = useIdeaStore();
  const [idea, setIdea] = useState<Idea | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const foundIdea = ideas.find(i => i.id === id);
    setIdea(foundIdea || null);
    setIsLoading(false);
  }, [id, ideas]);

  const handleShare = async () => {
    if (!idea) return;
    
    try {
      await Share.share({
        message: `Check out my idea: ${idea.title}\n\n${idea.description}`,
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to share idea');
    }
  };

  const handleDelete = () => {
    if (!idea) return;
    
    Alert.alert(
      'Delete Idea',
      'Are you sure you want to delete this idea?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => {
            deleteIdea(idea.id);
            router.back();
          }
        },
      ]
    );
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  if (!idea) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorIcon}>💡</Text>
          <Text style={styles.errorTitle}>Idea not found</Text>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <Stack.Screen 
        options={{ 
          headerShown: true,
          headerTitle: '',
          headerTransparent: true,
          headerLeft: () => (
            <TouchableOpacity 
              style={styles.headerButton}
              onPress={() => router.back()}
            >
              <Text style={styles.headerButtonText}>←</Text>
            </TouchableOpacity>
          ),
          headerRight: () => (
            <View style={styles.headerButtons}>
              <TouchableOpacity 
                style={styles.headerButton}
                onPress={handleShare}
              >
                <Text style={styles.headerButtonText}>📤</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.headerButton}
                onPress={() => toggleFavorite(idea.id)}
              >
                <Text style={styles.headerButtonText}>{idea.isFavorite ? '❤️' : '🤍'}</Text>
              </TouchableOpacity>
            </View>
          ),
        }} 
      />
      
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Hero Section */}
        <View style={styles.heroSection}>
          <View style={[styles.categoryBadge, { backgroundColor: CATEGORY_COLORS[idea.category] + '20' }]}>
            <Text style={[styles.categoryText, { color: CATEGORY_COLORS[idea.category] }]}>
              {CATEGORY_LABELS[idea.category]}
            </Text>
          </View>
          
          <Text style={[styles.ideaTitle, idea.isImplemented && styles.ideaTitleDone]}>
            {idea.title}
          </Text>
          
          <View style={styles.statusRow}>
            {idea.isImplemented && (
              <View style={styles.implementedBadge}>
                <Text style={styles.implementedText}>✓ Implemented</Text>
              </View>
            )}
            {idea.isFavorite && (
              <View style={styles.favoriteBadge}>
                <Text style={styles.favoriteText}>❤️ Favorite</Text>
              </View>
            )}
          </View>
        </View>

        {/* Details Card */}
        <View style={styles.detailsCard}>
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.description}>{idea.description}</Text>
          
          <View style={styles.metaRow}>
            <Text style={styles.metaIcon}>📅</Text>
            <Text style={styles.metaText}>
              Created {new Date(idea.createdAt).toLocaleDateString()}
            </Text>
          </View>
          
          {idea.updatedAt !== idea.createdAt && (
            <View style={styles.metaRow}>
              <Text style={styles.metaIcon}>✏️</Text>
              <Text style={styles.metaText}>
                Updated {new Date(idea.updatedAt).toLocaleDateString()}
              </Text>
            </View>
          )}
        </View>

        {/* Tags */}
        {idea.tags.length > 0 && (
          <View style={styles.tagsCard}>
            <Text style={styles.sectionTitle}>Tags</Text>
            <View style={styles.tagsContainer}>
              {idea.tags.map((tag, index) => (
                <View key={index} style={styles.tag}>
                  <Text style={styles.tagText}>#{tag}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Actions */}
        <View style={styles.actionsCard}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => toggleImplemented(idea.id)}
          >
            <Text style={styles.actionIcon}>{idea.isImplemented ? '⬜' : '✅'}</Text>
            <Text style={styles.actionText}>
              {idea.isImplemented ? 'Mark as Not Done' : 'Mark as Implemented'}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => toggleFavorite(idea.id)}
          >
            <Text style={styles.actionIcon}>{idea.isFavorite ? '❤️' : '🤍'}</Text>
            <Text style={styles.actionText}>
              {idea.isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.actionButton, styles.deleteButton]}
            onPress={handleDelete}
          >
            <Text style={styles.actionIcon}>🗑️</Text>
            <Text style={[styles.actionText, { color: colors.error }]}>Delete Idea</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xxl,
  },
  errorIcon: {
    fontSize: 64,
    marginBottom: spacing.lg,
  },
  errorTitle: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.semibold,
    color: colors.textPrimary,
    marginBottom: spacing.lg,
  },
  backButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.xxl,
    paddingVertical: spacing.md,
    borderRadius: radius.md,
  },
  backButtonText: {
    color: colors.white,
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: radius.full,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.md,
  },
  headerButtonText: {
    fontSize: 18,
  },
  headerButtons: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  heroSection: {
    backgroundColor: colors.primary,
    padding: spacing.xxl,
    paddingTop: spacing.xxxl,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.md,
    marginBottom: spacing.md,
  },
  categoryText: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
  },
  ideaTitle: {
    fontSize: fontSize.xxxl,
    fontWeight: fontWeight.bold,
    color: colors.white,
    marginBottom: spacing.md,
  },
  ideaTitleDone: {
    textDecorationLine: 'line-through',
    opacity: 0.7,
  },
  statusRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  implementedBadge: {
    backgroundColor: colors.success,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.md,
  },
  implementedText: {
    color: colors.white,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
  },
  favoriteBadge: {
    backgroundColor: colors.error,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.md,
  },
  favoriteText: {
    color: colors.white,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
  },
  detailsCard: {
    backgroundColor: colors.white,
    margin: spacing.lg,
    marginTop: -spacing.lg,
    borderRadius: radius.lg,
    padding: spacing.lg,
    ...shadows.md,
  },
  sectionTitle: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  description: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
    lineHeight: 24,
    marginBottom: spacing.lg,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  metaIcon: {
    fontSize: 14,
    marginRight: spacing.sm,
  },
  metaText: {
    fontSize: fontSize.sm,
    color: colors.textTertiary,
  },
  tagsCard: {
    backgroundColor: colors.white,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.lg,
    borderRadius: radius.lg,
    padding: spacing.lg,
    ...shadows.sm,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  tag: {
    backgroundColor: colors.primary + '15',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.full,
  },
  tagText: {
    color: colors.primary,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
  },
  actionsCard: {
    backgroundColor: colors.white,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.lg,
    borderRadius: radius.lg,
    padding: spacing.lg,
    ...shadows.sm,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  actionIcon: {
    fontSize: 20,
    marginRight: spacing.md,
  },
  actionText: {
    fontSize: fontSize.md,
    color: colors.textPrimary,
  },
  deleteButton: {
    borderBottomWidth: 0,
  },
});
