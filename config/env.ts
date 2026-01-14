// ============================================
// PlayNxt - Environment Configuration
// ============================================
// Centralized environment configuration with type safety
// and validation for production readiness.

/**
 * Environment types supported by the application
 */
export type Environment = 'development' | 'qa' | 'staging' | 'production';

/**
 * Type-safe environment configuration interface
 */
interface EnvironmentConfig {
  // Core
  ENV: Environment;
  APP_NAME: string;
  APP_VERSION: string;
  IS_PRODUCTION: boolean;
  IS_DEVELOPMENT: boolean;

  // API
  API_URL: string;
  API_TIMEOUT: number;

  // Feature Flags
  ENABLE_ANALYTICS: boolean;
  ENABLE_CRASH_REPORTING: boolean;
  ENABLE_PUSH_NOTIFICATIONS: boolean;
  ENABLE_MOCK_DATA: boolean;

  // Third-Party
  GOOGLE_MAPS_API_KEY: string;
  PAYMENT_GATEWAY_KEY: string;
  SENTRY_DSN: string;

  // App Settings
  DEFAULT_CURRENCY: string;
  DEFAULT_LOCALE: string;
  SUPPORT_EMAIL: string;
}

/**
 * Helper to safely get environment variables with defaults
 */
const getEnvVar = (key: string, defaultValue: string = ''): string => {
  return process.env[key] ?? defaultValue;
};

/**
 * Helper to parse boolean environment variables
 */
const getEnvBool = (key: string, defaultValue: boolean = false): boolean => {
  const value = process.env[key];
  if (value === undefined) return defaultValue;
  return value === 'true' || value === '1';
};

/**
 * Helper to parse numeric environment variables
 */
const getEnvNumber = (key: string, defaultValue: number): number => {
  const value = process.env[key];
  if (value === undefined) return defaultValue;
  const parsed = Number.parseInt(value, 10);
  return Number.isNaN(parsed) ? defaultValue : parsed;
};

/**
 * Current environment name
 */
const currentEnv = getEnvVar('EXPO_PUBLIC_ENV', 'development') as Environment;

/**
 * Centralized environment configuration
 * Access this throughout the app for environment-specific values
 */
export const ENV: EnvironmentConfig = {
  // Core
  ENV: currentEnv,
  APP_NAME: getEnvVar('EXPO_PUBLIC_APP_NAME', 'PlayNxt'),
  APP_VERSION: getEnvVar('EXPO_PUBLIC_APP_VERSION', '1.0.0'),
  IS_PRODUCTION: currentEnv === 'production',
  IS_DEVELOPMENT: currentEnv === 'development',

  // API
  API_URL: getEnvVar('EXPO_PUBLIC_API_URL', 'http://localhost:3000/api'),
  API_TIMEOUT: getEnvNumber('EXPO_PUBLIC_API_TIMEOUT', 30000),

  // Feature Flags
  ENABLE_ANALYTICS: getEnvBool('EXPO_PUBLIC_ENABLE_ANALYTICS', false),
  ENABLE_CRASH_REPORTING: getEnvBool('EXPO_PUBLIC_ENABLE_CRASH_REPORTING', false),
  ENABLE_PUSH_NOTIFICATIONS: getEnvBool('EXPO_PUBLIC_ENABLE_PUSH_NOTIFICATIONS', false),
  ENABLE_MOCK_DATA: getEnvBool('EXPO_PUBLIC_ENABLE_MOCK_DATA', true),

  // Third-Party
  GOOGLE_MAPS_API_KEY: getEnvVar('EXPO_PUBLIC_GOOGLE_MAPS_API_KEY', ''),
  PAYMENT_GATEWAY_KEY: getEnvVar('EXPO_PUBLIC_PAYMENT_GATEWAY_KEY', ''),
  SENTRY_DSN: getEnvVar('EXPO_PUBLIC_SENTRY_DSN', ''),

  // App Settings
  DEFAULT_CURRENCY: getEnvVar('EXPO_PUBLIC_DEFAULT_CURRENCY', 'INR'),
  DEFAULT_LOCALE: getEnvVar('EXPO_PUBLIC_DEFAULT_LOCALE', 'en-IN'),
  SUPPORT_EMAIL: getEnvVar('EXPO_PUBLIC_SUPPORT_EMAIL', 'support@playnxt.com'),
} as const;

/**
 * Validate critical environment variables
 * Call this on app startup to catch misconfigurations early
 */
export const validateEnv = (): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];

  // In production, ensure we're not using mock data
  if (ENV.IS_PRODUCTION && ENV.ENABLE_MOCK_DATA) {
    errors.push('Mock data should be disabled in production');
  }

  // In production, ensure API URL is set correctly
  if (ENV.IS_PRODUCTION && ENV.API_URL.includes('localhost')) {
    errors.push('API URL should not point to localhost in production');
  }

  // In production, ensure error tracking is enabled
  if (ENV.IS_PRODUCTION && !ENV.ENABLE_CRASH_REPORTING) {
    errors.push('Crash reporting should be enabled in production');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
};

/**
 * Log environment info (only in development)
 */
export const logEnvInfo = (): void => {
  if (!ENV.IS_DEVELOPMENT) return;

  console.log('🔧 Environment Configuration:');
  console.log(`   Environment: ${ENV.ENV}`);
  console.log(`   API URL: ${ENV.API_URL}`);
  console.log(`   Mock Data: ${ENV.ENABLE_MOCK_DATA}`);
  console.log(`   Analytics: ${ENV.ENABLE_ANALYTICS}`);
};

