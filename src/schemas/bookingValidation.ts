import { z } from 'zod';

// Base schema without refinements for picking
const baseBookingSchema = z.object({
  // Step 1: Service Type Selection
  serviceType: z.enum(['new-resident', 'individual', 'amc', 'emergency']),
  newResidentPackage: z.enum(['move-in-ready', 'first-month-free', 'new-building-special']).optional(),
  individualService: z.enum(['plumbing', 'ac', 'painting', 'electrical', 'general']).optional(),
  amcPackage: z.enum(['basic', 'premium', 'family']).optional(),
  isEmergency: z.boolean().optional(),

  // Step 2: Service Details
  moveInDate: z.string().optional(),
  apartmentType: z.enum(['studio', '1br', '2br', '3br', '4br+']).optional(),
  buildingType: z.enum(['apartment', 'villa', 'townhouse']).optional(),
  familySize: z.number().min(1).max(20).optional(),
  problemDescription: z.string().min(10, 'Please provide more details about the problem').optional(),
  specialRequests: z.string().max(500, 'Special requests cannot exceed 500 characters').optional(),
  contractStartDate: z.string().optional(),
  urgencyLevel: z.enum(['emergency', 'urgent', 'normal', 'scheduled']).optional(),

  // Step 3: Scheduling
  preferredDate: z.string().min(1, 'Please select a preferred date'),
  preferredTime: z.string().min(1, 'Please select a preferred time'),
  alternativeDate: z.string().optional(),
  alternativeTime: z.string().optional(),
  isRecurring: z.boolean().optional(),
  recurringFrequency: z.enum(['weekly', 'monthly', 'quarterly']).optional(),

  // Step 4: Customer Information
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  phone: z.string().regex(/^(\+971|00971|971)?[0-9]{8,9}$/, 'Please enter a valid UAE phone number'),
  whatsappNumber: z.string().regex(/^(\+971|00971|971)?[0-9]{8,9}$/, 'Please enter a valid UAE WhatsApp number').optional(),
  email: z.string().email('Please enter a valid email address'),
  buildingName: z.string().min(2, 'Building name is required'),
  apartmentNumber: z.string().min(1, 'Apartment number is required'),
  area: z.string().min(2, 'Area is required'),
  emirate: z.enum(['dubai', 'sharjah', 'ajman', 'abu-dhabi', 'ras-al-khaimah', 'fujairah', 'umm-al-quwain']),
  landmark: z.string().optional(),
  marketingSource: z.enum(['google', 'facebook', 'instagram', 'whatsapp', 'referral', 'website', 'flyer', 'other']),
  referralSource: z.string().optional(),

  // Step 5: Payment Terms
  paymentMethod: z.enum(['cash', 'card', 'bank-transfer', 'installment']),
  wantsInstallment: z.boolean().optional(),
  agreedToTerms: z.boolean().refine(val => val === true, 'You must agree to the terms and conditions'),
  agreedToPrivacy: z.boolean().refine(val => val === true, 'You must agree to the privacy policy'),
});

// Full schema with conditional validation
export const bookingFormSchema = baseBookingSchema.refine((data) => {
  // Conditional validation based on service type
  if (data.serviceType === 'new-resident' && !data.newResidentPackage) {
    return false;
  }
  if (data.serviceType === 'individual' && !data.individualService) {
    return false;
  }
  if (data.serviceType === 'amc' && !data.amcPackage) {
    return false;
  }
  if (data.serviceType === 'new-resident' && !data.moveInDate) {
    return false;
  }
  if (data.serviceType === 'amc' && !data.contractStartDate) {
    return false;
  }
  if (data.serviceType === 'individual' && !data.problemDescription) {
    return false;
  }
  if (data.marketingSource === 'referral' && !data.referralSource) {
    return false;
  }
  return true;
}, {
  message: "Please complete all required fields for the selected service type",
});

export type BookingFormData = z.infer<typeof bookingFormSchema>;

// Step-specific schemas for validation
export const step1Schema = baseBookingSchema.pick({
  serviceType: true,
  newResidentPackage: true,
  individualService: true,
  amcPackage: true,
  isEmergency: true,
});

export const step2Schema = baseBookingSchema.pick({
  moveInDate: true,
  apartmentType: true,
  buildingType: true,
  familySize: true,
  problemDescription: true,
  specialRequests: true,
  contractStartDate: true,
  urgencyLevel: true,
});

export const step3Schema = baseBookingSchema.pick({
  preferredDate: true,
  preferredTime: true,
  alternativeDate: true,
  alternativeTime: true,
  isRecurring: true,
  recurringFrequency: true,
});

export const step4Schema = baseBookingSchema.pick({
  firstName: true,
  lastName: true,
  phone: true,
  whatsappNumber: true,
  email: true,
  buildingName: true,
  apartmentNumber: true,
  area: true,
  emirate: true,
  landmark: true,
  marketingSource: true,
  referralSource: true,
});

export const step5Schema = baseBookingSchema.pick({
  paymentMethod: true,
  wantsInstallment: true,
  agreedToTerms: true,
  agreedToPrivacy: true,
});
