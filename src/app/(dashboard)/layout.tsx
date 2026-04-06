import { TooltipProvider } from '@/components/ui/tooltip';
import { Sidebar } from '@/components/layout/sidebar';
import { Topbar } from '@/components/layout/topbar';
import { CommandSearch } from '@/features/dashboard/components/command-search';
import { getUser, getOrgId } from '@/lib/supabase/server';
import { getRecentAlerts, getUnreadAlertCount } from '@/features/monitoring/services/alert-service';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default async function DashboardLayout({ children }: DashboardLayoutProps) {
  const user = await getUser();

  const userName = user?.user_metadata?.full_name as string | undefined;
  const userEmail = user?.email;
  const plan = (user?.app_metadata?.plan as string) ?? 'free';

  // Fetch alerts for the notification popover
  const orgId = await getOrgId();
  const [alerts, unreadCount] = orgId
    ? await Promise.all([getRecentAlerts(orgId, 5), getUnreadAlertCount(orgId)])
    : [[], 0];

  return (
    <TooltipProvider delay={0}>
      <div className="flex h-screen overflow-hidden">
        <Sidebar plan={plan} />
        <div className="flex flex-1 flex-col overflow-hidden">
          <Topbar
            userName={userName}
            userEmail={userEmail}
            alerts={alerts}
            unreadCount={unreadCount}
          />
          <main className="flex-1 overflow-y-auto">
            <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">{children}</div>
          </main>
          <CommandSearch />
        </div>
      </div>
    </TooltipProvider>
  );
}
