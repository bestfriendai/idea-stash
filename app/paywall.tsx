import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, Stack } from 'expo-router';
import { useSubscription, Package } from '../../src/services/purchases';
import { colors, spacing, radius, fontSize, fontWeight, shadows } from '../../src/ui/theme';

const FEATURES = [
  { icon: '☁️', text: 'Cloud sync across devices' },
  { icon: '∞', text: 'Unlimited ideas' },
  { icon: '🔒', text: 'Advanced security' },
  { icon: '📊', text: 'Analytics dashboard' },
  { icon: '🎨', text: 'Custom themes' },
  { icon: '🚀', text: 'Priority support' },
];

// Demo packages
const DEMO_PACKAGES: Package[] = [
  {
    identifier: 'monthly',
    packageType: 'MONTHLY',
    storeProduct: {
      productId: 'com.ideastash.premium.monthly',
      localizedPriceString: '$4.99/mo',
      productTitle: 'Premium Monthly',
      productDescription: 'Unlock all features',
    },
  },
  {
    identifier: 'annual',
    packageType: 'ANNUAL',
    storeProduct: {
      productId: 'com.ideastash.premium.annual',
      localizedPriceString: '$39.99/yr',
      productTitle: 'Premium Annual',
      productDescription: 'Save 33%',
    },
  },
];

