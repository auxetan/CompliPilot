import { describe, it, expect } from 'vitest';
import { cn, formatDate, formatCurrency, slugify, truncate } from '@/lib/utils';

describe('cn', () => {
  it('merges class names', () => {
    expect(cn('px-4', 'py-2')).toBe('px-4 py-2');
  });

  it('resolves tailwind conflicts (last wins)', () => {
    const result = cn('px-4', 'px-8');
    expect(result).toBe('px-8');
  });

  it('handles conditional classes', () => {
    expect(cn('base', false && 'hidden', 'extra')).toBe('base extra');
  });

  it('returns empty string for no inputs', () => {
    expect(cn()).toBe('');
  });
});

describe('formatDate', () => {
  it('formats a Date object in fr-FR', () => {
    const result = formatDate(new Date('2025-01-15'));
    expect(result).toContain('2025');
    expect(result).toContain('15');
  });

  it('formats a date string', () => {
    const result = formatDate('2024-06-20');
    expect(result).toContain('2024');
  });

  it('uses custom locale', () => {
    const result = formatDate(new Date('2025-03-01'), 'en-US');
    expect(result).toContain('2025');
    expect(result).toContain('March');
  });
});

describe('formatCurrency', () => {
  it('formats EUR by default', () => {
    const result = formatCurrency(199);
    expect(result).toContain('199');
    expect(result).toMatch(/€|EUR/);
  });

  it('formats zero', () => {
    const result = formatCurrency(0);
    expect(result).toContain('0');
  });

  it('formats USD with en-US locale', () => {
    const result = formatCurrency(49.99, 'USD', 'en-US');
    expect(result).toContain('49.99');
    expect(result).toContain('$');
  });
});

describe('slugify', () => {
  it('converts to lowercase', () => {
    expect(slugify('Hello World')).toBe('hello-world');
  });

  it('removes accents', () => {
    expect(slugify('Évaluation dimpact')).toBe('evaluation-dimpact');
  });

  it('replaces special characters with hyphens', () => {
    expect(slugify('EU AI Act (2024)')).toBe('eu-ai-act-2024');
  });

  it('trims leading/trailing hyphens', () => {
    expect(slugify('--hello--')).toBe('hello');
  });

  it('handles empty string', () => {
    expect(slugify('')).toBe('');
  });

  it('collapses consecutive hyphens', () => {
    expect(slugify('a   b   c')).toBe('a-b-c');
  });
});

describe('truncate', () => {
  it('returns text unchanged if within limit', () => {
    expect(truncate('hello', 10)).toBe('hello');
  });

  it('truncates and adds ellipsis', () => {
    expect(truncate('Hello World Test', 10)).toBe('Hello Worl...');
  });

  it('handles exact length', () => {
    expect(truncate('12345', 5)).toBe('12345');
  });

  it('handles length = 0', () => {
    expect(truncate('abc', 0)).toBe('...');
  });
});
