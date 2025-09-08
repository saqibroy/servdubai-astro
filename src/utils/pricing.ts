import type { ServiceType, NewResidentPackage, AMCPackage, IndividualService } from '../types/booking';
import siteConfig from '../config/site';

// Re-export data from centralized config
export const servicePricing = {
  newResident: Object.fromEntries(
    Object.entries(siteConfig.pricing.newResidentPackages).map(([key, value]) => [key, value.price])
  ),
  amc: Object.fromEntries(
    Object.entries(siteConfig.pricing.amcPackages).map(([key, value]) => [
      key, 
      { annual: value.annual, quarterly: value.quarterly }
    ])
  ),
  individual: Object.fromEntries(
    Object.entries(siteConfig.pricing.individualServices).map(([key, value]) => [key, value.price])
  ),
  emergency: {
    surcharge: siteConfig.pricing.surcharges.emergency,
  },
} as const;

export function calculateServicePrice(
  serviceType: ServiceType,
  packageType?: NewResidentPackage | AMCPackage | IndividualService,
  isEmergency = false,
  isAnnual = true
): number {
  let basePrice = 0;

  switch (serviceType) {
    case 'new-resident':
      if (packageType && packageType in siteConfig.pricing.newResidentPackages) {
        basePrice = (siteConfig.pricing.newResidentPackages as any)[packageType].price;
      }
      break;
    case 'amc':
      if (packageType && packageType in siteConfig.pricing.amcPackages) {
        const amcPackage = (siteConfig.pricing.amcPackages as any)[packageType];
        basePrice = isAnnual ? amcPackage.annual : amcPackage.quarterly;
      }
      break;
    case 'individual':
    case 'emergency':
      if (packageType && packageType in siteConfig.pricing.individualServices) {
        basePrice = (siteConfig.pricing.individualServices as any)[packageType].price;
      }
      break;
  }

  // Add emergency surcharge if applicable
  if (isEmergency || serviceType === 'emergency') {
    basePrice += siteConfig.pricing.surcharges.emergency;
  }

  return basePrice;
}

export function formatPrice(price: number): string {
  return `AED ${price.toLocaleString()}`;
}

export function getInstallmentOptions(totalPrice: number): Array<{ description: string; amount: number; remaining: number }> {
  if (totalPrice < siteConfig.pricing.installmentThreshold) {
    return []; // No installment for amounts less than threshold
  }

  const advance = Math.round(totalPrice * siteConfig.pricing.advancePayment);
  const remaining = totalPrice - advance;

  return [
    {
      description: `${Math.round(siteConfig.pricing.advancePayment * 100)}% Advance Payment`,
      amount: advance,
      remaining: remaining,
    },
  ];
}

export function getServiceDescription(
  serviceType: ServiceType,
  packageType?: NewResidentPackage | AMCPackage | IndividualService
): string {
  switch (serviceType) {
    case 'new-resident':
      if (packageType && packageType in siteConfig.pricing.newResidentPackages) {
        return (siteConfig.pricing.newResidentPackages as any)[packageType].description;
      }
      return 'New resident package';
    case 'amc':
      if (packageType && packageType in siteConfig.pricing.amcPackages) {
        return (siteConfig.pricing.amcPackages as any)[packageType].description;
      }
      return 'Annual Maintenance Contract';
    case 'individual':
      if (packageType && packageType in siteConfig.pricing.individualServices) {
        return (siteConfig.pricing.individualServices as any)[packageType].description;
      }
      return 'Individual service';
    case 'emergency':
      return 'Emergency same-day service';
    default:
      return 'Service';
  }
}

// Re-export from config
export const timeSlots = siteConfig.operations.timeSlots;
export const emirates = siteConfig.serviceAreas.emirates;
export const marketingSources = siteConfig.operations.marketingSources;
