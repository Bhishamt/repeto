/**
 * Utility functions for domain calculations, currency, and points formatting.
 */

export function calculatePoints(
  billAmount: number,
  spendPerPoint: number = 100,
  pointsPerUnit: number = 10
): number {
  if (!billAmount || billAmount <= 0) return 0;
  return Math.floor(billAmount / spendPerPoint) * pointsPerUnit;
}

export function canRedeemReward(
  customerPoints: number,
  rewardCost: number
): boolean {
  if (customerPoints < 0 || rewardCost < 0) return false;
  return customerPoints >= rewardCost;
}

export function formatCurrency(
  amount: number,
  currencySymbol: string = '₹'
): string {
  if (isNaN(amount)) return `${currencySymbol}0`;
  return `${currencySymbol}${amount.toLocaleString('en-IN')}`;
}

export function formatPoints(points: number): string {
  if (isNaN(points) || points <= 0) return '0 pts';
  return `${points.toLocaleString('en-IN')} pts`;
}

export function formatTimestamp(isoString: string): string {
  if (!isoString) return 'N/A';
  const date = new Date(isoString);
  if (isNaN(date.getTime())) return 'Invalid Date';
  return date.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function truncateText(text: string, maxLength: number = 30): string {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength).trim()}...`;
}

export function getRelativeTimeString(daysAgo: number): string {
  if (daysAgo === 0) return 'Today';
  if (daysAgo === 1) return 'Yesterday';
  if (daysAgo < 30) return `${daysAgo} days ago`;
  const months = Math.floor(daysAgo / 30);
  return `${months} month${months > 1 ? 's' : ''} ago`;
}

export function isValidEmail(email: string): boolean {
  if (!email || typeof email !== 'string') return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
}

export function isValidPhone(phone: string): boolean {
  if (!phone || typeof phone !== 'string') return false;
  const cleaned = phone.trim();
  const digitsOnly = cleaned.replace(/\D/g, '');
  if (digitsOnly.length < 7 || digitsOnly.length > 15) return false;
  const phoneRegex = /^\+?[0-9\s\-()]+$/;
  return phoneRegex.test(cleaned);
}



