import React, { useState, useCallback, useRef } from 'react';
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
  projectAssessmentSchema, 
  ProjectAssessmentData,
  step1Schema,
  step2Schema,
  step3Schema,
  step4Schema,
  validateFileUpload,
  projectTypeOptions,
  contactMethodOptions,
  contactTimeOptions
} from '../../schemas/projectAssessmentValidation';
import { generateProjectQuote, formatPrice, formatPriceRange } from '../../utils/pricing';

interface ProjectAssessmentFormProps {
  initialProjectType?: string;
}

const steps = [
  { id: 1, title: 'Project Type', description: 'Select your construction service' },
  { id: 2, title: 'Project Details', description: 'Tell us about your project' },
  { id: 3, title: 'Requirements', description: 'Specify your needs' },
  { id: 4, title: 'Contact & Visit', description: 'Schedule consultation' },
];

// Use the project type options from the validation schema and extend with sub-services
const constructionServices = projectTypeOptions.map(option => ({
  id: option.value,
  name: option.label,
  description: option.description,
  subServices: getSubServicesForProjectType(option.value)
}));

function getSubServicesForProjectType(projectType: string): string[] {
  switch (projectType) {
    case 'kitchen':
      return [
        'Complete kitchen installation',
        'Kitchen appliance connections',
        'Cabinet and countertop work',
        'Kitchen plumbing and electrical'
      ];
    case 'bathroom':
      return [
        'Fixture installations (shower, toilet, sink)',
        'Tile and marble work',
        'Plumbing connections',
        'Bathroom cabinet installations'
      ];
    case 'flooring':
      return [
        'Marble/granite installation',
        'Ceramic/porcelain tiling',
        'Floor finishing and polishing',
        'Tile repair and replacement'
      ];
    case 'woodwork':
      return [
        'Built-in wardrobes and cabinets',
        'Custom carpentry work',
        'Door and window finishing',
        'Wooden flooring installation'
      ];
    case 'painting':
      return [
        'Interior wall painting',
        'Exterior building painting',
        'Touch-up and finishing work',
        'Decorative painting'
      ];
    case 'ac':
      return [
        'Split AC installation',
        'Central AC setup',
        'Ductwork and ventilation',
        'AC system commissioning'
      ];
    case 'complete':
      return [
        'Multiple services combined',
        'Full apartment/building finishing',
        'Large-scale construction projects'
      ];
    default:
      return [];
  }
}

