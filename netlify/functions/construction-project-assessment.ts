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
    const projectData = JSON.parse(event.body || '{}');
    
    // Validate required fields for construction project assessment
    const requiredFields = [
      'projectType', 'projectLocation', 'projectSize', 'currentStatus', 
      'timeline', 'contactInfo', 'projectAddress', 'preferredContactMethod', 
      'bestContactTime'
    ];
    
    const missingFields = requiredFields.filter(field => !projectData[field]);
    
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

    // Generate project assessment ID
    const projectId = `PROJ-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    
    // Calculate estimated pricing based on project type and requirements
    const estimatedQuote = calculateProjectQuote(projectData);
    
    // Determine specialist assignment based on project type
    const assignedSpecialist = getSpecialistAssignment(projectData.projectType);
    
    // Create enhanced project assessment object
    const projectAssessment = {
      ...projectData,
      projectId,
      estimatedQuote,
      assignedSpecialist,
      priority: determinePriority(projectData),
      serviceType: 'construction-finishing',
      createdAt: new Date().toISOString(),
      status: 'assessment-pending',
      siteVisitScheduled: false,
      quoteSent: false,
    };

    // Send project notification to construction team
    await sendConstructionTeamNotification(projectAssessment);
    
    // Send confirmation email to customer
    await sendProjectConfirmation(projectAssessment);
    
    // Store project assessment
    await storeProjectAssessment(projectAssessment);

    // Generate WhatsApp links for customer and team
    const customerWhatsAppLink = generateCustomerWhatsAppLink(projectAssessment);
    const teamWhatsAppLink = generateTeamWhatsAppLink(projectAssessment);

    console.log('Construction project assessment processed:', { 
      projectId, 
      projectType: projectData.projectType,
      estimatedQuote 
    });

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        success: true,
        projectId,
        estimatedQuote,
        assignedSpecialist,
        priority: projectAssessment.priority,
        message: `Construction project assessment received! Our ${assignedSpecialist.specialization} specialist will contact you within ${getResponseTime(projectAssessment.priority)} for site visit and assessment.`,
        whatsappLink: customerWhatsAppLink,
        siteVisitInfo: {
          included: true,
          estimatedDuration: '45-60 minutes',
          whatToExpect: [
            'Detailed project scope assessment',
            'Material and labor cost breakdown',
            'Timeline and milestone planning',
            'Quality standards discussion',
            'Formal written quote within 24 hours'
          ]
        },
        nextSteps: [
          `${assignedSpecialist.name} will call within ${getResponseTime(projectAssessment.priority)}`,
          'Free on-site assessment will be scheduled',
          'Detailed written quote provided within 24 hours',
          'Project timeline and milestones discussed',
          'Contract and work commencement planning'
        ]
      }),
    };

  } catch (error) {
    console.error('Construction project assessment error:', error);
    
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ 
        error: 'Internal server error',
        message: 'Failed to process construction project assessment. Please call us directly at +971 55 241 8446.'
      }),
    };
  }
};

interface ProjectQuote {
  min: number;
  max: number;
  currency: 'AED';
  breakdown?: {
    materials: number;
    labor: number;
    additional: number;
  };
}

function calculateProjectQuote(projectData: any): ProjectQuote {
  const basePricing = {
    kitchen: { min: 2500, max: 8000 },
    bathroom: { min: 1800, max: 6000 },
    flooring: { min: 80, max: 200, unit: 'sqm' },
    woodwork: { min: 1200, max: 5000 },
    painting: { min: 25, max: 60, unit: 'sqm' },
    ac: { min: 800, max: 3000 },
    complete: { min: 8000, max: 25000 }
  };

  const projectType = projectData.projectType;
  const baseQuote = basePricing[projectType as keyof typeof basePricing] || basePricing.complete;
  
  // Adjust pricing based on project size and complexity
  let multiplier = 1;
  
  // Size-based adjustments
  if (projectData.projectSize?.includes('large') || projectData.projectSize?.includes('villa')) {
    multiplier *= 1.5;
  } else if (projectData.projectSize?.includes('small') || projectData.projectSize?.includes('studio')) {
    multiplier *= 0.8;
  }
  
  // Timeline urgency adjustments
  if (projectData.timeline?.includes('urgent') || projectData.timeline?.includes('immediate')) {
    multiplier *= 1.2;
  }
  
  // Multiple requirements complexity adjustment
  const requirementTypes = [
    projectData.kitchenRequirements,
    projectData.bathroomRequirements,
    projectData.flooringRequirements,
    projectData.woodworkRequirements,
    projectData.paintingRequirements,
    projectData.acRequirements
  ].filter(Boolean).length;
  
  if (requirementTypes > 2) {
    multiplier *= 1.3;
  }

  return {
    min: Math.round(baseQuote.min * multiplier),
    max: Math.round(baseQuote.max * multiplier),
    currency: 'AED'
  };
}

function getSpecialistAssignment(projectType: string) {
  const specialists = {
    kitchen: {
      name: 'Ahmed Al-Mansouri',
      phone: '+971 55 241 8447',
      specialization: 'Kitchen Installation Specialist',
      experience: '12+ years in kitchen finishing',
      expertise: ['Cabinet installation', 'Countertop fitting', 'Appliance connections', 'Custom storage solutions']
    },
    bathroom: {
      name: 'Omar Hassan',
      phone: '+971 55 241 8448',
      specialization: 'Bathroom Finishing Specialist', 
      experience: '10+ years in bathroom construction',
      expertise: ['Fixture installation', 'Tile & marble work', 'Plumbing connections', 'Waterproofing']
    },
    flooring: {
      name: 'Khalid Al-Zahra',
      phone: '+971 55 241 8449',
      specialization: 'Flooring & Tiling Specialist',
      experience: '15+ years in marble & tile installation',
      expertise: ['Marble installation', 'Granite fitting', 'Ceramic tiling', 'Floor polishing']
    },
    woodwork: {
      name: 'Saeed Al-Rashid',
      phone: '+971 55 241 8450',
      specialization: 'Woodwork & Carpentry Specialist',
      experience: '14+ years in custom carpentry',
      expertise: ['Built-in wardrobes', 'Custom cabinets', 'Door finishing', 'Wooden flooring']
    },
    painting: {
      name: 'Hassan Al-Maktoum',
      phone: '+971 55 241 8451',
      specialization: 'Painting & Finishing Specialist',
      experience: '11+ years in building painting',
      expertise: ['Interior painting', 'Exterior painting', 'Decorative finishes', 'Surface preparation']
    },
    ac: {
      name: 'Rashid Al-Nuaimi',
      phone: '+971 55 241 8452',
      specialization: 'AC Installation Specialist',
      experience: '13+ years in HVAC systems',
      expertise: ['Split AC installation', 'Central AC setup', 'Ductwork', 'System commissioning']
    },
    complete: {
      name: 'Mohammed Al-Falasi',
      phone: '+971 55 241 8446',
      specialization: 'Project Manager - Complete Finishing',
      experience: '18+ years in construction finishing',
      expertise: ['Project coordination', 'Multi-trade management', 'Quality control', 'Timeline management']
    }
  };

  return specialists[projectType as keyof typeof specialists] || specialists.complete;
}

function determinePriority(projectData: any): 'critical' | 'high' | 'normal' {
  // Critical priority for urgent timelines or large projects
  if (projectData.timeline?.includes('urgent') || 
      projectData.timeline?.includes('immediate') ||
      projectData.projectType === 'complete') {
    return 'critical';
  }
  
  // High priority for commercial projects or multiple requirements
  if (projectData.contactInfo?.company || 
      projectData.projectSize?.includes('building') ||
      projectData.projectSize?.includes('multiple')) {
    return 'high';
  }
  
  return 'normal';
}

function getResponseTime(priority: string): string {
  const responseTimes = {
    critical: '30 minutes',
    high: '1 hour', 
    normal: '2 hours'
  };
  
  return responseTimes[priority as keyof typeof responseTimes] || '2 hours';
}

async function sendConstructionTeamNotification(projectAssessment: any) {
  const transporter = nodemailer.createTransporter({
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

  const projectTypeEmoji = {
    'kitchen': '🍳',
    'bathroom': '🚿',
    'flooring': '🏗️',
    'woodwork': '🪵',
    'painting': '🎨',
    'ac': '❄️',
    'complete': '🏢'
  };

  const emailContent = `
    ${priorityEmoji[projectAssessment.priority]} ${projectAssessment.priority.toUpperCase()} PRIORITY - CONSTRUCTION PROJECT ASSESSMENT
    ${projectTypeEmoji[projectAssessment.projectType]} Project ID: ${projectAssessment.projectId}
    
    CLIENT INFORMATION:
    • Name: ${projectAssessment.contactInfo.name}
    • Phone: ${projectAssessment.contactInfo.phone}
    • Email: ${projectAssessment.contactInfo.email}
    • Company: ${projectAssessment.contactInfo.company || 'Individual Client'}
    • Preferred Contact: ${projectAssessment.preferredContactMethod}
    • Best Time: ${projectAssessment.bestContactTime}
    
    PROJECT DETAILS:
    • Type: ${projectAssessment.projectType.toUpperCase()} Finishing
    • Building: ${projectAssessment.projectLocation.buildingName}
    • Area: ${projectAssessment.projectLocation.area}
    • Unit: ${projectAssessment.projectLocation.unitNumber || 'Not specified'}
    • Size: ${projectAssessment.projectSize}
    • Current Status: ${projectAssessment.currentStatus}
    • Timeline: ${projectAssessment.timeline}
    
    PROJECT ADDRESS:
    • Building: ${projectAssessment.projectAddress.buildingName}
    • Area/District: ${projectAssessment.projectAddress.areaDistrict}
    • Unit: ${projectAssessment.projectAddress.unitNumber || 'Not specified'}
    
    ESTIMATED QUOTE: AED ${projectAssessment.estimatedQuote.min.toLocaleString()} - ${projectAssessment.estimatedQuote.max.toLocaleString()}
    
    ASSIGNED SPECIALIST: ${projectAssessment.assignedSpecialist.name}
    • Specialization: ${projectAssessment.assignedSpecialist.specialization}
    • Phone: ${projectAssessment.assignedSpecialist.phone}
    • Experience: ${projectAssessment.assignedSpecialist.experience}
    
    REQUIREMENTS SUMMARY:
    ${formatRequirements(projectAssessment)}
    
    ${projectAssessment.additionalDetails ? `ADDITIONAL DETAILS:\n${projectAssessment.additionalDetails}\n` : ''}
    
    IMMEDIATE ACTIONS REQUIRED:
    1. ${projectAssessment.assignedSpecialist.name} to call client within ${getResponseTime(projectAssessment.priority)}
    2. Schedule on-site assessment within 24 hours
    3. Prepare detailed written quote within 24 hours of site visit
    4. Update project status in system
    5. Send quote and timeline to client
    
    CLIENT WHATSAPP: https://wa.me/${projectAssessment.contactInfo.phone.replace(/[^0-9]/g, '')}
    TEAM WHATSAPP: ${generateTeamWhatsAppLink(projectAssessment)}
    
    Response Required: ${getResponseTime(projectAssessment.priority)}
    Priority Level: ${projectAssessment.priority.toUpperCase()}
  `;

  await transporter.sendMail({
    from: process.env.FROM_EMAIL || 'projects@servdubai.ae',
    to: process.env.CONSTRUCTION_TEAM_EMAIL || 'construction@servdubai.ae',
    cc: [
      projectAssessment.assignedSpecialist.email || `${projectAssessment.assignedSpecialist.name.toLowerCase().replace(/\s+/g, '.')}@servdubai.ae`,
      process.env.PROJECT_MANAGER_EMAIL || 'projects@servdubai.ae'
    ],
    subject: `${priorityEmoji[projectAssessment.priority]} ${projectAssessment.priority.toUpperCase()}: ${projectAssessment.projectType} Project - ${projectAssessment.projectId}`,
    text: emailContent,
    html: emailContent.replace(/\n/g, '<br>').replace(/•/g, '&bull;'),
  });
}

async function sendProjectConfirmation(projectAssessment: any) {
  const transporter = nodemailer.createTransporter({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const projectTypeNames = {
    kitchen: 'Kitchen Installation & Setup',
    bathroom: 'Bathroom Finishing Work',
    flooring: 'Flooring & Tiling',
    woodwork: 'Custom Woodwork & Carpentry',
    painting: 'Painting & Finishing',
    ac: 'AC Installation & Setup',
    complete: 'Complete Building Finishing'
  };

  const emailContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #0D9488; margin-bottom: 10px;">Construction Project Assessment Received!</h1>
        <p style="color: #6b7280; font-size: 16px;">Thank you for choosing ServDubai for your construction finishing needs</p>
      </div>
      
      <div style="background-color: #f0f9ff; padding: 20px; border-radius: 8px; border-left: 4px solid #0D9488; margin-bottom: 25px;">
        <h3 style="color: #0D9488; margin-top: 0;">Project Assessment Details</h3>
        <p><strong>Project ID:</strong> ${projectAssessment.projectId}</p>
        <p><strong>Project Type:</strong> ${projectTypeNames[projectAssessment.projectType as keyof typeof projectTypeNames]}</p>
        <p><strong>Estimated Quote:</strong> AED ${projectAssessment.estimatedQuote.min.toLocaleString()} - ${projectAssessment.estimatedQuote.max.toLocaleString()}</p>
        <p><strong>Assigned Specialist:</strong> ${projectAssessment.assignedSpecialist.name}</p>
        <p><strong>Expected Response:</strong> ${getResponseTime(projectAssessment.priority)}</p>
      </div>
      
      <div style="background-color: #ecfdf5; padding: 20px; border-radius: 8px; border: 1px solid #10b981; margin-bottom: 25px;">
        <h4 style="color: #059669; margin-top: 0;">🏗️ Your Assigned Construction Specialist</h4>
        <p style="margin-bottom: 10px;"><strong>${projectAssessment.assignedSpecialist.name}</strong></p>
        <p style="margin-bottom: 10px;"><strong>Specialization:</strong> ${projectAssessment.assignedSpecialist.specialization}</p>
        <p style="margin-bottom: 10px;"><strong>Experience:</strong> ${projectAssessment.assignedSpecialist.experience}</p>
        <p style="margin-bottom: 10px;"><strong>Direct Phone:</strong> ${projectAssessment.assignedSpecialist.phone}</p>
        <p style="margin-bottom: 0;"><strong>Expertise:</strong> ${projectAssessment.assignedSpecialist.expertise.join(', ')}</p>
      </div>
      
      <div style="margin-bottom: 25px;">
        <h3 style="color: #374151;">What Happens Next?</h3>
        <ol style="color: #6b7280; line-height: 1.6;">
          <li><strong>${projectAssessment.assignedSpecialist.name}</strong> will call you within <strong>${getResponseTime(projectAssessment.priority)}</strong></li>
          <li><strong>Free on-site assessment</strong> will be scheduled at your convenience</li>
          <li><strong>Detailed written quote</strong> provided within 24 hours of site visit</li>
          <li><strong>Project timeline and milestones</strong> discussion</li>
          <li><strong>Contract and work commencement</strong> planning</li>
        </ol>
      </div>
      
      <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; margin-bottom: 25px;">
        <h4 style="color: #374151; margin-top: 0;">📋 Site Visit Information</h4>
        <p style="margin-bottom: 10px;"><strong>Duration:</strong> 45-60 minutes</p>
        <p style="margin-bottom: 15px;"><strong>What to Expect:</strong></p>
        <ul style="color: #6b7280; margin-bottom: 0;">
          <li>Detailed project scope assessment</li>
          <li>Material and labor cost breakdown</li>
          <li>Timeline and milestone planning</li>
          <li>Quality standards discussion</li>
          <li>Formal written quote within 24 hours</li>
        </ul>
      </div>
      
      <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; margin-bottom: 25px;">
        <h4 style="color: #374151; margin-top: 0;">Need Immediate Assistance?</h4>
        <p style="margin-bottom: 10px;"><strong>📞 Main Office:</strong> +971 55 241 8446</p>
        <p style="margin-bottom: 10px;"><strong>📞 Your Specialist:</strong> ${projectAssessment.assignedSpecialist.phone}</p>
        <p style="margin-bottom: 10px;"><strong>💬 WhatsApp:</strong> <a href="${generateCustomerWhatsAppLink(projectAssessment)}" style="color: #0D9488;">Click to chat about your project</a></p>
        <p style="margin-bottom: 0;"><strong>📧 Email:</strong> projects@servdubai.ae</p>
      </div>
      
      <div style="background-color: #ecfdf5; padding: 20px; border-radius: 8px; border: 1px solid #10b981; margin-bottom: 25px;">
        <h4 style="color: #059669; margin-top: 0;">🎯 Why Choose ServDubai for Construction Finishing?</h4>
        <ul style="color: #047857; margin-bottom: 0;">
          <li><strong>20+ Skilled Specialists</strong> - Expert teams for each trade</li>
          <li><strong>500+ Buildings Completed</strong> - Proven track record in Dubai</li>
          <li><strong>Licensed & Insured</strong> - Full compliance and protection</li>
          <li><strong>Quality Guarantee</strong> - 6-month warranty on all work</li>
          <li><strong>Flexible Scheduling</strong> - Work around your construction timeline</li>
        </ul>
      </div>
      
      <div style="text-align: center; padding-top: 30px; border-top: 1px solid #e5e7eb; color: #6b7280;">
        <p style="margin-bottom: 10px;">Follow us for construction tips and project updates:</p>
        <p>🌐 www.servdubai.ae | 📱 @ServDubaiConstruction</p>
        <p style="font-size: 14px; margin-top: 20px;">
          This is an automated confirmation. For immediate assistance, please call ${projectAssessment.assignedSpecialist.phone}
        </p>
      </div>
    </div>
  `;

  await transporter.sendMail({
    from: process.env.FROM_EMAIL || 'projects@servdubai.ae',
    to: projectAssessment.contactInfo.email,
    subject: `Construction Project Assessment Confirmed - ${projectAssessment.projectId} | ServDubai`,
    html: emailContent,
  });
}

