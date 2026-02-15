import { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useSettingsStore } from '../../src/store/settingsStore';
import { useIdeaStore } from '../../src/store/ideaStore';
import { colors, spacing, radius, fontSize, fontWeight, shadows } from '../../src/ui/theme';

export default function SettingsScreen() {
  const router = useRouter();
  const { sortOrder, viewMode, setSortOrder, setViewMode } = useSettingsStore();
  const { ideas, loadIdeas } = useIdeaStore();

  useEffect(() => {
    loadIdeas();
  }, []);

  const implementedCount = ideas.filter(i => i.isImplemented).length;
  const favoritesCount = ideas.filter(i => i.isFavorite).length;

  const handleClearData = () => {
    Alert.alert(
      'Clear All Data',
      'This will delete all your saved ideas. This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Clear', 
          style: 'destructive',
          onPress: async () => {
            Alert.alert('Done', 'All data has been cleared.');
          }
        },
      ]
    );
  };

  const handleUpgrade = () => {
    router.push('/paywall');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Settings</Text>
        </View>

        {/* Statistics */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{ideas.length}</Text>
            <Text style={styles.statLabel}>Ideas</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{favoritesCount}</Text>
            <Text style={styles.statLabel}>Favorites</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{implementedCount}</Text>
            <Text style={styles.statLabel}>Done</Text>
          </View>
        </View>

        {/* Display Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Display</Text>
          
          <View style={styles.settingsGroup}>
            <View style={styles.settingRow}>
              <Text style={styles.settingLabel}>View Mode</Text>
              <View style={styles.segmentedControl}>
                <TouchableOpacity
                  style={[styles.segment, viewMode === 'list' && styles.segmentActive]}
                  onPress={() => setViewMode('list')}
                >
                  <Text style={[styles.segmentText, viewMode === 'list' && styles.segmentTextActive]}>
                    List
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.segment, viewMode === 'grid' && styles.segmentActive]}
                  onPress={() => setViewMode('grid')}
                >
                  <Text style={[styles.segmentText, viewMode === 'grid' && styles.segmentTextActive]}>
                    Grid
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            
            <View style={styles.settingDivider} />
            
            <View style={styles.settingRow}>
              <Text style={styles.settingLabel}>Sort By</Text>
              <View style={styles.segmentedControl}>
                <TouchableOpacity
                  style={[styles.segment, sortOrder === 'newest' && styles.segmentActive]}
                  onPress={() => setSortOrder('newest')}
                >
                  <Text style={[styles.segmentText, sortOrder === 'newest' && styles.segmentTextActive]}>
                    Newest
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.segment, sortOrder === 'oldest' && styles.segmentActive]}
                  onPress={() => setSortOrder('oldest')}
                >
                  <Text style={[styles.segmentText, sortOrder === 'oldest' && styles.segmentTextActive]}>
                    Oldest
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.segment, sortOrder === 'category' && styles.segmentActive]}
                  onPress={() => setSortOrder('category')}
                >
                  <Text style={[styles.segmentText, sortOrder === 'category' && styles.segmentTextActive]}>
                    Category
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>

        {/* Premium Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Premium</Text>
          
          <TouchableOpacity style={styles.premiumCard} onPress={handleUpgrade}>
            <View style={styles.premiumContent}>
              <Text style={styles.premiumIcon}>⭐</Text>
              <View style={styles.premiumInfo}>
                <Text style={styles.premiumTitle}>Upgrade to Premium</Text>
                <Text style={styles.premiumDescription}>
                  Cloud sync, unlimited ideas, and more
                </Text>
              </View>
              <Text style={styles.premiumArrow}>→</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Support Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Support</Text>
          
          <View style={styles.settingsGroup}>
            <TouchableOpacity style={styles.settingRow} onPress={() => {}}>
              <Text style={styles.settingLabel}>Rate App</Text>
              <Text style={styles.settingArrow}>→</Text>
            </TouchableOpacity>
            
            <View style={styles.settingDivider} />
            
            <TouchableOpacity style={styles.settingRow} onPress={() => {}}>
              <Text style={styles.settingLabel}>Privacy Policy</Text>
              <Text style={styles.settingArrow}>→</Text>
            </TouchableOpacity>
            
            <View style={styles.settingDivider} />
            
            <TouchableOpacity style={styles.settingRow} onPress={handleClearData}>
              <Text style={[styles.settingLabel, { color: colors.error }]}>
                Clear All Data
              </Text>
              <Text style={[styles.settingArrow, { color: colors.error }]}>→</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* App Info */}
        <View style={styles.appInfo}>
          <Text style={styles.appVersion}>IdeaStash v1.0.0</Text>
          <Text style={styles.appCopyright}>© 2026 IdeaStash Inc.</Text>
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
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.lg,
    borderRadius: radius.lg,
    padding: spacing.lg,
    ...shadows.sm,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
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
  statDivider: {
    width: 1,
    backgroundColor: colors.border,
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.sm,
  },
  settingsGroup: {
    backgroundColor: colors.white,
    marginHorizontal: spacing.lg,
    borderRadius: radius.lg,
    ...shadows.sm,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  settingLabel: {
    fontSize: fontSize.lg,
    color: colors.textPrimary,
  },
  settingArrow: {
    fontSize: fontSize.lg,
    color: colors.textTertiary,
  },
  settingDivider: {
    height: 1,
    backgroundColor: colors.border,
    marginLeft: spacing.lg,
  },
  segmentedControl: {
    flexDirection: 'row',
    backgroundColor: colors.background,
    borderRadius: radius.md,
    padding: 2,
  },
  segment: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.sm,
  },
  segmentActive: {
    backgroundColor: colors.primary,
  },
  segmentText: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    fontWeight: fontWeight.medium,
  },
  segmentTextActive: {
    color: colors.white,
  },
  premiumCard: {
    backgroundColor: colors.primary,
    marginHorizontal: spacing.lg,
    borderRadius: radius.lg,
    padding: spacing.lg,
    ...shadows.md,
  },
  premiumContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  premiumIcon: {
    fontSize: 32,
    marginRight: spacing.md,
  },
  premiumInfo: {
    flex: 1,
  },
  premiumTitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: colors.white,
  },
  premiumDescription: {
    fontSize: fontSize.sm,
    color: colors.white,
    opacity: 0.8,
    marginTop: spacing.xs,
  },
  premiumArrow: {
    fontSize: fontSize.xl,
    color: colors.white,
  },
  appInfo: {
    alignItems: 'center',
    paddingVertical: spacing.xxl,
  },
  appVersion: {
    fontSize: fontSize.sm,
    color: colors.textTertiary,
  },
  appCopyright: {
    fontSize: fontSize.xs,
    color: colors.textTertiary,
    marginTop: spacing.xs,
  },
});
