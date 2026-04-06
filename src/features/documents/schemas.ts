import { z } from 'zod';
import { DOCUMENT_TYPES, DOCUMENT_REGULATIONS, DOCUMENT_LANGUAGES } from './types';

/**
 * Schema for Step 1 — document type selection.
 */
export const generateStep1Schema = z.object({
  type: z.enum(DOCUMENT_TYPES, { message: 'Selectionnez un type de document' }),
});

export type GenerateStep1Values = z.infer<typeof generateStep1Schema>;

/**
 * Schema for Step 2 — document parameters.
 */
export const generateStep2Schema = z.object({
  aiToolId: z.string().nullable(),
  regulation: z.enum(DOCUMENT_REGULATIONS, { message: 'Selectionnez une reglementation' }),
  language: z.enum(DOCUMENT_LANGUAGES).default('fr'),
  additionalContext: z.string().max(2000).default(''),
});

export type GenerateStep2Values = z.infer<typeof generateStep2Schema>;

/**
 * Full generation input schema (Step 1 + Step 2 merged).
 */
export const generateDocumentSchema = generateStep1Schema.merge(generateStep2Schema);

export type GenerateDocumentValues = z.infer<typeof generateDocumentSchema>;

/**
 * Schema for updating a document (status, content, etc.).
 */
export const updateDocumentSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  contentMarkdown: z.string().optional(),
  content: z.record(z.string(), z.unknown()).optional(),
  status: z.enum(['draft', 'review', 'approved', 'expired', 'archived']).optional(),
});

export type UpdateDocumentValues = z.infer<typeof updateDocumentSchema>;
