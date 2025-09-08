import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Button, 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  Input,
  Label,
  Textarea,
  Select,
  Checkbox,
  Progress,
  Badge
} from '../ui';
import { 
  bookingFormSchema, 
  step1Schema, 
  step2Schema, 
  step3Schema, 
  step4Schema, 
  step5Schema,
  type BookingFormData 
} from '../../schemas/bookingValidation';
import { 
  calculateServicePrice, 
  formatPrice, 
  getInstallmentOptions, 
  getServiceDescription,
  timeSlots,
  emirates,
  marketingSources
} from '../../utils/pricing';
import siteConfig from '../../config/site';
import type { ServiceType, NewResidentPackage, AMCPackage, IndividualService } from '../../types/booking';

interface BookingFormProps {
  initialPackage?: string;
}

const steps = [
  { id: 1, title: 'Service Type', description: 'Choose your service' },
  { id: 2, title: 'Service Details', description: 'Provide details' },
  { id: 3, title: 'Scheduling', description: 'Pick date & time' },
  { id: 4, title: 'Your Information', description: 'Contact details' },
  { id: 5, title: 'Payment Terms', description: 'Confirm & pay' },
];

export default function BookingForm({ initialPackage }: BookingFormProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    trigger,
    formState: { errors },
    getValues,
  } = useForm<BookingFormData>({
    resolver: zodResolver(bookingFormSchema),
    mode: 'onChange',
    defaultValues: {
      serviceType: initialPackage === 'amc' ? 'amc' : 'new-resident',
      amcPackage: initialPackage && ['basic', 'premium', 'family'].includes(initialPackage) ? initialPackage as AMCPackage : undefined,
      newResidentPackage: initialPackage === 'new-resident' ? 'move-in-ready' : undefined,
      agreedToTerms: false,
      agreedToPrivacy: false,
    },
  });

  const watchedValues = watch();
  const serviceType = watch('serviceType');
  const phone = watch('phone');

  // Auto-fill WhatsApp number from phone
  useEffect(() => {
    if (phone && !watchedValues.whatsappNumber) {
      setValue('whatsappNumber', phone);
    }
  }, [phone, setValue, watchedValues.whatsappNumber]);

  const getCurrentStepSchema = () => {
    switch (currentStep) {
      case 1: return step1Schema;
      case 2: return step2Schema;
      case 3: return step3Schema;
      case 4: return step4Schema;
      case 5: return step5Schema;
      default: return step1Schema;
    }
  };

  const validateCurrentStep = async () => {
    const schema = getCurrentStepSchema();
    const result = await trigger(Object.keys(schema.shape) as (keyof BookingFormData)[]);
    return result;
  };

  const nextStep = async () => {
    const isValid = await validateCurrentStep();
    if (isValid && currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const onSubmit = async (data: BookingFormData) => {
    setIsSubmitting(true);
    try {
      // Determine which endpoint to use based on service type
      let endpoint = '';
      if (data.serviceType === 'new-resident') {
        endpoint = '/.netlify/functions/resident-booking';
      } else if (data.serviceType === 'amc') {
        endpoint = '/.netlify/functions/amc-subscription';
      } else {
        endpoint = '/.netlify/functions/general-contact';
      }

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        console.log('Booking submitted successfully:', result);
        // Store booking details for success page
        const bookingId = result.bookingId || 'SRV-' + new Date().getFullYear() + '-' + String(Math.floor(Math.random() * 9999) + 1).padStart(4, '0');
        const price = calculateCurrentPrice();
        const serviceDesc = getServiceDescription(data.serviceType, data.newResidentPackage || data.amcPackage || data.individualService);
        
        // Redirect to success page with details
        window.location.href = `/success?id=${bookingId}&service=${encodeURIComponent(serviceDesc)}&cost=${encodeURIComponent(formatPrice(price))}&priority=${data.urgencyLevel || 'Normal'}`;
      } else {
        throw new Error(result.message || 'Failed to submit booking');
      }
    } catch (error) {
      console.error('Submission error:', error);
      // Show user-friendly error message
      alert('Failed to submit booking. Please try again or contact us directly at +971 50 123 4567.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const calculateCurrentPrice = () => {
    const { serviceType, newResidentPackage, amcPackage, individualService, isEmergency } = watchedValues;
    const packageType = newResidentPackage || amcPackage || individualService;
    return calculateServicePrice(serviceType, packageType, isEmergency);
  };

  const generateWhatsAppLink = () => {
    const bookingDetails = getValues();
    const price = calculateCurrentPrice();
    const message = `Hi ${siteConfig.business.name}! I'd like to book a service:
Service: ${getServiceDescription(bookingDetails.serviceType, bookingDetails.newResidentPackage || bookingDetails.amcPackage || bookingDetails.individualService)}
Name: ${bookingDetails.firstName} ${bookingDetails.lastName}
Date: ${bookingDetails.preferredDate}
Price: ${formatPrice(price)}
Please help me with my booking. Thank you!`;
    
    return `https://wa.me/${siteConfig.business.whatsappNumber}?text=${encodeURIComponent(message)}`;
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Progress Bar */}
      <div className="mb-6 md:mb-8">
        {/* Mobile Step Indicator */}
        <div className="block md:hidden mb-4">
          <div className="flex items-center justify-between mb-3">
            <div className="text-sm font-medium text-gray-600">
              Step {currentStep} of {steps.length}
            </div>
            <div className="text-sm text-gray-500">
              {Math.round((currentStep / steps.length) * 100)}% Complete
            </div>
          </div>
          <Progress value={(currentStep / steps.length) * 100} className="h-3 mb-3" />
          <div className="text-center">
            <h3 className="font-semibold text-lg text-gray-900">
              {steps[currentStep - 1].title}
            </h3>
            <p className="text-sm text-gray-600">
              {steps[currentStep - 1].description}
            </p>
          </div>
        </div>

        {/* Desktop Step Indicator */}
        <div className="hidden md:block">
          <div className="flex items-center justify-between mb-4">
            {steps.map((step, index) => (
              <div key={step.id} className={`flex items-center ${index < steps.length - 1 ? 'flex-1' : ''}`}>
                <Badge 
                  variant={currentStep >= step.id ? 'default' : 'outline'}
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                    currentStep >= step.id 
                      ? 'bg-teal-500 text-white border-teal-500' 
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {step.id}
                </Badge>
                <div className={`ml-4 ${index < steps.length - 1 ? 'flex-1' : ''}`}>
                  <div className={`font-medium text-sm ${
                    currentStep >= step.id ? 'text-teal-600' : 'text-gray-600'
                  }`}>
                    {step.title}
                  </div>
                  <div className="text-xs text-gray-500">{step.description}</div>
                </div>
                {index < steps.length - 1 && (
                  <div className={`flex-1 h-1 mx-4 rounded ${
                    currentStep > step.id ? 'bg-teal-500' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <Progress value={(currentStep / steps.length) * 100} className="h-2" />
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <AnimatePresence mode="wait">
          {/* Step 1: Service Type Selection */}
          {currentStep === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Select Your Service Type</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <Controller
                      name="serviceType"
                      control={control}
                      render={({ field }) => (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                          {[
                            { value: 'new-resident', label: 'New Resident Package', desc: 'Move-in ready services for new residents' },
                            { value: 'amc', label: 'Annual Maintenance Contract', desc: 'Year-round maintenance coverage' },
                            { value: 'individual', label: 'Individual Services', desc: 'One-time service requests' },
                            { value: 'emergency', label: 'Emergency Service', desc: 'Same-day urgent repairs' },
                          ].map((option) => (
                            <label
                              key={option.value}
                              className={`p-3 md:p-4 border-2 rounded-lg cursor-pointer transition-all ${
                                field.value === option.value
                                  ? 'border-teal-500 bg-teal-50'
                                  : 'border-gray-200 hover:border-teal-300'
                              }`}
                            >
                              <input
                                type="radio"
                                value={option.value}
                                checked={field.value === option.value}
                                onChange={field.onChange}
                                className="sr-only"
                              />
                              <div className="font-semibold text-gray-900 text-sm md:text-base">{option.label}</div>
                              <div className="text-xs md:text-sm text-gray-600 mt-1">{option.desc}</div>
                            </label>
                          ))}
                        </div>
                      )}
                    />                  {/* Package Selection */}
                  {serviceType === 'new-resident' && (
                    <Controller
                      name="newResidentPackage"
                      control={control}
                      render={({ field }) => (
                        <div className="space-y-3">
                          <Label>Choose Your Package</Label>
                          <div className="grid gap-2 md:gap-3">
                            {Object.entries(siteConfig.pricing.newResidentPackages).map(([key, pkg]) => (
                              <label
                                key={key}
                                className={`p-3 border rounded-lg cursor-pointer flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-0 ${
                                  field.value === key ? 'border-teal-500 bg-teal-50' : 'border-gray-200'
                                }`}
                              >
                                <div>
                                  <input
                                    type="radio"
                                    value={key}
                                    checked={field.value === key}
                                    onChange={field.onChange}
                                    className="sr-only"
                                  />
                                  <span className="font-medium text-sm md:text-base">{pkg.name}</span>
                                </div>
                                <span className="font-bold text-teal-600 text-sm md:text-base">{formatPrice(pkg.price)}</span>
                              </label>
                            ))}
                          </div>
                        </div>
                      )}
                    />
                  )}

                  {serviceType === 'amc' && (
                    <Controller
                      name="amcPackage"
                      control={control}
                      render={({ field }) => (
                        <div className="space-y-3">
                          <Label>Choose Your AMC Package</Label>
                          <div className="grid gap-2 md:gap-3">
                            {Object.entries(siteConfig.pricing.amcPackages).map(([key, pkg]) => (
                              <label
                                key={key}
                                className={`p-3 border rounded-lg cursor-pointer ${
                                  field.value === key ? 'border-teal-500 bg-teal-50' : 'border-gray-200'
                                }`}
                              >
                                <input
                                  type="radio"
                                  value={key}
                                  checked={field.value === key}
                                  onChange={field.onChange}
                                  className="sr-only"
                                />
                                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-0">
                                  <span className="font-medium text-sm md:text-base">{pkg.name}</span>
                                  <div className="text-left sm:text-right">
                                    <div className="font-bold text-teal-600 text-sm md:text-base">{formatPrice(pkg.annual)}/year</div>
                                    <div className="text-xs md:text-sm text-gray-600">{formatPrice(pkg.quarterly)}/quarter</div>
                                  </div>
                                </div>
                              </label>
                            ))}
                          </div>
                        </div>
                      )}
                    />
                  )}

                  {(serviceType === 'individual' || serviceType === 'emergency') && (
                    <Controller
                      name="individualService"
                      control={control}
                      render={({ field }) => (
                        <div className="space-y-3">
                          <Label>Select Service Type</Label>
                          <Select {...field}>
                            <option value="">Choose a service</option>
                            <option value="plumbing">Plumbing Services - {formatPrice(150)}</option>
                            <option value="ac">AC Services - {formatPrice(200)}</option>
                            <option value="painting">Painting Services - {formatPrice(180)}</option>
                            <option value="electrical">Electrical Services - {formatPrice(120)}</option>
                            <option value="general">General Maintenance - {formatPrice(100)}</option>
                          </Select>
                        </div>
                      )}
                    />
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Step 2: Service Details */}
          {currentStep === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Service Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {serviceType === 'new-resident' && (
                    <>
                      <div>
                        <Label htmlFor="moveInDate">Move-in Date</Label>
                        <Controller
                          name="moveInDate"
                          control={control}
                          render={({ field }) => (
                            <Input
                              type="date"
                              {...field}
                              min={new Date().toISOString().split('T')[0]}
                            />
                          )}
                        />
                        {errors.moveInDate && (
                          <p className="text-red-500 text-sm mt-1">{errors.moveInDate.message}</p>
                        )}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <Label>Apartment Type</Label>
                          <Controller
                            name="apartmentType"
                            control={control}
                            render={({ field }) => (
                              <Select {...field}>
                                <option value="">Select type</option>
                                <option value="studio">Studio</option>
                                <option value="1br">1 Bedroom</option>
                                <option value="2br">2 Bedroom</option>
                                <option value="3br">3 Bedroom</option>
                                <option value="4br+">4+ Bedroom</option>
                              </Select>
                            )}
                          />
                        </div>

                        <div>
                          <Label>Building Type</Label>
                          <Controller
                            name="buildingType"
                            control={control}
                            render={({ field }) => (
                              <Select {...field}>
                                <option value="">Select type</option>
                                <option value="apartment">Apartment</option>
                                <option value="villa">Villa</option>
                                <option value="townhouse">Townhouse</option>
                              </Select>
                            )}
                          />
                        </div>
                      </div>
                    </>
                  )}

                  {serviceType === 'amc' && (
                    <>
                      <div>
                        <Label htmlFor="contractStartDate">Contract Start Date</Label>
                        <Controller
                          name="contractStartDate"
                          control={control}
                          render={({ field }) => (
                            <Input
                              type="date"
                              {...field}
                              min={new Date().toISOString().split('T')[0]}
                            />
                          )}
                        />
                        {errors.contractStartDate && (
                          <p className="text-red-500 text-sm mt-1">{errors.contractStartDate.message}</p>
                        )}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <Label>Building Type</Label>
                          <Controller
                            name="buildingType"
                            control={control}
                            render={({ field }) => (
                              <Select {...field}>
                                <option value="">Select type</option>
                                <option value="apartment">Apartment</option>
                                <option value="villa">Villa</option>
                                <option value="townhouse">Townhouse</option>
                              </Select>
                            )}
                          />
                        </div>

                        <div>
                          <Label>Family Size</Label>
                          <Controller
                            name="familySize"
                            control={control}
                            render={({ field }) => (
                              <Input
                                type="number"
                                {...field}
                                onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                                min="1"
                                max="20"
                                placeholder="Number of family members"
                              />
                            )}
                          />
                        </div>
                      </div>
                    </>
                  )}

                  {(serviceType === 'individual' || serviceType === 'emergency') && (
                    <>
                      <div>
                        <Label>Urgency Level</Label>
                        <Controller
                          name="urgencyLevel"
                          control={control}
                          render={({ field }) => (
                            <Select {...field}>
                              <option value="">Select urgency</option>
                              <option value="emergency">Emergency (Same Day) - +{formatPrice(100)}</option>
                              <option value="urgent">Urgent (Within 2 Days)</option>
                              <option value="normal">Normal (Within 1 Week)</option>
                              <option value="scheduled">Scheduled (Flexible)</option>
                            </Select>
                          )}
                        />
                      </div>

                      <div>
                        <Label htmlFor="problemDescription">Problem Description</Label>
                        <Controller
                          name="problemDescription"
                          control={control}
                          render={({ field }) => (
                            <Textarea
                              {...field}
                              rows={4}
                              placeholder="Please describe the issue in detail..."
                            />
                          )}
                        />
                        {errors.problemDescription && (
                          <p className="text-red-500 text-sm mt-1">{errors.problemDescription.message}</p>
                        )}
                      </div>
                    </>
                  )}

                  <div>
                    <Label htmlFor="specialRequests">Special Requests (Optional)</Label>
                    <Controller
                      name="specialRequests"
                      control={control}
                      render={({ field }) => (
                        <Textarea
                          {...field}
                          rows={3}
                          placeholder="Any special requirements or notes..."
                        />
                      )}
                    />
                    {errors.specialRequests && (
                      <p className="text-red-500 text-sm mt-1">{errors.specialRequests.message}</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Step 3: Scheduling */}
          {currentStep === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Schedule Your Service</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="preferredDate">Preferred Date</Label>
                      <Controller
                        name="preferredDate"
                        control={control}
                        render={({ field }) => (
                          <Input
                            type="date"
                            {...field}
                            min={new Date().toISOString().split('T')[0]}
                          />
                        )}
                      />
                      {errors.preferredDate && (
                        <p className="text-red-500 text-sm mt-1">{errors.preferredDate.message}</p>
                      )}
                    </div>

                    <div>
                      <Label>Preferred Time</Label>
                      <Controller
                        name="preferredTime"
                        control={control}
                        render={({ field }) => (
                          <Select {...field}>
                            <option value="">Select time slot</option>
                            {timeSlots.map((slot) => (
                              <option key={slot.value} value={slot.value}>
                                {slot.label}
                              </option>
                            ))}
                          </Select>
                        )}
                      />
                      {errors.preferredTime && (
                        <p className="text-red-500 text-sm mt-1">{errors.preferredTime.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="alternativeDate">Alternative Date (Optional)</Label>
                      <Controller
                        name="alternativeDate"
                        control={control}
                        render={({ field }) => (
                          <Input
                            type="date"
                            {...field}
                            min={new Date().toISOString().split('T')[0]}
                          />
                        )}
                      />
                    </div>

                    <div>
                      <Label>Alternative Time (Optional)</Label>
                      <Controller
                        name="alternativeTime"
                        control={control}
                        render={({ field }) => (
                          <Select {...field}>
                            <option value="">Select alternative time</option>
                            {timeSlots.map((slot) => (
                              <option key={slot.value} value={slot.value}>
                                {slot.label}
                              </option>
                            ))}
                          </Select>
                        )}
                      />
                    </div>
                  </div>

                  {serviceType === 'amc' && (
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <Controller
                          name="isRecurring"
                          control={control}
                          render={({ field }) => (
                            <Checkbox
                              checked={field.value}
                              onChange={(e) => field.onChange(e.target.checked)}
                            />
                          )}
                        />
                        <Label>Set up recurring maintenance schedule</Label>
                      </div>

                      {watch('isRecurring') && (
                        <div>
                          <Label>Recurring Frequency</Label>
                          <Controller
                            name="recurringFrequency"
                            control={control}
                            render={({ field }) => (
                              <Select {...field}>
                                <option value="">Select frequency</option>
                                <option value="monthly">Monthly</option>
                                <option value="quarterly">Quarterly</option>
                              </Select>
                            )}
                          />
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Step 4: Customer Information */}
          {currentStep === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Your Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">First Name</Label>
                      <Controller
                        name="firstName"
                        control={control}
                        render={({ field }) => (
                          <Input {...field} placeholder="Enter your first name" />
                        )}
                      />
                      {errors.firstName && (
                        <p className="text-red-500 text-sm mt-1">{errors.firstName.message}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="lastName">Last Name</Label>
                      <Controller
                        name="lastName"
                        control={control}
                        render={({ field }) => (
                          <Input {...field} placeholder="Enter your last name" />
                        )}
                      />
                      {errors.lastName && (
                        <p className="text-red-500 text-sm mt-1">{errors.lastName.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="phone">Phone Number</Label>
                      <Controller
                        name="phone"
                        control={control}
                        render={({ field }) => (
                          <Input
                            {...field}
                            type="tel"
                            placeholder="+971 50 123 4567"
                          />
                        )}
                      />
                      {errors.phone && (
                        <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="whatsappNumber">WhatsApp Number</Label>
                      <Controller
                        name="whatsappNumber"
                        control={control}
                        render={({ field }) => (
                          <Input
                            {...field}
                            type="tel"
                            placeholder="Auto-filled from phone"
                          />
                        )}
                      />
                      {errors.whatsappNumber && (
                        <p className="text-red-500 text-sm mt-1">{errors.whatsappNumber.message}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Controller
                      name="email"
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          type="email"
                          placeholder="your.email@example.com"
                        />
                      )}
                    />
                    {errors.email && (
                      <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    <div className="col-span-2 sm:col-span-1">
                      <Label htmlFor="buildingName">Building Name</Label>
                      <Controller
                        name="buildingName"
                        control={control}
                        render={({ field }) => (
                          <Input {...field} placeholder="Building name" />
                        )}
                      />
                      {errors.buildingName && (
                        <p className="text-red-500 text-sm mt-1">{errors.buildingName.message}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="apartmentNumber">Apartment Number</Label>
                      <Controller
                        name="apartmentNumber"
                        control={control}
                        render={({ field }) => (
                          <Input {...field} placeholder="Apt. number" />
                        )}
                      />
                      {errors.apartmentNumber && (
                        <p className="text-red-500 text-sm mt-1">{errors.apartmentNumber.message}</p>
                      )}
                    </div>

                    <div className="col-span-2 sm:col-span-1">
                      <Label>Emirate</Label>
                      <Controller
                        name="emirate"
                        control={control}
                        render={({ field }) => (
                          <Select {...field}>
                            <option value="">Select emirate</option>
                            {emirates.map((emirate) => (
                              <option key={emirate.value} value={emirate.value}>
                                {emirate.label}
                              </option>
                            ))}
                          </Select>
                        )}
                      />
                      {errors.emirate && (
                        <p className="text-red-500 text-sm mt-1">{errors.emirate.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="area">Area</Label>
                      <Controller
                        name="area"
                        control={control}
                        render={({ field }) => (
                          <Input {...field} placeholder="Area/District" />
                        )}
                      />
                      {errors.area && (
                        <p className="text-red-500 text-sm mt-1">{errors.area.message}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="landmark">Nearby Landmark (Optional)</Label>
                      <Controller
                        name="landmark"
                        control={control}
                        render={({ field }) => (
                          <Input {...field} placeholder="Nearest landmark" />
                        )}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label>How did you hear about us?</Label>
                      <Controller
                        name="marketingSource"
                        control={control}
                        render={({ field }) => (
                          <Select {...field}>
                            <option value="">Select source</option>
                            {marketingSources.map((source) => (
                              <option key={source.value} value={source.value}>
                                {source.label}
                              </option>
                            ))}
                          </Select>
                        )}
                      />
                      {errors.marketingSource && (
                        <p className="text-red-500 text-sm mt-1">{errors.marketingSource.message}</p>
                      )}
                    </div>

                    {watch('marketingSource') === 'referral' && (
                      <div>
                        <Label htmlFor="referralSource">Referral Source</Label>
                        <Controller
                          name="referralSource"
                          control={control}
                          render={({ field }) => (
                            <Input {...field} placeholder="Who referred you?" />
                          )}
                        />
                        {errors.referralSource && (
                          <p className="text-red-500 text-sm mt-1">{errors.referralSource.message}</p>
                        )}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Step 5: Payment Terms */}
          {currentStep === 5 && (
            <motion.div
              key="step5"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Payment Terms & Confirmation</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Price Summary */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-base md:text-lg mb-2">Service Summary</h3>
                    <div className="space-y-2">
                      <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-0">
                        <span className="text-sm md:text-base">Service:</span>
                        <span className="text-sm md:text-base font-medium">{getServiceDescription(
                          watchedValues.serviceType,
                          watchedValues.newResidentPackage || watchedValues.amcPackage || watchedValues.individualService
                        )}</span>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-0 pt-2 border-t">
                        <span className="font-bold text-base md:text-lg">Total Price:</span>
                        <span className="font-bold text-base md:text-lg text-teal-600">{formatPrice(calculateCurrentPrice())}</span>
                      </div>
                    </div>
                  </div>

                  {/* Payment Method */}
                  <div>
                    <Label>Payment Method</Label>
                    <Controller
                      name="paymentMethod"
                      control={control}
                      render={({ field }) => (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
                          {[
                            { value: 'cash', label: 'Cash on Service' },
                            { value: 'card', label: 'Credit/Debit Card' },
                            { value: 'bank-transfer', label: 'Bank Transfer' },
                            { value: 'installment', label: 'Installment Plan' },
                          ].map((method) => (
                            <label
                              key={method.value}
                              className={`p-3 border rounded-lg cursor-pointer text-center ${
                                field.value === method.value
                                  ? 'border-teal-500 bg-teal-50'
                                  : 'border-gray-200'
                              }`}
                            >
                              <input
                                type="radio"
                                value={method.value}
                                checked={field.value === method.value}
                                onChange={field.onChange}
                                className="sr-only"
                              />
                              <span className="text-xs sm:text-sm font-medium">{method.label}</span>
                            </label>
                          ))}
                        </div>
                      )}
                    />
                    {errors.paymentMethod && (
                      <p className="text-red-500 text-sm mt-1">{errors.paymentMethod.message}</p>
                    )}
                  </div>

                  {/* Installment Options */}
                  {calculateCurrentPrice() >= 1000 && (
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h4 className="font-medium text-blue-900 mb-2 text-sm md:text-base">Installment Available</h4>
                      <p className="text-blue-800 text-xs md:text-sm mb-3">
                        For services over AED 1,000, you can pay 30% advance and the remaining amount after service completion.
                      </p>
                      <div className="mt-2">
                        <Controller
                          name="wantsInstallment"
                          control={control}
                          render={({ field }) => (
                            <label className="flex items-start space-x-2">
                              <Checkbox
                                checked={field.value}
                                onChange={(e) => field.onChange(e.target.checked)}
                              />
                              <span className="text-xs md:text-sm leading-relaxed">
                                Pay {formatPrice(Math.round(calculateCurrentPrice() * 0.3))} now, 
                                {formatPrice(calculateCurrentPrice() - Math.round(calculateCurrentPrice() * 0.3))} after service
                              </span>
                            </label>
                          )}
                        />
                      </div>
                    </div>
                  )}

                  {/* Terms and Conditions */}
                  <div className="space-y-3">
                    <div className="flex items-start space-x-2">
                      <Controller
                        name="agreedToTerms"
                        control={control}
                        render={({ field }) => (
                          <Checkbox
                            checked={field.value}
                            onChange={(e) => field.onChange(e.target.checked)}
                            className="mt-1"
                          />
                        )}
                      />
                      <Label className="text-sm">
                        I agree to the{' '}
                        <a href="/terms" className="text-teal-600 underline" target="_blank">
                          Terms and Conditions
                        </a>
                      </Label>
                    </div>
                    {errors.agreedToTerms && (
                      <p className="text-red-500 text-sm">{errors.agreedToTerms.message}</p>
                    )}

                    <div className="flex items-start space-x-2">
                      <Controller
                        name="agreedToPrivacy"
                        control={control}
                        render={({ field }) => (
                          <Checkbox
                            checked={field.value}
                            onChange={(e) => field.onChange(e.target.checked)}
                            className="mt-1"
                          />
                        )}
                      />
                      <Label className="text-sm">
                        I agree to the{' '}
                        <a href="/privacy" className="text-teal-600 underline" target="_blank">
                          Privacy Policy
                        </a>
                      </Label>
                    </div>
                    {errors.agreedToPrivacy && (
                      <p className="text-red-500 text-sm">{errors.agreedToPrivacy.message}</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation Buttons */}
        <div className="flex flex-col sm:flex-row justify-between gap-3 sm:gap-0 mt-6 md:mt-8">
          {currentStep > 1 && (
            <Button
              type="button"
              variant="outline"
              onClick={prevStep}
              disabled={isSubmitting}
              className="w-full sm:w-auto order-2 sm:order-1"
            >
              Previous
            </Button>
          )}
          
          <div className={`${currentStep === 1 ? 'w-full' : 'w-full sm:w-auto'} order-1 sm:order-2 ${currentStep > 1 ? 'sm:ml-auto' : ''}`}>
            {currentStep < steps.length ? (
              <Button
                type="button"
                onClick={nextStep}
                className="w-full bg-teal-500 hover:bg-teal-600"
                disabled={isSubmitting}
              >
                Next Step
              </Button>
            ) : (
              <Button
                type="submit"
                className="w-full bg-teal-500 hover:bg-teal-600"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Submitting...' : 'Confirm Booking'}
              </Button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}
