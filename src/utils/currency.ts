/**
 * Currency formatting utilities for SpendWise
 * Supports multiple currencies with proper locale formatting
 */

// Demo mode uses KES exclusively
export const DEMO_CURRENCY = 'KES';
export const DEMO_CURRENCY_SYMBOL = 'KSh';
export const DEMO_LOCALE = 'en-KE';

interface CurrencyConfig {
  symbol: string;
  locale: string;
  decimalPlaces: number;
}

const CURRENCY_CONFIGS: Record<string, CurrencyConfig> = {
  'KES': {
    symbol: 'KSh',
    locale: 'en-KE',
    decimalPlaces: 2,
  },
  'USD': {
    symbol: '$',
    locale: 'en-US',
    decimalPlaces: 2,
  },
  'EUR': {
    symbol: '€',
    locale: 'en-IE',
    decimalPlaces: 2,
  },
  'GBP': {
    symbol: '£',
    locale: 'en-GB',
    decimalPlaces: 2,
  },
  'NGN': {
    symbol: '₦',
    locale: 'en-NG',
    decimalPlaces: 2,
  },
  'ZAR': {
    symbol: 'R',
    locale: 'en-ZA',
    decimalPlaces: 2,
  },
};

/**
 * Format amount as currency with proper locale formatting
 * @param amount - Amount to format
 * @param currency - Currency code (e.g., 'KES', 'USD')
 * @param isDemo - Whether this is demo mode (affects display)
 * @returns Formatted currency string (e.g., 'KSh 2,500.00')
 */
export function formatCurrency(
  amount: number | string,
  currency: string = DEMO_CURRENCY,
  isDemo: boolean = false
): string {
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;

  if (isNaN(numAmount)) {
    return `${currency} 0.00`;
  }

  const config = CURRENCY_CONFIGS[currency] || CURRENCY_CONFIGS[DEMO_CURRENCY];

  // Format number with proper locale
  const formatted = new Intl.NumberFormat(config.locale, {
    minimumFractionDigits: config.decimalPlaces,
    maximumFractionDigits: config.decimalPlaces,
  }).format(numAmount);

  return `${config.symbol} ${formatted}`;
}

/**
 * Format amount for KES specifically (demo uses this)
 * @param amount - Amount to format
 * @returns Formatted KES string (e.g., 'KSh 2,500.00')
 */
export function formatKES(amount: number | string): string {
  return formatCurrency(amount, DEMO_CURRENCY);
}

/**
 * Format large amounts with K/M suffix (e.g., '50K', '1.2M')
 * @param amount - Amount to format
 * @param currency - Currency code
 * @returns Formatted string with suffix (e.g., 'KSh 50K')
 */
export function formatCompactCurrency(amount: number | string, currency: string = DEMO_CURRENCY): string {
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;

  if (isNaN(numAmount)) {
    return `${currency} 0`;
  }

  const config = CURRENCY_CONFIGS[currency] || CURRENCY_CONFIGS[DEMO_CURRENCY];
  let displayAmount: string;

  if (numAmount >= 1_000_000) {
    displayAmount = (numAmount / 1_000_000).toFixed(1) + 'M';
  } else if (numAmount >= 1_000) {
    displayAmount = (numAmount / 1_000).toFixed(0) + 'K';
  } else {
    displayAmount = numAmount.toFixed(0);
  }

  return `${config.symbol} ${displayAmount}`;
}

/**
 * Get currency symbol for a given currency code
 * @param currency - Currency code
 * @returns Currency symbol
 */
export function getCurrencySymbol(currency: string): string {
  const config = CURRENCY_CONFIGS[currency] || CURRENCY_CONFIGS[DEMO_CURRENCY];
  return config.symbol;
}

/**
 * Get locale for a given currency code
 * @param currency - Currency code
 * @returns Locale string
 */
export function getCurrencyLocale(currency: string): string {
  const config = CURRENCY_CONFIGS[currency] || CURRENCY_CONFIGS[DEMO_CURRENCY];
  return config.locale;
}

/**
 * Parse formatted currency back to number
 * @param formatted - Formatted currency string (e.g., 'KSh 2,500.00')
 * @returns Number value
 */
export function parseCurrency(formatted: string): number {
  // Remove currency symbol and whitespace, then parse
  const numStr = formatted.replace(/[^\d.-]/g, '');
  return parseFloat(numStr) || 0;
}

/**
 * Format currency for display in tables/lists
 * Uses compact format for large numbers
 * @param amount - Amount to format
 * @param currency - Currency code
 * @param compact - Use compact format
 * @returns Formatted currency string
 */
export function displayCurrency(
  amount: number | string,
  currency: string = DEMO_CURRENCY,
  compact: boolean = false
): string {
  return compact ? formatCompactCurrency(amount, currency) : formatCurrency(amount, currency);
}
