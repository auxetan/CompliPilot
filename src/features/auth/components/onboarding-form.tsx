'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Loader2, ArrowRight, ArrowLeft, Building2, Scale, Bot } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import {
  onboardingStep1Schema,
  onboardingStep2Schema,
  onboardingStep3Schema,
  type OnboardingStep1Values,
} from '@/lib/validations/auth';
import { REGULATION_LABELS } from '@/lib/constants';
import { completeOnboardingAction } from '../actions/auth-actions';

const INDUSTRIES = [
  'Technologie',
  'Finance / Banque',
  'Assurance',
  'Sante',
  'E-commerce',
  'Education',
  'Industrie',
  'Conseil',
  'Juridique',
  'Autre',
];

const COUNTRIES = [
  { value: 'FR', label: 'France' },
  { value: 'DE', label: 'Allemagne' },
  { value: 'ES', label: 'Espagne' },
  { value: 'IT', label: 'Italie' },
  { value: 'NL', label: 'Pays-Bas' },
  { value: 'BE', label: 'Belgique' },
  { value: 'LU', label: 'Luxembourg' },
  { value: 'CH', label: 'Suisse' },
  { value: 'OTHER', label: 'Autre pays UE' },
];

const STEPS = [
  { icon: Building2, title: 'Votre organisation' },
  { icon: Scale, title: 'Reglementations' },
  { icon: Bot, title: 'Outils IA' },
] as const;

