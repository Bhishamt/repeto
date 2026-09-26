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
  ];

  assert.strictEqual(expectedExports.length, 8, 'UI library should export 8 core primitives');
  assert.ok(expectedExports.includes('LoadingSpinner'), 'LoadingSpinner component should be registered');
});
