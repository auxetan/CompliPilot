'use client';

import { FileText, ShieldAlert, Eye, Database, Scale, BarChart3, Award, File } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  DOCUMENT_TYPES,
  DOCUMENT_TYPE_LABELS,
  DOCUMENT_TYPE_DESCRIPTIONS,
  type DocumentType,
} from '@/features/documents/types';
import type { LucideIcon } from 'lucide-react';

const TYPE_ICONS: Record<DocumentType, LucideIcon> = {
  impact_assessment: ShieldAlert,
  transparency_notice: Eye,
  technical_doc: FileText,
  risk_register: Database,
  bias_audit: BarChart3,
  data_processing_record: Scale,
  conformity_declaration: Award,
  custom: File,
};

interface DocumentTypeCardsProps {
  selected: DocumentType | null;
  onSelect: (type: DocumentType) => void;
}

/**
 * Selectable card grid for choosing a document type (Step 1 of generation).
 */
export function DocumentTypeCards({ selected, onSelect }: DocumentTypeCardsProps) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {DOCUMENT_TYPES.filter((t) => t !== 'custom').map((type) => {
        const Icon = TYPE_ICONS[type];
        const isSelected = selected === type;
        return (
          <button
            key={type}
            type="button"
            onClick={() => onSelect(type)}
            className={cn(
              'flex flex-col items-start gap-2 rounded-lg border p-4 text-left transition-all hover:border-primary/50 hover:shadow-sm',
              isSelected
                ? 'border-primary bg-primary/5 ring-2 ring-primary/20'
                : 'border-border bg-card',
            )}
            aria-pressed={isSelected}
          >
            <div
              className={cn(
                'flex h-10 w-10 items-center justify-center rounded-lg',
                isSelected ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground',
              )}
            >
              <Icon className="h-5 w-5" aria-hidden="true" />
            </div>
            <div>
              <p className="font-medium text-sm">{DOCUMENT_TYPE_LABELS[type]}</p>
              <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                {DOCUMENT_TYPE_DESCRIPTIONS[type]}
              </p>
            </div>
          </button>
        );
      })}
    </div>
  );
}
