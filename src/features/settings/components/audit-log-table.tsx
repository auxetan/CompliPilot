'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { formatDate } from '@/lib/utils';
import { History, Search } from 'lucide-react';

interface AuditLogEntry {
  id: string;
  userId: string | null;
  userName: string | null;
  action: string;
  entityType: string | null;
  details: Record<string, unknown>;
  ipAddress: string | null;
  createdAt: string;
}

interface AuditLogTableProps {
  entries: AuditLogEntry[];
}

const ACTION_LABELS: Record<string, string> = {
  organization_updated: 'Organisation modifiee',
  regulations_updated: 'Reglementations modifiees',
  member_role_updated: 'Role membre modifie',
  member_removed: 'Membre retire',
  invitation_sent: 'Invitation envoyee',
  subscription_created: 'Abonnement cree',
  subscription_updated: 'Abonnement modifie',
  subscription_canceled: 'Abonnement annule',
  payment_failed: 'Paiement echoue',
  tool_created: 'Outil ajoute',
  tool_updated: 'Outil modifie',
  assessment_completed: 'Evaluation terminee',
  document_generated: 'Document genere',
};

export function AuditLogTable({ entries }: AuditLogTableProps) {
  const [filter, setFilter] = useState('');

  const filtered = filter
    ? entries.filter(
        (e) =>
          e.action.toLowerCase().includes(filter.toLowerCase()) ||
          (e.userName ?? '').toLowerCase().includes(filter.toLowerCase()),
      )
    : entries;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <History className="h-4 w-4" aria-hidden="true" />
          Journal d&apos;audit
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4 relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Filtrer par action ou utilisateur..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="pl-9"
          />
        </div>

        {filtered.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">Aucune entree trouvee.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-xs text-muted-foreground">
                  <th className="pb-2 font-medium">Date</th>
                  <th className="pb-2 font-medium">Utilisateur</th>
                  <th className="pb-2 font-medium">Action</th>
                  <th className="hidden pb-2 font-medium md:table-cell">Details</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((entry) => (
                  <tr key={entry.id} className="border-b last:border-0">
                    <td className="py-2.5 pr-4 text-xs text-muted-foreground whitespace-nowrap">
                      {formatDate(entry.createdAt)}
                    </td>
                    <td className="py-2.5 pr-4">{entry.userName ?? '—'}</td>
                    <td className="py-2.5 pr-4">{ACTION_LABELS[entry.action] ?? entry.action}</td>
                    <td className="hidden py-2.5 text-xs text-muted-foreground md:table-cell max-w-48 truncate">
                      {Object.keys(entry.details).length > 0 ? JSON.stringify(entry.details) : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
