import Link from 'next/link';
import { ShieldCheck } from 'lucide-react';

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-secondary/30 px-4">
      <div className="mb-8">
        <Link href="/" className="flex items-center gap-2 text-xl font-semibold">
          <ShieldCheck className="h-7 w-7 text-primary" />
          <span>CompliPilot</span>
        </Link>
      </div>
      <div className="w-full max-w-md">{children}</div>
    </div>
  );
}
