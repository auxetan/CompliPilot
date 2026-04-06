import { createServerClient } from '@/lib/supabase/server';
import { getAnthropicClient, DEFAULT_MODEL, MAX_ASSESSMENT_TOKENS } from '@/lib/ai/client';
import { assessmentOutputSchema, type AssessmentOutput } from '@/features/scanner/schemas';
import {
  RISK_CLASSIFICATION_SYSTEM_PROMPT,
  buildAssessmentUserPrompt,
} from '@/lib/ai/prompts/risk-classification';

/**
 * Évalue un outil IA via Claude API et stocke les résultats.
 */
export async function assessAiTool(
  toolId: string,
  orgId: string,
  userId?: string,
): Promise<AssessmentOutput> {
  const supabase = await createServerClient();

  // 1. Récupérer l'outil
  const { data: tool } = await supabase
    .from('ai_tools')
    .select(
      'id, org_id, name, provider, category, description, usage_context, data_types_processed, user_count, is_customer_facing, automated_decisions',
    )
    .eq('id', toolId)
    .single();

  if (!tool) throw new Error(`Outil non trouvé : ${toolId}`);
  if (tool.org_id !== orgId) throw new Error('Accès non autorisé');

  // 2. Appeler Claude API
  const anthropic = getAnthropicClient();
  const message = await anthropic.messages.create({
    model: DEFAULT_MODEL,
    max_tokens: MAX_ASSESSMENT_TOKENS,
    system: RISK_CLASSIFICATION_SYSTEM_PROMPT,
    messages: [
      {
        role: 'user',
        content: buildAssessmentUserPrompt({
          name: tool.name,
          provider: tool.provider,
          category: tool.category,
          description: tool.description,
          usageContext: tool.usage_context,
          dataTypesProcessed: tool.data_types_processed as string[] | null,
          userCount: tool.user_count,
          isCustomerFacing: tool.is_customer_facing,
          automatedDecisions: tool.automated_decisions,
        }),
      },
    ],
  });

  // 3. Extraire et valider la réponse JSON
  const textContent = message.content.find((block) => block.type === 'text');
  if (!textContent || textContent.type !== 'text') {
    throw new Error('Réponse IA invalide : pas de contenu texte');
  }

  const jsonMatch = textContent.text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error('Réponse IA invalide : pas de JSON trouvé');
  }

  const rawOutput = JSON.parse(jsonMatch[0]);
  const assessment = assessmentOutputSchema.parse(rawOutput);

  // 4. Stocker les évaluations par réglementation
  const now = new Date().toISOString();
  const expiresAt = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString();

  for (const regulation of assessment.applicableRegulations) {
    const regulationFindings = assessment.findings.filter((f) => f.regulation === regulation);
    const regulationRecommendations = assessment.recommendations.filter(
      (r) => r.regulation === regulation,
    );

    await supabase.from('risk_assessments').insert({
      org_id: orgId,
      ai_tool_id: toolId,
      regulation_code: regulation,
      risk_level: assessment.riskLevel === 'unacceptable' ? 'high' : assessment.riskLevel,
      risk_score: assessment.riskScore,
      findings: regulationFindings,
      recommendations: regulationRecommendations,
      assessed_by: 'ai',
      assessed_at: now,
      expires_at: expiresAt,
    });
  }

  // 5. Mettre à jour l'outil
  await supabase
    .from('ai_tools')
    .update({
      risk_level: assessment.riskLevel,
      risk_score: assessment.riskScore,
      last_assessed_at: now,
      status: assessment.riskLevel === 'unacceptable' ? 'blocked' : 'active',
      updated_at: now,
    })
    .eq('id', toolId);

  // 6. Audit log
  await supabase.from('audit_logs').insert({
    org_id: orgId,
    user_id: userId ?? null,
    action: 'tool.assessed',
    entity_type: 'ai_tool',
    entity_id: toolId,
    details: {
      riskLevel: assessment.riskLevel,
      riskScore: assessment.riskScore,
      regulationsAssessed: assessment.applicableRegulations,
    },
  });

  return assessment;
}
