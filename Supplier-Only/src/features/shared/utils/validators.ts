// Validation utilities and functions

export const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const phoneRegex = /^\+?[\d\s\-\(\)]+$/;
export const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export const validateEmail = (email: string): ValidationResult => {
  const errors: string[] = [];

  if (!email) {
    errors.push('Email is required');
  } else if (!emailRegex.test(email)) {
    errors.push('Please enter a valid email address');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

export const validatePassword = (password: string): ValidationResult => {
  const errors: string[] = [];

  if (!password) {
    errors.push('Password is required');
  } else {
    if (password.length < 8) {
      errors.push('Password must be at least 8 characters long');
    }
    if (!passwordRegex.test(password)) {
      errors.push('Password must contain at least one uppercase letter, one lowercase letter, and one number');
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

export const validatePhone = (phone: string): ValidationResult => {
  const errors: string[] = [];

  if (!phone) {
    errors.push('Phone number is required');
  } else if (!phoneRegex.test(phone)) {
    errors.push('Please enter a valid phone number');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

export const validateRequired = (value: string, fieldName: string): ValidationResult => {
  const errors: string[] = [];

  if (!value || value.trim() === '') {
    errors.push(`${fieldName} is required`);
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

export const validateUrl = (url: string): ValidationResult => {
  const errors: string[] = [];

  if (url && !url.startsWith('http')) {
    errors.push('Please enter a valid URL starting with http:// or https://');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};