export default function PaywallScreen() {
  const router = useRouter();
  const { purchase, restore, isPro } = useSubscription();
  const [selectedPackage, setSelectedPackage] = useState<Package>(DEMO_PACKAGES[1]);
  const [isPurchasing, setIsPurchasing] = useState(false);

  const handlePurchase = async () => {
    if (isPro) {
      Alert.alert('Already Premium', 'You already have Premium access!');
      return;
    }

    setIsPurchasing(true);
    try {
      const success = await purchase(selectedPackage);
      if (success) {
        Alert.alert('Success!', 'Welcome to Premium!');
        router.back();
      }
    } catch (error) {
      Alert.alert('Error', 'Purchase failed. Please try again.');
    } finally {
      setIsPurchasing(false);
    }
  };

  const handleRestore = async () => {
    try {
      const success = await restore();
      if (success) {
        Alert.alert('Restored!', 'Your purchase has been restored.');
        router.back();
      } else {
        Alert.alert('No Purchases', 'No previous purchases found.');
      }
    } catch (error) {
      Alert.alert('Error', 'Restore failed. Please try again.');
    }
  };

  const handleClose = () => {
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen 
        options={{ 
          headerShown: true,
          headerTitle: 'Upgrade to Premium',
          headerLeft: () => (
            <TouchableOpacity onPress={handleClose}>
              <Text style={styles.closeText}>Close</Text>
            </TouchableOpacity>
          ),
        }} 
      />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.premiumIcon}>⭐</Text>
          <Text style={styles.title}>IdeaStash Premium</Text>
          <Text style={styles.subtitle}>Unlock your creative potential!</Text>
        </View>

        {/* Features */}
        <View style={styles.featuresContainer}>
          {FEATURES.map((feature, index) => (
            <View key={index} style={styles.featureRow}>
              <Text style={styles.featureIcon}>{feature.icon}</Text>
              <Text style={styles.featureText}>{feature.text}</Text>
            </View>
          ))}
        </View>

        {/* Packages */}
        <View style={styles.packagesContainer}>
          <Text style={styles.sectionTitle}>Choose Your Plan</Text>
          
          {DEMO_PACKAGES.map((pkg) => (
            <TouchableOpacity
              key={pkg.identifier}
              style={[
                styles.packageCard,
                selectedPackage.identifier === pkg.identifier && styles.packageCardSelected,
              ]}
              onPress={() => setSelectedPackage(pkg)}
            >
              {pkg.identifier === 'annual' && (
                <View style={styles.bestValueBadge}>
                  <Text style={styles.bestValueText}>BEST VALUE</Text>
                </View>
              )}
              <View style={styles.packageHeader}>
                <Text style={[
                  styles.packageTitle,
                  selectedPackage.identifier === pkg.identifier && styles.packageTitleSelected,
                ]}>
                  {pkg.storeProduct.productTitle}
                </Text>
                <Text style={[
                  styles.packagePrice,
                  selectedPackage.identifier === pkg.identifier && styles.packagePriceSelected,
                ]}>
                  {pkg.storeProduct.localizedPriceString}
                </Text>
              </View>
              <Text style={styles.packageDescription}>
                {pkg.storeProduct.productDescription}
              </Text>
              {selectedPackage.identifier === pkg.identifier && (
                <View style={styles.checkmark}>
                  <Text style={styles.checkmarkText}>✓</Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* Purchase Button */}
        <TouchableOpacity 
          style={[styles.purchaseButton, isPurchasing && styles.purchaseButtonDisabled]}
          onPress={handlePurchase}
          disabled={isPurchasing}
        >
          <Text style={styles.purchaseButtonText}>
            {isPurchasing ? 'Processing...' : 'Subscribe Now'}
          </Text>
        </TouchableOpacity>

        {/* Restore */}
        <TouchableOpacity style={styles.restoreButton} onPress={handleRestore}>
          <Text style={styles.restoreButtonText}>Restore Purchases</Text>
        </TouchableOpacity>

        {/* Terms */}
        <Text style={styles.termsText}>
          Subscription automatically renews. Cancel anytime in Settings.
          By subscribing, you agree to our Terms of Service and Privacy Policy.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  closeText: {
    fontSize: fontSize.lg,
    color: colors.primary,
  },
  header: {
    alignItems: 'center',
    paddingVertical: spacing.xxl,
    paddingHorizontal: spacing.lg,
  },
  premiumIcon: {
    fontSize: 56,
    marginBottom: spacing.md,
  },
  title: {
    fontSize: fontSize.xxxl,
    fontWeight: fontWeight.bold,
    color: colors.primary,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: fontSize.lg,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  featuresContainer: {
    backgroundColor: colors.white,
    marginHorizontal: spacing.lg,
    borderRadius: radius.lg,
    padding: spacing.lg,
    ...shadows.sm,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  featureIcon: {
    fontSize: 20,
    marginRight: spacing.md,
  },
  featureText: {
    fontSize: fontSize.md,
    color: colors.textPrimary,
  },
  packagesContainer: {
    marginTop: spacing.xxl,
    paddingHorizontal: spacing.lg,
  },
  sectionTitle: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  packageCard: {
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    borderWidth: 2,
    borderColor: colors.border,
    ...shadows.sm,
  },
  packageCardSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primary + '08',
  },
  bestValueBadge: {
    position: 'absolute',
    top: -10,
    right: spacing.md,
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.sm,
  },
  bestValueText: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.bold,
    color: colors.white,
  },
  packageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  packageTitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold,
    color: colors.textPrimary,
  },
  packageTitleSelected: {
    color: colors.primary,
  },
  packagePrice: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
    color: colors.textPrimary,
  },
  packagePriceSelected: {
    color: colors.primary,
  },
  packageDescription: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
  checkmark: {
    position: 'absolute',
    top: spacing.md,
    right: spacing.md,
    width: 24,
    height: 24,
    borderRadius: radius.full,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmarkText: {
    color: colors.white,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.bold,
  },
  purchaseButton: {
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    paddingVertical: spacing.lg,
    alignItems: 'center',
    marginHorizontal: spacing.lg,
    marginTop: spacing.xl,
    ...shadows.md,
  },
  purchaseButtonDisabled: {
    opacity: 0.6,
  },
  purchaseButtonText: {
    color: colors.white,
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
  },
  restoreButton: {
    alignItems: 'center',
    padding: spacing.lg,
    marginTop: spacing.sm,
  },
  restoreButtonText: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
    textDecorationLine: 'underline',
  },
  termsText: {
    fontSize: fontSize.xs,
    color: colors.textTertiary,
    textAlign: 'center',
    paddingHorizontal: spacing.xxl,
    paddingBottom: spacing.xxxl,
    lineHeight: 18,
  },
});
