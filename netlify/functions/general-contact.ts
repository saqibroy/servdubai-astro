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
    'project-inquiry': {
      assignedTo: 'projects@servdubai.ae',
      teamName: 'Construction Project Specialists',
      priority: 'high',
      estimatedResponse: '1 hour',
      message: 'Our construction project specialists will contact you within 1 hour for project consultation.',
      nextSteps: [
        'Free project consultation call within 1 hour',
        'Site visit scheduling for detailed assessment',
        'Customized construction finishing quote',
        'Project timeline and milestone planning'
      ]
    },
    'developer-inquiry': {
      assignedTo: 'developers@servdubai.ae',
      teamName: 'Developer Relations Team',
      priority: 'high',
      estimatedResponse: '30 minutes',
      message: 'Our developer relations team will contact you within 30 minutes for bulk project discussion.',
      nextSteps: [
        'Immediate consultation for bulk projects',
        'Multi-unit finishing package assessment',
        'Volume pricing and timeline discussion',
        'Dedicated project manager assignment'
      ]
    },
    'contractor-inquiry': {
      assignedTo: 'contractors@servdubai.ae',
      teamName: 'Contractor Partnership Team',
      priority: 'high',
      estimatedResponse: '1 hour',
      message: 'Our contractor partnership team will contact you within 1 hour for collaboration discussion.',
      nextSteps: [
        'Partnership opportunity assessment',
        'Subcontracting terms and pricing discussion',
        'Quality standards and timeline alignment',
        'Contract framework development'
      ]
    },
    'emergency': {
      assignedTo: 'emergency@servdubai.ae',
      teamName: 'Emergency Construction Support',
      priority: 'critical',
      estimatedResponse: '30 minutes',
      message: 'Our emergency construction team will call you within 30 minutes.',
      nextSteps: [
        'Immediate phone consultation within 30 minutes',
        'Emergency construction support dispatch',
        'Same-day resolution for critical construction issues',
        'Follow-up to ensure project continuity'
      ]
    },
    'pricing': {
      assignedTo: 'quotes@servdubai.ae',
      teamName: 'Construction Pricing Specialists',
      priority: 'normal',
      estimatedResponse: '2 hours',
      message: 'Our construction pricing team will send you a detailed quote within 2 hours.',
      nextSteps: [
        'Detailed construction project assessment',
        'Transparent material and labor cost breakdown',
        'Multiple finishing package options',
        'Flexible payment and timeline terms'
      ]
    },
    'complaint': {
      assignedTo: 'support@servdubai.ae',
      teamName: 'Project Support Team',
      priority: 'high',
      estimatedResponse: '1 hour',
      message: 'Our project support manager will personally address your concern within 1 hour.',
      nextSteps: [
        'Personal call from project support manager',
        'Thorough investigation of construction concern',
        'Resolution plan within 24 hours',
        'Quality assurance follow-up'
      ]
    },
    'feedback': {
      assignedTo: 'feedback@servdubai.ae',
      teamName: 'Construction Quality Team',
      priority: 'normal',
      estimatedResponse: '24 hours',
      message: 'Thank you for your feedback! Our construction quality team will review and respond within 24 hours.',
      nextSteps: [
        'Feedback review by construction quality team',
        'Process improvement implementation if applicable',
        'Personal response within 24 hours',
        'Invitation to participate in future project improvements'
      ]
    },
    'general': {
      assignedTo: 'info@servdubai.ae',
      teamName: 'Construction Information Team',
      priority: 'normal',
      estimatedResponse: '2 hours',
      message: 'Our construction information team will respond to your inquiry within 2 hours.',
      nextSteps: [
        'Comprehensive response about construction services',
        'Construction finishing information packets',
        'Service recommendations based on your project needs',
        'Follow-up consultation if needed'
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
    ${priorityEmoji[inquiry.priority as keyof typeof priorityEmoji]} ${inquiry.priority.toUpperCase()} PRIORITY CONSTRUCTION INQUIRY - ${inquiry.inquiryId}
    
    Client Details:
    • Name: ${inquiry.firstName} ${inquiry.lastName}
    • Phone: ${inquiry.phone}
    • Email: ${inquiry.email}
    • Company: ${inquiry.company || 'Individual Client'}
    • Preferred Contact: ${inquiry.preferredContact || 'Phone'}
    
    Construction Inquiry Details:
    • Type: ${inquiry.inquiryType}
    • Subject: ${inquiry.subject || 'Construction Finishing Inquiry'}
    • Project Location: ${inquiry.buildingName ? `${inquiry.buildingName}, ${inquiry.area || 'Dubai'}` : 'Not specified'}
    • Project Type: ${inquiry.projectType || 'Not specified'}
    
    Message:
    ${inquiry.message}
    
    ${inquiry.specificService ? `Specific Construction Service: ${inquiry.specificService}` : ''}
    ${inquiry.projectSize ? `Project Size: ${inquiry.projectSize}` : ''}
    ${inquiry.timeline ? `Project Timeline: ${inquiry.timeline}` : ''}
    ${inquiry.previousCustomer ? 'Previous Customer: Yes' : 'Previous Customer: No'}
    ${inquiry.marketingSource ? `How they heard about us: ${inquiry.marketingSource}` : ''}
    
    Response Required: ${routingInfo.estimatedResponse}
    Assigned Team: ${routingInfo.teamName}
    
    Action Items:
    ${routingInfo.nextSteps.map((step: string, index: number) => `${index + 1}. ${step}`).join('\n')}
    
    Client WhatsApp: https://wa.me/${inquiry.phone.replace(/[^0-9]/g, '')}
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
        <p style="color: #6b7280; font-size: 16px;">Your construction finishing inquiry has been received and is being processed</p>
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
        <p style="margin-bottom: 10px;"><strong>📞 Main Office:</strong> +971 55 241 8446</p>
        <p style="margin-bottom: 10px;"><strong>💬 WhatsApp:</strong> <a href="${generateInquiryWhatsAppLink(inquiry)}" style="color: #0D9488;">Click to chat about your project</a></p>
        <p style="margin-bottom: 0;"><strong>📧 Email:</strong> ${routingInfo.assignedTo}</p>
      </div>
      
      ${inquiry.inquiryType === 'project-inquiry' || inquiry.inquiryType === 'developer-inquiry' ? `
        <div style="background-color: #ecfdf5; padding: 20px; border-radius: 8px; border: 1px solid #10b981; margin-bottom: 25px;">
          <h4 style="color: #059669; margin-top: 0;">🏗️ Construction Finishing Benefits!</h4>
          <ul style="color: #047857; margin-bottom: 0;">
            <li><strong>FREE</strong> on-site project assessment</li>
            <li><strong>20+ Skilled Specialists</strong> for all construction trades</li>
            <li><strong>Bulk pricing</strong> for multiple units or large projects</li>
            <li><strong>Flexible scheduling</strong> to match construction timelines</li>
            <li><strong>Quality guarantee</strong> with 6-month warranty</li>
          </ul>
        </div>
      ` : ''}
      
      <div style="background-color: #f0f9ff; padding: 20px; border-radius: 8px; margin-bottom: 25px;">
        <h4 style="color: #0D9488; margin-top: 0;">🎯 Our Construction Finishing Services</h4>
        <ul style="color: #374151; margin-bottom: 0;">
          <li><strong>Kitchen Installation & Setup</strong> - Complete kitchen finishing from AED 2,500</li>
          <li><strong>Bathroom Finishing Work</strong> - Professional bathroom completion from AED 1,800</li>
          <li><strong>Flooring & Tiling</strong> - Marble, granite, and tile installation from AED 80/sqm</li>
          <li><strong>Custom Woodwork</strong> - Built-in wardrobes and carpentry from AED 1,200</li>
          <li><strong>Painting & Finishing</strong> - Interior and exterior painting from AED 25/sqm</li>
          <li><strong>AC Installation</strong> - Professional AC setup from AED 800</li>
        </ul>
      </div>
      
      <div style="text-align: center; padding-top: 30px; border-top: 1px solid #e5e7eb; color: #6b7280;">
        <p style="margin-bottom: 10px;">Follow us for construction tips and project updates:</p>
        <p>🌐 www.servdubai.ae | 📱 @ServDubaiConstruction</p>
        <p style="font-size: 14px; margin-top: 20px;">
          This is an automated confirmation. For immediate project assistance, please call +971 55 241 8446
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

I submitted a construction finishing inquiry:
📋 Inquiry ID: ${inquiry.inquiryId}
📝 Type: ${inquiry.inquiryType}
👤 Name: ${inquiry.firstName} ${inquiry.lastName}
🏢 Company: ${inquiry.company || 'Individual Client'}
🏗️ Project: ${inquiry.projectType || 'Construction finishing'}

${inquiry.message}

Looking forward to discussing my construction project!`;

  const phoneNumber = '971552418446'; // ServDubai Construction WhatsApp Business number
  return `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
}

export { handler };
