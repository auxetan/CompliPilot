'use client';

import { useState } from 'react';
import { FileBarChart, Construction } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

const REPORT_TYPES = [
  { value: 'global', label: 'Rapport de conformite global' },
  { value: 'regulation', label: 'Rapport par reglementation' },
  { value: 'auditor', label: 'Rapport pour auditeurs' },
] as const;

export function NewReportForm() {
  const [reportType, setReportType] = useState('');
  const [notes, setNotes] = useState('');

  return (
    <div className="space-y-6">
      {/* Coming soon banner */}
      <Card className="border-amber-500/30 bg-amber-50/50 dark:bg-amber-950/20">
        <CardContent className="flex items-start gap-4 pt-6">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-100 dark:bg-amber-900/40">
            <Construction
              className="h-5 w-5 text-amber-600 dark:text-amber-400"
              aria-hidden="true"
            />
          </div>
          <div>
            <p className="font-medium text-amber-900 dark:text-amber-200">
              Fonctionnalite en cours de developpement
            </p>
            <p className="mt-1 text-sm text-amber-700 dark:text-amber-400">
              La generation de rapports est en cours de developpement. Vous pourrez bientot generer
              des rapports de conformite complets, exportables en PDF, directement depuis cette
              page.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Form */}
      <Card>
        <CardContent className="space-y-6 pt-6">
          <div className="flex items-center gap-3 pb-2">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
              <FileBarChart className="h-5 w-5 text-primary" aria-hidden="true" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">Parametres du rapport</h2>
              <p className="text-sm text-muted-foreground">
                Configurez les options de generation de votre rapport
              </p>
            </div>
          </div>

          {/* Report type */}
          <div className="space-y-2">
            <Label htmlFor="report-type">Type de rapport</Label>
            <Select value={reportType} onValueChange={setReportType}>
              <SelectTrigger id="report-type">
                <SelectValue placeholder="Selectionnez un type de rapport" />
              </SelectTrigger>
              <SelectContent>
                {REPORT_TYPES.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Date range */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="date-from">Date de debut (optionnel)</Label>
              <input
                id="date-from"
                type="date"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="date-to">Date de fin (optionnel)</Label>
              <input
                id="date-to"
                type="date"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notes (optionnel)</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ajoutez des notes ou instructions specifiques pour la generation du rapport..."
              rows={4}
            />
          </div>

          {/* Submit */}
          <div className="flex justify-end pt-2">
            <Button disabled>
              <FileBarChart className="mr-2 h-4 w-4" />
              Generer le rapport
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
