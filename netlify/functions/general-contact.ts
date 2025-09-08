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
    const contactData = JSON.parse(event.body || '{}');
    
    // Validate required fields
    const requiredFields = ['firstName', 'lastName', 'phone', 'email', 'inquiryType', 'message'];
    const missingFields = requiredFields.filter(field => !contactData[field]);
    
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

    // Generate inquiry ID
    const inquiryId = `INQ-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    
    // Determine routing based on inquiry type
    const routingInfo = getRoutingInfo(contactData.inquiryType);
    
    // Create inquiry object
    const inquiry = {
      ...contactData,
      inquiryId,
      createdAt: new Date().toISOString(),
      status: 'new',
      assignedTo: routingInfo.assignedTo,
      priority: routingInfo.priority,
      estimatedResponse: routingInfo.estimatedResponse,
    };

    // Route to appropriate team member
    await routeInquiry(inquiry, routingInfo);
    
    // Send confirmation email to customer
    await sendCustomerAcknowledgment(inquiry);
    
    // Store inquiry
    await storeInquiry(inquiry);

    console.log('General inquiry processed:', { inquiryId, type: contactData.inquiryType });

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        success: true,
        inquiryId,
        estimatedResponse: routingInfo.estimatedResponse,
        assignedTeam: routingInfo.teamName,
        message: `Thank you for contacting ServDubai! Your inquiry has been received and assigned to our ${routingInfo.teamName}. ${routingInfo.message}`,
        whatsappLink: generateInquiryWhatsAppLink(inquiry),
        nextSteps: routingInfo.nextSteps
      }),
    };

  } catch (error) {
    console.error('General contact error:', error);
    
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ 
        error: 'Internal server error',
        message: 'Failed to process your inquiry. Please call us directly at +971 50 123 4567.'
      }),
    };
  }
};

function getRoutingInfo(inquiryType: string) {
  const routingMap = {
    'new-resident': {
      assignedTo: 'new-residents@servdubai.ae',
      teamName: 'New Resident Specialists',
      priority: 'high',
      estimatedResponse: '1 hour',
      message: 'Our new resident specialists will contact you within 1 hour with a free consultation.',
      nextSteps: [
        'Free property assessment call within 1 hour',
        'Customized service package recommendation',
        'Special new resident discount application',
        'Priority booking for your convenience'
      ]
    },
    'amc-inquiry': {
      assignedTo: 'amc@servdubai.ae',
      teamName: 'AMC Specialists',
      priority: 'high',
      estimatedResponse: '2 hours',
      message: 'Our AMC specialists will contact you within 2 hours with detailed package information.',
      nextSteps: [
        'Detailed AMC package consultation',
        'Property assessment for optimal package selection',
        'Custom quote with potential savings analysis',
        'Flexible contract terms discussion'
      ]
    },
    'emergency': {
      assignedTo: 'emergency@servdubai.ae',
      teamName: 'Emergency Response Team',
      priority: 'critical',
      estimatedResponse: '30 minutes',
      message: 'Our emergency team will call you within 30 minutes.',
      nextSteps: [
        'Immediate phone consultation within 30 minutes',
        'Emergency service dispatch if required',
        'Same-day resolution for critical issues',
        'Follow-up to ensure problem is resolved'
      ]
    },
    'pricing': {
      assignedTo: 'quotes@servdubai.ae',
      teamName: 'Pricing Specialists',
      priority: 'normal',
      estimatedResponse: '4 hours',
      message: 'Our pricing team will send you a detailed quote within 4 hours.',
      nextSteps: [
        'Detailed service assessment',
        'Transparent pricing breakdown',
        'Multiple package options',
        'Flexible payment terms'
      ]
    },
    'complaint': {
      assignedTo: 'support@servdubai.ae',
      teamName: 'Customer Support Team',
      priority: 'high',
      estimatedResponse: '1 hour',
      message: 'Our customer support manager will personally address your concern within 1 hour.',
      nextSteps: [
        'Personal call from customer support manager',
        'Thorough investigation of your concern',
        'Resolution plan within 24 hours',
        'Follow-up to ensure satisfaction'
      ]
    },
    'feedback': {
      assignedTo: 'feedback@servdubai.ae',
      teamName: 'Quality Assurance Team',
      priority: 'normal',
      estimatedResponse: '24 hours',
      message: 'Thank you for your feedback! Our quality team will review and respond within 24 hours.',
      nextSteps: [
        'Feedback review by quality assurance team',
        'Process improvement implementation if applicable',
        'Personal response within 24 hours',
        'Invitation to participate in future service improvements'
      ]
    },
    'general': {
      assignedTo: 'info@servdubai.ae',
      teamName: 'Customer Service Team',
      priority: 'normal',
      estimatedResponse: '4 hours',
      message: 'Our customer service team will respond to your inquiry within 4 hours.',
      nextSteps: [
        'Comprehensive response to your questions',
        'Additional information packets if requested',
        'Service recommendations based on your needs',
        'Follow-up call if needed'
      ]
    }
  };

  return routingMap[inquiryType as keyof typeof routingMap] || routingMap.general;
}

async function routeInquiry(inquiry: any, routingInfo: any) {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const priorityEmoji = {
    'critical': '🚨',
    'high': '⚡',
    'normal': '📋'
  };

  const emailContent = `
    ${priorityEmoji[inquiry.priority as keyof typeof priorityEmoji]} ${inquiry.priority.toUpperCase()} PRIORITY INQUIRY - ${inquiry.inquiryId}
    
    Customer Details:
    • Name: ${inquiry.firstName} ${inquiry.lastName}
    • Phone: ${inquiry.phone}
    • Email: ${inquiry.email}
    • Preferred Contact: ${inquiry.preferredContact || 'Phone'}
    
    Inquiry Details:
    • Type: ${inquiry.inquiryType}
    • Subject: ${inquiry.subject || 'General Inquiry'}
    • Property: ${inquiry.buildingName ? `${inquiry.buildingName}, ${inquiry.area || 'Dubai'}` : 'Not specified'}
    
    Message:
    ${inquiry.message}
    
    ${inquiry.specificService ? `Specific Service Requested: ${inquiry.specificService}` : ''}
    ${inquiry.previousCustomer ? 'Previous Customer: Yes' : 'Previous Customer: No'}
    ${inquiry.marketingSource ? `How they heard about us: ${inquiry.marketingSource}` : ''}
    
    Response Required: ${routingInfo.estimatedResponse}
    Assigned Team: ${routingInfo.teamName}
    
    Action Items:
    ${routingInfo.nextSteps.map((step: string, index: number) => `${index + 1}. ${step}`).join('\n')}
    
    Customer WhatsApp: https://wa.me/${inquiry.phone.replace(/[^0-9]/g, '')}
  `;

  await transporter.sendMail({
    from: process.env.FROM_EMAIL || 'inquiries@servdubai.ae',
    to: routingInfo.assignedTo,
    cc: process.env.MANAGER_EMAIL || 'manager@servdubai.ae',
    subject: `${priorityEmoji[inquiry.priority as keyof typeof priorityEmoji]} ${inquiry.priority.toUpperCase()}: ${inquiry.inquiryType} - ${inquiry.inquiryId}`,
    text: emailContent,
    html: emailContent.replace(/\n/g, '<br>'),
  });
}

async function sendCustomerAcknowledgment(inquiry: any) {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const routingInfo = getRoutingInfo(inquiry.inquiryType);

  const emailContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #0D9488; margin-bottom: 10px;">Thank You for Contacting ServDubai!</h1>
        <p style="color: #6b7280; font-size: 16px;">Your inquiry has been received and is being processed</p>
      </div>
      
      <div style="background-color: #f0f9ff; padding: 20px; border-radius: 8px; border-left: 4px solid #0D9488; margin-bottom: 25px;">
        <h3 style="color: #0D9488; margin-top: 0;">Inquiry Details</h3>
        <p><strong>Inquiry ID:</strong> ${inquiry.inquiryId}</p>
        <p><strong>Type:</strong> ${inquiry.inquiryType}</p>
        <p><strong>Assigned to:</strong> ${routingInfo.teamName}</p>
        <p><strong>Expected Response:</strong> ${routingInfo.estimatedResponse}</p>
      </div>
      
      <div style="margin-bottom: 25px;">
        <h3 style="color: #374151;">What Happens Next?</h3>
        <ol style="color: #6b7280; line-height: 1.6;">
          ${routingInfo.nextSteps.map((step: string) => `<li>${step}</li>`).join('')}
        </ol>
      </div>
      
      <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; margin-bottom: 25px;">
        <h4 style="color: #374151; margin-top: 0;">Need Immediate Assistance?</h4>
        <p style="margin-bottom: 10px;"><strong>📞 Call:</strong> +971 50 123 4567</p>
        <p style="margin-bottom: 10px;"><strong>💬 WhatsApp:</strong> <a href="${generateInquiryWhatsAppLink(inquiry)}" style="color: #0D9488;">Click to chat</a></p>
        <p style="margin-bottom: 0;"><strong>📧 Email:</strong> ${routingInfo.assignedTo}</p>
      </div>
      
      ${inquiry.inquiryType === 'new-resident' ? `
        <div style="background-color: #ecfdf5; padding: 20px; border-radius: 8px; border: 1px solid #10b981; margin-bottom: 25px;">
          <h4 style="color: #059669; margin-top: 0;">🎉 New Resident Special Offers!</h4>
          <ul style="color: #047857; margin-bottom: 0;">
            <li><strong>FREE</strong> initial property inspection</li>
            <li><strong>20-30% OFF</strong> your first service</li>
            <li><strong>Priority scheduling</strong> for move-in timeline</li>
            <li><strong>Dedicated support</strong> for new residents</li>
          </ul>
        </div>
      ` : ''}
      
      <div style="text-align: center; padding-top: 30px; border-top: 1px solid #e5e7eb; color: #6b7280;">
        <p style="margin-bottom: 10px;">Follow us for tips and updates:</p>
        <p>🌐 www.servdubai.ae | 📱 @ServDubaiOfficial</p>
        <p style="font-size: 14px; margin-top: 20px;">
          This is an automated confirmation. Please do not reply to this email.
        </p>
      </div>
    </div>
  `;

  await transporter.sendMail({
    from: process.env.FROM_EMAIL || 'noreply@servdubai.ae',
    to: inquiry.email,
    subject: `Inquiry Received - ${inquiry.inquiryId} | ServDubai`,
    html: emailContent,
  });
}

