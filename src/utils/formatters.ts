/**
 * ==============================================================================
 * Centralized Formatting Utilities
 * Standardized functions to format currency, percentages, dates, and CNIC numbers.
 * ==============================================================================
 */

/**
 * Format a number as Pakistani Rupee (e.g. 1500000 -> "₨ 1,500,000" or "PKR 1,500,000")
 */
export function formatPKR(amount: number | string | undefined | null, includeSymbol: boolean = true): string {
  const num = typeof amount === 'string' ? parseFloat(amount) : (amount ?? 0);
  if (isNaN(num)) return includeSymbol ? '₨ 0' : '0';
  
  const formatted = new Intl.NumberFormat('en-PK', {
    maximumFractionDigits: 2,
    minimumFractionDigits: 0,
  }).format(num);

  return includeSymbol ? `₨ ${formatted}` : formatted;
}

/**
 * Format compact numbers for charts / mobile cards (e.g. 1,500,000 -> "1.5M")
 */
export function formatCompact(amount: number): string {
  if (Math.abs(amount) >= 1_000_000) {
    return `${(amount / 1_000_000).toFixed(2)}M`;
  }
  if (Math.abs(amount) >= 1_000) {
    return `${(amount / 1_000).toFixed(1)}k`;
  }
  return amount.toLocaleString();
}

/**
 * Format percentage with + / - indicator
 */
export function formatPercentage(val: number, withSign: boolean = true): string {
  const sign = withSign && val > 0 ? '+' : '';
  return `${sign}${val.toFixed(2)}%`;
}

/**
 * Format Pakistani CNIC with dashes (e.g. 4210112345671 -> "42101-1234567-1")
 */
export function formatCNIC(cnic: string): string {
  const clean = cnic.replace(/\D/g, '');
  if (clean.length === 13) {
    return `${clean.slice(0, 5)}-${clean.slice(5, 12)}-${clean.slice(12)}`;
  }
  return cnic;
}

/**
 * Safely format ISO date strings into clean human-readable dates
 */
export function formatDate(dateString?: string): string {
  if (!dateString) return new Date().toLocaleDateString('en-PK');
  const d = new Date(dateString);
  return isNaN(d.getTime()) ? dateString : d.toLocaleDateString('en-PK', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}
