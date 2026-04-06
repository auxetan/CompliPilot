import { createServerClient, getOrgId } from '@/lib/supabase/server';
import {
  getDocumentSystemPrompt,
  buildDocumentUserPrompt,
  DOCUMENT_PROMPT_VERSION,
} from '@/lib/ai/prompts/document-generation';
import { DOCUMENT_TYPE_LABELS } from '@/features/documents/types';
import type {
  DocumentType,
  DocumentRegulation,
  DocumentLanguage,
} from '@/features/documents/types';

interface GenerateParams {
  type: DocumentType;
  regulation: DocumentRegulation;
  aiToolId: string | null;
  language: DocumentLanguage;
  additionalContext: string;
}

/**
 * Builds the full prompt context for document generation.
 * Returns system + user prompts ready for Claude API.
 */
export async function buildGenerationPrompts(params: GenerateParams) {
  const orgId = await getOrgId();
  if (!orgId) throw new Error('Non authentifie');

  const supabase = await createServerClient();

  // Fetch org info
  const { data: org } = await supabase
    .from('organizations')
    .select('name, industry, country, employee_count')
    .eq('id', orgId)
    .single();

  if (!org) throw new Error('Organisation introuvable');

  // Fetch tool + assessments if a specific tool is selected
  let toolContext = null;
  let assessments: {
    riskLevel: string;
    riskScore: number | null;
    findings: unknown[];
    recommendations: unknown[];
  }[] = [];

  if (params.aiToolId) {
    const { data: tool } = await supabase
      .from('ai_tools')
      .select(
        'name, provider, category, description, usage_context, data_types_processed, user_count, is_customer_facing, automated_decisions',
      )
      .eq('id', params.aiToolId)
      .eq('org_id', orgId)
      .single();

    if (tool) {
      toolContext = {
        name: tool.name,
        provider: tool.provider,
        category: tool.category,
        description: tool.description,
        usageContext: tool.usage_context,
        dataTypesProcessed: tool.data_types_processed as string[] | null,
        userCount: tool.user_count,
        isCustomerFacing: tool.is_customer_facing,
        automatedDecisions: tool.automated_decisions,
      };

      const { data: riskData } = await supabase
        .from('risk_assessments')
        .select('risk_level, risk_score, findings, recommendations')
        .eq('ai_tool_id', params.aiToolId)
        .eq('org_id', orgId)
        .order('assessed_at', { ascending: false })
        .limit(4);

      if (riskData) {
        assessments = riskData.map((r) => ({
          riskLevel: r.risk_level,
          riskScore: r.risk_score,
          findings: (r.findings ?? []) as unknown[],
          recommendations: (r.recommendations ?? []) as unknown[],
        }));
      }
    }
  }

  const systemPrompt = getDocumentSystemPrompt(params.language);
  const userPrompt = buildDocumentUserPrompt(
    params.type,
    params.regulation,
    {
      tool: toolContext,
      assessments,
      org: {
        name: org.name,
        industry: org.industry,
        country: org.country,
        employeeCount: org.employee_count,
      },
      additionalContext: params.additionalContext,
    },
    params.language,
  );

  // Generate a title
  const typeLabel = DOCUMENT_TYPE_LABELS[params.type];
  const title = toolContext
    ? `${typeLabel} — ${toolContext.name}`
    : `${typeLabel} — Document global`;

  return {
    systemPrompt,
    userPrompt,
    title,
    orgId,
    promptVersion: DOCUMENT_PROMPT_VERSION,
  };
}
