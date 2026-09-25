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
