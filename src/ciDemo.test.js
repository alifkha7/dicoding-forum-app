import { describe, it, expect } from 'vitest';

describe('CI Demo Test', () => {
  it('should intentionally fail to demonstrate CI error check in Pull Request', () => {
    expect(1 + 1).toBe(3);
  });
});
