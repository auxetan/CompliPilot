'use server';

import { getOrgId } from '@/lib/supabase/server';
import { getRisksByRegulation } from '../services/get-risk-data';

/**
 * Generates a CSV export of all risk assessments.
 * Only includes summary-level data (no internal details).
 */
export async function exportRisksCsv(): Promise<string> {
  const orgId = await getOrgId();
  if (!orgId) throw new Error('Non authentifie');

  const rows = await getRisksByRegulation(orgId);

  const header = [
    'Outil',
    'Fournisseur',
    'Niveau de risque',
    'Score',
    'Reglementation',
    'Action requise',
    'Echeance',
    'Date evaluation',
  ];

  const csvRows = rows.map((r) => [
    r.toolName,
    r.provider ?? '',
    r.riskLevel,
    String(r.riskScore),
    r.regulationLabel,
    r.actionRequired ?? '',
    r.deadline ?? '',
    r.assessedAt ? new Date(r.assessedAt).toLocaleDateString('fr-FR') : '',
  ]);

  const csv = [header, ...csvRows]
    .map((row) => row.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(','))
    .join('\n');

  return csv;
}
