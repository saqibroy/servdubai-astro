/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

interface ImportMetaEnv {
  // SMTP Configuration
  readonly SMTP_HOST: string;
  readonly SMTP_PORT: string;
  readonly SMTP_USER: string;
  readonly SMTP_PASS: string;
  readonly SMTP_FROM: string;
  readonly SMTP_TLS: string;

  // Site Configuration
  readonly SITE_URL: string;
  readonly PUBLIC_BASE_URL: string;

  // API Keys & Services
  readonly GOOGLE_MAPS_API_KEY: string;
  readonly WHATSAPP_BUSINESS_NUMBER: string;

  // Notification Recipients
  readonly NOTIFICATION_EMAIL: string;
  readonly ADMIN_EMAIL: string;

  // Feature Flags
  readonly ENABLE_MAINTENANCE_MODE: string;
  readonly ENABLE_BOOKING_SYSTEM: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}