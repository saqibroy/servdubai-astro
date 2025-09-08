import type { Handler, HandlerEvent } from '@netlify/functions';

const handler: Handler = async (event: HandlerEvent) => {
  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
      },
      body: '',
    };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    const bookingData = JSON.parse(event.body || '{}');
    
    // Validate required fields
    const requiredFields = ['firstName', 'lastName', 'phone', 'email', 'serviceType'];
    const missingFields = requiredFields.filter(field => !bookingData[field]);
    
    if (missingFields.length > 0) {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({ 
          error: 'Missing required fields', 
          fields: missingFields 
        }),
      };
    }

    // Generate booking ID
    const bookingId = `SERV-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    
    // Calculate service price
    const price = calculatePrice(bookingData);
    
    // Here you would typically:
    // 1. Save to database
    // 2. Send confirmation email
    // 3. Send WhatsApp notification
    // 4. Create calendar event
    
    console.log('Booking received:', { bookingId, ...bookingData, price });

    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Send success response
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        success: true,
        bookingId,
        price,
        message: 'Booking submitted successfully. We will contact you within 2 hours.',
        whatsappLink: generateWhatsAppLink(bookingData, bookingId, price),
      }),
    };

  } catch (error) {
    console.error('Booking submission error:', error);
    
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ 
        error: 'Internal server error',
        message: 'Failed to process booking. Please try again.'
      }),
    };
  }
};

interface BookingData {
  serviceType: 'new-resident' | 'amc' | 'individual' | 'emergency';
  newResidentPackage?: 'move-in-ready' | 'first-month-free' | 'new-building-special';
  amcPackage?: 'basic' | 'premium' | 'family';
  individualService?: 'plumbing' | 'ac' | 'painting' | 'electrical' | 'general';
  urgencyLevel?: 'emergency' | 'urgent' | 'normal' | 'scheduled';
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  preferredDate: string;
  preferredTime: string;
}

function calculatePrice(bookingData: BookingData): number {
  const servicePricing = {
    'new-resident': {
      'move-in-ready': 800,
      'first-month-free': 650,
      'new-building-special': 750,
    },
    'amc': {
      'basic': 1200,
      'premium': 2500,
      'family': 1800,
    },
    'individual': {
      'plumbing': 150,
      'ac': 200,
      'painting': 180,
      'electrical': 120,
      'general': 100,
    },
    'emergency': {
      'surcharge': 100,
    },
  } as const;

  let basePrice = 0;
  const { serviceType, newResidentPackage, amcPackage, individualService, urgencyLevel } = bookingData;

  switch (serviceType) {
    case 'new-resident':
      if (newResidentPackage && newResidentPackage in servicePricing['new-resident']) {
        basePrice = servicePricing['new-resident'][newResidentPackage];
      }
      break;
    case 'amc':
      if (amcPackage && amcPackage in servicePricing['amc']) {
        basePrice = servicePricing['amc'][amcPackage];
      }
      break;
    case 'individual':
    case 'emergency':
      if (individualService && individualService in servicePricing['individual']) {
        basePrice = servicePricing['individual'][individualService];
      }
      break;
  }

  // Add emergency surcharge
  if (urgencyLevel === 'emergency' || serviceType === 'emergency') {
    basePrice += servicePricing['emergency']['surcharge'];
  }

  return basePrice;
}

function generateWhatsAppLink(bookingData: BookingData, bookingId: string, price: number): string {
  const { firstName, lastName, serviceType, preferredDate, preferredTime } = bookingData;
  
  const message = `Hi ServDubai! 

New booking request received:
📋 Booking ID: ${bookingId}
👤 Customer: ${firstName} ${lastName}
🔧 Service: ${serviceType}
📅 Date: ${preferredDate}
⏰ Time: ${preferredTime}
💰 Price: AED ${price}

Please confirm this booking. Thank you!`;

  const phoneNumber = '971501234567'; // Replace with actual WhatsApp Business number
  return `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
}

export { handler };
