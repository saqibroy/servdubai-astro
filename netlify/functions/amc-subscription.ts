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
    const subscriptionData = JSON.parse(event.body || '{}');
    
    // Validate required fields for AMC subscription
    const requiredFields = [
      'firstName', 'lastName', 'phone', 'email', 
      'amcPackage', 'contractStartDate', 'buildingName', 
      'apartmentNumber', 'emirate', 'area', 'paymentMethod'
    ];
    
    const missingFields = requiredFields.filter(field => !subscriptionData[field]);
    
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

    // Generate contract ID
    const contractId = `AMC-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    
    // Calculate pricing and payment schedule for construction maintenance contracts
    const packagePricing = {
      'basic': { annual: 3600, quarterly: 900, monthly: 320 },
      'premium': { annual: 7200, quarterly: 1800, monthly: 650 },
      'enterprise': { annual: 12000, quarterly: 3000, monthly: 1100 },
    };
    
    const pricing = packagePricing[subscriptionData.amcPackage as keyof typeof packagePricing];
    const paymentSchedule = calculatePaymentSchedule(pricing, subscriptionData.contractStartDate);

    // Create enhanced subscription object
    const subscription = {
      ...subscriptionData,
      contractId,
      pricing,
      paymentSchedule,
      serviceType: 'amc',
      createdAt: new Date().toISOString(),
      status: 'pending_contract',
      nextPaymentDue: paymentSchedule[0]?.dueDate,
      contractDuration: '12 months',
      autoRenewal: subscriptionData.autoRenewal || false,
    };

    // Send contract documents and welcome email
    await sendContractDocuments(subscription);
    
    // Send team notification
    await sendAMCTeamNotification(subscription);
    
    // Store in database
    await storeAMCSubscription(subscription);

    // Set up recurring service reminders
    await scheduleServiceReminders(subscription);

    console.log('AMC subscription processed:', { contractId, package: subscriptionData.amcPackage });

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        success: true,
        contractId,
        pricing,
        paymentSchedule,
        message: 'Construction Maintenance Contract confirmed! Contract documents have been sent to your email.',
        whatsappLink: generateAMCWhatsAppLink(subscription),
        benefits: [
          'Annual construction maintenance contract activated',
          'Quarterly payment schedule set up',
          'Priority construction support privileges',
          'Dedicated construction project manager assigned',
          '24/7 emergency construction response (Premium+ packages)',
          'Detailed maintenance and inspection reports',
          'Exclusive member discounts on additional construction services'
        ],
        nextSteps: [
          'Review and sign the contract documents',
          'First payment due within 7 days',
          'Service team will contact you within 24 hours',
          'First maintenance visit will be scheduled'
        ]
      }),
    };

  } catch (error) {
    console.error('AMC subscription error:', error);
    
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ 
        error: 'Internal server error',
        message: 'Failed to process AMC subscription. Please call us at +971 50 123 4567.'
      }),
    };
  }
};

function calculatePaymentSchedule(pricing: any, startDate: string) {
  const schedule = [];
  const start = new Date(startDate);
  
  // Calculate quarterly payments
  for (let i = 0; i < 4; i++) {
    const dueDate = new Date(start);
    dueDate.setMonth(start.getMonth() + (i * 3));
    
    schedule.push({
      quarter: i + 1,
      amount: pricing.quarterly,
      dueDate: dueDate.toISOString().split('T')[0],
      status: i === 0 ? 'due' : 'pending',
      description: `Q${i + 1} AMC Payment`
    });
  }
  
  return schedule;
}

async function sendContractDocuments(subscription: any) {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const contractContent = generateContractContent(subscription);

  await transporter.sendMail({
    from: process.env.FROM_EMAIL || 'contracts@servdubai.ae',
    to: subscription.email,
    cc: process.env.CONTRACTS_EMAIL || 'contracts@servdubai.ae',
    subject: `AMC Contract Documents - ${subscription.contractId}`,
    html: contractContent,
    attachments: [
      {
        filename: `AMC_Contract_${subscription.contractId}.pdf`,
        content: generateContractPDF(subscription), // This would generate actual PDF
        contentType: 'application/pdf'
      }
    ]
  });
}

async function sendAMCTeamNotification(subscription: any) {
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
    🏗️ NEW CONSTRUCTION MAINTENANCE CONTRACT - ${subscription.contractId}
    
    Client Details:
    • Name: ${subscription.firstName} ${subscription.lastName}
    • Phone: ${subscription.phone}
    • Email: ${subscription.email}
    • Company: ${subscription.company || 'Individual Client'}
    
    Property Details:
    • Building: ${subscription.buildingName}
    • Unit/Floor: ${subscription.apartmentNumber}
    • Area: ${subscription.area}, ${subscription.emirate}
    • Building Type: ${subscription.buildingType || 'Not specified'}
    • Project Size: ${subscription.projectSize || 'Not specified'}
    
    Contract Details:
    • Package: ${subscription.amcPackage.toUpperCase()} Construction Maintenance
    • Annual Value: AED ${subscription.pricing.annual}
    • Quarterly Payment: AED ${subscription.pricing.quarterly}
    • Start Date: ${subscription.contractStartDate}
    • Payment Method: ${subscription.paymentMethod}
    
    Action Required:
    1. Assign dedicated construction project manager
    2. Contact client within 24 hours
    3. Schedule initial construction assessment
    4. Send construction maintenance welcome package
    5. Set up project portal access
    
    Payment Schedule: ${subscription.paymentSchedule.map((p: any) => 
      `Q${p.quarter}: AED ${p.amount} due ${p.dueDate}`
    ).join(' | ')}
  `;

  await transporter.sendMail({
    from: process.env.FROM_EMAIL || 'amc@servdubai.ae',
    to: process.env.AMC_TEAM_EMAIL || 'amc-team@servdubai.ae',
    cc: process.env.MANAGER_EMAIL || 'manager@servdubai.ae',
    subject: `🏆 New AMC Subscription - ${subscription.amcPackage.toUpperCase()} - ${subscription.contractId}`,
    text: emailContent,
    html: emailContent.replace(/\n/g, '<br>'),
  });
}

