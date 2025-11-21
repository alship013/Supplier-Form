/// <reference types="vite/client" />

interface ImportMetaEnv {
  // API Configuration
  readonly VITE_API_URL: string
  readonly VITE_API_TIMEOUT: string

  // Supabase Configuration
  readonly VITE_SUPABASE_URL: string
  readonly VITE_SUPABASE_ANON_KEY: string

  // Application Configuration
  readonly VITE_APP_NAME: string
  readonly VITE_APP_VERSION: string
  readonly VITE_APP_DESCRIPTION: string

  // Feature Flags
  readonly VITE_ENABLE_EMERGENCY_MODE: string
  readonly VITE_ENABLE_KIOSK_MODE: string
  readonly VITE_ENABLE_PUSH_NOTIFICATIONS: string

  // Development/Debug Configuration
  readonly VITE_DEBUG_MODE: string
  readonly VITE_LOG_LEVEL: string

  // Build Configuration
  readonly VITE_SENTRY_DSN: string
  readonly VITE_GOOGLE_ANALYTICS_ID: string

  // Kiosk Configuration
  readonly VITE_KIOSK_AUTO_LOGOUT_TIMEOUT: string
  readonly VITE_KIOSK_IDLE_TIMEOUT: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}