export default function ProjectAssessmentForm({ initialProjectType }: ProjectAssessmentFormProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedSubServices, setSelectedSubServices] = useState<string[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadErrors, setUploadErrors] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    trigger,
    formState: { errors },
    getValues,
  } = useForm<ProjectAssessmentData>({
    resolver: zodResolver(projectAssessmentSchema),
    mode: 'onChange',
    defaultValues: {
      projectType: initialProjectType as any || 'kitchen',
      subServices: [],
      projectLocation: {
        buildingName: '',
        area: '',
        unitNumber: ''
      },
      projectSize: '',
      currentStatus: '',
      timeline: '',
      projectImages: [],
      kitchenRequirements: {},
      bathroomRequirements: {},
      flooringRequirements: {},
      woodworkRequirements: {},
      paintingRequirements: {},
      acRequirements: {},
      additionalDetails: '',
      contactInfo: {
        name: '',
        phone: '',
        email: '',
        company: ''
      },
      projectAddress: {
        buildingName: '',
        areaDistrict: '',
        unitNumber: ''
      },
      preferredContactMethod: 'whatsapp',
      bestContactTime: 'morning',
      agreedToTerms: false,
      agreedToPrivacy: false
    },
  });

  const watchedValues = watch();
  const projectType = watch('projectType');

  const validateCurrentStep = async () => {
    const currentValues = getValues();
    
    try {
      switch (currentStep) {
        case 1:
          step1Schema.parse({
            projectType: currentValues.projectType,
            subServices: currentValues.subServices
          });
          break;
        case 2:
          step2Schema.parse({
            projectLocation: currentValues.projectLocation,
            projectSize: currentValues.projectSize,
            currentStatus: currentValues.currentStatus,
            timeline: currentValues.timeline,
            projectImages: currentValues.projectImages
          });
          break;
        case 3:
          step3Schema.parse({
            kitchenRequirements: currentValues.kitchenRequirements,
            bathroomRequirements: currentValues.bathroomRequirements,
            flooringRequirements: currentValues.flooringRequirements,
            woodworkRequirements: currentValues.woodworkRequirements,
            paintingRequirements: currentValues.paintingRequirements,
            acRequirements: currentValues.acRequirements,
            additionalDetails: currentValues.additionalDetails
          });
          break;
        case 4:
          step4Schema.parse({
            contactInfo: currentValues.contactInfo,
            projectAddress: currentValues.projectAddress,
            preferredContactMethod: currentValues.preferredContactMethod,
            bestContactTime: currentValues.bestContactTime,
            agreedToTerms: currentValues.agreedToTerms,
            agreedToPrivacy: currentValues.agreedToPrivacy
          });
          break;
      }
      return true;
    } catch (error) {
      // Trigger validation for the current step fields
      await trigger();
      return false;
    }
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

  const handleSubServiceToggle = useCallback((subService: string) => {
    const newSubServices = selectedSubServices.includes(subService)
      ? selectedSubServices.filter(s => s !== subService)
      : [...selectedSubServices, subService];
    
    setSelectedSubServices(newSubServices);
    setValue('subServices', newSubServices);
  }, [selectedSubServices, setValue]);

  // File upload utility functions
  const handleFileSelect = useCallback((files: FileList | File[]) => {
    const fileArray = Array.from(files);
    const errors: string[] = [];

    // Check total file count
    if (uploadedFiles.length + fileArray.length > 10) {
      errors.push('Maximum 10 files allowed');
      setUploadErrors(errors);
      return;
    }

    try {
      // Use the validation utility from the schema
      validateFileUpload(fileArray);
      
      // Add valid files
      const newFiles = [...uploadedFiles, ...fileArray];
      setUploadedFiles(newFiles);
      setValue('projectImages', newFiles);
      setUploadErrors([]);
    } catch (error) {
      setUploadErrors([error instanceof Error ? error.message : 'File validation failed']);
    }
  }, [uploadedFiles, setValue]);

  const handleFileRemove = useCallback((index: number) => {
    const newFiles = uploadedFiles.filter((_, i) => i !== index);
    setUploadedFiles(newFiles);
    setValue('projectImages', newFiles);
  }, [uploadedFiles, setValue]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files);
    }
  }, [handleFileSelect]);

  const handleFileInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files);
    }
    // Reset input value to allow selecting the same file again
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [handleFileSelect]);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const onSubmit = async (data: ProjectAssessmentData) => {
    setIsSubmitting(true);
    try {
      // Generate project quote using new pricing utilities
      const projectQuote = generateProjectQuote(data);
      console.log('Generated project quote:', projectQuote);

      // This will be updated in task 9.1 to use the new construction project assessment function
      const response = await fetch('/.netlify/functions/construction-project-assessment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          estimatedQuote: projectQuote.estimatedQuote,
          projectId: projectQuote.projectId,
          recommendations: projectQuote.recommendations
        }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        console.log('Project assessment submitted successfully:', result);
        // Redirect to success page with project details and quote
        const projectId = result.projectId || projectQuote.projectId;
        const selectedService = constructionServices.find(s => s.id === data.projectType);
        
        window.location.href = `/success?id=${projectId}&service=${encodeURIComponent(selectedService?.name || 'Construction Project')}&type=project-assessment&quote=${encodeURIComponent(formatPriceRange(projectQuote.estimatedQuote.min, projectQuote.estimatedQuote.max))}`;
      } else {
        throw new Error(result.message || 'Failed to submit project assessment');
      }
    } catch (error) {
      console.error('Submission error:', error);
      // Show user-friendly error message with WhatsApp fallback
      const whatsappMessage = generateWhatsAppMessage();
      alert(`Failed to submit project assessment. Please try again or contact us directly via WhatsApp: ${whatsappMessage}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const generateWhatsAppMessage = () => {
    const data = getValues();
    const selectedService = constructionServices.find(s => s.id === data.projectType);
    
    // Generate quick price estimate for WhatsApp
    let priceEstimate = '';
    try {
      const projectQuote = generateProjectQuote(data);
      priceEstimate = `\nEstimated Price Range: ${formatPriceRange(projectQuote.estimatedQuote.min, projectQuote.estimatedQuote.max)}`;
    } catch (error) {
      console.log('Could not generate price estimate for WhatsApp message');
    }
    
    const message = `Hi ServDubai! I'd like to get a quote for a construction finishing project:

Project Type: ${selectedService?.name || data.projectType}
Location: ${data.projectLocation?.buildingName || 'TBD'}, ${data.projectLocation?.area || 'TBD'}
Project Size: ${data.projectSize || 'TBD'}
Timeline: ${data.timeline || 'TBD'}${priceEstimate}
Name: ${data.contactInfo?.name || 'TBD'}
Phone: ${data.contactInfo?.phone || 'TBD'}

Please help me with my project assessment and provide a detailed quote. Thank you!`;
    
    return `https://wa.me/971552418446?text=${encodeURIComponent(message)}`;
  };

  const selectedService = constructionServices.find(s => s.id === projectType);

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
          {/* Step 1: Project Type Selection */}
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
                  <CardTitle>What type of construction finishing do you need?</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <Controller
                    name="projectType"
                    control={control}
                    render={({ field }) => (
                      <div className="grid grid-cols-1 gap-4">
                        {constructionServices.map((service) => (
                          <label
                            key={service.id}
                            className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                              field.value === service.id
                                ? 'border-teal-500 bg-teal-50'
                                : 'border-gray-200 hover:border-teal-300'
                            }`}
                          >
                            <input
                              type="radio"
                              value={service.id}
                              checked={field.value === service.id}
                              onChange={(e) => {
                                field.onChange(e.target.value);
                                setSelectedSubServices([]);
                                setValue('subServices', []);
                              }}
                              className="sr-only"
                            />
                            <div className="font-semibold text-gray-900 text-base mb-2">{service.name}</div>
                            <div className="text-sm text-gray-600 mb-3">{service.description}</div>
                          </label>
                        ))}
                      </div>
                    )}
                  />

                  {/* Sub-service selection */}
                  {selectedService && (
                    <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                      <Label className="text-base font-medium mb-3 block">
                        Select specific services needed (optional):
                      </Label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {selectedService.subServices.map((subService) => (
                          <label
                            key={subService}
                            className="flex items-center space-x-3 cursor-pointer"
                          >
                            <Checkbox
                              checked={selectedSubServices.includes(subService)}
                              onChange={() => handleSubServiceToggle(subService)}
                            />
                            <span className="text-sm text-gray-700">{subService}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}

                  {errors.projectType && (
                    <p className="text-red-500 text-sm">{errors.projectType.message}</p>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )}
  
        {/* Step 2: Project Details & Image Upload */}
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
                  <CardTitle>Help us understand your project better</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="projectLocation.buildingName">Building Name</Label>
                      <Controller
                        name="projectLocation.buildingName"
                        control={control}
                        render={({ field }) => (
                          <Input
                            {...field}
                            placeholder="e.g., Marina Heights Tower"
                          />
                        )}
                      />
                      {errors.projectLocation?.buildingName && (
                        <p className="text-red-500 text-sm mt-1">{errors.projectLocation.buildingName.message}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="projectLocation.area">Area in Dubai</Label>
                      <Controller
                        name="projectLocation.area"
                        control={control}
                        render={({ field }) => (
                          <Select {...field}>
                            <option value="">Select area</option>
                            <option value="Dubai Marina">Dubai Marina</option>
                            <option value="Downtown Dubai">Downtown Dubai</option>
                            <option value="Business Bay">Business Bay</option>
                            <option value="DIFC">DIFC</option>
                            <option value="Dubai Hills">Dubai Hills</option>
                            <option value="City Walk">City Walk</option>
                            <option value="Al Barsha">Al Barsha</option>
                            <option value="Jumeirah">Jumeirah</option>
                            <option value="Dubai South">Dubai South</option>
                            <option value="Dubai Investment Park">Dubai Investment Park</option>
                            <option value="Other">Other</option>
                          </Select>
                        )}
                      />
                      {errors.projectLocation?.area && (
                        <p className="text-red-500 text-sm mt-1">{errors.projectLocation.area.message}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="projectLocation.unitNumber">Apartment/Unit Number (Optional)</Label>
                    <Controller
                      name="projectLocation.unitNumber"
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          placeholder="e.g., Unit 1205, Floor 12"
                        />
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="projectSize">Project Size</Label>
                      <Controller
                        name="projectSize"
                        control={control}
                        render={({ field }) => (
                          <Select {...field}>
                            <option value="">Select project size</option>
                            <option value="Studio apartment">Studio apartment</option>
                            <option value="1 bedroom apartment">1 bedroom apartment</option>
                            <option value="2 bedroom apartment">2 bedroom apartment</option>
                            <option value="3 bedroom apartment">3 bedroom apartment</option>
                            <option value="4+ bedroom apartment">4+ bedroom apartment</option>
                            <option value="Villa">Villa</option>
                            <option value="Townhouse">Townhouse</option>
                            <option value="Multiple units (2-10)">Multiple units (2-10)</option>
                            <option value="Building (10+ units)">Building (10+ units)</option>
                            <option value="Commercial space">Commercial space</option>
                          </Select>
                        )}
                      />
                      {errors.projectSize && (
                        <p className="text-red-500 text-sm mt-1">{errors.projectSize.message}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="currentStatus">Current Status</Label>
                      <Controller
                        name="currentStatus"
                        control={control}
                        render={({ field }) => (
                          <Select {...field}>
                            <option value="">Select current status</option>
                            <option value="Construction completed - ready for finishing">Construction completed - ready for finishing</option>
                            <option value="Partially finished - needs completion">Partially finished - needs completion</option>
                            <option value="Renovation project">Renovation project</option>
                            <option value="New construction - final phase">New construction - final phase</option>
                            <option value="Handover preparation">Handover preparation</option>
                          </Select>
                        )}
                      />
                      {errors.currentStatus && (
                        <p className="text-red-500 text-sm mt-1">{errors.currentStatus.message}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="timeline">When do you need work completed?</Label>
                    <Controller
                      name="timeline"
                      control={control}
                      render={({ field }) => (
                        <Select {...field}>
                          <option value="">Select timeline</option>
                          <option value="ASAP - Within 1 week">ASAP - Within 1 week</option>
                          <option value="Within 2 weeks">Within 2 weeks</option>
                          <option value="Within 1 month">Within 1 month</option>
                          <option value="Within 2 months">Within 2 months</option>
                          <option value="Within 3 months">Within 3 months</option>
                          <option value="Flexible timeline">Flexible timeline</option>
                        </Select>
                      )}
                    />
                    {errors.timeline && (
                      <p className="text-red-500 text-sm mt-1">{errors.timeline.message}</p>
                    )}
                  </div>

                  {/* Image Upload Component */}
                  <div className="space-y-4">
                    <Label>Upload Project Images (Optional)</Label>
                    <p className="text-sm text-gray-600">
                      Current state photos, reference images, or building plans help us provide accurate quotes
                    </p>
                    
                    {/* Drag and Drop Area */}
                    <div
                      className={`p-6 border-2 border-dashed rounded-lg text-center transition-colors cursor-pointer ${
                        isDragOver
                          ? 'border-teal-500 bg-teal-50'
                          : 'border-gray-300 hover:border-teal-400 hover:bg-gray-50'
                      }`}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <div className="text-gray-500 mb-2">
                        <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                          <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </div>
                      <p className="text-sm text-gray-600 mb-1">
                        {isDragOver ? 'Drop files here' : 'Drag and drop files here, or click to select'}
                      </p>
                      <p className="text-xs text-gray-500">
                        Supported: JPG, PNG, PDF • Max 10 files, 5MB each
                      </p>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="mt-3"
                        onClick={(e) => {
                          e.stopPropagation();
                          fileInputRef.current?.click();
                        }}
                      >
                        Choose Files
                      </Button>
                    </div>

                    {/* Hidden File Input */}
                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      accept=".jpg,.jpeg,.png,.pdf"
                      onChange={handleFileInputChange}
                      className="hidden"
                    />

                    {/* Upload Errors */}
                    {uploadErrors.length > 0 && (
                      <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-sm font-medium text-red-800 mb-1">Upload Errors:</p>
                        <ul className="text-sm text-red-700 space-y-1">
                          {uploadErrors.map((error, index) => (
                            <li key={index}>• {error}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Uploaded Files List */}
                    {uploadedFiles.length > 0 && (
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-gray-700">
                          Uploaded Files ({uploadedFiles.length}/10):
                        </p>
                        <div className="space-y-2 max-h-40 overflow-y-auto">
                          {uploadedFiles.map((file, index) => (
                            <div
                              key={index}
                              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border"
                            >
                              <div className="flex items-center space-x-3 flex-1 min-w-0">
                                <div className="flex-shrink-0">
                                  {file.type.startsWith('image/') ? (
                                    <svg className="h-5 w-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                                      <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                                    </svg>
                                  ) : (
                                    <svg className="h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                                      <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                                    </svg>
                                  )}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium text-gray-900 truncate">
                                    {file.name}
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    {formatFileSize(file.size)}
                                  </p>
                                </div>
                              </div>
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => handleFileRemove(index)}
                                className="ml-3 text-red-600 hover:text-red-700 hover:bg-red-50"
                              >
                                Remove
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Step 3: Project Scope & Requirements */}
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
                  <CardTitle>Project Specifications</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Kitchen Requirements */}
                  {(projectType === 'kitchen' || projectType === 'complete') && (
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <h4 className="font-medium text-gray-900 mb-3">For Kitchen Projects:</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <Controller
                          name="kitchenRequirements.cabinetInstallation"
                          control={control}
                          render={({ field }) => (
                            <label className="flex items-center space-x-3 cursor-pointer">
                              <Checkbox
                                checked={field.value || false}
                                onChange={(e) => field.onChange(e.target.checked)}
                              />
                              <span className="text-sm text-gray-700">Cabinet installation required</span>
                            </label>
                          )}
                        />

                        <Controller
                          name="kitchenRequirements.countertopInstallation"
                          control={control}
                          render={({ field }) => (
                            <label className="flex items-center space-x-3 cursor-pointer">
                              <Checkbox
                                checked={field.value || false}
                                onChange={(e) => field.onChange(e.target.checked)}
                              />
                              <span className="text-sm text-gray-700">Countertop installation (marble/granite/quartz)</span>
                            </label>
                          )}
                        />

                        <Controller
                          name="kitchenRequirements.applianceConnections"
                          control={control}
                          render={({ field }) => (
                            <label className="flex items-center space-x-3 cursor-pointer">
                              <Checkbox
                                checked={field.value || false}
                                onChange={(e) => field.onChange(e.target.checked)}
                              />
                              <span className="text-sm text-gray-700">Appliance connections needed</span>
                            </label>
                          )}
                        />

                        <Controller
                          name="kitchenRequirements.plumbingWork"
                          control={control}
                          render={({ field }) => (
                            <label className="flex items-center space-x-3 cursor-pointer">
                              <Checkbox
                                checked={field.value || false}
                                onChange={(e) => field.onChange(e.target.checked)}
                              />
                              <span className="text-sm text-gray-700">Plumbing work required</span>
                            </label>
                          )}
                        />

                        <Controller
                          name="kitchenRequirements.electricalConnections"
                          control={control}
                          render={({ field }) => (
                            <label className="flex items-center space-x-3 cursor-pointer">
                              <Checkbox
                                checked={field.value || false}
                                onChange={(e) => field.onChange(e.target.checked)}
                              />
                              <span className="text-sm text-gray-700">Electrical connections needed</span>
                            </label>
                          )}
                        />

                        <Controller
                          name="kitchenRequirements.customStorage"
                          control={control}
                          render={({ field }) => (
                            <label className="flex items-center space-x-3 cursor-pointer">
                              <Checkbox
                                checked={field.value || false}
                                onChange={(e) => field.onChange(e.target.checked)}
                              />
                              <span className="text-sm text-gray-700">Custom storage solutions</span>
                            </label>
                          )}
                        />
                      </div>
                    </div>
                  )}

                  {/* Bathroom Requirements */}
                  {(projectType === 'bathroom' || projectType === 'complete') && (
                    <div className="p-4 bg-green-50 rounded-lg">
                      <h4 className="font-medium text-gray-900 mb-3">For Bathroom Projects:</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <Controller
                          name="bathroomRequirements.showerBathtubInstallation"
                          control={control}
                          render={({ field }) => (
                            <label className="flex items-center space-x-3 cursor-pointer">
                              <Checkbox
                                checked={field.value || false}
                                onChange={(e) => field.onChange(e.target.checked)}
                              />
                              <span className="text-sm text-gray-700">Shower/bathtub installation</span>
                            </label>
                          )}
                        />

                        <Controller
                          name="bathroomRequirements.toiletSinkInstallation"
                          control={control}
                          render={({ field }) => (
                            <label className="flex items-center space-x-3 cursor-pointer">
                              <Checkbox
                                checked={field.value || false}
                                onChange={(e) => field.onChange(e.target.checked)}
                              />
                              <span className="text-sm text-gray-700">Toilet and sink installation</span>
                            </label>
                          )}
                        />

                        <Controller
                          name="bathroomRequirements.tileMarbleInstallation"
                          control={control}
                          render={({ field }) => (
                            <label className="flex items-center space-x-3 cursor-pointer">
                              <Checkbox
                                checked={field.value || false}
                                onChange={(e) => field.onChange(e.target.checked)}
                              />
                              <span className="text-sm text-gray-700">Tile/marble installation</span>
                            </label>
                          )}
                        />

                        <Controller
                          name="bathroomRequirements.plumbingConnections"
                          control={control}
                          render={({ field }) => (
                            <label className="flex items-center space-x-3 cursor-pointer">
                              <Checkbox
                                checked={field.value || false}
                                onChange={(e) => field.onChange(e.target.checked)}
                              />
                              <span className="text-sm text-gray-700">Plumbing connections</span>
                            </label>
                          )}
                        />

                        <Controller
                          name="bathroomRequirements.mirrorCabinetInstallation"
                          control={control}
                          render={({ field }) => (
                            <label className="flex items-center space-x-3 cursor-pointer">
                              <Checkbox
                                checked={field.value || false}
                                onChange={(e) => field.onChange(e.target.checked)}
                              />
                              <span className="text-sm text-gray-700">Mirror and cabinet installation</span>
                            </label>
                          )}
                        />

                        <Controller
                          name="bathroomRequirements.waterproofing"
                          control={control}
                          render={({ field }) => (
                            <label className="flex items-center space-x-3 cursor-pointer">
                              <Checkbox
                                checked={field.value || false}
                                onChange={(e) => field.onChange(e.target.checked)}
                              />
                              <span className="text-sm text-gray-700">Waterproofing needed</span>
                            </label>
                          )}
                        />
                      </div>
                    </div>
                  )}

                  <div>
                    <Label htmlFor="additionalDetails">Additional Details</Label>
                    <Controller
                      name="additionalDetails"
                      control={control}
                      render={({ field }) => (
                        <Textarea
                          {...field}
                          rows={4}
                          placeholder="Specific requirements, materials preferences, timeline constraints, or any other details about your project..."
                        />
                      )}
                    />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Step 4: Contact & Site Visit */}
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
                  <CardTitle>Let's discuss your project</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Contact Information */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-4">Contact Information</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="contactInfo.name">Name *</Label>
                        <Controller
                          name="contactInfo.name"
                          control={control}
                          render={({ field }) => (
                            <Input
                              {...field}
                              placeholder="Your full name"
                            />
                          )}
                        />
                        {errors.contactInfo?.name && (
                          <p className="text-red-500 text-sm mt-1">{errors.contactInfo.name.message}</p>
                        )}
                      </div>

                      <div>
                        <Label htmlFor="contactInfo.phone">Phone Number *</Label>
                        <Controller
                          name="contactInfo.phone"
                          control={control}
                          render={({ field }) => (
                            <Input
                              {...field}
                              placeholder="+971 50 123 4567"
                            />
                          )}
                        />
                        {errors.contactInfo?.phone && (
                          <p className="text-red-500 text-sm mt-1">{errors.contactInfo.phone.message}</p>
                        )}
                        <p className="text-xs text-gray-500 mt-1">Will be used for WhatsApp communication</p>
                      </div>

                      <div>
                        <Label htmlFor="contactInfo.email">Email *</Label>
                        <Controller
                          name="contactInfo.email"
                          control={control}
                          render={({ field }) => (
                            <Input
                              {...field}
                              type="email"
                              placeholder="your.email@example.com"
                            />
                          )}
                        />
                        {errors.contactInfo?.email && (
                          <p className="text-red-500 text-sm mt-1">{errors.contactInfo.email.message}</p>
                        )}
                      </div>

                      <div>
                        <Label htmlFor="contactInfo.company">Company (Optional)</Label>
                        <Controller
                          name="contactInfo.company"
                          control={control}
                          render={({ field }) => (
                            <Input
                              {...field}
                              placeholder="Your company name"
                            />
                          )}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Project Address */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-4">Project Address</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="projectAddress.buildingName">Building Name *</Label>
                        <Controller
                          name="projectAddress.buildingName"
                          control={control}
                          render={({ field }) => (
                            <Input
                              {...field}
                              placeholder="e.g., Marina Heights Tower"
                            />
                          )}
                        />
                        {errors.projectAddress?.buildingName && (
                          <p className="text-red-500 text-sm mt-1">{errors.projectAddress.buildingName.message}</p>
                        )}
                      </div>

                      <div>
                        <Label htmlFor="projectAddress.areaDistrict">Area/District *</Label>
                        <Controller
                          name="projectAddress.areaDistrict"
                          control={control}
                          render={({ field }) => (
                            <Input
                              {...field}
                              placeholder="e.g., Dubai Marina"
                            />
                          )}
                        />
                        {errors.projectAddress?.areaDistrict && (
                          <p className="text-red-500 text-sm mt-1">{errors.projectAddress.areaDistrict.message}</p>
                        )}
                      </div>

                      <div className="sm:col-span-2">
                        <Label htmlFor="projectAddress.unitNumber">Apartment/Unit Number (Optional)</Label>
                        <Controller
                          name="projectAddress.unitNumber"
                          control={control}
                          render={({ field }) => (
                            <Input
                              {...field}
                              placeholder="e.g., Unit 1205, Floor 12"
                            />
                          )}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Preferred Contact Method */}
                  <div>
                    <Label className="text-base font-medium mb-3 block">Preferred Contact Method</Label>
                    <Controller
                      name="preferredContactMethod"
                      control={control}
                      render={({ field }) => (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {[
                            { value: 'whatsapp', label: 'WhatsApp consultation', desc: 'Quick messaging and photo sharing' },
                            { value: 'phone', label: 'Phone call discussion', desc: 'Direct conversation about your project' },
                            { value: 'onsite', label: 'On-site visit and quote', desc: 'In-person assessment and detailed quote' },
                            { value: 'email', label: 'Email project details', desc: 'Detailed written communication' }
                          ].map((option) => (
                            <label
                              key={option.value}
                              className={`p-3 border rounded-lg cursor-pointer transition-all ${
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
                              <div className="font-medium text-sm text-gray-900">{option.label}</div>
                              <div className="text-xs text-gray-600 mt-1">{option.desc}</div>
                            </label>
                          ))}
                        </div>
                      )}
                    />
                    {errors.preferredContactMethod && (
                      <p className="text-red-500 text-sm mt-1">{errors.preferredContactMethod.message}</p>
                    )}
                  </div>

                  {/* Best Contact Time */}
                  <div>
                    <Label className="text-base font-medium mb-3 block">Best time to contact</Label>
                    <Controller
                      name="bestContactTime"
                      control={control}
                      render={({ field }) => (
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                          {[
                            { value: 'morning', label: 'Morning', desc: '9AM-12PM' },
                            { value: 'afternoon', label: 'Afternoon', desc: '12PM-5PM' },
                            { value: 'evening', label: 'Evening', desc: '5PM-8PM' },
                            { value: 'weekend', label: 'Weekend', desc: 'Sat-Sun' }
                          ].map((option) => (
                            <label
                              key={option.value}
                              className={`p-3 border rounded-lg cursor-pointer text-center transition-all ${
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
                              <div className="font-medium text-sm text-gray-900">{option.label}</div>
                              <div className="text-xs text-gray-600 mt-1">{option.desc}</div>
                            </label>
                          ))}
                        </div>
                      )}
                    />
                    {errors.bestContactTime && (
                      <p className="text-red-500 text-sm mt-1">{errors.bestContactTime.message}</p>
                    )}
                  </div>

                  {/* Terms and Privacy Agreement */}
                  <div className="space-y-3 pt-4 border-t border-gray-200">
                    <div className="flex items-start space-x-3">
                      <Controller
                        name="agreedToTerms"
                        control={control}
                        render={({ field }) => (
                          <Checkbox
                            checked={field.value}
                            onChange={field.onChange}
                            className="mt-1"
                          />
                        )}
                      />
                      <div className="text-sm">
                        <span className="text-gray-700">I agree to the </span>
                        <a href="/terms" target="_blank" className="text-teal-600 hover:text-teal-700 underline">
                          Terms and Conditions
                        </a>
                        <span className="text-red-500"> *</span>
                      </div>
                    </div>
                    {errors.agreedToTerms && (
                      <p className="text-red-500 text-sm">{errors.agreedToTerms.message}</p>
                    )}

                    <div className="flex items-start space-x-3">
                      <Controller
                        name="agreedToPrivacy"
                        control={control}
                        render={({ field }) => (
                          <Checkbox
                            checked={field.value}
                            onChange={field.onChange}
                            className="mt-1"
                          />
                        )}
                      />
                      <div className="text-sm">
                        <span className="text-gray-700">I agree to the </span>
                        <a href="/privacy" target="_blank" className="text-teal-600 hover:text-teal-700 underline">
                          Privacy Policy
                        </a>
                        <span className="text-red-500"> *</span>
                      </div>
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
        <div className="flex justify-between mt-8">
          <Button
            type="button"
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 1}
            className="px-6"
          >
            Previous
          </Button>

          {currentStep < steps.length ? (
            <Button
              type="button"
              onClick={nextStep}
              className="px-6 bg-teal-500 hover:bg-teal-600"
            >
              Next Step
            </Button>
          ) : (
            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => window.open(generateWhatsAppMessage(), '_blank')}
                className="px-6"
              >
                Contact via WhatsApp
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="px-6 bg-teal-500 hover:bg-teal-600"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Project Assessment'}
              </Button>
            </div>
          )}
        </div>
      </form>
    </div>
  );
}