import Link from 'next/link';
import { cn } from '@/lib/utils';

type Variant = 'default' | 'outline' | 'ghost' | 'secondary' | 'destructive' | 'link';
type Size = 'default' | 'sm' | 'lg';

interface LinkButtonProps {
  href: string;
  variant?: Variant;
  size?: Size;
  className?: string;
  children: React.ReactNode;
}

const VARIANT_CLASSES: Record<Variant, string> = {
  default: 'bg-primary text-primary-foreground hover:bg-primary/80',
  outline: 'border border-border bg-background hover:bg-muted hover:text-foreground',
  ghost: 'hover:bg-muted hover:text-foreground',
  secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
  destructive: 'bg-destructive/10 text-destructive hover:bg-destructive/20',
  link: 'text-primary underline-offset-4 hover:underline',
};

const SIZE_CLASSES: Record<Size, string> = {
  default: 'h-8 px-2.5 text-sm',
  sm: 'h-7 px-2.5 text-[0.8rem]',
  lg: 'h-9 px-2.5 text-sm',
};

/**
 * Server Component–compatible link styled as a button.
 * Use this in Server Components where buttonVariants() cannot be called.
 */
export function LinkButton({
  href,
  variant = 'default',
  size = 'default',
  className,
  children,
}: LinkButtonProps) {
  return (
    <Link
      href={href}
      className={cn(
        'inline-flex items-center justify-center gap-1.5 rounded-lg font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:ring-3 focus-visible:ring-ring/50',
        VARIANT_CLASSES[variant],
        SIZE_CLASSES[size],
        className,
      )}
    >
      {children}
    </Link>
  );
}
