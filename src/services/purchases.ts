import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Offering {
  identifier: string;
  serverDescription: string;
  availablePackages: Package[];
}

export interface Package {
  identifier: string;
  packageType: 'MONTHLY' | 'ANNUAL' | 'LIFETIME';
  storeProduct: StoreProduct;
}

export interface StoreProduct {
  productId: string;
  localizedPriceString: string;
  productTitle: string;
  productDescription: string;
}

export interface CustomerInfo {
  entitlements: {
    active: {
      [key: string]: EntitlementInfo;
    };
  };
}

export interface EntitlementInfo {
  identifier: string;
  isActive: boolean;
  willRenew: boolean;
}

const PRO_STATUS_KEY = '@ideastash_pro_status';

const DEFAULT_PACKAGES: Package[] = [
  {
    identifier: 'monthly',
    packageType: 'MONTHLY',
    storeProduct: {
      productId: 'com.ideastash.premium.monthly',
      localizedPriceString: '$4.99/mo',
      productTitle: 'Premium Monthly',
      productDescription: 'Unlock all premium features',
    },
  },
  {
    identifier: 'annual',
    packageType: 'ANNUAL',
    storeProduct: {
      productId: 'com.ideastash.premium.annual',
      localizedPriceString: '$39.99/yr',
      productTitle: 'Premium Annual',
      productDescription: 'Save 33% compared to monthly',
    },
  },
];

class Purchases {
  private static instance: Purchases;

  static getSharedInstance(): Purchases {
    if (!Purchases.instance) {
      Purchases.instance = new Purchases();
    }
    return Purchases.instance;
  }

  async getOfferings(): Promise<Offering | null> {
    return {
      identifier: 'default',
      serverDescription: 'Default premium plans',
      availablePackages: DEFAULT_PACKAGES,
    };
  }

  async getCustomerInfo(): Promise<CustomerInfo | null> {
    const isActive = (await AsyncStorage.getItem(PRO_STATUS_KEY)) === 'true';

    return {
      entitlements: {
        active: isActive
          ? {
              premium: {
                identifier: 'premium',
                isActive: true,
                willRenew: true,
              },
            }
          : {},
      },
    };
  }

  async purchasePackage(_pkg: Package): Promise<boolean> {
    await AsyncStorage.setItem(PRO_STATUS_KEY, 'true');
    return true;
  }

  async restorePurchases(): Promise<CustomerInfo | null> {
    return this.getCustomerInfo();
  }

  async isPro(): Promise<boolean> {
    const info = await this.getCustomerInfo();
    return info?.entitlements?.active?.premium?.isActive ?? false;
  }
}

export const purchases = Purchases.getSharedInstance();

export function useSubscription() {
  const [isPro, setIsPro] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkSubscription();
  }, []);

  const checkSubscription = async () => {
    try {
      const pro = await purchases.isPro();
      setIsPro(pro);
    } catch (error) {
      console.error('Error checking subscription:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const purchase = async (pkg: Package): Promise<boolean> => {
    const success = await purchases.purchasePackage(pkg);
    if (success) {
      setIsPro(true);
    }
    return success;
  };

  const restore = async (): Promise<boolean> => {
    const info = await purchases.restorePurchases();
    const restored = info?.entitlements?.active?.premium?.isActive ?? false;
    setIsPro(restored);
    return restored;
  };

  return {
    isPro,
    isLoading,
    purchase,
    restore,
    refresh: checkSubscription,
  };
}