async function storeProjectAssessment(projectAssessment: any) {
  console.log('Storing construction project assessment:', projectAssessment);
  
  // In production, this would connect to your database
  // Example with Airtable or similar database:
  /*
  const Airtable = require('airtable');
  const base = new Airtable({apiKey: process.env.AIRTABLE_API_KEY}).base(process.env.AIRTABLE_BASE_ID);
  
  await base('Construction Projects').create({
    'Project ID': projectAssessment.projectId,
    'Client Name': projectAssessment.contactInfo.name,
    'Phone': projectAssessment.contactInfo.phone,
    'Email': projectAssessment.contactInfo.email,
    'Company': projectAssessment.contactInfo.company,
    'Project Type': projectAssessment.projectType,
    'Building Name': projectAssessment.projectLocation.buildingName,
    'Area': projectAssessment.projectLocation.area,
    'Project Size': projectAssessment.projectSize,
    'Timeline': projectAssessment.timeline,
    'Estimated Min': projectAssessment.estimatedQuote.min,
    'Estimated Max': projectAssessment.estimatedQuote.max,
    'Assigned Specialist': projectAssessment.assignedSpecialist.name,
    'Priority': projectAssessment.priority,
    'Status': 'assessment-pending',
    'Created': projectAssessment.createdAt,
    'Preferred Contact': projectAssessment.preferredContactMethod,
    'Best Contact Time': projectAssessment.bestContactTime
  });
  */
}

