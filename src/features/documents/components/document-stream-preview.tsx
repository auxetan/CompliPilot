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
  if (!content) return null;

  return (
    <div className="max-h-[600px] overflow-y-auto rounded-lg border bg-card p-6">
      <article className="prose prose-sm dark:prose-invert max-w-none">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
      </article>
    </div>
  );
}
