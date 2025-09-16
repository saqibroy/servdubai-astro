// Helper to safely access import.meta.env with fallbacks
const getClientEnv = (key: string, fallback: string = ''): string => {
  return typeof import.meta !== 'undefined' && import.meta.env ? 
    (import.meta.env[key] || fallback) : 
    fallback;
};

// For client-side code (safe to expose)
export const clientEnv = {
  // Site Configuration
  SITE_URL: getClientEnv('SITE_URL'),
  PUBLIC_BASE_URL: getClientEnv('PUBLIC_BASE_URL'),

  // Feature Flags
  ENABLE_MAINTENANCE_MODE: getClientEnv('ENABLE_MAINTENANCE_MODE', 'false') === 'true',
  ENABLE_BOOKING_SYSTEM: getClientEnv('ENABLE_BOOKING_SYSTEM', 'true') === 'true',

  // Public API Keys
  GOOGLE_MAPS_API_KEY: getClientEnv('GOOGLE_MAPS_API_KEY'),
  WHATSAPP_BUSINESS_NUMBER: getClientEnv('WHATSAPP_BUSINESS_NUMBER'),
};

// For server-side code (Netlify functions - private)
export const serverEnv = {
  // SMTP Configuration
  SMTP_HOST: process.env.SMTP_HOST,
  SMTP_PORT: parseInt(process.env.SMTP_PORT || '587'),
  SMTP_USER: process.env.SMTP_USER,
  SMTP_PASS: process.env.SMTP_PASS,
  SMTP_FROM: process.env.SMTP_FROM,
  SMTP_TLS: process.env.SMTP_TLS === 'true',

  // Site Configuration
  SITE_URL: process.env.SITE_URL,
  PUBLIC_BASE_URL: process.env.PUBLIC_BASE_URL,

  // API Keys & Services
  GOOGLE_MAPS_API_KEY: process.env.GOOGLE_MAPS_API_KEY,
  WHATSAPP_BUSINESS_NUMBER: process.env.WHATSAPP_BUSINESS_NUMBER,

  // Notification Recipients
  NOTIFICATION_EMAIL: process.env.NOTIFICATION_EMAIL,
  ADMIN_EMAIL: process.env.ADMIN_EMAIL,

  // Feature Flags
  ENABLE_MAINTENANCE_MODE: process.env.ENABLE_MAINTENANCE_MODE === 'true',
  ENABLE_BOOKING_SYSTEM: process.env.ENABLE_BOOKING_SYSTEM === 'true',
};