export function OnboardingForm() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  // Step 1 form
  const step1Form = useForm<OnboardingStep1Values>({
    resolver: zodResolver(onboardingStep1Schema),
    defaultValues: { name: '', industry: '', country: 'FR', employeeCount: 0 },
  });

  const watchedIndustry = useWatch({ control: step1Form.control, name: 'industry' });
  const watchedCountry = useWatch({ control: step1Form.control, name: 'country' });

  // Step 2 state
  const [selectedRegulations, setSelectedRegulations] = useState<string[]>([]);

  // Step 3 state
  const [aiToolRange, setAiToolRange] = useState<string>('');

  function toggleRegulation(reg: string) {
    setSelectedRegulations((prev) =>
      prev.includes(reg) ? prev.filter((r) => r !== reg) : [...prev, reg],
    );
  }

  async function handleNext() {
    if (currentStep === 0) {
      const valid = await step1Form.trigger();
      if (!valid) return;
      setCurrentStep(1);
    } else if (currentStep === 1) {
      const parsed = onboardingStep2Schema.safeParse({ regulations: selectedRegulations });
      if (!parsed.success) {
        toast.error(parsed.error.issues[0]?.message ?? 'Selectionnez au moins une reglementation');
        return;
      }
      setCurrentStep(2);
    } else if (currentStep === 2) {
      const parsed = onboardingStep3Schema.safeParse({ aiToolRange });
      if (!parsed.success) {
        toast.error('Selectionnez une tranche');
        return;
      }
      await handleSubmit();
    }
  }

  function handleBack() {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  }

  async function handleSubmit() {
    setIsLoading(true);
    const values = step1Form.getValues();
    const formData = new FormData();
    formData.set('name', values.name);
    formData.set('industry', values.industry);
    formData.set('country', values.country);
    formData.set('employeeCount', String(values.employeeCount));
    selectedRegulations.forEach((reg) => formData.append('regulations', reg));
    formData.set('aiToolRange', aiToolRange);

    const result = await completeOnboardingAction(formData);
    setIsLoading(false);

    if (result.success && result.redirectTo) {
      router.push(result.redirectTo);
      router.refresh();
    } else {
      toast.error(result.error ?? 'Erreur lors de la configuration');
    }
  }

  return (
    <div className="w-full max-w-lg mx-auto">
      {/* Stepper */}
      <div className="mb-8 flex items-center justify-center gap-2">
        {STEPS.map((step, i) => (
          <div key={step.title} className="flex items-center gap-2">
            <div
              className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-medium transition-colors ${
                i <= currentStep
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground'
              }`}
            >
              {i + 1}
            </div>
            <span className="hidden text-sm sm:inline">{step.title}</span>
            {i < STEPS.length - 1 && (
              <div className={`h-px w-8 ${i < currentStep ? 'bg-primary' : 'bg-border'}`} />
            )}
          </div>
        ))}
      </div>

      <Card>
        {/* Step 1: Organization */}
        {currentStep === 0 && (
          <>
            <CardHeader>
              <CardTitle>Votre organisation</CardTitle>
              <CardDescription>Parlez-nous de votre entreprise.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nom de l&apos;organisation</Label>
                <Input id="name" placeholder="Acme SAS" {...step1Form.register('name')} />
                {step1Form.formState.errors.name && (
                  <p className="text-sm text-destructive">
                    {step1Form.formState.errors.name.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="industry">Industrie</Label>
                <Select
                  value={watchedIndustry}
                  onValueChange={(v) =>
                    step1Form.setValue('industry', v ?? '', { shouldValidate: true })
                  }
                >
                  <SelectTrigger id="industry">
                    <SelectValue placeholder="Selectionnez votre industrie" />
                  </SelectTrigger>
                  <SelectContent>
                    {INDUSTRIES.map((ind) => (
                      <SelectItem key={ind} value={ind}>
                        {ind}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {step1Form.formState.errors.industry && (
                  <p className="text-sm text-destructive">
                    {step1Form.formState.errors.industry.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="country">Pays</Label>
                <Select
                  value={watchedCountry}
                  onValueChange={(v) =>
                    step1Form.setValue('country', v ?? '', { shouldValidate: true })
                  }
                >
                  <SelectTrigger id="country">
                    <SelectValue placeholder="Selectionnez votre pays" />
                  </SelectTrigger>
                  <SelectContent>
                    {COUNTRIES.map((c) => (
                      <SelectItem key={c.value} value={c.value}>
                        {c.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="employeeCount">Nombre d&apos;employes</Label>
                <Input
                  id="employeeCount"
                  type="number"
                  min={1}
                  placeholder="50"
                  {...step1Form.register('employeeCount')}
                />
                {step1Form.formState.errors.employeeCount && (
                  <p className="text-sm text-destructive">
                    {step1Form.formState.errors.employeeCount.message}
                  </p>
                )}
              </div>
            </CardContent>
          </>
        )}

        {/* Step 2: Regulations */}
        {currentStep === 1 && (
          <>
            <CardHeader>
              <CardTitle>Reglementations</CardTitle>
              <CardDescription>
                Quelles reglementations vous concernent ? (Selectionnez au moins une)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {(Object.entries(REGULATION_LABELS) as [string, string][]).map(([key, label]) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => toggleRegulation(key)}
                    className={`rounded-lg border p-4 text-left transition-colors ${
                      selectedRegulations.includes(key)
                        ? 'border-primary bg-primary/5 ring-1 ring-primary'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <span className="font-medium">{label}</span>
                  </button>
                ))}
              </div>
            </CardContent>
          </>
        )}

        {/* Step 3: AI Tools */}
        {currentStep === 2 && (
          <>
            <CardHeader>
              <CardTitle>Vos outils IA</CardTitle>
              <CardDescription>
                Combien d&apos;outils IA utilisez-vous approximativement ?
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                {['1-5', '6-20', '20+'].map((range) => (
                  <button
                    key={range}
                    type="button"
                    onClick={() => setAiToolRange(range)}
                    className={`rounded-lg border p-6 text-center transition-colors ${
                      aiToolRange === range
                        ? 'border-primary bg-primary/5 ring-1 ring-primary'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <span className="text-2xl font-semibold">{range}</span>
                    <span className="mt-1 block text-sm text-muted-foreground">outils</span>
                  </button>
                ))}
              </div>
            </CardContent>
          </>
        )}

        <CardFooter className="flex justify-between">
          <Button
            type="button"
            variant="ghost"
            onClick={handleBack}
            disabled={currentStep === 0 || isLoading}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour
          </Button>
          <Button type="button" onClick={handleNext} disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {currentStep === 2 ? 'Terminer' : 'Suivant'}
            {currentStep < 2 && <ArrowRight className="ml-2 h-4 w-4" />}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
