'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ToolSummaryTab } from './tabs/tool-summary-tab';
import { ToolAssessmentsTab } from './tabs/tool-assessments-tab';
import { ToolDocumentsTab } from './tabs/tool-documents-tab';
import { ToolHistoryTab, type AuditLogEntry } from './tabs/tool-history-tab';
import type { AiToolWithAssessments } from '../types';

interface ToolDetailTabsProps {
  tool: AiToolWithAssessments;
  auditLogs: AuditLogEntry[];
}

export function ToolDetailTabs({ tool, auditLogs }: ToolDetailTabsProps) {
  return (
    <Tabs defaultValue="summary">
      <TabsList>
        <TabsTrigger value="summary">Résumé</TabsTrigger>
        <TabsTrigger value="assessments">
          Évaluation des risques
          {tool.riskAssessments.length > 0 && (
            <span className="ml-1.5 rounded-full bg-primary/10 px-1.5 py-0.5 text-xs font-medium text-primary">
              {tool.riskAssessments.length}
            </span>
          )}
        </TabsTrigger>
        <TabsTrigger value="documents">
          Documents
          {tool.complianceDocuments.length > 0 && (
            <span className="ml-1.5 rounded-full bg-primary/10 px-1.5 py-0.5 text-xs font-medium text-primary">
              {tool.complianceDocuments.length}
            </span>
          )}
        </TabsTrigger>
        <TabsTrigger value="history">Historique</TabsTrigger>
      </TabsList>

      <TabsContent value="summary" className="mt-6">
        <ToolSummaryTab tool={tool} />
      </TabsContent>

      <TabsContent value="assessments" className="mt-6">
        <ToolAssessmentsTab tool={tool} />
      </TabsContent>

      <TabsContent value="documents" className="mt-6">
        <ToolDocumentsTab tool={tool} />
      </TabsContent>

      <TabsContent value="history" className="mt-6">
        <ToolHistoryTab logs={auditLogs} />
      </TabsContent>
    </Tabs>
  );
}
