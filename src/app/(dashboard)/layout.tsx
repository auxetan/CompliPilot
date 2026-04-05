import { TooltipProvider } from '@/components/ui/tooltip';
import { Sidebar } from '@/components/layout/sidebar';
import { Topbar } from '@/components/layout/topbar';
import { CommandSearch } from '@/features/dashboard/components/command-search';
import { getUser } from '@/lib/supabase/server';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default async function DashboardLayout({ children }: DashboardLayoutProps) {
  const user = await getUser();

  const userName = user?.user_metadata?.full_name as string | undefined;
  const userEmail = user?.email;
  const plan = (user?.app_metadata?.plan as string) ?? 'free';

  return (
    <TooltipProvider delay={0}>
      <div className="flex h-screen overflow-hidden">
        <Sidebar plan={plan} />
        <div className="flex flex-1 flex-col overflow-hidden">
          <Topbar userName={userName} userEmail={userEmail} />
          <main className="flex-1 overflow-y-auto">
            <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">{children}</div>
          </main>
          <CommandSearch />
        </div>
      </div>
    </TooltipProvider>
  );
}
