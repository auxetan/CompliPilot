'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface DocumentStreamPreviewProps {
  content: string;
}

/**
 * Renders streamed markdown content with proper formatting.
 */
export function DocumentStreamPreview({ content }: DocumentStreamPreviewProps) {
  if (!content) {
    return (
      <div className="flex items-center justify-center rounded-lg border bg-card p-6">
        <div className="flex items-center gap-3 text-muted-foreground">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <span className="text-sm">Generation du document en cours...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="max-h-[600px] overflow-y-auto rounded-lg border bg-card p-6">
      <article className="prose prose-sm dark:prose-invert max-w-none">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
      </article>
    </div>
  );
}
