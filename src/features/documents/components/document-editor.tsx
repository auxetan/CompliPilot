'use client';

import { useState, useTransition } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Pencil, Eye, Save, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { updateDocument } from '@/features/documents/actions';

interface DocumentEditorProps {
  documentId: string;
  initialContent: string;
}

/**
 * Markdown editor with live preview toggle for document content.
 */
export function DocumentEditor({ documentId, initialContent }: DocumentEditorProps) {
  const [content, setContent] = useState(initialContent);
  const [isEditing, setIsEditing] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleSave() {
    startTransition(async () => {
      try {
        await updateDocument(documentId, { contentMarkdown: content });
        toast.success('Document sauvegarde');
        setIsEditing(false);
      } catch {
        toast.error('Erreur lors de la sauvegarde');
      }
    });
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <Button
            variant={isEditing ? 'default' : 'outline'}
            size="sm"
            onClick={() => setIsEditing(true)}
          >
            <Pencil className="mr-2 h-4 w-4" aria-hidden="true" />
            Editer
          </Button>
          <Button
            variant={!isEditing ? 'default' : 'outline'}
            size="sm"
            onClick={() => setIsEditing(false)}
          >
            <Eye className="mr-2 h-4 w-4" aria-hidden="true" />
            Apercu
          </Button>
        </div>
        {isEditing && (
          <Button size="sm" onClick={handleSave} disabled={isPending}>
            {isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
            ) : (
              <Save className="mr-2 h-4 w-4" aria-hidden="true" />
            )}
            Sauvegarder
          </Button>
        )}
      </div>

      {isEditing ? (
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="min-h-[500px] font-mono text-sm"
          placeholder="Contenu Markdown du document..."
        />
      ) : (
        <div className="rounded-lg border bg-card p-6">
          <article className="prose prose-sm dark:prose-invert max-w-none">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
          </article>
        </div>
      )}
    </div>
  );
}
