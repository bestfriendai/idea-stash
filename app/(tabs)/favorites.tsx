import { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useIdeaStore, Idea, CATEGORY_LABELS, CATEGORY_COLORS } from '../../src/store/ideaStore';
import { colors, spacing, radius, fontSize, fontWeight, shadows } from '../../src/ui/theme';

export default function FavoritesScreen() {
  const router = useRouter();
  const { ideas, loadIdeas, toggleFavorite, toggleImplemented } = useIdeaStore();

  useEffect(() => {
    loadIdeas();
  }, []);

  const favorites = ideas.filter(idea => idea.isFavorite);

  const handleIdeaPress = (idea: Idea) => {
    router.push(`/idea/${idea.id}`);
  };

  const renderIdeaCard = ({ item }: { item: Idea }) => (
    <TouchableOpacity 
      style={styles.ideaCard} 
      onPress={() => handleIdeaPress(item)}
      activeOpacity={0.7}
    >
      <View style={styles.ideaCardHeader}>
        <View style={[styles.categoryBadge, { backgroundColor: CATEGORY_COLORS[item.category] + '20' }]}>
          <Text style={[styles.categoryText, { color: CATEGORY_COLORS[item.category] }]}>
            {CATEGORY_LABELS[item.category]}
          </Text>
        </View>
        <View style={styles.actionButtons}>
          <TouchableOpacity 
            onPress={() => toggleImplemented(item.id)}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Text style={styles.actionIcon}>{item.isImplemented ? '✅' : '⬜'}</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={() => toggleFavorite(item.id)}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Text style={styles.actionIcon}>❤️</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      <Text style={[styles.ideaTitle, item.isImplemented && styles.ideaTitleDone]}>{item.title}</Text>
      <Text style={styles.ideaDescription} numberOfLines={2}>{item.description}</Text>
      
      {item.tags.length > 0 && (
        <View style={styles.tagsRow}>
          {item.tags.slice(0, 3).map((tag, index) => (
            <View key={index} style={styles.tag}>
              <Text style={styles.tagText}>#{tag}</Text>
            </View>
          ))}
        </View>
      )}
      
      <Text style={styles.dateText}>
        {new Date(item.updatedAt).toLocaleDateString()}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Favorites</Text>
        <Text style={styles.headerSubtitle}>
          {favorites.length} {favorites.length === 1 ? 'idea' : 'ideas'} saved
        </Text>
      </View>

      <FlatList
        data={favorites}
        renderItem={renderIdeaCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>🤍</Text>
            <Text style={styles.emptyTitle}>No favorites yet</Text>
            <Text style={styles.emptySubtitle}>
              Tap the heart on any idea to save it here
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
  },
  headerTitle: {
    fontSize: fontSize.title,
    fontWeight: fontWeight.bold,
    color: colors.primary,
  },
  headerSubtitle: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  listContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  ideaCard: {
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.sm,
  },
  ideaCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  categoryBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.sm,
  },
  categoryText: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.semibold,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  actionIcon: {
    fontSize: 18,
  },
  ideaTitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  ideaTitleDone: {
    textDecorationLine: 'line-through',
    color: colors.textTertiary,
  },
  ideaDescription: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
    marginBottom: spacing.md,
    lineHeight: 20,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
    marginBottom: spacing.sm,
  },
  tag: {
    backgroundColor: colors.primary + '15',
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radius.sm,
  },
  tagText: {
    fontSize: fontSize.xs,
    color: colors.primary,
    fontWeight: fontWeight.medium,
  },
  dateText: {
    fontSize: fontSize.xs,
    color: colors.textTertiary,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 100,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: spacing.lg,
  },
  emptyTitle: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.semibold,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  emptySubtitle: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});
