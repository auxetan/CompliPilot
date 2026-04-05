import { Bot, ShieldAlert, FileText, Bell } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import type { DashboardStats } from '../types';

interface StatCardProps {
  label: string;
  value: number;
  icon: React.ComponentType<{ className?: string }>;
  iconColor: string;
  iconBg: string;
}

function StatCard({ label, value, icon: Icon, iconColor, iconBg }: StatCardProps) {
  return (
    <Card>
      <CardContent className="flex items-center gap-4">
        <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-lg ${iconBg}`}>
          <Icon className={`h-6 w-6 ${iconColor}`} aria-hidden="true" />
        </div>
        <div>
          <p className="text-2xl font-semibold">{value}</p>
          <p className="text-sm text-muted-foreground">{label}</p>
        </div>
      </CardContent>
    </Card>
  );
}

interface StatCardsProps {
  stats: DashboardStats;
}

/**
 * 2×2 grid of stat cards — AI tools, high-risk, documents, alerts.
 */
export function StatCards({ stats }: StatCardsProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <StatCard
        label="Outils IA"
        value={stats.totalTools}
        icon={Bot}
        iconColor="text-primary"
        iconBg="bg-primary/10"
      />
      <StatCard
        label="Risques eleves"
        value={stats.highRiskTools}
        icon={ShieldAlert}
        iconColor="text-destructive"
        iconBg="bg-destructive/10"
      />
      <StatCard
        label="Documents"
        value={stats.totalDocuments}
        icon={FileText}
        iconColor="text-success"
        iconBg="bg-success/10"
      />
      <StatCard
        label="Alertes"
        value={stats.unreadAlerts}
        icon={Bell}
        iconColor="text-warning"
        iconBg="bg-warning/10"
      />
    </div>
  );
}
