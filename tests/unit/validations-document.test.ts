import { describe, it, expect } from 'vitest';
import {
  generateStep1Schema,
  generateStep2Schema,
  generateDocumentSchema,
  updateDocumentSchema,
} from '@/features/documents/schemas';

describe('generateStep1Schema', () => {
  it('accepts valid document type', () => {
    expect(generateStep1Schema.safeParse({ type: 'impact_assessment' }).success).toBe(true);
    expect(generateStep1Schema.safeParse({ type: 'risk_register' }).success).toBe(true);
    expect(generateStep1Schema.safeParse({ type: 'custom' }).success).toBe(true);
  });

  it('rejects invalid document type', () => {
    expect(generateStep1Schema.safeParse({ type: 'invalid_type' }).success).toBe(false);
  });
});

describe('generateStep2Schema', () => {
  const valid = {
    aiToolId: null,
    regulation: 'eu_ai_act' as const,
    language: 'fr' as const,
    additionalContext: '',
  };

  it('accepts valid step 2', () => {
    expect(generateStep2Schema.safeParse(valid).success).toBe(true);
  });

  it('accepts with aiToolId string', () => {
    expect(generateStep2Schema.safeParse({ ...valid, aiToolId: 'some-uuid' }).success).toBe(true);
  });

  it('accepts multi regulation', () => {
    expect(generateStep2Schema.safeParse({ ...valid, regulation: 'multi' }).success).toBe(true);
  });

  it('rejects invalid regulation', () => {
    expect(generateStep2Schema.safeParse({ ...valid, regulation: 'unknown' }).success).toBe(false);
  });

  it('rejects additionalContext over 2000 chars', () => {
    expect(
      generateStep2Schema.safeParse({ ...valid, additionalContext: 'x'.repeat(2001) }).success,
    ).toBe(false);
  });
});

describe('generateDocumentSchema (merged)', () => {
  it('accepts full valid input', () => {
    const result = generateDocumentSchema.safeParse({
      type: 'transparency_notice',
      aiToolId: null,
      regulation: 'gdpr',
      language: 'en',
      additionalContext: 'Some context',
    });
    expect(result.success).toBe(true);
  });
});

describe('updateDocumentSchema', () => {
  it('accepts partial update with title only', () => {
    expect(updateDocumentSchema.safeParse({ title: 'New Title' }).success).toBe(true);
  });

  it('accepts status change', () => {
    expect(updateDocumentSchema.safeParse({ status: 'approved' }).success).toBe(true);
  });

  it('accepts empty object', () => {
    expect(updateDocumentSchema.safeParse({}).success).toBe(true);
  });

  it('rejects invalid status', () => {
    expect(updateDocumentSchema.safeParse({ status: 'invalid' }).success).toBe(false);
  });

  it('rejects empty title', () => {
    expect(updateDocumentSchema.safeParse({ title: '' }).success).toBe(false);
  });
});
