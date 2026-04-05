'use client';

import { useState, useTransition } from 'react';
import { useForm, type Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, ArrowRight, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import {
  createToolStep1Schema,
  createToolStep2Schema,
  createToolSchema,
  TOOL_CATEGORIES,
  TOOL_CATEGORY_LABELS,
  DATA_TYPES,
  DATA_TYPE_LABELS,
  PROVIDER_SUGGESTIONS,
  type CreateToolStep1Input,
  type CreateToolStep2Input,
} from '@/features/scanner/schemas';
import { createAiTool } from '@/features/scanner/actions';

export function AddToolForm() {
  const [step, setStep] = useState<1 | 2>(1);
  const [isPending, startTransition] = useTransition();

  const step1Form = useForm<CreateToolStep1Input>({
    resolver: zodResolver(createToolStep1Schema),
    defaultValues: {
      name: '',
      provider: '',
      description: '',
      url: '',
    },
  });

  const step2Form = useForm<CreateToolStep2Input>({
    resolver: zodResolver(createToolStep2Schema) as Resolver<CreateToolStep2Input>,
    defaultValues: {
      usageContext: '',
      dataTypesProcessed: [],
      userCount: 1,
      isCustomerFacing: false,
      automatedDecisions: false,
    },
  });

  async function goToStep2() {
    const valid = await step1Form.trigger();
    if (valid) setStep(2);
  }

  function handleSubmit() {
    step2Form.handleSubmit((step2Data) => {
      const step1Data = step1Form.getValues();
      const fullData = { ...step1Data, ...step2Data };

      const validated = createToolSchema.safeParse(fullData);
      if (!validated.success) {
        toast.error('Données invalides. Vérifiez le formulaire.');
        return;
      }

      startTransition(async () => {
        try {
          await createAiTool(validated.data);
        } catch {
          toast.error("Erreur lors de la création de l'outil");
        }
      });
    })();
  }

  return (
    <div className="mx-auto max-w-2xl">
      {/* Step indicator */}
      <div className="mb-8 flex items-center gap-4">
        <StepIndicator number={1} label="Informations" active={step === 1} completed={step > 1} />
        <div className="h-px flex-1 bg-border" />
        <StepIndicator
          number={2}
          label="Contexte d'utilisation"
          active={step === 2}
          completed={false}
        />
      </div>

      {/* Step 1 */}
      {step === 1 && (
        <Card>
          <CardHeader>
            <CardTitle>Informations de base</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">
                Nom de l&apos;outil <span className="text-destructive">*</span>
              </Label>
              <Input
                id="name"
                placeholder="Ex: ChatGPT, Copilot, HireVue..."
                {...step1Form.register('name')}
                aria-invalid={!!step1Form.formState.errors.name}
              />
              {step1Form.formState.errors.name && (
                <p className="text-sm text-destructive">
                  {step1Form.formState.errors.name.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="provider">
                Fournisseur <span className="text-destructive">*</span>
              </Label>
              <Input
                id="provider"
                placeholder="Ex: OpenAI, Google, Microsoft..."
                list="provider-suggestions"
                {...step1Form.register('provider')}
                aria-invalid={!!step1Form.formState.errors.provider}
              />
              <datalist id="provider-suggestions">
                {PROVIDER_SUGGESTIONS.map((p) => (
                  <option key={p} value={p} />
                ))}
              </datalist>
              {step1Form.formState.errors.provider && (
                <p className="text-sm text-destructive">
                  {step1Form.formState.errors.provider.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label>
                Catégorie <span className="text-destructive">*</span>
              </Label>
              <Select
                value={step1Form.watch('category') ?? ''}
                onValueChange={(v) =>
                  step1Form.setValue('category', v as CreateToolStep1Input['category'], {
                    shouldValidate: true,
                  })
                }
              >
                <SelectTrigger aria-invalid={!!step1Form.formState.errors.category}>
                  <SelectValue placeholder="Sélectionner une catégorie" />
                </SelectTrigger>
                <SelectContent>
                  {TOOL_CATEGORIES.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {TOOL_CATEGORY_LABELS[cat]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {step1Form.formState.errors.category && (
                <p className="text-sm text-destructive">
                  {step1Form.formState.errors.category.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Décrivez brièvement cet outil..."
                rows={3}
                {...step1Form.register('description')}
              />
              {step1Form.formState.errors.description && (
                <p className="text-sm text-destructive">
                  {step1Form.formState.errors.description.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="url">URL de l&apos;outil (optionnel)</Label>
              <Input id="url" type="url" placeholder="https://..." {...step1Form.register('url')} />
              {step1Form.formState.errors.url && (
                <p className="text-sm text-destructive">{step1Form.formState.errors.url.message}</p>
              )}
            </div>

            <div className="flex justify-end pt-4">
              <Button onClick={goToStep2}>
                Suivant
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 2 */}
      {step === 2 && (
        <Card>
          <CardHeader>
            <CardTitle>Contexte d&apos;utilisation</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="usageContext">
                Comment votre entreprise utilise cet outil ?{' '}
                <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="usageContext"
                placeholder="Décrivez précisément comment cet outil est utilisé dans votre entreprise. Plus la description est détaillée, plus l'évaluation sera précise."
                rows={5}
                {...step2Form.register('usageContext')}
                aria-invalid={!!step2Form.formState.errors.usageContext}
              />
              {step2Form.formState.errors.usageContext && (
                <p className="text-sm text-destructive">
                  {step2Form.formState.errors.usageContext.message}
                </p>
              )}
            </div>

            <div className="space-y-3">
              <Label>
                Types de données traitées <span className="text-destructive">*</span>
              </Label>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {DATA_TYPES.map((dt) => (
                  <div key={dt} className="flex items-center gap-2">
                    <Checkbox
                      id={`dt-${dt}`}
                      checked={step2Form.watch('dataTypesProcessed').includes(dt)}
                      onCheckedChange={(checked) => {
                        const current = step2Form.getValues('dataTypesProcessed');
                        if (checked) {
                          step2Form.setValue('dataTypesProcessed', [...current, dt], {
                            shouldValidate: true,
                          });
                        } else {
                          step2Form.setValue(
                            'dataTypesProcessed',
                            current.filter((d) => d !== dt),
                            { shouldValidate: true },
                          );
                        }
                      }}
                    />
                    <Label htmlFor={`dt-${dt}`} className="cursor-pointer text-sm font-normal">
                      {DATA_TYPE_LABELS[dt]}
                    </Label>
                  </div>
                ))}
              </div>
              {step2Form.formState.errors.dataTypesProcessed && (
                <p className="text-sm text-destructive">
                  {step2Form.formState.errors.dataTypesProcessed.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="userCount">
                Nombre d&apos;employés utilisant l&apos;outil{' '}
                <span className="text-destructive">*</span>
              </Label>
              <Input
                id="userCount"
                type="number"
                min={1}
                {...step2Form.register('userCount')}
                aria-invalid={!!step2Form.formState.errors.userCount}
              />
              {step2Form.formState.errors.userCount && (
                <p className="text-sm text-destructive">
                  {step2Form.formState.errors.userCount.message}
                </p>
              )}
            </div>

            <div className="flex items-center justify-between rounded-lg border border-border p-4">
              <div>
                <Label htmlFor="isCustomerFacing" className="cursor-pointer">
                  Interaction directe avec vos clients ?
                </Label>
                <p className="text-sm text-muted-foreground">
                  L&apos;outil interagit-il directement avec vos clients finaux ?
                </p>
              </div>
              <Switch
                id="isCustomerFacing"
                checked={step2Form.watch('isCustomerFacing')}
                onCheckedChange={(v) => step2Form.setValue('isCustomerFacing', v)}
              />
            </div>

            <div className="flex items-center justify-between rounded-lg border border-border p-4">
              <div>
                <Label htmlFor="automatedDecisions" className="cursor-pointer">
                  Décisions automatisées ?
                </Label>
                <p className="text-sm text-muted-foreground">
                  L&apos;outil prend-il des décisions sans intervention humaine ?
                </p>
              </div>
              <Switch
                id="automatedDecisions"
                checked={step2Form.watch('automatedDecisions')}
                onCheckedChange={(v) => step2Form.setValue('automatedDecisions', v)}
              />
            </div>

            <div className="flex justify-between pt-4">
              <Button variant="outline" onClick={() => setStep(1)}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Précédent
              </Button>
              <Button onClick={handleSubmit} disabled={isPending}>
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isPending ? 'Création...' : "Créer l'outil"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function StepIndicator({
  number,
  label,
  active,
  completed,
}: {
  number: number;
  label: string;
  active: boolean;
  completed: boolean;
}) {
  return (
    <div className="flex items-center gap-2">
      <div
        className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium ${
          active
            ? 'bg-primary text-primary-foreground'
            : completed
              ? 'bg-green-500 text-white'
              : 'bg-muted text-muted-foreground'
        }`}
      >
        {completed ? '✓' : number}
      </div>
      <span
        className={`hidden text-sm sm:inline ${active ? 'font-medium' : 'text-muted-foreground'}`}
      >
        {label}
      </span>
    </div>
  );
}
