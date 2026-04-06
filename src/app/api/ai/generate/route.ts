import { anthropic } from '@ai-sdk/anthropic';
import { streamText } from 'ai';
import { getOrgId, getUser, createServerClient } from '@/lib/supabase/server';
import { DEFAULT_MODEL } from '@/lib/ai/client';
import { buildGenerationPrompts } from '@/features/documents/services/generate-document';
import { generateDocumentSchema } from '@/features/documents/schemas';
import type {
  DocumentType,
  DocumentRegulation,
  DocumentLanguage,
} from '@/features/documents/types';

/**
 * POST /api/ai/generate — Streams a compliance document via Claude API.
 * Uses Vercel AI SDK streamText + @ai-sdk/anthropic provider.
 */
export async function POST(request: Request) {
  // 1. Auth check
  const orgId = await getOrgId();
  if (!orgId) {
    return new Response('Non authentifie', { status: 401 });
  }
  const user = await getUser();

  // 2. Parse & validate body
  const body = await request.json();
  const parsed = generateDocumentSchema.safeParse(body);
  if (!parsed.success) {
    return new Response(JSON.stringify({ error: parsed.error.flatten() }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const { type, regulation, aiToolId, language, additionalContext } = parsed.data;

  // 3. Build prompts with full context (tool, org, assessments)
  const { systemPrompt, userPrompt, title, promptVersion } = await buildGenerationPrompts({
    type: type as DocumentType,
    regulation: regulation as DocumentRegulation,
    aiToolId: aiToolId,
    language: (language ?? 'fr') as DocumentLanguage,
    additionalContext: additionalContext ?? '',
  });

  const startTime = Date.now();

  // 4. Create document record (status: draft, content empty — will be filled after stream completes)
  const supabase = await createServerClient();
  const { data: doc, error: insertError } = await supabase
    .from('compliance_documents')
    .insert({
      org_id: orgId,
      ai_tool_id: aiToolId,
      title,
      type,
      regulation,
      status: 'draft',
      version: 1,
      generated_by: 'ai',
      content: {},
      content_markdown: '',
    })
    .select('id')
    .single();

  if (insertError || !doc) {
    return new Response(JSON.stringify({ error: 'Erreur lors de la creation du document' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // 5. Stream with Vercel AI SDK
  const result = streamText({
    model: anthropic(DEFAULT_MODEL),
    system: systemPrompt,
    messages: [{ role: 'user', content: userPrompt }],
    maxOutputTokens: 8192,
    async onFinish({ text, usage }) {
      const durationMs = Date.now() - startTime;

      // Save completed markdown to the document
      await supabase
        .from('compliance_documents')
        .update({
          content_markdown: text,
          content: { promptVersion, generatedAt: new Date().toISOString() },
        })
        .eq('id', doc.id);

      // Audit log
      await supabase.from('audit_logs').insert({
        org_id: orgId,
        user_id: user?.id ?? null,
        action: 'document.generated',
        entity_type: 'compliance_document',
        entity_id: doc.id,
        details: {
          type,
          regulation,
          aiToolId,
          model: DEFAULT_MODEL,
          promptVersion,
          tokensUsed: usage?.totalTokens ?? null,
          durationMs,
        },
      });
    },
  });

  // 6. Return streaming response with document ID in header
  const response = result.toTextStreamResponse();

  // Add document ID header so the client can redirect after completion
  const headers = new Headers(response.headers);
  headers.set('X-Document-Id', doc.id);

  return new Response(response.body, {
    status: response.status,
    headers,
  });
}
