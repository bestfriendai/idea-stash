import { useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useIdeaStore, CATEGORY_LABELS, CATEGORY_COLORS } from '../../src/store/ideaStore';
import { colors, spacing, radius, fontSize, fontWeight, shadows } from '../../src/ui/theme';

export default function TagsScreen() {
  const router = useRouter();
  const { ideas, loadIdeas } = useIdeaStore();

  useEffect(() => {
    loadIdeas();
  }, []);

  const tagStats = useMemo(() => {
    const tagMap: Record<string, number> = {};
    
    ideas.forEach(idea => {
      idea.tags.forEach(tag => {
        tagMap[tag] = (tagMap[tag] || 0) + 1;
      });
    });
    
    return Object.entries(tagMap)
      .map(([tag, count]) => ({ tag, count }))
      .sort((a, b) => b.count - a.count);
  }, [ideas]);

  const categoryStats = useMemo(() => {
    const catMap: Record<string, number> = {};
    
    ideas.forEach(idea => {
      catMap[idea.category] = (catMap[idea.category] || 0) + 1;
    });
    
    return Object.entries(catMap)
      .map(([category, count]) => ({ 
        category: category as keyof typeof CATEGORY_LABELS, 
        count 
      }))
      .sort((a, b) => b.count - a.count);
  }, [ideas]);

  const renderTagChip = ({ tag, count }: { tag: string; count: number }) => (
    <TouchableOpacity
      key={tag}
      style={styles.tagChip}
      onPress={() => {
        // In a real app, this would filter by tag
        router.push('/(tabs)');
      }}
    >
      <Text style={styles.tagChipText}>#{tag}</Text>
      <View style={styles.tagChipBadge}>
        <Text style={styles.tagChipBadgeText}>{count}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderCategoryCard = ({ category, count }: { category: keyof typeof CATEGORY_LABELS; count: number }) => (
    <TouchableOpacity
      key={category}
      style={[styles.categoryCard, { borderLeftColor: CATEGORY_COLORS[category] }]}
      onPress={() => {
        // In a real app, this would filter by category
        router.push('/(tabs)');
      }}
    >
      <View style={[styles.categoryIcon, { backgroundColor: CATEGORY_COLORS[category] + '20' }]}>
        <Text style={styles.categoryIconText}>
          {CATEGORY_LABELS[category].charAt(0)}
        </Text>
      </View>
      <View style={styles.categoryInfo}>
        <Text style={styles.categoryName}>{CATEGORY_LABELS[category]}</Text>
        <Text style={styles.categoryCount}>{count} {count === 1 ? 'idea' : 'ideas'}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Tags & Categories</Text>
          <Text style={styles.headerSubtitle}>
            {ideas.length} total {ideas.length === 1 ? 'idea' : 'ideas'}
          </Text>
        </View>

        {/* Categories */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Categories</Text>
          <View style={styles.categoriesGrid}>
            {categoryStats.map(renderCategoryCard)}
          </View>
        </View>

        {/* Tags */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Popular Tags ({tagStats.length})
          </Text>
          {tagStats.length > 0 ? (
            <View style={styles.tagsContainer}>
              {tagStats.slice(0, 30).map(renderTagChip)}
            </View>
          ) : (
            <View style={styles.emptyTags}>
              <Text style={styles.emptyTagsText}>No tags yet</Text>
            </View>
          )}
        </View>

        {/* Stats */}
        <View style={styles.statsSection}>
          <Text style={styles.sectionTitle}>Statistics</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{ideas.length}</Text>
              <Text style={styles.statLabel}>Total Ideas</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{tagStats.length}</Text>
              <Text style={styles.statLabel}>Tags</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{categoryStats.length}</Text>
              <Text style={styles.statLabel}>Categories</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{ideas.filter(i => i.isImplemented).length}</Text>
              <Text style={styles.statLabel}>Implemented</Text>
            </View>
          </View>
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
  section: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  categoriesGrid: {
    paddingHorizontal: spacing.lg,
    gap: spacing.md,
  },
  categoryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderLeftWidth: 4,
    ...shadows.sm,
  },
  categoryIcon: {
    width: 40,
    height: 40,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  categoryIconText: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: colors.textPrimary,
  },
  categoryInfo: {
    flex: 1,
  },
  categoryName: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold,
    color: colors.textPrimary,
  },
  categoryCount: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: spacing.lg,
    gap: spacing.sm,
  },
  tagChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: radius.full,
    paddingLeft: spacing.md,
    paddingRight: spacing.sm,
    paddingVertical: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  tagChipText: {
    fontSize: fontSize.sm,
    color: colors.primary,
    fontWeight: fontWeight.medium,
  },
  tagChipBadge: {
    backgroundColor: colors.primary + '20',
    borderRadius: radius.full,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    marginLeft: spacing.sm,
  },
  tagChipBadgeText: {
    fontSize: fontSize.xs,
    color: colors.primary,
    fontWeight: fontWeight.semibold,
  },
  emptyTags: {
    paddingHorizontal: spacing.lg,
    padding: spacing.lg,
  },
  emptyTagsText: {
    fontSize: fontSize.md,
    color: colors.textTertiary,
    textAlign: 'center',
  },
  statsSection: {
    marginBottom: spacing.xxxl,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: spacing.lg,
    gap: spacing.md,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: colors.white,
    borderRadius: radius.md,
    padding: spacing.lg,
    alignItems: 'center',
    ...shadows.sm,
  },
  statValue: {
    fontSize: fontSize.xxxl,
    fontWeight: fontWeight.bold,
    color: colors.primary,
  },
  statLabel: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
});
