import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculatePoints,
  canRedeemReward,
  formatCurrency,
  formatPoints,
  formatTimestamp,
  truncateText,
  getRelativeTimeString,
  isValidEmail,
  isValidPhone,
} from '../src/utils/formatters.ts';

test('calculatePoints correctly calculates points earned', () => {
  assert.equal(calculatePoints(500, 100, 10), 50);
  assert.equal(calculatePoints(99, 100, 10), 0);
  assert.equal(calculatePoints(1000, 100, 10), 100);
  assert.equal(calculatePoints(0, 100, 10), 0);
  assert.equal(calculatePoints(-50, 100, 10), 0);
});

test('canRedeemReward validates eligibility', () => {
  assert.equal(canRedeemReward(150, 100), true);
  assert.equal(canRedeemReward(50, 100), false);
  assert.equal(canRedeemReward(100, 100), true);
  assert.equal(canRedeemReward(-10, 50), false);
});

test('formatCurrency formats Indian currency correctly', () => {
  assert.equal(formatCurrency(500), '₹500');
  assert.equal(formatCurrency(1500), '₹1,500');
  assert.equal(formatCurrency(0), '₹0');
});

test('formatPoints formats points badge text', () => {
  assert.equal(formatPoints(1200), '1,200 pts');
  assert.equal(formatPoints(0), '0 pts');
  assert.equal(formatPoints(-5), '0 pts');
});

test('formatTimestamp formats ISO strings safely', () => {
  assert.ok(formatTimestamp('2026-09-25T12:00:00Z').includes('2026'));
  assert.equal(formatTimestamp('invalid-date'), 'Invalid Date');
  assert.equal(formatTimestamp(''), 'N/A');
});

test('truncateText truncates text over maxLength', () => {
  assert.equal(truncateText('Short text', 20), 'Short text');
  assert.equal(truncateText('This text is way too long for display', 10), 'This text...');
  assert.equal(truncateText('', 10), '');
});

test('getRelativeTimeString formats relative days and months', () => {
  assert.equal(getRelativeTimeString(0), 'Today');
  assert.equal(getRelativeTimeString(1), 'Yesterday');
  assert.equal(getRelativeTimeString(5), '5 days ago');
  assert.equal(getRelativeTimeString(45), '1 month ago');
  assert.equal(getRelativeTimeString(90), '3 months ago');
});

test('isValidEmail validates email addresses accurately', () => {
  assert.equal(isValidEmail('user@example.com'), true);
  assert.equal(isValidEmail('test.name+alias@domain.co.in'), true);
  assert.equal(isValidEmail('invalid-email'), false);
  assert.equal(isValidEmail('@missinguser.com'), false);
  assert.equal(isValidEmail(''), false);
});

test('isValidPhone validates telephone format strings', () => {
  assert.equal(isValidPhone('+919876543210'), true);
  assert.equal(isValidPhone('9876543210'), true);
  assert.equal(isValidPhone('+1 (555) 019-2834'), true);
  assert.equal(isValidPhone('abc123'), false);
  assert.equal(isValidPhone('123'), false);
  assert.equal(isValidPhone(''), false);
});