async function storeInquiry(inquiry: any) {
  console.log('Storing general inquiry:', inquiry);
  
  // In production, this would connect to your database
  // Example with Airtable:
  /*
  const Airtable = require('airtable');
  const base = new Airtable({apiKey: process.env.AIRTABLE_API_KEY}).base(process.env.AIRTABLE_BASE_ID);
  
  await base('General Inquiries').create({
    'Inquiry ID': inquiry.inquiryId,
    'Customer Name': `${inquiry.firstName} ${inquiry.lastName}`,
    'Phone': inquiry.phone,
    'Email': inquiry.email,
    'Type': inquiry.inquiryType,
    'Message': inquiry.message,
    'Status': 'new',
    'Priority': inquiry.priority,
    'Assigned To': inquiry.assignedTo,
    'Created': inquiry.createdAt
  });
  */
}

function generateInquiryWhatsAppLink(inquiry: any): string {
  const message = `Hi ServDubai! 

I submitted an inquiry:
📋 Inquiry ID: ${inquiry.inquiryId}
📝 Type: ${inquiry.inquiryType}
👤 Name: ${inquiry.firstName} ${inquiry.lastName}

${inquiry.message}

Looking forward to your response!`;

  const phoneNumber = '971501234567'; // Replace with actual WhatsApp Business number
  return `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
}

export { handler };
