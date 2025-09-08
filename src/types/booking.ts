export type ServiceType = 'new-resident' | 'individual' | 'amc' | 'emergency';

export type NewResidentPackage = 'move-in-ready' | 'first-month-free' | 'new-building-special';

export type IndividualService = 'plumbing' | 'ac' | 'painting' | 'electrical' | 'general';

export type AMCPackage = 'basic' | 'premium' | 'family';

export type UrgencyLevel = 'emergency' | 'urgent' | 'normal' | 'scheduled';

export type PaymentMethod = 'cash' | 'card' | 'bank-transfer' | 'installment';

export type MarketingSource = 
  | 'google'
  | 'facebook'
  | 'instagram'
  | 'whatsapp'
  | 'referral'
  | 'website'
  | 'flyer'
  | 'other';

export interface BookingFormData {
  // Step 1: Service Type Selection
  serviceType: ServiceType;
  newResidentPackage?: NewResidentPackage;
  individualService?: IndividualService;
  amcPackage?: AMCPackage;
  isEmergency?: boolean;

  // Step 2: Service Details
  moveInDate?: string;
  apartmentType?: 'studio' | '1br' | '2br' | '3br' | '4br+';
  buildingType?: 'apartment' | 'villa' | 'townhouse';
  familySize?: number;
  problemDescription?: string;
  specialRequests?: string;
  contractStartDate?: string;
  urgencyLevel?: UrgencyLevel;
  photoUpload?: File[];

  // Step 3: Scheduling
  preferredDate: string;
  preferredTime: string;
  alternativeDate?: string;
  alternativeTime?: string;
  isRecurring?: boolean;
  recurringFrequency?: 'weekly' | 'monthly' | 'quarterly';

  // Step 4: Customer Information
  firstName: string;
  lastName: string;
  phone: string;
  whatsappNumber?: string;
  email: string;
  buildingName: string;
  apartmentNumber: string;
  area: string;
  emirate: 'dubai' | 'sharjah' | 'ajman' | 'abu-dhabi' | 'ras-al-khaimah' | 'fujairah' | 'umm-al-quwain';
  landmark?: string;
  marketingSource: MarketingSource;
  referralSource?: string;

  // Step 5: Payment Terms
  paymentMethod: PaymentMethod;
  wantsInstallment?: boolean;
  agreedToTerms: boolean;
  agreedToPrivacy: boolean;
}

export interface ServicePricing {
  newResident: {
    'move-in-ready': 800;
    'first-month-free': 650;
    'new-building-special': 750;
  };
  amc: {
    basic: { annual: 1200; quarterly: 300 };
    premium: { annual: 2500; quarterly: 625 };
    family: { annual: 1800; quarterly: 450 };
  };
  individual: {
    plumbing: 150;
    ac: 200;
    painting: 180;
    electrical: 120;
    general: 100;
  };
  emergency: {
    surcharge: 100; // Additional charge for same-day service
  };
}

export interface BookingConfirmation {
  bookingId: string;
  serviceType: ServiceType;
  scheduledDate: string;
  estimatedPrice: number;
  technician?: {
    name: string;
    phone: string;
    photo?: string;
  };
  whatsappGroupLink?: string;
}
