// Application constants

export const APP_NAME = 'Supplier Management System';
export const APP_VERSION = '1.0.0';

export const API_ENDPOINTS = {
  SUPPLIERS: '/api/suppliers',
  AUTH: '/api/auth',
  USERS: '/api/users',
} as const;

export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 100,
} as const;

export const VALIDATION = {
  MIN_PASSWORD_LENGTH: 8,
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
} as const;

export const ROLES = {
  ADMIN: 'admin',
  SUPPLIER: 'supplier',
  USER: 'user',
} as const;

export const REGISTRATION_STEPS = {
  BASIC_INFO: 1,
  CONTACT_INFO: 2,
  BUSINESS_DETAILS: 3,
  COMPLIANCE: 4,
  DOCUMENTS: 5,
} as const;