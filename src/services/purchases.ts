import { useEffect, useState } from 'react';
import { Alert } from 'react-native';

// RevenueCat SDK stub - Replace with actual implementation
// See: https://docs.revenuecat.com/docs

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

class Purchases {
  private static instance: Purchases;
  
  static getSharedInstance(): Purchases {
    if (!Purchases.instance) {
      Purchases.instance = new Purchases();
    }
    return Purchases.instance;
  }

  async getOfferings(): Promise<Offering | null> {
    return null;
  }

  async getCustomerInfo(): Promise<CustomerInfo | null> {
    return null;
  }

  async purchasePackage(pkg: Package): Promise<boolean> {
    Alert.alert(
      'Premium Feature',
      'This is a demo. In production, RevenueCat SDK would handle the purchase flow.',
      [{ text: 'OK' }]
    );
    return false;
  }

  async restorePurchases(): Promise<CustomerInfo | null> {
    return null;
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