async function storeAMCSubscription(subscription: any) {
  console.log('Storing AMC subscription:', subscription);
  
  // In production, this would connect to your database
  // Example with Airtable:
  /*
  const Airtable = require('airtable');
  const base = new Airtable({apiKey: process.env.AIRTABLE_API_KEY}).base(process.env.AIRTABLE_BASE_ID);
  
  await base('AMC Subscriptions').create({
    'Contract ID': subscription.contractId,
    'Customer Name': `${subscription.firstName} ${subscription.lastName}`,
    'Phone': subscription.phone,
    'Email': subscription.email,
    'Package': subscription.amcPackage,
    'Annual Value': subscription.pricing.annual,
    'Start Date': subscription.contractStartDate,
    'Status': 'pending_contract',
    'Next Payment': subscription.nextPaymentDue,
    'Created': subscription.createdAt
  });
  */
}

async function scheduleServiceReminders(subscription: any) {
  // This would set up cron jobs or use a task scheduler
  console.log('Setting up service reminders for:', subscription.contractId);
  
  // Example implementation would:
  // 1. Schedule quarterly maintenance reminders
  // 2. Set up payment due notifications
  // 3. Schedule contract renewal reminders
  // 4. Set up customer satisfaction surveys
}

function generateContractContent(subscription: any): string {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px;">
      <h1 style="color: #0D9488;">Construction Maintenance Contract</h1>
      <h2>Contract ID: ${subscription.contractId}</h2>
      
      <h3>Client Information</h3>
      <p><strong>Name:</strong> ${subscription.firstName} ${subscription.lastName}</p>
      <p><strong>Company:</strong> ${subscription.company || 'Individual Client'}</p>
      <p><strong>Property:</strong> ${subscription.buildingName}, Unit ${subscription.apartmentNumber}</p>
      <p><strong>Location:</strong> ${subscription.area}, ${subscription.emirate}</p>
      
      <h3>Service Package: ${subscription.amcPackage.toUpperCase()} Construction Maintenance</h3>
      <p><strong>Contract Value:</strong> AED ${subscription.pricing.annual} per year</p>
      <p><strong>Payment Terms:</strong> Quarterly - AED ${subscription.pricing.quarterly}</p>
      <p><strong>Contract Period:</strong> 12 months from ${subscription.contractStartDate}</p>
      
      <h3>Services Included</h3>
      <ul>
        ${getServicesList(subscription.amcPackage)}
      </ul>
      
      <h3>Payment Schedule</h3>
      <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
        <thead>
          <tr style="background-color: #f3f4f6;">
            <th style="border: 1px solid #ddd; padding: 12px; text-align: left;">Quarter</th>
            <th style="border: 1px solid #ddd; padding: 12px; text-align: left;">Amount</th>
            <th style="border: 1px solid #ddd; padding: 12px; text-align: left;">Due Date</th>
          </tr>
        </thead>
        <tbody>
          ${subscription.paymentSchedule.map((payment: any) => `
            <tr>
              <td style="border: 1px solid #ddd; padding: 12px;">Q${payment.quarter}</td>
              <td style="border: 1px solid #ddd; padding: 12px;">AED ${payment.amount}</td>
              <td style="border: 1px solid #ddd; padding: 12px;">${payment.dueDate}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
      
      <h3>Terms and Conditions</h3>
      <ol>
        <li>This contract is valid for 12 months from the start date.</li>
        <li>Payments are due quarterly as per the schedule above.</li>
        <li>Services include regular maintenance and emergency response as per package.</li>
        <li>Additional services may be charged separately.</li>
        <li>Contract can be cancelled with 30 days notice.</li>
        <li>All work is guaranteed for 6 months.</li>
      </ol>
      
      <div style="margin-top: 40px; padding: 20px; background-color: #f9fafb; border-radius: 8px;">
        <h4>Next Steps:</h4>
        <ol>
          <li>Review this contract carefully</li>
          <li>Reply to this email with your acceptance</li>
          <li>First payment due within 7 days</li>
          <li>Our team will contact you within 24 hours</li>
        </ol>
      </div>
      
      <div style="margin-top: 20px; text-align: center; color: #6b7280;">
        <p>Thank you for choosing ServDubai!</p>
        <p>📞 +971 50 123 4567 | 📧 amc@servdubai.ae</p>
      </div>
    </div>
  `;
}

function getServicesList(packageType: string): string {
  const services = {
    basic: [
      '4 scheduled construction maintenance inspections',
      'Emergency construction support (2 visits/year)',
      'Basic finishing touch-ups and repairs',
      'Phone support during business hours',
      '48-hour response time for non-critical issues'
    ],
    premium: [
      '6 comprehensive construction maintenance visits',
      'Unlimited emergency construction support',
      'Priority 24/7 construction hotline',
      'Same-day emergency response',
      'Quarterly painting and finishing touch-ups',
      'Detailed construction maintenance reports',
      'Preventive maintenance scheduling'
    ],
    enterprise: [
      '12 scheduled construction maintenance visits',
      'Unlimited emergency construction support',
      '24/7 dedicated construction project manager',
      'Same-day emergency response guarantee',
      'Monthly finishing work inspections',
      'Comprehensive construction maintenance reports',
      'Preventive maintenance and upgrade planning',
      'Priority access to construction specialists'
    ]
  };

  return services[packageType as keyof typeof services]?.map(service => `<li>${service}</li>`).join('') || '';
}

function generateContractPDF(subscription: any): Buffer {
  // This would generate actual PDF using a library like puppeteer or pdfkit
  // For now, returning empty buffer
  return Buffer.from('PDF content would be generated here');
}

function generateAMCWhatsAppLink(subscription: any): string {
  const message = `Hi ServDubai! 

I just signed up for a Construction Maintenance Contract:
🏗️ Contract ID: ${subscription.contractId}
📦 Package: ${subscription.amcPackage.toUpperCase()} Construction Maintenance
💰 Annual Value: AED ${subscription.pricing.annual}
📅 Start Date: ${subscription.contractStartDate}

Looking forward to excellent construction maintenance service!

Best regards,
${subscription.firstName} ${subscription.lastName}`;

  const phoneNumber = '971501234567'; // Replace with actual WhatsApp Business number
  return `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
}

export { handler };
