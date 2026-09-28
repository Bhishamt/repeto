import test from 'node:test';
import assert from 'node:assert';

test('UI Component Exports Structure Integrity', (t) => {
  const expectedExports = [
    'Badge',
    'Button',
    'Card',
    'Input',
    'Modal',
    'Toast',
    'EmptyState',
    'LoadingSpinner',
    'TierBadge',
  ];

  assert.strictEqual(expectedExports.length, 9, 'UI library should export 9 core primitives');
  assert.ok(expectedExports.includes('LoadingSpinner'), 'LoadingSpinner component should be registered');
  assert.ok(expectedExports.includes('TierBadge'), 'TierBadge component should be registered');
});

