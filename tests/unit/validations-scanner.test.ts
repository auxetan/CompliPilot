import { describe, it, expect } from 'vitest';
import {
  createToolStep1Schema,
  createToolStep2Schema,
  createToolSchema,
  assessmentOutputSchema,
} from '@/features/scanner/schemas';

describe('createToolStep1Schema', () => {
  const valid = { name: 'ChatGPT', provider: 'OpenAI', category: 'chatbot' as const };

  it('accepts valid step 1', () => {
    expect(createToolStep1Schema.safeParse(valid).success).toBe(true);
  });

  it('accepts with optional fields', () => {
    expect(
      createToolStep1Schema.safeParse({
        ...valid,
        description: 'A chatbot',
        url: 'https://openai.com',
      }).success,
    ).toBe(true);
  });

  it('rejects empty name', () => {
    expect(createToolStep1Schema.safeParse({ ...valid, name: '' }).success).toBe(false);
  });

  it('rejects invalid category', () => {
    expect(createToolStep1Schema.safeParse({ ...valid, category: 'unknown' }).success).toBe(false);
  });

  it('rejects invalid url', () => {
    expect(createToolStep1Schema.safeParse({ ...valid, url: 'not-a-url' }).success).toBe(false);
  });

  it('allows empty string url', () => {
    expect(createToolStep1Schema.safeParse({ ...valid, url: '' }).success).toBe(true);
  });
});

describe('createToolStep2Schema', () => {
  const valid = {
    usageContext: 'Used for customer support conversations',
    dataTypesProcessed: ['personal_data' as const],
    userCount: 100,
    isCustomerFacing: true,
    automatedDecisions: false,
  };

  it('accepts valid step 2', () => {
    expect(createToolStep2Schema.safeParse(valid).success).toBe(true);
  });

  it('rejects too short usageContext', () => {
    expect(createToolStep2Schema.safeParse({ ...valid, usageContext: 'short' }).success).toBe(
      false,
    );
  });

  it('rejects empty dataTypesProcessed', () => {
    expect(createToolStep2Schema.safeParse({ ...valid, dataTypesProcessed: [] }).success).toBe(
      false,
    );
  });

  it('rejects userCount = 0', () => {
    expect(createToolStep2Schema.safeParse({ ...valid, userCount: 0 }).success).toBe(false);
  });
});

describe('createToolSchema (merged)', () => {
  it('accepts all fields combined', () => {
    const result = createToolSchema.safeParse({
      name: 'Claude',
      provider: 'Anthropic',
      category: 'chatbot',
      usageContext: 'Internal AI assistant for compliance',
      dataTypesProcessed: ['internal'],
      userCount: 50,
      isCustomerFacing: false,
      automatedDecisions: false,
    });
    expect(result.success).toBe(true);
  });
});

describe('assessmentOutputSchema', () => {
  const valid = {
    riskLevel: 'high' as const,
    riskScore: 75,
    findings: [
      {
        regulation: 'eu_ai_act' as const,
        finding: 'High risk system',
        severity: 'high' as const,
        details: 'Uses personal data for scoring',
      },
    ],
    recommendations: [
      {
        priority: 'urgent' as const,
        action: 'Conduct full impact assessment',
        regulation: 'eu_ai_act' as const,
      },
    ],
    applicableRegulations: ['eu_ai_act' as const, 'gdpr' as const],
  };

  it('accepts valid assessment output', () => {
    expect(assessmentOutputSchema.safeParse(valid).success).toBe(true);
  });

  it('rejects riskScore > 100', () => {
    expect(assessmentOutputSchema.safeParse({ ...valid, riskScore: 150 }).success).toBe(false);
  });

  it('rejects riskScore < 0', () => {
    expect(assessmentOutputSchema.safeParse({ ...valid, riskScore: -5 }).success).toBe(false);
  });

  it('rejects invalid riskLevel', () => {
    expect(assessmentOutputSchema.safeParse({ ...valid, riskLevel: 'not_assessed' }).success).toBe(
      false,
    );
  });
});
