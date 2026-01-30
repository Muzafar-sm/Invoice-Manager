export type CurrencyCode = 'USD' | 'JPY' | 'AED' | 'INR';

const CURRENCY_LOCALES: Record<string, string> = {
  USD: 'en-US',
  JPY: 'ja-JP',
  AED: 'ar-AE',
  INR: 'en-IN',
};

export const formatCurrency = (amount: number, currency: string = 'USD'): string => {
  const code = ['USD', 'JPY', 'AED', 'INR'].includes(currency) ? currency : 'USD';
  const locale = CURRENCY_LOCALES[code] || 'en-US';
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: code,
    minimumFractionDigits: code === 'JPY' ? 0 : 2,
    maximumFractionDigits: code === 'JPY' ? 0 : 2,
  }).format(amount);
};

/** Format multiple amounts by currency for display (e.g. "$1,000 · ₹50,000") */
export const formatAmountsByCurrency = (
  amountsByCurrency: Record<string, number>,
  fallbackAmount?: number,
  fallbackCurrency?: string
): string => {
  const entries = Object.entries(amountsByCurrency || {}).filter(([, amt]) => amt > 0);
  if (entries.length === 0) {
    return fallbackAmount != null && fallbackAmount > 0
      ? formatCurrency(fallbackAmount, fallbackCurrency)
      : formatCurrency(0);
  }
  return entries.map(([curr, amt]) => formatCurrency(amt, curr)).join(' · ');
};
