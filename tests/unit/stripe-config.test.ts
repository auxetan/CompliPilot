import { describe, it, expect } from 'vitest';
import { PLANS, PLAN_ORDER, isHigherPlan, formatPrice } from '@/lib/stripe/config';
import type { PlanId } from '@/lib/stripe/config';

describe('PLANS configuration', () => {
  it('has 4 plans', () => {
    expect(Object.keys(PLANS)).toHaveLength(4);
  });

  it('free plan has zero prices', () => {
    expect(PLANS.free.priceMonthly).toBe(0);
    expect(PLANS.free.priceYearly).toBe(0);
  });

  it('starter costs 199 EUR/month', () => {
    expect(PLANS.starter.priceMonthly).toBe(19900);
  });

  it('growth costs 499 EUR/month', () => {
    expect(PLANS.growth.priceMonthly).toBe(49900);
  });

  it('enterprise costs 1499 EUR/month', () => {
    expect(PLANS.enterprise.priceMonthly).toBe(149900);
  });

  it('yearly prices are cheaper per month (20% off)', () => {
    for (const id of ['starter', 'growth', 'enterprise'] as PlanId[]) {
      const plan = PLANS[id];
      expect(plan.priceYearly).toBeLessThan(plan.priceMonthly * 12);
    }
  });

  it('growth plan is recommended', () => {
    expect(PLANS.growth.recommended).toBe(true);
  });

  it('free plan has strictest limits', () => {
    expect(PLANS.free.limits.tools).toBe(2);
    expect(PLANS.free.limits.documentsPerMonth).toBe(1);
    expect(PLANS.free.limits.teamMembers).toBe(1);
  });

  it('enterprise plan has Infinity limits', () => {
    expect(PLANS.enterprise.limits.tools).toBe(Infinity);
    expect(PLANS.enterprise.limits.documentsPerMonth).toBe(Infinity);
    expect(PLANS.enterprise.limits.teamMembers).toBe(Infinity);
  });

  it('each plan has features array', () => {
    for (const plan of Object.values(PLANS)) {
      expect(plan.features.length).toBeGreaterThan(0);
    }
  });
});

describe('PLAN_ORDER', () => {
  it('starts with free and ends with enterprise', () => {
    expect(PLAN_ORDER[0]).toBe('free');
    expect(PLAN_ORDER[PLAN_ORDER.length - 1]).toBe('enterprise');
  });
});

describe('isHigherPlan', () => {
  it('enterprise > free', () => {
    expect(isHigherPlan('enterprise', 'free')).toBe(true);
  });

  it('free is not higher than starter', () => {
    expect(isHigherPlan('free', 'starter')).toBe(false);
  });

  it('same plan is not higher', () => {
    expect(isHigherPlan('growth', 'growth')).toBe(false);
  });

  it('growth > starter', () => {
    expect(isHigherPlan('growth', 'starter')).toBe(true);
  });
});

describe('formatPrice', () => {
  it('returns "Gratuit" for 0', () => {
    expect(formatPrice(0)).toBe('Gratuit');
  });

  it('formats 19900 cents as 199 EUR', () => {
    const result = formatPrice(19900);
    expect(result).toContain('199');
    expect(result).toMatch(/€|EUR/);
  });

  it('formats 49900 cents as 499 EUR', () => {
    const result = formatPrice(49900);
    expect(result).toContain('499');
  });
});
