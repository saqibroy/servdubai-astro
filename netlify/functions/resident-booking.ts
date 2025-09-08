import type { Handler, HandlerEvent, HandlerResponse } from '@netlify/functions';
import nodemailer from 'nodemailer';

const handler: Handler = async (event: HandlerEvent): Promise<HandlerResponse> => {
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
    
    // Validate required fields for new resident booking
    const requiredFields = [
      'firstName', 'lastName', 'phone', 'email', 
      'newResidentPackage', 'moveInDate', 'buildingName', 
      'apartmentNumber', 'emirate', 'area'
    ];
    
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

    // Generate booking ID with priority prefix for new residents
    const bookingId = `NR-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    
    // Calculate pricing with new resident discounts
    const packagePricing = {
      'move-in-ready': 800,
      'first-month-free': 520, // 20% discount for new residents
      'new-building-special': 600, // 20% discount for new buildings
    };
    
    const basePrice = packagePricing[bookingData.newResidentPackage as keyof typeof packagePricing] || 800;
    const finalPrice = bookingData.isFirstTimeResident ? Math.round(basePrice * 0.7) : basePrice; // 30% off for first time

    // Create enhanced booking object
    const booking = {
      ...bookingData,
      bookingId,
      finalPrice,
      priority: 'high', // New residents get high priority
      serviceType: 'new-resident',
      createdAt: new Date().toISOString(),
      status: 'pending',
      inspectionBooked: false,
      assignedTeam: null,
    };

    // Send priority notification to team via email
    await sendTeamNotification(booking);
    
    // Send confirmation email to customer
    await sendCustomerConfirmation(booking);
    
    // Store in simple database (could be enhanced with Airtable)
    await storeBooking(booking);

    // Generate WhatsApp links
    const customerWhatsAppLink = generateCustomerWhatsAppLink(booking);
    const teamWhatsAppLink = generateTeamWhatsAppLink(booking);

    console.log('New resident booking processed:', { bookingId, finalPrice });

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        success: true,
        bookingId,
        finalPrice,
        originalPrice: basePrice,
        savings: basePrice - finalPrice,
        priority: 'high',
        message: 'New resident booking confirmed! Our team will contact you within 1 hour for priority scheduling.',
        whatsappLink: customerWhatsAppLink,
        estimatedResponse: '1 hour',
        freeInspection: true,
        benefits: [
          'Free initial property inspection',
          'Priority scheduling for new residents',
          '20-30% discount applied',
          'Dedicated move-in support team',
          '6-month warranty on all work'
        ]
      }),
    };

  } catch (error) {
    console.error('New resident booking error:', error);
    
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ 
        error: 'Internal server error',
        message: 'Failed to process new resident booking. Please call us directly at +971 50 123 4567.'
      }),
    };
  }
};

async function sendTeamNotification(booking: any) {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const emailContent = `
    🏠 PRIORITY: New Resident Booking - ${booking.bookingId}
    
    Customer Details:
    • Name: ${booking.firstName} ${booking.lastName}
    • Phone: ${booking.phone}
    • Email: ${booking.email}
    • Move-in Date: ${booking.moveInDate}
    
    Property Details:
    • Building: ${booking.buildingName}
    • Apartment: ${booking.apartmentNumber}
    • Area: ${booking.area}, ${booking.emirate}
    • Type: ${booking.apartmentType || 'Not specified'}
    
    Service Details:
    • Package: ${booking.newResidentPackage}
    • Price: AED ${booking.finalPrice}
    • Preferred Date: ${booking.preferredDate}
    • Preferred Time: ${booking.preferredTime}
    
    Special Notes:
    • Priority booking for new resident
    • Free initial inspection included
    • ${booking.specialRequests ? `Special requests: ${booking.specialRequests}` : ''}
    
    Action Required:
    1. Call customer within 1 hour
    2. Schedule free inspection
    3. Assign specialized new resident team
    4. Update booking status in system
    
    WhatsApp: ${generateTeamWhatsAppLink(booking)}
  `;

  await transporter.sendMail({
    from: process.env.FROM_EMAIL || 'bookings@servdubai.ae',
    to: process.env.TEAM_EMAIL || 'team@servdubai.ae',
    cc: process.env.MANAGER_EMAIL || 'manager@servdubai.ae',
    subject: `🚨 PRIORITY: New Resident Booking - ${booking.bookingId}`,
    text: emailContent,
    html: emailContent.replace(/\n/g, '<br>'),
  });
}

async function sendCustomerConfirmation(booking: any) {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const emailContent = `
    Dear ${booking.firstName},

    Welcome to Dubai! Your new resident booking has been confirmed.

    Booking Details:
    • Booking ID: ${booking.bookingId}
    • Service: ${booking.newResidentPackage} Package
    • Price: AED ${booking.finalPrice} ${booking.finalPrice < 800 ? '(New Resident Discount Applied!)' : ''}
    • Scheduled: ${booking.preferredDate} at ${booking.preferredTime}

    What's Included:
    ✅ Free comprehensive property inspection
    ✅ Priority service scheduling
    ✅ New resident discount (20-30% off)
    ✅ 6-month warranty on all work
    ✅ Dedicated move-in support team

    Next Steps:
    1. Our team will call you within 1 hour
    2. Free inspection will be scheduled at your convenience
    3. Service will be completed as per your preferred timing
    4. Follow-up support for any concerns

    Need immediate assistance?
    📞 Call: +971 50 123 4567
    💬 WhatsApp: ${generateCustomerWhatsAppLink(booking)}

    Welcome to the ServDubai family!

    Best regards,
    ServDubai Team
  `;

  await transporter.sendMail({
    from: process.env.FROM_EMAIL || 'welcome@servdubai.ae',
    to: booking.email,
    subject: `Welcome to Dubai! Your Booking Confirmed - ${booking.bookingId}`,
    text: emailContent,
    html: emailContent.replace(/\n/g, '<br>').replace(/•/g, '&bull;').replace(/✅/g, '✅'),
  });
}

async function storeBooking(booking: any) {
  // Simple storage - could be enhanced with Airtable or database
  console.log('Storing new resident booking:', booking);
  
  // In production, this would connect to your database
  // Example with Airtable:
  /*
  const Airtable = require('airtable');
  const base = new Airtable({apiKey: process.env.AIRTABLE_API_KEY}).base(process.env.AIRTABLE_BASE_ID);
  
  await base('New Resident Bookings').create({
    'Booking ID': booking.bookingId,
    'Customer Name': `${booking.firstName} ${booking.lastName}`,
    'Phone': booking.phone,
    'Email': booking.email,
    'Package': booking.newResidentPackage,
    'Move-in Date': booking.moveInDate,
    'Price': booking.finalPrice,
    'Status': 'pending',
    'Priority': 'high',
    'Created': booking.createdAt
  });
  */
}

function generateCustomerWhatsAppLink(booking: any): string {
  const message = `Hi ServDubai! 

I just submitted a new resident booking:
🏠 Booking ID: ${booking.bookingId}
📦 Package: ${booking.newResidentPackage}
📅 Move-in: ${booking.moveInDate}
💰 Price: AED ${booking.finalPrice}

Looking forward to your call within the hour!

Best regards,
${booking.firstName} ${booking.lastName}`;

  const phoneNumber = '971501234567'; // Replace with actual WhatsApp Business number
  return `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
}

function generateTeamWhatsAppLink(booking: any): string {
  const message = `🚨 NEW RESIDENT PRIORITY BOOKING

📋 ID: ${booking.bookingId}
👤 Customer: ${booking.firstName} ${booking.lastName}
📞 Phone: ${booking.phone}
🏠 Building: ${booking.buildingName}, ${booking.area}
📦 Package: ${booking.newResidentPackage}
💰 Price: AED ${booking.finalPrice}
📅 Move-in: ${booking.moveInDate}

⚡ Action: Call within 1 hour, schedule free inspection`;

  const teamNumber = '971501234568'; // Team WhatsApp number
  return `https://wa.me/${teamNumber}?text=${encodeURIComponent(message)}`;
}

export { handler };
