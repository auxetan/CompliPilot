import { ResetPasswordForm } from '@/features/auth/components/reset-password-form';

export const metadata = {
  title: 'Nouveau mot de passe',
  description: 'Definissez votre nouveau mot de passe CompliPilot.',
};

/**
 * Reset password page — shown after clicking the password reset link.
 */
export default function ResetPasswordPage() {
  return (
    <div className="mx-auto w-full max-w-sm space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">Nouveau mot de passe</h1>
        <p className="text-sm text-muted-foreground">
          Choisissez un nouveau mot de passe pour votre compte.
        </p>
      </div>
      <ResetPasswordForm />
    </div>
  );
}
