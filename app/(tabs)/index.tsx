import { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  TextInput,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useIdeaStore, Idea, IdeaCategory, CATEGORY_LABELS, CATEGORY_COLORS } from '../../src/store/ideaStore';
import { colors, spacing, radius, fontSize, fontWeight, shadows } from '../../src/ui/theme';

export default function IdeasScreen() {
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  
  const { 
    ideas, 
    categories, 
    selectedCategory, 
    setSelectedCategory,
    loadIdeas, 
    toggleFavorite,
    toggleImplemented,
    searchQuery,
    setSearchQuery,
  } = useIdeaStore();

  useEffect(() => {
    loadIdeas();
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadIdeas();
    setRefreshing(false);
  }, [loadIdeas]);

  const filteredIdeas = ideas.filter(idea => {
    const matchesSearch = idea.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      idea.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      idea.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = !selectedCategory || idea.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleIdeaPress = (idea: Idea) => {
    router.push(`/idea/${idea.id}`);
  };

  const handleAddIdea = () => {
    router.push('/add-idea');
  };

  const renderCategoryChip = (category: IdeaCategory) => {
    const isSelected = selectedCategory === category;
    return (
      <TouchableOpacity
        key={category}
        style={[
          styles.categoryChip,
          isSelected && { backgroundColor: CATEGORY_COLORS[category], borderColor: CATEGORY_COLORS[category] },
        ]}
        onPress={() => setSelectedCategory(isSelected ? null : category)}
      >
        <Text style={[styles.categoryChipText, isSelected && styles.categoryChipTextSelected]}>
          {CATEGORY_LABELS[category]}
        </Text>
      </TouchableOpacity>
    );
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
            <Text style={styles.actionIcon}>{item.isFavorite ? '❤️' : '🤍'}</Text>
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
          {item.tags.length > 3 && (
            <Text style={styles.moreTagsText}>+{item.tags.length - 3}</Text>
          )}
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
        <Text style={styles.headerTitle}>IdeaStash</Text>
        <TouchableOpacity style={styles.addButton} onPress={handleAddIdea}>
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search ideas..."
          placeholderTextColor={colors.textTertiary}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <View style={styles.categoriesContainer}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesScroll}
        >
          {categories.map(renderCategoryChip)}
        </ScrollView>
      </View>

      <FlatList
        data={filteredIdeas}
        renderItem={renderIdeaCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>💡</Text>
            <Text style={styles.emptyTitle}>No ideas yet</Text>
            <Text style={styles.emptySubtitle}>
              Tap + to capture your first idea!
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  headerTitle: {
    fontSize: fontSize.title,
    fontWeight: fontWeight.bold,
    color: colors.primary,
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: radius.full,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.md,
  },
  addButtonText: {
    fontSize: 24,
    color: colors.white,
    fontWeight: fontWeight.bold,
    marginTop: -2,
  },
  searchContainer: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  searchInput: {
    backgroundColor: colors.white,
    borderRadius: radius.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    fontSize: fontSize.md,
    color: colors.textPrimary,
    borderWidth: 1,
    borderColor: colors.border,
  },
  categoriesContainer: {
    marginBottom: spacing.md,
  },
  categoriesScroll: {
    paddingHorizontal: spacing.lg,
    gap: spacing.sm,
  },
  categoryChip: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: radius.full,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    marginRight: spacing.sm,
  },
  categoryChipSelected: {
    borderColor: 'transparent',
  },
  categoryChipText: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    fontWeight: fontWeight.medium,
  },
  categoryChipTextSelected: {
    color: colors.white,
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
  moreTagsText: {
    fontSize: fontSize.xs,
    color: colors.textTertiary,
    alignSelf: 'center',
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
  },
});
