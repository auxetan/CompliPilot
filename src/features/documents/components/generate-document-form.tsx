'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, ArrowRight, Loader2, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { DocumentTypeCards } from './document-type-cards';
import { DocumentStreamPreview } from './document-stream-preview';
import {
  DOCUMENT_REGULATIONS,
  DOCUMENT_LANGUAGE_LABELS,
  type DocumentType,
  type DocumentRegulation,
  type DocumentLanguage,
} from '@/features/documents/types';
import { REGULATION_LABELS } from '@/lib/constants';

interface AiToolOption {
  id: string;
  name: string;
}

interface GenerateDocumentFormProps {
  tools: AiToolOption[];
}

/**
 * Multi-step form for generating a compliance document.
 * Step 1: Choose document type
 * Step 2: Set parameters (tool, regulation, language)
 * Step 3: Generate with streaming preview
 */
export function GenerateDocumentForm({ tools }: GenerateDocumentFormProps) {
  const router = useRouter();
  const [step, setStep] = useState(1);

  // Step 1
  const [type, setType] = useState<DocumentType | null>(null);

  // Step 2
  const [aiToolId, setAiToolId] = useState<string | null>(null);
  const [regulation, setRegulation] = useState<DocumentRegulation>('eu_ai_act');
  const [language, setLanguage] = useState<DocumentLanguage>('fr');
  const [additionalContext, setAdditionalContext] = useState('');

  // Step 3
  const [isGenerating, setIsGenerating] = useState(false);
  const [streamedText, setStreamedText] = useState('');
  const [documentId, setDocumentId] = useState<string | null>(null);
  const [isComplete, setIsComplete] = useState(false);

  const handleGenerate = useCallback(async () => {
    if (!type) return;
    setIsGenerating(true);
    setStreamedText('');
    setIsComplete(false);

    try {
      const response = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, regulation, aiToolId, language, additionalContext }),
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.error ?? 'Erreur lors de la generation');
      }

      const docId = response.headers.get('X-Document-Id');
      if (docId) setDocumentId(docId);

      const reader = response.body?.getReader();
      if (!reader) throw new Error('Pas de flux de reponse');

      const decoder = new TextDecoder();
      let accumulated = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        accumulated += chunk;
        setStreamedText(accumulated);
      }

      setIsComplete(true);
      toast.success('Document genere avec succes');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erreur inconnue';
      toast.error(message);
    } finally {
      setIsGenerating(false);
    }
  }, [type, regulation, aiToolId, language, additionalContext]);

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Step indicator */}
      <div className="flex items-center gap-2">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex items-center gap-2">
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium ${
                s <= step ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
              }`}
            >
              {s}
            </div>
            <span className="text-sm text-muted-foreground hidden sm:inline">
              {s === 1 ? 'Type' : s === 2 ? 'Parametres' : 'Generation'}
            </span>
            {s < 3 && <div className="h-px w-8 bg-border" />}
          </div>
        ))}
      </div>

      {/* Step 1 — Document type selection */}
      {step === 1 && (
        <Card>
          <CardHeader>
            <CardTitle>Quel type de document souhaitez-vous generer ?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <DocumentTypeCards selected={type} onSelect={setType} />
            <div className="flex justify-end">
              <Button onClick={() => setStep(2)} disabled={!type}>
                Suivant <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 2 — Parameters */}
      {step === 2 && (
        <Card>
          <CardHeader>
            <CardTitle>Parametres du document</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="tool">Outil IA concerne</Label>
                <Select
                  value={aiToolId ?? '__global__'}
                  onValueChange={(v: string | null) => setAiToolId(v === '__global__' ? null : v)}
                >
                  <SelectTrigger id="tool">
                    <SelectValue placeholder="Selectionnez un outil" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__global__">Document global</SelectItem>
                    {tools.map((t) => (
                      <SelectItem key={t.id} value={t.id}>
                        {t.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="regulation">Reglementation principale</Label>
                <Select
                  value={regulation}
                  onValueChange={(v: string | null) => {
                    if (v) setRegulation(v as DocumentRegulation);
                  }}
                >
                  <SelectTrigger id="regulation">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {DOCUMENT_REGULATIONS.filter((r) => r !== 'multi').map((r) => (
                      <SelectItem key={r} value={r}>
                        {REGULATION_LABELS[r as keyof typeof REGULATION_LABELS] ?? r}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="language">Langue du document</Label>
                <Select
                  value={language}
                  onValueChange={(v: string | null) => {
                    if (v) setLanguage(v as DocumentLanguage);
                  }}
                >
                  <SelectTrigger id="language">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(DOCUMENT_LANGUAGE_LABELS).map(([code, label]) => (
                      <SelectItem key={code} value={code}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="context">Informations supplementaires (optionnel)</Label>
              <Textarea
                id="context"
                placeholder="Ajoutez du contexte specifique pour personnaliser le document..."
                value={additionalContext}
                onChange={(e) => setAdditionalContext(e.target.value)}
                rows={3}
              />
            </div>

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setStep(1)}>
                <ArrowLeft className="mr-2 h-4 w-4" aria-hidden="true" /> Retour
              </Button>
              <Button onClick={() => setStep(3)}>
                Suivant <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 3 — Generation */}
      {step === 3 && (
        <Card>
          <CardHeader>
            <CardTitle>Generation du document</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {!isGenerating && !isComplete && (
              <div className="flex flex-col items-center gap-4 py-8">
                <Sparkles className="h-12 w-12 text-primary" aria-hidden="true" />
                <p className="text-center text-muted-foreground">
                  Pret a generer votre document. Claude va analyser le contexte de votre outil et
                  produire un document conforme aux exigences reglementaires.
                </p>
                <Button size="lg" onClick={handleGenerate}>
                  <Sparkles className="mr-2 h-4 w-4" aria-hidden="true" />
                  Generer avec l&apos;IA
                </Button>
              </div>
            )}

            {isGenerating && (
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                  Generation en cours...
                </div>
                <DocumentStreamPreview content={streamedText} />
              </div>
            )}

            {isComplete && (
              <div className="space-y-4">
                <DocumentStreamPreview content={streamedText} />
                <div className="flex justify-between">
                  <Button variant="outline" onClick={() => setStep(2)}>
                    <ArrowLeft className="mr-2 h-4 w-4" aria-hidden="true" /> Modifier les
                    parametres
                  </Button>
                  <div className="flex gap-2">
                    {documentId && (
                      <Button onClick={() => router.push(`/documents/${documentId}`)}>
                        Voir le document
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            )}

            {!isGenerating && !isComplete && (
              <div className="flex justify-start">
                <Button variant="outline" onClick={() => setStep(2)}>
                  <ArrowLeft className="mr-2 h-4 w-4" aria-hidden="true" /> Retour
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