function formatRequirements(projectAssessment: any): string {
  let requirements = '';
  
  if (projectAssessment.kitchenRequirements) {
    requirements += 'KITCHEN REQUIREMENTS:\n';
    Object.entries(projectAssessment.kitchenRequirements).forEach(([key, value]) => {
      if (value) {
        requirements += `• ${key.replace(/([A-Z])/g, ' $1').toLowerCase()}\n`;
      }
    });
    requirements += '\n';
  }
  
  if (projectAssessment.bathroomRequirements) {
    requirements += 'BATHROOM REQUIREMENTS:\n';
    Object.entries(projectAssessment.bathroomRequirements).forEach(([key, value]) => {
      if (value) {
        requirements += `• ${key.replace(/([A-Z])/g, ' $1').toLowerCase()}\n`;
      }
    });
    requirements += '\n';
  }
  
  if (projectAssessment.flooringRequirements) {
    requirements += 'FLOORING REQUIREMENTS:\n';
    Object.entries(projectAssessment.flooringRequirements).forEach(([key, value]) => {
      if (value) {
        requirements += `• ${key.replace(/([A-Z])/g, ' $1').toLowerCase()}\n`;
      }
    });
    requirements += '\n';
  }
  
  if (projectAssessment.woodworkRequirements) {
    requirements += 'WOODWORK REQUIREMENTS:\n';
    Object.entries(projectAssessment.woodworkRequirements).forEach(([key, value]) => {
      if (value) {
        requirements += `• ${key.replace(/([A-Z])/g, ' $1').toLowerCase()}\n`;
      }
    });
    requirements += '\n';
  }
  
  if (projectAssessment.paintingRequirements) {
    requirements += 'PAINTING REQUIREMENTS:\n';
    Object.entries(projectAssessment.paintingRequirements).forEach(([key, value]) => {
      if (value) {
        requirements += `• ${key.replace(/([A-Z])/g, ' $1').toLowerCase()}\n`;
      }
    });
    requirements += '\n';
  }
  
  if (projectAssessment.acRequirements) {
    requirements += 'AC REQUIREMENTS:\n';
    Object.entries(projectAssessment.acRequirements).forEach(([key, value]) => {
      if (value) {
        requirements += `• ${key.replace(/([A-Z])/g, ' $1').toLowerCase()}\n`;
      }
    });
    requirements += '\n';
  }
  
  return requirements || 'No specific requirements specified';
}

