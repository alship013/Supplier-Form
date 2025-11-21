// Environment configuration utilities for VSTS

export const config = {
  // API Configuration
  api: {
    url: import.meta.env.VITE_API_URL || 'http://localhost:5000',
    timeout: parseInt(import.meta.env.VITE_API_TIMEOUT) || 10000,
  },

  // Supabase Configuration
  supabase: {
    url: import.meta.env.VITE_SUPABASE_URL || '',
    anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || '',
  },

  // Application Configuration
  app: {
    name: import.meta.env.VITE_APP_NAME || 'VSTS',
    version: import.meta.env.VITE_APP_VERSION || '1.0.0',
    description: import.meta.env.VITE_APP_DESCRIPTION || 'Visitor and Staff Tracking System',
  },

  // Feature Flags
  features: {
    emergencyMode: import.meta.env.VITE_ENABLE_EMERGENCY_MODE === 'true',
    kioskMode: import.meta.env.VITE_ENABLE_KIOSK_MODE === 'true',
    pushNotifications: import.meta.env.VITE_ENABLE_PUSH_NOTIFICATIONS === 'true',
  },

  // Development/Debug Configuration
  debug: {
    enabled: import.meta.env.VITE_DEBUG_MODE === 'true',
    logLevel: import.meta.env.VITE_LOG_LEVEL || 'error',
  },

  // Build Configuration
  build: {
    sentryDsn: import.meta.env.VITE_SENTRY_DSN || '',
    googleAnalyticsId: import.meta.env.VITE_GOOGLE_ANALYTICS_ID || '',
  },

  // Kiosk Configuration
  kiosk: {
    autoLogoutTimeout: parseInt(import.meta.env.VITE_KIOSK_AUTO_LOGOUT_TIMEOUT) || 300000,
    idleTimeout: parseInt(import.meta.env.VITE_KIOSK_IDLE_TIMEOUT) || 60000,
  },
}

// Environment validation
export const validateConfig = () => {
  const errors: string[] = []

  if (!config.supabase.url) {
    errors.push('VITE_SUPABASE_URL is required')
  }

  if (!config.supabase.anonKey) {
    errors.push('VITE_SUPABASE_ANON_KEY is required')
  }

  if (errors.length > 0) {
    console.error('Configuration validation failed:', errors)
    throw new Error(`Missing required environment variables: ${errors.join(', ')}`)
  }

  return true
}

// Development-only logging
export const log = {
  debug: (...args: any[]) => {
    if (config.debug.enabled && config.debug.logLevel === 'debug') {
      console.debug('[VSTS Debug]', ...args)
    }
  },
  info: (...args: any[]) => {
    if (config.debug.enabled && ['debug', 'info'].includes(config.debug.logLevel)) {
      console.info('[VSTS Info]', ...args)
    }
  },
  warn: (...args: any[]) => {
    if (config.debug.enabled && ['debug', 'info', 'warn'].includes(config.debug.logLevel)) {
      console.warn('[VSTS Warning]', ...args)
    }
  },
  error: (...args: any[]) => {
    console.error('[VSTS Error]', ...args)
  },
}