/**
 * Utility functions for formatting data
 */

/**
 * Formats a number with thousands separators and decimal places
 * @param value - The number to format
 * @param decimals - Number of decimal places (default: 0)
 * @returns Formatted number string
 */
export const formatNumber = (value: number | string | undefined | null, decimals: number = 0): string => {
  if (value === undefined || value === null || value === '') {
    return '0';
  }

  const num = typeof value === 'string' ? parseFloat(value) : value;

  if (isNaN(num)) {
    return '0';
  }

  return num.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  });
};

/**
 * Formats currency in Indonesian Rupiah (IDR)
 * @param value - The number to format
 * @returns Formatted currency string
 */
export const formatCurrency = (value: number | string | undefined | null): string => {
  const formatted = formatNumber(value, 0);
  return `IDR ${formatted}`;
};

/**
 * Formats a date string to a readable format
 * @param dateString - ISO date string
 * @param options - Date formatting options
 * @returns Formatted date string
 */
export const formatDate = (
  dateString: string | undefined | null,
  options: Intl.DateTimeFormatOptions = {}
): string => {
  if (!dateString) {
    return 'N/A';
  }

  try {
    const date = new Date(dateString);
    const defaultOptions: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    };

    return date.toLocaleDateString('en-US', { ...defaultOptions, ...options });
  } catch (error) {
    return 'Invalid Date';
  }
};

/**
 * Formats a date string with time
 * @param dateString - ISO date string
 * @returns Formatted date-time string
 */
export const formatDateTime = (dateString: string | undefined | null): string => {
  return formatDate(dateString, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

/**
 * Formats file size in human-readable format
 * @param bytes - Size in bytes
 * @returns Formatted file size string
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * Truncates text to a specified length
 * @param text - Text to truncate
 * @param maxLength - Maximum length
 * @param suffix - Suffix to add when truncated (default: "...")
 * @returns Truncated text
 */
export const truncateText = (text: string | undefined | null, maxLength: number, suffix: string = '...'): string => {
  if (!text) {
    return '';
  }

  if (text.length <= maxLength) {
    return text;
  }

  return text.substring(0, maxLength - suffix.length) + suffix;
};

/**
 * Capitalizes the first letter of each word
 * @param text - Text to capitalize
 * @returns Capitalized text
 */
export const capitalizeWords = (text: string | undefined | null): string => {
  if (!text) {
    return '';
  }

  return text.replace(/\b\w/g, (char) => char.toUpperCase());
};

/**
 * Formats a status string to display format
 * @param status - Status string
 * @returns Formatted status string
 */
export const formatStatus = (status: string | undefined | null): string => {
  if (!status) {
    return 'Unknown';
  }

  return status.split('_').map(word => capitalizeWords(word)).join(' ');
};

/**
 * Formats GPS coordinates for display
 * @param coordinates - GPS coordinate string
 * @param maxLength - Maximum characters to display
 * @returns Formatted GPS string
 */
export const formatGPS = (coordinates: string | undefined | null, maxLength: number = 20): string => {
  if (!coordinates) {
    return 'N/A';
  }

  return truncateText(coordinates, maxLength);
};