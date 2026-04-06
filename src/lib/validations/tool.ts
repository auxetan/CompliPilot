/**
 * AI Tool validation schemas — shared re-exports from scanner feature.
 * Import from here for cross-feature usage (e.g., dashboard, risks).
 */
export {
  createToolStep1Schema,
  createToolStep2Schema,
  createToolSchema,
  updateToolSchema,
  assessmentOutputSchema,
  type CreateToolStep1Input,
  type CreateToolStep2Input,
  type CreateToolInput,
  type UpdateToolInput,
  type AssessmentOutput,
} from '@/features/scanner/schemas';