function generateCustomerWhatsAppLink(projectAssessment: any): string {
  const message = `Hi ServDubai! 

I submitted a construction project assessment:

🏗️ Project ID: ${projectAssessment.projectId}
📋 Project Type: ${projectAssessment.projectType}
🏢 Building: ${projectAssessment.projectLocation.buildingName}, ${projectAssessment.projectLocation.area}
👤 Contact: ${projectAssessment.contactInfo.name}
📞 Phone: ${projectAssessment.contactInfo.phone}

My assigned specialist is ${projectAssessment.assignedSpecialist.name} (${projectAssessment.assignedSpecialist.phone}).

Looking forward to the site visit and detailed quote!

Best regards,
${projectAssessment.contactInfo.name}`;

  const phoneNumber = '971552418446'; // Main ServDubai WhatsApp Business number
  return `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
}

function generateTeamWhatsAppLink(projectAssessment: any): string {
  const message = `🚨 NEW CONSTRUCTION PROJECT ASSESSMENT

📋 Project ID: ${projectAssessment.projectId}
🏗️ Type: ${projectAssessment.projectType.toUpperCase()}
👤 Client: ${projectAssessment.contactInfo.name}
📞 Phone: ${projectAssessment.contactInfo.phone}
🏢 Building: ${projectAssessment.projectLocation.buildingName}, ${projectAssessment.projectLocation.area}
💰 Estimate: AED ${projectAssessment.estimatedQuote.min.toLocaleString()} - ${projectAssessment.estimatedQuote.max.toLocaleString()}
⚡ Priority: ${projectAssessment.priority.toUpperCase()}

👨‍🔧 Assigned: ${projectAssessment.assignedSpecialist.name}
📞 Specialist Phone: ${projectAssessment.assignedSpecialist.phone}

⏰ Action: Call client within ${getResponseTime(projectAssessment.priority)}
📅 Schedule site visit within 24 hours
📋 Provide written quote within 24 hours of visit`;

  const teamNumber = '971552418447'; // Construction team WhatsApp number
  return `https://wa.me/${teamNumber}?text=${encodeURIComponent(message)}`;
}

export { handler };