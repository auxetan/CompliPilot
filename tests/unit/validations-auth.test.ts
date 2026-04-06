import { describe, it, expect } from 'vitest';
import {
  loginSchema,
  registerSchema,
  forgotPasswordSchema,
  magicLinkSchema,
  resetPasswordSchema,
  onboardingStep1Schema,
  onboardingStep2Schema,
  onboardingStep3Schema,
} from '@/lib/validations/auth';

describe('loginSchema', () => {
  it('accepts valid credentials', () => {
    const result = loginSchema.safeParse({ email: 'user@test.com', password: 'secret123' });
    expect(result.success).toBe(true);
  });

  it('rejects invalid email', () => {
    const result = loginSchema.safeParse({ email: 'not-email', password: 'secret123' });
    expect(result.success).toBe(false);
  });

  it('rejects empty password', () => {
    const result = loginSchema.safeParse({ email: 'user@test.com', password: '' });
    expect(result.success).toBe(false);
  });
});

describe('registerSchema', () => {
  const valid = {
    fullName: 'John Doe',
    email: 'john@test.com',
    password: 'Password1',
    confirmPassword: 'Password1',
  };

  it('accepts valid registration', () => {
    expect(registerSchema.safeParse(valid).success).toBe(true);
  });

  it('rejects short name', () => {
    expect(registerSchema.safeParse({ ...valid, fullName: 'J' }).success).toBe(false);
  });

  it('rejects password without uppercase', () => {
    expect(
      registerSchema.safeParse({ ...valid, password: 'password1', confirmPassword: 'password1' })
        .success,
    ).toBe(false);
  });

  it('rejects password without digit', () => {
    expect(
      registerSchema.safeParse({
        ...valid,
        password: 'Password',
        confirmPassword: 'Password',
      }).success,
    ).toBe(false);
  });

  it('rejects short password', () => {
    expect(
      registerSchema.safeParse({ ...valid, password: 'Pass1', confirmPassword: 'Pass1' }).success,
    ).toBe(false);
  });

  it('rejects mismatched passwords', () => {
    expect(registerSchema.safeParse({ ...valid, confirmPassword: 'Different1' }).success).toBe(
      false,
    );
  });
});

describe('forgotPasswordSchema', () => {
  it('accepts valid email', () => {
    expect(forgotPasswordSchema.safeParse({ email: 'a@b.com' }).success).toBe(true);
  });

  it('rejects invalid email', () => {
    expect(forgotPasswordSchema.safeParse({ email: 'abc' }).success).toBe(false);
  });
});

describe('magicLinkSchema', () => {
  it('accepts valid email', () => {
    expect(magicLinkSchema.safeParse({ email: 'a@b.com' }).success).toBe(true);
  });
});

describe('resetPasswordSchema', () => {
  it('accepts matching strong passwords', () => {
    expect(
      resetPasswordSchema.safeParse({ password: 'NewPass1!', confirmPassword: 'NewPass1!' })
        .success,
    ).toBe(true);
  });

  it('rejects mismatched passwords', () => {
    expect(
      resetPasswordSchema.safeParse({ password: 'NewPass1!', confirmPassword: 'Other1!' }).success,
    ).toBe(false);
  });
});

describe('onboardingStep1Schema', () => {
  const valid = { name: 'My Company', industry: 'fintech', country: 'FR', employeeCount: 50 };

  it('accepts valid data', () => {
    expect(onboardingStep1Schema.safeParse(valid).success).toBe(true);
  });

  it('rejects missing name', () => {
    expect(onboardingStep1Schema.safeParse({ ...valid, name: '' }).success).toBe(false);
  });

  it('rejects employeeCount = 0', () => {
    expect(onboardingStep1Schema.safeParse({ ...valid, employeeCount: 0 }).success).toBe(false);
  });
});

describe('onboardingStep2Schema', () => {
  it('accepts valid regulations array', () => {
    expect(onboardingStep2Schema.safeParse({ regulations: ['gdpr', 'nis2'] }).success).toBe(true);
  });

  it('rejects empty regulations', () => {
    expect(onboardingStep2Schema.safeParse({ regulations: [] }).success).toBe(false);
  });

  it('rejects invalid regulation', () => {
    expect(onboardingStep2Schema.safeParse({ regulations: ['invalid'] }).success).toBe(false);
  });
});

describe('onboardingStep3Schema', () => {
  it('accepts valid range', () => {
    expect(onboardingStep3Schema.safeParse({ aiToolRange: '1-5' }).success).toBe(true);
    expect(onboardingStep3Schema.safeParse({ aiToolRange: '6-20' }).success).toBe(true);
    expect(onboardingStep3Schema.safeParse({ aiToolRange: '20+' }).success).toBe(true);
  });

  it('rejects invalid range', () => {
    expect(onboardingStep3Schema.safeParse({ aiToolRange: '50+' }).success).toBe(false);
  });
});
