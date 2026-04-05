# MEGA-PROMPT COMPLET — CompliPilot : SaaS de Compliance IA pour PME

> **MODE D'EMPLOI** : Ce document est un prompt exhaustif a donner a une IA de code (Cursor, Claude, etc.) pour construire CompliPilot etape par etape. Chaque etape contient son propre prompt autonome. Tu copies le prompt de l'etape, tu le donnes a l'IA, tu valides le resultat, puis tu passes a l'etape suivante. NE SAUTE AUCUNE ETAPE.

---

## TABLE DES MATIERES

1. [CONTEXTE GLOBAL DU PROJET](#1-contexte-global)
2. [STACK TECHNIQUE & JUSTIFICATIONS](#2-stack-technique)
3. [DIRECTION ARTISTIQUE (DA)](#3-direction-artistique)
4. [ARCHITECTURE & STRUCTURE DU PROJET](#4-architecture)
5. [SCHEMA DE BASE DE DONNEES](#5-schema-bdd)
6. [ETAPES DE DEVELOPPEMENT (12 ETAPES)](#6-etapes)
   - Etape 1 : Setup du projet & config de base
   - Etape 2 : Systeme d'authentification & multi-tenancy
   - Etape 3 : Design System & Layout principal
   - Etape 4 : Landing page & pages marketing
   - Etape 5 : Dashboard principal & navigation
   - Etape 6 : Module "AI Scanner" — inventaire des outils IA
   - Etape 7 : Module "Risk Assessment" — classification des risques
   - Etape 8 : Module "Document Generator" — generation IA de docs compliance
   - Etape 9 : Module "Monitoring & Alerts" — suivi temps reel
   - Etape 10 : Systeme de billing Stripe
   - Etape 11 : Settings, profil, gestion d'equipe
   - Etape 12 : Tests, SEO, performance, deploiement

---

## 1. CONTEXTE GLOBAL

```
Tu es un developpeur senior full-stack expert en Next.js, TypeScript, Supabase, et Tailwind CSS.
Tu vas construire "CompliPilot" — un SaaS B2B qui aide les PME a se mettre en conformite
avec les reglementations IA (EU AI Act, RGPD, NIS2, DORA).

LE PRODUIT :
- Scanne les outils IA utilises par une entreprise
- Classifie chaque outil selon le niveau de risque EU AI Act (inacceptable, high-risk, limited, minimal)
- Genere automatiquement la documentation legale requise via LLM (evaluations d'impact, registres, fiches transparence)
- Dashboard temps reel du score de conformite
- Alertes quand une reglementation change
- Rapports pre-formates pour auditeurs
- Multi-reglementation : EU AI Act + RGPD + NIS2 + DORA
- Systeme de billing par abonnement (Starter/Growth/Enterprise)

CIBLE : PME europeennes et startups tech (1 a 1000 employes)
PRICING : Starter 199EUR/mois, Growth 499EUR/mois, Enterprise 1499EUR/mois

PRINCIPES FONDAMENTAUX A RESPECTER DANS TOUT LE CODE :
1. TypeScript STRICT partout — zero "any", zero "as any"
2. Server Components par defaut, "use client" UNIQUEMENT quand necessaire
3. Toute donnee sensible cote serveur uniquement (Server Actions, Route Handlers)
4. Row-Level Security (RLS) sur CHAQUE table Supabase — zero exception
5. Separation stricte features/ — chaque module est autonome
6. Accessibilite WCAG 2.1 AA minimum (aria-labels, keyboard nav, focus management)
7. Dark mode natif via CSS variables Tailwind + shadcn/ui
8. Responsive mobile-first
9. Code DRY — utilitaires partages dans lib/
10. Commentaires JSDoc sur chaque fonction exportee
11. Nommage : camelCase variables/fonctions, PascalCase composants/types, SCREAMING_SNAKE constantes
12. Erreurs gerees proprement partout (try/catch, error boundaries, toast notifications)
13. Pas de console.log en production — utiliser un logger structure
14. Variables d'environnement validees au demarrage via zod
15. Chaque composant < 150 lignes — sinon decomposer
```

---

## 2. STACK TECHNIQUE

```
STACK TECHNIQUE DEFINITIVE — NE PAS DEVIER :

FRONTEND :
- Next.js 15+ (App Router UNIQUEMENT, zero Pages Router)
- TypeScript 5.x (mode strict)
- Tailwind CSS 4 (config via CSS, pas tailwind.config.js)
- shadcn/ui (copier les composants, pas installer comme package)
- Radix UI (via shadcn, pour l'accessibilite)
- Lucide React (icones)
- Recharts (graphiques dashboard)
- React Hook Form + Zod (formulaires + validation)
- Framer Motion (animations subtiles)
- next-intl (i18n — FR/EN minimum)
- nuqs (state URL search params)

BACKEND :
- Supabase (PostgreSQL + Auth + Storage + Realtime + Edge Functions)
- Drizzle ORM (type-safe, migrations, pas Prisma — trop lourd)
- Supabase Auth (Magic Link + Google OAuth + Email/Password)
- Row-Level Security PostgreSQL natif

IA / LLM :
- Anthropic Claude API (claude-sonnet-4-20250514) pour la generation de documents
- Structured Outputs (schema Zod → JSON garanti)
- Vercel AI SDK (useChat, useCompletion, streamText)
- Systeme de prompts versiones dans /prompts/ (pas en dur dans le code)

PAIEMENT :
- Stripe Checkout (creation de session via Server Actions)
- Stripe Webhooks (sync abonnements → Supabase)
- Stripe Customer Portal (gestion autonome par le client)

INFRA / DEPLOY :
- Vercel (hosting + edge functions + preview deploys)
- Supabase Cloud (database + auth + storage)
- Resend (emails transactionnels)
- Upstash Redis (rate limiting + cache)
- Sentry (error tracking)
- PostHog (analytics produit)

TESTING :
- Vitest (unit tests)
- Playwright (E2E tests)
- Testing Library (composants React)

QUALITE CODE :
- ESLint (next/core-web-vitals + typescript-eslint strict)
- Prettier (formatage auto)
- Husky + lint-staged (pre-commit hooks)
- commitlint (conventional commits)

POURQUOI CES CHOIX :
- Next.js App Router : Server Components = moins de JS client, meilleur SEO, streaming
- Supabase vs Firebase : PostgreSQL > NoSQL pour du B2B compliance, RLS natif, open-source
- Drizzle vs Prisma : Plus leger, migrations SQL pures, meilleur type inference
- Claude vs GPT : Meilleur sur les taches de raisonnement long et la generation de documents structures
- shadcn/ui : Composants copiables = controle total, pas de dependance externe fragile
- Vercel AI SDK : Abstraction propre pour le streaming, compatible Claude + GPT
```

---

## 3. DIRECTION ARTISTIQUE (DA)

```
DIRECTION ARTISTIQUE — RESPECTER A LA LETTRE :

NOM : CompliPilot
TAGLINE : "AI-Powered Compliance on Autopilot"
POSITIONNEMENT VISUEL : Professionnel, rassurant, tech-premium. Inspire confiance et serieux
(c'est de la compliance legale). Pas de design "startup fun" — plutot "enterprise accessible".

PALETTE DE COULEURS (CSS Variables) :

Mode Clair :
  --background: 0 0% 100%          /* #FFFFFF — fond principal */
  --foreground: 222 47% 11%        /* #0F172A — texte principal */
  --card: 210 40% 98%              /* #F8FAFC — fond cartes */
  --card-foreground: 222 47% 11%   /* #0F172A */
  --primary: 217 91% 60%           /* #3B82F6 — bleu action principal */
  --primary-foreground: 0 0% 100%  /* #FFFFFF */
  --secondary: 210 40% 96%         /* #F1F5F9 — gris clair secondaire */
  --accent: 262 83% 58%            /* #8B5CF6 — violet accent */
  --success: 142 76% 36%           /* #16A34A — vert conformite OK */
  --warning: 38 92% 50%            /* #F59E0B — orange attention */
  --destructive: 0 84% 60%         /* #EF4444 — rouge non-conforme */
  --muted: 210 40% 96%             /* #F1F5F9 */
  --border: 214 32% 91%            /* #E2E8F0 */
  --ring: 217 91% 60%              /* #3B82F6 */

Mode Sombre :
  --background: 222 47% 11%        /* #0F172A */
  --foreground: 210 40% 98%        /* #F8FAFC */
  --card: 217 33% 17%              /* #1E293B */
  --card-foreground: 210 40% 98%   /* #F8FAFC */
  --primary: 217 91% 60%           /* #3B82F6 */
  --secondary: 217 33% 17%         /* #1E293B */
  --accent: 262 83% 68%            /* #A78BFA */
  --border: 217 33% 25%            /* #334155 */

TYPOGRAPHIE :
  - Font principale : Inter (Google Fonts) — clean, lisible, pro
  - Font monospace (code/donnees) : JetBrains Mono
  - Tailles : system fluid (clamp) pour responsive
  - Headings : Semi-bold (600), Body : Regular (400)

COMPOSANTS UI — REGLES :
  - Border-radius : 8px (cartes), 6px (boutons), 12px (modales)
  - Shadows : subtiles, 1 niveau max (shadow-sm par defaut)
  - Spacing : multiple de 4px (Tailwind scale)
  - Boutons primaires : fond bleu #3B82F6, hover darken 10%, transition 150ms
  - Boutons secondaires : fond transparent, border gris, hover bg-secondary
  - Boutons destructifs : fond rouge, uniquement pour actions irreversibles
  - Cards : bg-card, border 1px border-border, radius 8px, padding 24px
  - Tableaux : header sticky, lignes alternees (striped), hover highlight
  - Formulaires : labels au-dessus, messages d'erreur en rouge sous le champ
  - Toasts : en bas a droite, auto-dismiss 5s, couleur selon type (success/error/info)

SCORE DE CONFORMITE — REPRESENTATION VISUELLE :
  - Score 0-39% : Rouge (#EF4444) — badge "Non-Conforme"
  - Score 40-69% : Orange (#F59E0B) — badge "En Cours"
  - Score 70-89% : Bleu (#3B82F6) — badge "Presque Conforme"
  - Score 90-100% : Vert (#16A34A) — badge "Conforme"
  - Affichage : cercle progressif animé (ring gauge) + pourcentage au centre

LOGO :
  - Icone : bouclier stylise avec un check et une etincelle IA
  - Utiliser Lucide "ShieldCheck" comme placeholder
  - Texte "CompliPilot" a cote en font Inter Semi-bold

ANIMATIONS :
  - Page transitions : fade-in 200ms
  - Cards : hover translateY(-2px) + shadow-md, transition 200ms
  - Score gauge : animation fill au chargement, 1s ease-out
  - Skeleton loaders pour tous les etats de chargement (pas de spinners)
  - Pas d'animations excessives — c'est un outil pro, pas un jeu
```

---

## 4. ARCHITECTURE & STRUCTURE DU PROJET

```
STRUCTURE DU PROJET — SUIVRE EXACTEMENT :

complipilot/
├── .env.local                     # Variables d'environnement (jamais commit)
├── .env.example                   # Template des variables requises
├── next.config.ts                 # Config Next.js
├── tailwind.config.ts             # Config Tailwind (si necessaire, sinon CSS-only v4)
├── drizzle.config.ts              # Config Drizzle ORM
├── tsconfig.json                  # TypeScript strict
├── middleware.ts                  # Auth middleware (redirect si pas connecte)
├── package.json
│
├── public/
│   ├── images/                    # Images statiques (logo, illustrations)
│   └── fonts/                     # Fonts locales si besoin
│
├── src/
│   ├── app/                       # Next.js App Router
│   │   ├── (marketing)/           # Route group — pages publiques
│   │   │   ├── page.tsx           # Landing page
│   │   │   ├── pricing/page.tsx
│   │   │   ├── about/page.tsx
│   │   │   ├── blog/
│   │   │   │   ├── page.tsx       # Liste articles
│   │   │   │   └── [slug]/page.tsx
│   │   │   └── layout.tsx         # Layout marketing (navbar + footer)
│   │   │
│   │   ├── (auth)/                # Route group — pages auth
│   │   │   ├── login/page.tsx
│   │   │   ├── register/page.tsx
│   │   │   ├── forgot-password/page.tsx
│   │   │   ├── verify-email/page.tsx
│   │   │   └── layout.tsx         # Layout auth (centre, minimaliste)
│   │   │
│   │   ├── (dashboard)/           # Route group — app authentifiee
│   │   │   ├── dashboard/
│   │   │   │   └── page.tsx       # Dashboard principal (score, resume)
│   │   │   ├── scanner/
│   │   │   │   ├── page.tsx       # Liste des outils IA scannes
│   │   │   │   ├── new/page.tsx   # Ajouter un outil IA
│   │   │   │   └── [id]/page.tsx  # Detail d'un outil
│   │   │   ├── risks/
│   │   │   │   ├── page.tsx       # Vue globale des risques
│   │   │   │   └── [id]/page.tsx  # Detail d'un risque
│   │   │   ├── documents/
│   │   │   │   ├── page.tsx       # Liste des documents generes
│   │   │   │   ├── new/page.tsx   # Generer un nouveau document
│   │   │   │   └── [id]/page.tsx  # Vue/edition d'un document
│   │   │   ├── monitoring/
│   │   │   │   └── page.tsx       # Monitoring & alertes
│   │   │   ├── reports/
│   │   │   │   ├── page.tsx       # Rapports pour auditeurs
│   │   │   │   └── [id]/page.tsx
│   │   │   ├── settings/
│   │   │   │   ├── page.tsx       # Settings generaux
│   │   │   │   ├── team/page.tsx  # Gestion equipe
│   │   │   │   ├── billing/page.tsx
│   │   │   │   └── profile/page.tsx
│   │   │   └── layout.tsx         # Layout dashboard (sidebar + topbar)
│   │   │
│   │   ├── api/
│   │   │   ├── webhooks/
│   │   │   │   └── stripe/route.ts  # Webhook Stripe
│   │   │   ├── ai/
│   │   │   │   └── generate/route.ts # Endpoint generation IA
│   │   │   └── cron/
│   │   │       └── check-regulations/route.ts # Cron check reglementations
│   │   │
│   │   ├── layout.tsx             # Root layout (providers, fonts, metadata)
│   │   ├── globals.css            # CSS global + variables couleurs
│   │   ├── not-found.tsx
│   │   └── error.tsx
│   │
│   ├── components/                # Composants PARTAGES (utilises partout)
│   │   ├── ui/                    # shadcn/ui components (button, card, dialog, etc.)
│   │   ├── layout/
│   │   │   ├── sidebar.tsx
│   │   │   ├── topbar.tsx
│   │   │   ├── mobile-nav.tsx
│   │   │   └── footer.tsx
│   │   ├── shared/
│   │   │   ├── compliance-score-gauge.tsx  # Gauge circulaire du score
│   │   │   ├── risk-badge.tsx             # Badge niveau de risque
│   │   │   ├── regulation-tag.tsx         # Tag reglementation (RGPD, AI Act, etc.)
│   │   │   ├── data-table.tsx             # Table de donnees generique
│   │   │   ├── empty-state.tsx            # Etat vide avec CTA
│   │   │   ├── page-header.tsx            # Header de page standard
│   │   │   ├── confirm-dialog.tsx         # Dialog de confirmation
│   │   │   └── loading-skeleton.tsx       # Squelettes de chargement
│   │   └── providers/
│   │       ├── theme-provider.tsx         # Dark/light mode
│   │       ├── toast-provider.tsx
│   │       └── query-provider.tsx         # TanStack Query si besoin
│   │
│   ├── features/                  # Modules METIER (feature-based)
│   │   ├── auth/
│   │   │   ├── components/        # Composants specifiques auth
│   │   │   ├── actions/           # Server Actions auth
│   │   │   ├── hooks/             # useAuth, useSession, etc.
│   │   │   └── types.ts
│   │   ├── scanner/
│   │   │   ├── components/        # AiToolCard, ScannerForm, ToolDetailView
│   │   │   ├── actions/           # addTool, deleteTool, scanTool
│   │   │   ├── hooks/             # useTools, useScanStatus
│   │   │   ├── services/          # Logique metier scanner
│   │   │   └── types.ts
│   │   ├── risks/
│   │   │   ├── components/        # RiskMatrix, RiskDetailPanel
│   │   │   ├── actions/
│   │   │   ├── services/          # Algorithme de classification risque
│   │   │   └── types.ts
│   │   ├── documents/
│   │   │   ├── components/        # DocumentEditor, TemplateSelector
│   │   │   ├── actions/           # generateDocument, exportPDF
│   │   │   ├── services/          # Logique generation + prompts
│   │   │   ├── templates/         # Templates de documents JSON
│   │   │   └── types.ts
│   │   ├── monitoring/
│   │   │   ├── components/        # AlertsList, ComplianceTimeline
│   │   │   ├── actions/
│   │   │   ├── services/
│   │   │   └── types.ts
│   │   ├── billing/
│   │   │   ├── components/        # PricingCard, PlanBadge, UsageMeter
│   │   │   ├── actions/           # createCheckout, manageBilling
│   │   │   ├── services/          # Stripe sync logic
│   │   │   └── types.ts
│   │   └── team/
│   │       ├── components/        # MemberList, InviteForm, RoleSelector
│   │       ├── actions/
│   │       └── types.ts
│   │
│   ├── lib/                       # Utilitaires & configs partages
│   │   ├── supabase/
│   │   │   ├── client.ts          # createBrowserClient
│   │   │   ├── server.ts          # createServerClient
│   │   │   ├── admin.ts           # createServiceRoleClient (serveur uniquement)
│   │   │   └── middleware.ts      # Helper pour middleware auth
│   │   ├── stripe/
│   │   │   ├── client.ts          # Stripe instance
│   │   │   ├── config.ts          # Plans, prix, features par plan
│   │   │   └── webhooks.ts        # Handlers webhook
│   │   ├── ai/
│   │   │   ├── client.ts          # Anthropic client config
│   │   │   ├── prompts/           # Fichiers de prompts versiones
│   │   │   │   ├── risk-classification.ts
│   │   │   │   ├── document-generation.ts
│   │   │   │   ├── bias-audit.ts
│   │   │   │   └── regulation-summary.ts
│   │   │   └── schemas/           # Schemas Zod pour structured outputs
│   │   │       ├── risk-assessment.ts
│   │   │       └── compliance-document.ts
│   │   ├── db/
│   │   │   ├── schema.ts          # Schema Drizzle (toutes les tables)
│   │   │   ├── migrations/        # Fichiers migration SQL
│   │   │   └── seed.ts            # Seed data (reglementations, templates)
│   │   ├── validations/           # Schemas Zod partages
│   │   │   ├── auth.ts
│   │   │   ├── tool.ts
│   │   │   ├── document.ts
│   │   │   └── settings.ts
│   │   ├── constants.ts           # Constantes globales
│   │   ├── env.ts                 # Validation variables d'env via Zod
│   │   ├── logger.ts              # Logger structure (pino ou similar)
│   │   └── utils.ts               # Helpers generiques (cn, formatDate, etc.)
│   │
│   ├── hooks/                     # Hooks React partages
│   │   ├── use-debounce.ts
│   │   ├── use-media-query.ts
│   │   └── use-local-storage.ts
│   │
│   └── types/                     # Types globaux
│       ├── database.ts            # Types generes depuis Supabase/Drizzle
│       ├── api.ts                 # Types API responses
│       └── globals.d.ts           # Declarations globales
│
├── supabase/
│   ├── config.toml                # Config Supabase locale
│   ├── migrations/                # Migrations SQL
│   └── seed.sql                   # Donnees initiales
│
├── tests/
│   ├── unit/                      # Tests unitaires (Vitest)
│   ├── integration/               # Tests integration
│   └── e2e/                       # Tests E2E (Playwright)
│
└── scripts/
    ├── seed-regulations.ts        # Script pour peupler les reglementations
    └── generate-types.ts          # Generer les types depuis la BDD
```

---

## 5. SCHEMA DE BASE DE DONNEES

```
SCHEMA POSTGRESQL (Drizzle ORM) — TABLES PRINCIPALES :

IMPORTANT : Chaque table a une colonne "org_id" (sauf organizations et profiles).
RLS active sur TOUTES les tables. Politique par defaut :
  SELECT/INSERT/UPDATE/DELETE WHERE org_id = auth.jwt()->>'org_id'

=== TABLES ===

1. profiles (extends auth.users)
   - id: uuid (PK, ref auth.users.id)
   - email: text NOT NULL
   - full_name: text
   - avatar_url: text
   - role: enum('owner', 'admin', 'member', 'viewer') DEFAULT 'member'
   - org_id: uuid (FK organizations.id)
   - created_at: timestamptz DEFAULT now()
   - updated_at: timestamptz DEFAULT now()

2. organizations
   - id: uuid (PK, DEFAULT gen_random_uuid())
   - name: text NOT NULL
   - slug: text UNIQUE NOT NULL
   - logo_url: text
   - industry: text
   - country: text DEFAULT 'FR'
   - employee_count: integer
   - stripe_customer_id: text UNIQUE
   - stripe_subscription_id: text
   - plan: enum('free', 'starter', 'growth', 'enterprise') DEFAULT 'free'
   - plan_period_end: timestamptz
   - compliance_score: integer DEFAULT 0 (0-100)
   - created_at: timestamptz DEFAULT now()
   - updated_at: timestamptz DEFAULT now()

3. ai_tools (outils IA declares par l'entreprise)
   - id: uuid (PK)
   - org_id: uuid (FK organizations.id) NOT NULL
   - name: text NOT NULL (ex: "ChatGPT", "Copilot", "HireVue")
   - provider: text (ex: "OpenAI", "Microsoft", "Custom")
   - category: enum('chatbot', 'recruitment', 'scoring', 'content', 'analytics', 'automation', 'other')
   - description: text
   - usage_context: text (comment l'entreprise l'utilise)
   - data_types_processed: text[] (ex: ['personal_data', 'financial', 'health'])
   - user_count: integer (nombre d'employes qui l'utilisent)
   - is_customer_facing: boolean DEFAULT false
   - risk_level: enum('unacceptable', 'high', 'limited', 'minimal', 'not_assessed') DEFAULT 'not_assessed'
   - risk_score: integer (0-100)
   - last_assessed_at: timestamptz
   - status: enum('active', 'under_review', 'deprecated', 'blocked') DEFAULT 'active'
   - created_at: timestamptz DEFAULT now()
   - updated_at: timestamptz DEFAULT now()

4. risk_assessments
   - id: uuid (PK)
   - org_id: uuid (FK)
   - ai_tool_id: uuid (FK ai_tools.id)
   - regulation: enum('eu_ai_act', 'gdpr', 'nis2', 'dora')
   - risk_level: enum('unacceptable', 'high', 'limited', 'minimal')
   - risk_score: integer (0-100)
   - findings: jsonb (resultats detailles de l'evaluation)
   - recommendations: jsonb (actions recommandees)
   - assessed_by: enum('ai', 'manual', 'auditor')
   - assessed_at: timestamptz DEFAULT now()
   - expires_at: timestamptz (date de re-evaluation)
   - created_at: timestamptz DEFAULT now()

5. compliance_documents
   - id: uuid (PK)
   - org_id: uuid (FK)
   - ai_tool_id: uuid (FK ai_tools.id, nullable — certains docs sont globaux)
   - title: text NOT NULL
   - type: enum('impact_assessment', 'transparency_notice', 'technical_doc', 'risk_register', 'bias_audit', 'data_processing_record', 'conformity_declaration', 'custom')
   - regulation: enum('eu_ai_act', 'gdpr', 'nis2', 'dora', 'multi')
   - content: jsonb (contenu structure du document)
   - content_markdown: text (version markdown pour affichage)
   - status: enum('draft', 'review', 'approved', 'expired', 'archived') DEFAULT 'draft'
   - version: integer DEFAULT 1
   - generated_by: enum('ai', 'manual') DEFAULT 'ai'
   - approved_by: uuid (FK profiles.id, nullable)
   - approved_at: timestamptz
   - expires_at: timestamptz
   - pdf_url: text (URL Supabase Storage)
   - created_at: timestamptz DEFAULT now()
   - updated_at: timestamptz DEFAULT now()

6. regulations (table de reference — pas de RLS, lecture publique)
   - id: uuid (PK)
   - code: text UNIQUE NOT NULL (ex: 'eu_ai_act', 'gdpr')
   - name: text NOT NULL
   - full_name: text
   - jurisdiction: text (ex: 'EU', 'US', 'FR')
   - description: text
   - effective_date: date
   - last_updated: date
   - requirements: jsonb (liste structuree des exigences)
   - penalties: jsonb (amendes possibles)
   - source_url: text
   - created_at: timestamptz DEFAULT now()

7. compliance_checks (verifications individuelles)
   - id: uuid (PK)
   - org_id: uuid (FK)
   - regulation_id: uuid (FK regulations.id)
   - ai_tool_id: uuid (FK ai_tools.id, nullable)
   - requirement_key: text NOT NULL (identifiant de l'exigence)
   - requirement_label: text NOT NULL
   - status: enum('compliant', 'non_compliant', 'partial', 'not_applicable', 'not_checked') DEFAULT 'not_checked'
   - evidence: text (preuve de conformite)
   - notes: text
   - checked_at: timestamptz
   - checked_by: uuid (FK profiles.id, nullable)
   - created_at: timestamptz DEFAULT now()
   - updated_at: timestamptz DEFAULT now()

8. alerts
   - id: uuid (PK)
   - org_id: uuid (FK)
   - type: enum('regulation_update', 'deadline_approaching', 'score_dropped', 'document_expired', 'new_requirement', 'tool_risk_changed')
   - title: text NOT NULL
   - message: text NOT NULL
   - severity: enum('info', 'warning', 'critical') DEFAULT 'info'
   - is_read: boolean DEFAULT false
   - action_url: text (lien vers la page concernee)
   - metadata: jsonb
   - created_at: timestamptz DEFAULT now()

9. audit_logs
   - id: uuid (PK)
   - org_id: uuid (FK)
   - user_id: uuid (FK profiles.id)
   - action: text NOT NULL (ex: 'document.created', 'tool.assessed', 'settings.updated')
   - entity_type: text (ex: 'ai_tool', 'document', 'assessment')
   - entity_id: uuid
   - details: jsonb
   - ip_address: text
   - created_at: timestamptz DEFAULT now()

10. invitations
    - id: uuid (PK)
    - org_id: uuid (FK)
    - email: text NOT NULL
    - role: enum('admin', 'member', 'viewer') DEFAULT 'member'
    - invited_by: uuid (FK profiles.id)
    - status: enum('pending', 'accepted', 'expired') DEFAULT 'pending'
    - token: text UNIQUE NOT NULL
    - expires_at: timestamptz
    - created_at: timestamptz DEFAULT now()

INDEX A CREER :
- idx_ai_tools_org_id ON ai_tools(org_id)
- idx_risk_assessments_org_tool ON risk_assessments(org_id, ai_tool_id)
- idx_documents_org_id ON compliance_documents(org_id)
- idx_documents_type ON compliance_documents(org_id, type)
- idx_checks_org_regulation ON compliance_checks(org_id, regulation_id)
- idx_alerts_org_unread ON alerts(org_id, is_read) WHERE is_read = false
- idx_audit_logs_org_date ON audit_logs(org_id, created_at DESC)
```

---

## 6. ETAPES DE DEVELOPPEMENT

Chaque etape ci-dessous contient un prompt autonome. Copie-le, donne-le a l'IA, valide le resultat.

---

### ETAPE 1 : Setup du projet & configuration de base

```
PROMPT ETAPE 1 — SETUP DU PROJET

Tu vas initialiser le projet CompliPilot from scratch. Suis ces instructions EXACTEMENT :

1. CREATION DU PROJET :
   npx create-next-app@latest complipilot --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"

2. INSTALLER LES DEPENDANCES :
   # Core
   npm install @supabase/supabase-js @supabase/ssr drizzle-orm postgres zod
   npm install stripe @stripe/stripe-js
   npm install @anthropic-ai/sdk ai
   npm install next-intl nuqs framer-motion
   npm install react-hook-form @hookform/resolvers
   npm install recharts lucide-react
   npm install resend @upstash/redis @upstash/ratelimit
   npm install pino pino-pretty
   npm install clsx tailwind-merge class-variance-authority

   # Dev
   npm install -D drizzle-kit @types/node
   npm install -D vitest @testing-library/react @testing-library/jest-dom
   npm install -D playwright @playwright/test
   npm install -D prettier eslint-config-prettier
   npm install -D husky lint-staged @commitlint/cli @commitlint/config-conventional
   npm install -D @sentry/nextjs
   npm install -D posthog-js

3. INITIALISER SHADCN/UI :
   npx shadcn@latest init
   Choisir : New York style, Slate base, CSS variables OUI
   Puis installer les composants essentiels :
   npx shadcn@latest add button card dialog dropdown-menu input label select separator sheet skeleton table tabs textarea toast tooltip avatar badge command popover scroll-area switch alert-dialog form sonner

4. CONFIGURER LES FICHIERS DE BASE :

   a) .env.example — avec TOUTES les variables necessaires (commentees) :
      NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY,
      STRIPE_SECRET_KEY, NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY, STRIPE_WEBHOOK_SECRET,
      ANTHROPIC_API_KEY, RESEND_API_KEY, UPSTASH_REDIS_REST_URL, UPSTASH_REDIS_REST_TOKEN,
      SENTRY_DSN, NEXT_PUBLIC_POSTHOG_KEY, NEXT_PUBLIC_APP_URL

   b) src/lib/env.ts — validation Zod de TOUTES les variables d'env au demarrage.
      Si une variable manque, crash au build avec un message clair.

   c) tsconfig.json — activer strict: true, noUncheckedIndexedAccess: true, exactOptionalPropertyTypes: true

   d) src/lib/utils.ts — la fonction cn() (clsx + tailwind-merge) + helpers de base :
      - formatDate(date), formatCurrency(amount), slugify(text), truncate(text, length)

   e) src/app/globals.css — les CSS variables de la DA (mode clair + sombre) telles que definies dans la section DA.
      Configurer @layer base avec les variables.

   f) src/app/layout.tsx — Root layout avec :
      - Font Inter (Google Fonts via next/font/google)
      - Font JetBrains Mono
      - Metadata globale (title template, description, openGraph)
      - ThemeProvider (next-themes)
      - ToastProvider (sonner)
      - classe antialiased sur body

   g) middleware.ts — middleware vide prepare pour l'auth (juste un pass-through pour l'instant)

   h) .prettierrc — config Prettier (semi: true, singleQuote: true, tabWidth: 2, trailingComma: 'all')

   i) commitlint.config.js — conventional commits

   j) Configurer Husky + lint-staged dans package.json

5. CREER LA STRUCTURE DES DOSSIERS :
   Creer TOUS les dossiers vides de l'arborescence definie dans la section Architecture,
   avec un fichier .gitkeep dans chaque dossier vide.

6. VERIFICATION :
   - `npm run build` doit passer sans erreur
   - `npm run lint` doit passer sans erreur
   - L'app affiche une page blanche propre sur localhost:3000

NE FAIS RIEN D'AUTRE. Pas de composants, pas de pages, juste le setup propre.
```

---

### ETAPE 2 : Authentification & multi-tenancy

```
PROMPT ETAPE 2 — AUTH & MULTI-TENANCY

Contexte : Le projet CompliPilot est initialise (Etape 1 faite). Tu vas maintenant implementer :

1. SUPABASE CLIENTS (src/lib/supabase/) :
   - client.ts : createBrowserClient() pour usage client-side
   - server.ts : createServerClient() pour Server Components et Server Actions (utilise cookies())
   - admin.ts : createServiceRoleClient() pour operations admin (JAMAIS cote client)
   - middleware.ts : helper pour rafraichir la session dans le middleware Next.js

2. MIDDLEWARE AUTH (middleware.ts) :
   - Rafraichir le token Supabase a chaque requete
   - Routes protegees : tout sous /(dashboard)/* redirige vers /login si pas de session
   - Routes publiques : /(marketing)/*, /(auth)/*
   - Si l'utilisateur est connecte et va sur /login, rediriger vers /dashboard
   - Gerer le cas ou l'utilisateur n'a pas d'organisation (rediriger vers /onboarding)

3. PAGES AUTH (src/app/(auth)/) :
   Creer layout.tsx (centre, fond subtil, logo CompliPilot en haut) puis :

   a) login/page.tsx :
      - Formulaire email + mot de passe (React Hook Form + Zod)
      - Bouton "Connexion avec Google" (OAuth Supabase)
      - Bouton "Magic Link" (envoie un lien par email)
      - Lien "Mot de passe oublie"
      - Lien "Creer un compte"
      - Server Action pour le login
      - Gestion erreurs (toast)

   b) register/page.tsx :
      - Formulaire : nom complet, email, mot de passe, confirmer mot de passe
      - Validation Zod (password min 8 chars, 1 majuscule, 1 chiffre)
      - Server Action : creer user Supabase Auth + creer profile + creer organization
      - Apres inscription → rediriger vers /verify-email

   c) forgot-password/page.tsx : formulaire email, envoie un lien de reset

   d) verify-email/page.tsx : page de confirmation "Verifie tes emails"

4. ONBOARDING (src/app/(dashboard)/onboarding/page.tsx) :
   - Formulaire multi-etapes (3 etapes) :
     Step 1 : Nom de l'organisation, industrie, pays, nombre d'employes
     Step 2 : Quelles reglementations vous concernent ? (checkboxes : EU AI Act, RGPD, NIS2, DORA)
     Step 3 : Combien d'outils IA utilisez-vous approximativement ? (1-5, 6-20, 20+)
   - Server Action qui cree/update l'organization dans Supabase
   - Redirection vers /dashboard apres completion

5. MULTI-TENANCY :
   - Chaque user appartient a UNE organization (org_id dans profiles)
   - RLS sur toutes les tables : les users ne voient QUE les donnees de leur org
   - Creer les policies RLS en SQL pour les tables profiles et organizations
   - Le org_id est stocke dans le JWT custom claim via un trigger Supabase :
     CREATE OR REPLACE FUNCTION public.handle_new_user()
     qui set le raw_app_meta_data avec org_id
   - Helper getOrgId() dans lib/supabase/server.ts qui extrait l'org_id du JWT

6. HOOKS & HELPERS AUTH (src/features/auth/) :
   - hooks/use-auth.ts : hook client pour acceder a la session courante
   - actions/auth-actions.ts : Server Actions (login, register, logout, resetPassword)
   - types.ts : types AuthUser, Session, etc.

REGLES :
- ZERO stockage de tokens cote client
- Cookies httpOnly pour la session (gere par @supabase/ssr)
- Toute mutation de donnees via Server Actions (pas de fetch client direct)
- Chaque Server Action verifie la session ET le org_id avant d'operer
- Messages d'erreur user-friendly (pas de messages techniques)
```

---

### ETAPE 3 : Design System & Layout principal

```
PROMPT ETAPE 3 — DESIGN SYSTEM & LAYOUT

Contexte : Auth et multi-tenancy sont en place (Etape 2 faite). Maintenant, construis le design system et les layouts.

1. THEME & CSS (src/app/globals.css) :
   - Verifier que les CSS variables de la DA sont bien en place (mode clair ET sombre)
   - Ajouter les classes utilitaires custom si besoin
   - Animations keyframes : fadeIn, slideIn, scaleIn, shimmer (pour skeletons)

2. COMPOSANTS SHARED (src/components/shared/) :
   Creer chacun de ces composants avec leur storybook mental (variants, sizes, states) :

   a) compliance-score-gauge.tsx :
      - Props : score (0-100), size ('sm' | 'md' | 'lg'), showLabel (boolean)
      - Rendu : SVG circle progressif anime, pourcentage au centre
      - Couleur dynamique : rouge 0-39, orange 40-69, bleu 70-89, vert 90-100
      - Animation de remplissage au mount (1s ease-out)

   b) risk-badge.tsx :
      - Props : level ('unacceptable' | 'high' | 'limited' | 'minimal' | 'not_assessed')
      - Badge colore avec icone : rouge/ShieldAlert, orange/AlertTriangle, jaune/Info, vert/ShieldCheck, gris/HelpCircle

   c) regulation-tag.tsx :
      - Props : regulation ('eu_ai_act' | 'gdpr' | 'nis2' | 'dora')
      - Tag avec couleur distincte par reglementation et label court

   d) data-table.tsx :
      - Composant generique de tableau avec :
        Tri par colonne, pagination, recherche/filtre, selection de lignes,
        etats vides, etats de chargement (skeleton rows)
      - Utiliser @tanstack/react-table si necessaire, sinon garder simple

   e) empty-state.tsx :
      - Props : icon (LucideIcon), title, description, actionLabel, onAction
      - Illustration centree avec CTA

   f) page-header.tsx :
      - Props : title, description?, actions? (ReactNode pour boutons)
      - Breadcrumb automatique basee sur le pathname

   g) confirm-dialog.tsx :
      - Props : title, description, confirmLabel, variant ('default' | 'destructive'), onConfirm
      - Dialog modale avec Cancel/Confirm

   h) loading-skeleton.tsx :
      - Variantes : card, table-row, text-block, stat-card
      - Utilise l'animation shimmer

3. LAYOUT MARKETING (src/app/(marketing)/layout.tsx) :
   - Navbar : Logo CompliPilot | liens (Features, Pricing, Blog, About) | boutons Login/Get Started
   - Navbar sticky, fond blur au scroll
   - Footer : colonnes (Product, Company, Legal, Social) | copyright
   - Responsive : hamburger menu sur mobile

4. LAYOUT DASHBOARD (src/app/(dashboard)/layout.tsx) :
   - Sidebar gauche (collapsible) :
     Logo en haut
     Navigation : Dashboard, Scanner IA, Risques, Documents, Monitoring, Rapports
     Separateur
     Settings, Aide
     Badge du plan actuel en bas (ex: "Growth Plan")
     Chaque item : icone Lucide + label + badge de notification si applicable
   - Topbar :
     Breadcrumb a gauche
     A droite : barre de recherche (Cmd+K), icone notifications (bell + badge count), theme toggle, avatar user + dropdown (profil, settings, logout)
   - Zone de contenu : max-w-7xl, padding responsive
   - Mobile : sidebar devient un sheet (drawer) via le hamburger
   - Sidebar collapsee : icones seules avec tooltips

5. PROVIDERS (src/components/providers/) :
   - theme-provider.tsx : next-themes avec attribute="class", defaultTheme="system"
   - toast-provider.tsx : Sonner <Toaster /> avec position="bottom-right"

REGLES :
- Chaque composant a des props typees avec interface (pas type inline)
- Chaque composant gere le dark mode via les CSS variables (pas de dark: classes manuelles partout)
- Animations avec Framer Motion UNIQUEMENT si ca apporte de la valeur UX
- Pas de composants > 150 lignes
- Accessibilite : tous les boutons ont aria-label, tous les icones decoratifs aria-hidden="true"
- Les composants ui/ de shadcn ne sont PAS modifies — la customisation se fait dans les composants shared/
```

---

### ETAPE 4 : Landing page & pages marketing

```
PROMPT ETAPE 4 — LANDING PAGE & MARKETING

Contexte : Design system et layouts prets (Etape 3). Construis maintenant les pages marketing.

1. LANDING PAGE (src/app/(marketing)/page.tsx) :
   Structure en sections (chacune est un composant separe dans features/marketing/components/) :

   a) HeroSection :
      - Titre : "Mettez votre entreprise en conformite IA en quelques clics"
      - Sous-titre : "CompliPilot scanne vos outils IA, evalue les risques, et genere automatiquement toute la documentation requise par l'EU AI Act, le RGPD, NIS2 et DORA."
      - 2 boutons CTA : "Commencer gratuitement" (primary) + "Voir la demo" (secondary, outline)
      - Badge au-dessus du titre : "Deadline EU AI Act : 2 aout 2026" avec icone Clock
      - Illustration/screenshot du dashboard (placeholder image pour l'instant)
      - Stats en dessous : "500+ entreprises" / "15 000+ outils scannes" / "99.2% de conformite"

   b) ProblemSection :
      - Titre : "La conformite IA est un cauchemar pour les PME"
      - 3 pain points en cards avec icones :
        1. "Amendes massives" — Jusqu'a 35M EUR ou 7% du CA mondial
        2. "Documentation interminable" — Des centaines de pages de docs techniques requises
        3. "Reglementations qui changent" — EU AI Act, RGPD, NIS2, DORA... et ce n'est que le debut

   c) SolutionSection :
      - Titre : "CompliPilot automatise tout"
      - 4 features en grille avec icones et descriptions courtes :
        1. Scanner IA (ScanLine icon) — Inventoriez tous vos outils IA en un clic
        2. Classification des risques (ShieldAlert) — Classification automatique EU AI Act
        3. Generation de documents (FileText) — Documentation legale generee par IA
        4. Monitoring continu (Activity) — Score de conformite en temps reel

   d) HowItWorksSection :
      - Titre : "3 etapes pour etre conforme"
      - Steps numerotees avec illustrations :
        1. Declarez vos outils IA
        2. Obtenez votre evaluation des risques
        3. Generez et telechargez vos documents de conformite

   e) PricingSection :
      - 3 colonnes (Starter/Growth/Enterprise) telles que definies dans le rapport
      - Plan Growth mis en avant (badge "Populaire", border accent)
      - Toggle mensuel/annuel (-20% annuel)
      - Feature list avec check/cross par plan
      - CTA sous chaque plan

   f) TestimonialsSection :
      - 3 temoignages fictifs mais realistes de DPO/CTO de PME EU
      - Avec avatar, nom, titre, entreprise, quote
      - Design en cards avec guillemets decoratifs

   g) FAQSection :
      - Accordeon avec 6-8 questions frequentes (accordion shadcn)
      - Questions sur le produit, les reglementations, la securite des donnees

   h) CTASection (finale) :
      - Titre : "La deadline approche. Soyez pret."
      - Sous-titre avec la date du 2 aout 2026
      - Bouton CTA large "Commencer maintenant — c'est gratuit"

2. PAGE PRICING (src/app/(marketing)/pricing/page.tsx) :
   - Reprend PricingSection en version complete avec plus de details par plan
   - Tableau de comparaison detaille des features
   - Section FAQ specifique pricing

3. PAGE ABOUT (src/app/(marketing)/about/page.tsx) :
   - Mission, equipe (placeholders), valeurs, contact

4. SEO :
   - Metadata dynamique sur chaque page (generateMetadata)
   - Open Graph images (placeholder)
   - Schema.org JSON-LD sur la landing page (Organization + SoftwareApplication)

REGLES :
- Tout le contenu texte est dans des constantes (pas en dur dans le JSX) pour faciliter l'i18n future
- Chaque section est un Server Component (pas de "use client" sauf si interaction)
- Images en next/image avec blur placeholder
- Animations d'entree au scroll via Framer Motion (intersection observer) — SUBTILES
- La landing page doit scorer 95+ sur Lighthouse (performance, accessibility, SEO)
- Mobile-first : la landing est pensee mobile d'abord
```

---

### ETAPE 5 : Dashboard principal & navigation

```
PROMPT ETAPE 5 — DASHBOARD PRINCIPAL

Contexte : Landing page et marketing prets (Etape 4). Construis le dashboard principal.

1. DASHBOARD PAGE (src/app/(dashboard)/dashboard/page.tsx) :
   C'est la premiere page que l'utilisateur voit apres connexion. Elle doit donner une vue d'ensemble instantanee.

   Layout en grille responsive :

   a) Ligne 1 — Score de conformite global + stats :
      - A gauche : ComplianceScoreGauge (taille lg) avec le score global de l'org
      - A droite : 4 stat cards en grille 2x2 :
        * "Outils IA" — nombre total (icone ScanLine)
        * "Risques eleves" — nombre d'outils high-risk (icone AlertTriangle, couleur rouge)
        * "Documents" — nombre de docs generes (icone FileText)
        * "Alertes" — nombre d'alertes non lues (icone Bell, couleur orange si > 0)

   b) Ligne 2 — Conformite par reglementation :
      - 4 cards horizontales, une par reglementation (EU AI Act, RGPD, NIS2, DORA)
      - Chaque card : nom, mini score gauge (sm), barre de progression, "X/Y requirements ok"
      - Cliquer → va vers la page de la reglementation

   c) Ligne 3 — 2 colonnes :
      - Colonne gauche : "Actions prioritaires" — liste des 5 actions les plus urgentes
        (documents a generer, outils a evaluer, deadlines proches)
        Chaque action : icone, description, badge urgence, bouton "Traiter"
      - Colonne droite : "Activite recente" — timeline des 10 dernieres actions
        (audit log simplifie : "Document X genere", "Outil Y evalue", etc.)

   d) Ligne 4 — Graphique evolution :
      - Recharts LineChart montrant l'evolution du score de conformite sur les 30 derniers jours
      - Lignes de reference pour les seuils (40%, 70%, 90%)

2. DATA FETCHING :
   - Toutes les donnees sont fetchees cote serveur (Server Component)
   - Creer les fonctions dans features/dashboard/services/ :
     * getDashboardStats(orgId) → stats
     * getComplianceByRegulation(orgId) → scores par reglementation
     * getPriorityActions(orgId) → top 5 actions
     * getRecentActivity(orgId) → 10 dernieres entrees audit log
     * getComplianceHistory(orgId, days) → historique score
   - Chaque fonction query Supabase via le server client avec RLS
   - Loading states : chaque section a son loading.tsx avec skeletons

3. NAVIGATION FONCTIONNELLE :
   - Verifier que la sidebar highlight le bon item selon la route active
   - Breadcrumb dynamique dans la topbar
   - Cmd+K search : ouvre un Command dialog (shadcn Command) avec recherche globale
     * Recherche dans : outils IA, documents, pages de navigation
     * Resultats groupes par categorie
   - Notifications dropdown : cliquer sur la cloche ouvre un popover avec les alertes recentes
   - User dropdown : Profil, Settings, Billing, Logout

REGLES :
- Dashboard = Server Component. Les sous-composants interactifs (graphique, dropdown) sont "use client"
- Suspense boundaries autour de chaque section avec fallback skeleton
- Les donnees ne sont JAMAIS fetchees cote client sur le dashboard initial
- Le score global est calcule comme la MOYENNE des scores par reglementation
- Si l'org n'a aucun outil, afficher un EmptyState "Commencez par ajouter vos outils IA"
```

---

### ETAPE 6 : Module Scanner IA

```
PROMPT ETAPE 6 — MODULE SCANNER IA

Contexte : Dashboard pret (Etape 5). Construis le module de scan des outils IA.

C'est LE module central de CompliPilot : l'utilisateur declare ses outils IA, et le systeme les analyse.

1. PAGE LISTE (src/app/(dashboard)/scanner/page.tsx) :
   - PageHeader : "Scanner IA" + bouton "Ajouter un outil" (primary)
   - Filtres : par categorie, par niveau de risque, par statut
   - DataTable avec colonnes :
     * Nom de l'outil + provider (avec logo si dispo)
     * Categorie (badge)
     * Niveau de risque (RiskBadge)
     * Nombre d'utilisateurs
     * Client-facing ? (oui/non)
     * Dernier scan (date relative)
     * Actions (voir, editer, supprimer)
   - Tri par colonne, recherche textuelle, pagination
   - Vue alternative : cards grid (toggle list/grid)

2. PAGE AJOUT (src/app/(dashboard)/scanner/new/page.tsx) :
   - Formulaire multi-step (2 steps) avec React Hook Form + Zod :

     Step 1 — Informations de base :
       * Nom de l'outil (text, required)
       * Provider/Fournisseur (text, avec suggestions autocomplete : OpenAI, Google, Microsoft, Meta, Anthropic, Custom)
       * Categorie (select : chatbot, recrutement, scoring, contenu, analytics, automatisation, autre)
       * Description de l'outil (textarea)
       * URL de l'outil (optionnel)

     Step 2 — Contexte d'utilisation :
       * Comment votre entreprise utilise cet outil ? (textarea, required — crucial pour l'evaluation)
       * Types de donnees traitees (multi-select checkboxes : donnees personnelles, financieres, sante, publiques, internes)
       * Nombre d'employes utilisant l'outil (number)
       * L'outil interagit-il directement avec vos clients ? (switch boolean)
       * Decisions automatisees ? (switch — l'outil prend-il des decisions sans intervention humaine ?)

   - Server Action : createAiTool(formData) → insere dans ai_tools avec status 'active' et risk_level 'not_assessed'
   - Apres creation → redirect vers la page detail de l'outil avec option "Lancer l'evaluation"

3. PAGE DETAIL (src/app/(dashboard)/scanner/[id]/page.tsx) :
   - Header : nom, provider, badge risque, statut, date d'ajout
   - Onglets (Tabs shadcn) :

     Tab "Resume" :
       * Informations de l'outil (les champs du formulaire en lecture)
       * Score de risque avec gauge
       * Reglementations impactees (tags)
       * Bouton "Re-evaluer" (relance l'assessment IA)

     Tab "Evaluation des risques" :
       * Pour chaque reglementation applicable, une card avec :
         - Niveau de risque
         - Findings (resultats de l'analyse IA)
         - Recommendations (actions a prendre)
         - Date de l'evaluation
       * Si pas encore evalue : CTA "Lancer l'evaluation"

     Tab "Documents" :
       * Liste des documents de conformite generes pour cet outil
       * Bouton "Generer un document" → ouvre un dialog avec les types de documents disponibles

     Tab "Historique" :
       * Timeline des changements (evaluations, modifications, documents generes)

4. SERVER ACTIONS (src/features/scanner/actions/) :
   - createAiTool(data: CreateToolInput) : valide via Zod, insere, retourne l'ID
   - updateAiTool(id, data: UpdateToolInput) : update partiel
   - deleteAiTool(id) : soft delete (status = 'deprecated') + confirm dialog
   - assessAiTool(id) : lance l'evaluation IA (appelle le service AI)

5. SERVICE IA EVALUATION (src/features/scanner/services/assess-tool.ts) :
   - Prend les infos de l'outil + le contexte d'utilisation
   - Appelle Claude API avec un prompt structure pour :
     * Classifier le risque selon l'EU AI Act (Article 6 + Annexe III)
     * Identifier les obligations RGPD applicables
     * Verifier les exigences NIS2 si applicable
     * Verifier DORA si secteur financier
   - Utilise Structured Output (schema Zod) pour garantir un JSON propre :
     {
       risk_level: 'high' | 'limited' | 'minimal',
       risk_score: number (0-100),
       findings: [{ regulation, finding, severity, details }],
       recommendations: [{ priority, action, regulation, deadline_suggested }],
       applicable_regulations: string[]
     }
   - Stocke le resultat dans risk_assessments
   - Met a jour le risk_level et risk_score de l'outil
   - Recalcule le compliance_score de l'org

REGLES :
- Le prompt IA d'evaluation est dans lib/ai/prompts/risk-classification.ts — PAS en dur
- Le prompt inclut le texte officiel des articles pertinents de l'EU AI Act pour une classification precise
- L'evaluation est asynchrone : afficher un etat "Evaluation en cours..." avec skeleton
- Rate limiting : max 10 evaluations par heure par org (Upstash)
- Chaque evaluation est loggee dans audit_logs
- Si le plan est 'starter', limiter a 5 outils max (afficher upgrade CTA au-dela)
```

---

### ETAPE 7 : Module Risk Assessment

```
PROMPT ETAPE 7 — MODULE RISK ASSESSMENT

Contexte : Scanner IA pret (Etape 6). Construis la vue globale des risques.

1. PAGE RISQUES (src/app/(dashboard)/risks/page.tsx) :
   Vue d'ensemble de TOUS les risques identifies dans l'organisation.

   a) En-tete avec stats :
      - 4 cards : Outils a risque inacceptable (rouge), High-risk (orange), Limited (jaune), Minimal (vert)
      - Nombre d'outils dans chaque categorie

   b) Matrice de risques (composant RiskMatrix) :
      - Grille visuelle 2D : axe X = probabilite d'impact, axe Y = severite
      - Chaque outil IA est un point dans la matrice (hover pour voir details)
      - Code couleur par niveau de risque
      - Clickable : ouvre le detail de l'outil

   c) Liste detaillee :
      - DataTable groupee par niveau de risque (sections collapsibles)
      - Colonnes : Outil, Risque, Reglementations, Findings principaux, Actions requises, Deadline
      - Filtre par reglementation
      - Export CSV

   d) Recommendations prioritaires :
      - Top 10 actions a prendre, triees par urgence
      - Chaque action : description, reglementation, outil concerne, bouton "Traiter" (redirige)

2. PAGE DETAIL RISQUE (src/app/(dashboard)/risks/[id]/page.tsx) :
   - Detail complet d'un risk_assessment
   - Findings presentes en cards avec severite
   - Recommendations en checklist (cochable → met a jour compliance_checks)
   - Documents associes
   - Historique des evaluations precedentes

3. SERVICES (src/features/risks/services/) :
   - getRiskOverview(orgId) : stats agregees
   - getRiskMatrix(orgId) : donnees formatees pour la matrice
   - getRisksByRegulation(orgId, regulation) : risques filtres
   - getActionItems(orgId) : actions prioritaires triees

4. CALCUL DU SCORE DE CONFORMITE (src/features/risks/services/calculate-score.ts) :
   - Algorithme :
     * Pour chaque reglementation :
       - Compter les compliance_checks "compliant" vs total
       - Ponderer par severite (high = x3, limited = x2, minimal = x1)
       - Score reglementation = (checks_ok_ponderes / total_ponderes) * 100
     * Score global = moyenne ponderee des scores par reglementation
     * Mettre a jour organizations.compliance_score
   - Ce calcul est relance a chaque :
     * Nouvelle evaluation d'outil
     * Modification d'un compliance_check
     * Ajout/suppression d'un outil

REGLES :
- La matrice de risques est un composant "use client" (interaction hover/click)
- Les donnees de la page sont Server Components avec Suspense
- L'export CSV est un Server Action qui genere le fichier et retourne un blob URL
- Pas de donnees sensibles dans les exports (pas de details internes, juste le resume)
```

---

### ETAPE 8 : Module Document Generator

```
PROMPT ETAPE 8 — MODULE GENERATION DE DOCUMENTS

Contexte : Risques prets (Etape 7). Construis le generateur de documents compliance.

C'est le module qui fait PAYER les clients. La generation automatique de documentation legale est la valeur #1.

1. PAGE LISTE DOCUMENTS (src/app/(dashboard)/documents/page.tsx) :
   - PageHeader : "Documents de conformite" + bouton "Generer un document"
   - Filtres : par type, par reglementation, par statut, par outil IA
   - DataTable :
     * Titre du document
     * Type (badge : Evaluation d'impact, Notice transparence, Doc technique, etc.)
     * Reglementation(s) (tags)
     * Outil IA associe (ou "Global")
     * Statut (Draft/Review/Approved/Expired)
     * Version
     * Date de creation
     * Actions : Voir, Editer, Telecharger PDF, Dupliquer, Archiver

2. PAGE GENERATION (src/app/(dashboard)/documents/new/page.tsx) :
   Formulaire guidant la generation :

   Step 1 — Choix du type :
     Cards selectionnables avec description :
     - Evaluation d'impact (AIPD / DPIA) — Requis pour les systemes high-risk
     - Notice de transparence — Information des utilisateurs sur l'usage d'IA
     - Documentation technique — Documentation technique detaillee du systeme IA
     - Registre des traitements — Registre RGPD des traitements de donnees
     - Audit de biais — Rapport d'audit de biais algorithmique
     - Declaration de conformite — Declaration CE de conformite

   Step 2 — Parametres :
     - Outil IA concerne (select, ou "Document global")
     - Reglementation principale (select)
     - Langue du document (FR/EN)
     - Informations supplementaires (textarea optionnel)

   Step 3 — Generation :
     - Bouton "Generer avec l'IA"
     - Affichage en STREAMING du document en cours de generation
     - Utiliser le Vercel AI SDK (useCompletion) pour le streaming
     - Barre de progression + texte qui apparait en temps reel
     - A la fin : bouton "Sauvegarder comme brouillon" + "Editer"

3. PAGE DETAIL/EDITION (src/app/(dashboard)/documents/[id]/page.tsx) :
   - Affichage du document en mode lecture (rendu markdown → HTML)
   - Bouton "Editer" → passe en mode edition (textarea markdown)
   - Sidebar droite avec :
     * Metadonnees (type, reglementation, version, dates)
     * Statut avec workflow : Draft → Review → Approved
     * Boutons d'action : Telecharger PDF, Regenerer, Dupliquer
   - Historique des versions (version 1, 2, 3... avec diff)

4. SERVICE GENERATION IA (src/features/documents/services/generate-document.ts) :
   - Recoit : type de document, outil IA (avec toutes ses infos + risk assessment), reglementation
   - Construit un prompt RICHE avec :
     * Le contexte complet de l'outil et de l'entreprise
     * Les exigences specifiques de la reglementation pour ce type de document
     * Les findings du risk assessment
     * Des exemples de structure attendue
   - Appelle Claude en streaming avec le Vercel AI SDK
   - Schema de sortie pour chaque type de document (Zod)
   - Le contenu est stocke en JSON structure (pour edition) ET en markdown (pour affichage)

5. EXPORT PDF (src/features/documents/services/export-pdf.ts) :
   - Convertit le markdown en PDF propre avec en-tete CompliPilot
   - Utiliser une lib comme @react-pdf/renderer ou jspdf
   - En-tete : logo CompliPilot + "Document de conformite" + date + reference
   - Pied de page : "Genere par CompliPilot" + page X/Y
   - Upload le PDF dans Supabase Storage
   - Retourner l'URL signee (temporaire) pour le telechargement

6. PROMPTS IA (src/lib/ai/prompts/document-generation.ts) :
   Creer un prompt pour chaque type de document. Exemple pour l'Evaluation d'Impact :

   "Tu es un expert en conformite IA et protection des donnees.
    Genere une Evaluation d'Impact relative a l'Intelligence Artificielle (AIPD)
    pour le systeme IA suivant :

    [CONTEXTE SYSTEME IA]
    Nom : {tool.name}
    Fournisseur : {tool.provider}
    Usage : {tool.usage_context}
    Donnees traitees : {tool.data_types_processed}
    [...]

    [EVALUATION DES RISQUES EXISTANTE]
    {risk_assessment.findings}

    Le document doit suivre cette structure exacte :
    1. Description du systeme IA
    2. Necessite et proportionnalite
    3. Evaluation des risques pour les droits et libertes
    4. Mesures de mitigation
    5. Avis du DPO (placeholder)
    6. Decision et plan d'action

    Redige en francais professionnel, precis et juridiquement solide.
    Utilise le format Markdown."

REGLES :
- Le streaming est OBLIGATOIRE pour la generation (pas de loading 30s sans feedback)
- Chaque document genere consomme des "credits" lies au plan (Starter: 5/mois, Growth: 50, Enterprise: illimite)
- Verifier les credits AVANT de lancer la generation
- Le contenu genere par l'IA inclut un disclaimer : "Ce document a ete genere par IA et doit etre valide par un professionnel juridique."
- Les prompts sont versiones (v1, v2...) pour pouvoir les ameliorer sans casser les anciens docs
- Logging complet : quel prompt, quel modele, combien de tokens, duree de generation
```

---

### ETAPE 9 : Module Monitoring & Alertes

```
PROMPT ETAPE 9 — MONITORING & ALERTES

Contexte : Documents prets (Etape 8). Construis le monitoring continu.

1. PAGE MONITORING (src/app/(dashboard)/monitoring/page.tsx) :
   - Score de conformite global avec graphique d'evolution (30/90/365 jours)
   - Timeline de conformite : graphique aire montrant l'evolution par reglementation
   - Section "Prochaines deadlines" : liste des echeances reglementaires triees par date
   - Section "Documents expirant bientot" : docs dont expires_at < 30 jours
   - Section "Outils a re-evaluer" : outils dont last_assessed_at > 90 jours

2. SYSTEME D'ALERTES :
   a) Types d'alertes :
      - regulation_update : une reglementation a ete mise a jour
      - deadline_approaching : une deadline reglementaire approche (30j, 7j, 1j)
      - score_dropped : le score de conformite a baisse de plus de 10 points
      - document_expired : un document de conformite a expire
      - new_requirement : nouvelle exigence ajoutee a une reglementation
      - tool_risk_changed : le niveau de risque d'un outil a change

   b) Creation d'alertes (src/features/monitoring/services/alert-service.ts) :
      - Fonctions : createAlert(orgId, type, data)
      - Verifier les doublons avant de creer (pas 2 alertes identiques)

   c) Notifications :
      - In-app : badge sur la cloche dans la topbar, popover avec liste
      - Email (via Resend) : envoyer un email pour les alertes "critical"
      - Template email professionnel avec le branding CompliPilot

3. CRON JOB (src/app/api/cron/check-regulations/route.ts) :
   - Endpoint appele par un cron Vercel (quotidien)
   - Verifie :
     * Documents qui expirent dans les 30 prochains jours → alerte
     * Outils pas evalues depuis 90 jours → alerte
     * Deadlines reglementaires approchant → alerte
   - Securise par un header secret (CRON_SECRET dans .env)

4. PAGE RAPPORTS (src/app/(dashboard)/reports/) :
   - Generer un rapport de conformite complet pour les auditeurs
   - Le rapport compile : score global, liste des outils avec risques, documents generes, checks de conformite
   - Export PDF formaté professionnel
   - Historique des rapports generes

REGLES :
- Les alertes non lues sont fetchees dans le layout dashboard (pour le badge)
- Marquer comme lu : Server Action markAlertRead(id)
- Les emails ne sont envoyes qu'aux owners et admins de l'org
- Le cron est protege et idempotent (peut etre appele plusieurs fois sans effet)
- Rate limit sur les emails : max 5 par jour par org pour eviter le spam
```

---

### ETAPE 10 : Systeme de Billing Stripe

```
PROMPT ETAPE 10 — BILLING STRIPE

Contexte : Monitoring pret (Etape 9). Integre le systeme de paiement.

1. CONFIGURATION STRIPE (src/lib/stripe/) :
   a) config.ts — definir les plans :
      const PLANS = {
        starter: {
          name: 'Starter',
          price_monthly: 19900, // en centimes
          price_yearly: 191000, // -20%
          stripe_price_monthly: 'price_xxx', // ID Stripe
          stripe_price_yearly: 'price_yyy',
          limits: { tools: 5, documents_per_month: 5, team_members: 2 }
        },
        growth: {
          name: 'Growth',
          price_monthly: 49900,
          price_yearly: 479000,
          limits: { tools: 20, documents_per_month: 50, team_members: 10 }
        },
        enterprise: {
          name: 'Enterprise',
          price_monthly: 149900,
          price_yearly: 1439000,
          limits: { tools: Infinity, documents_per_month: Infinity, team_members: Infinity }
        }
      }

   b) client.ts — instance Stripe

2. SERVER ACTIONS BILLING (src/features/billing/actions/) :
   - createCheckoutSession(planId, interval) :
     * Creer ou recuperer le stripe_customer_id de l'org
     * Creer une Checkout Session Stripe
     * Retourner l'URL de checkout
   - createBillingPortalSession() :
     * Ouvrir le Customer Portal Stripe (gestion abo, factures, annulation)
     * Retourner l'URL du portal

3. WEBHOOK STRIPE (src/app/api/webhooks/stripe/route.ts) :
   Handler des events :
   - checkout.session.completed → mettre a jour org.plan + stripe_subscription_id
   - customer.subscription.updated → mettre a jour le plan si change
   - customer.subscription.deleted → downgrade vers 'free'
   - invoice.payment_failed → creer une alerte "Paiement echoue"
   - invoice.paid → mettre a jour plan_period_end

   IMPORTANT :
   - Verifier la signature du webhook (stripe.webhooks.constructEvent)
   - Idempotent : verifier que l'event n'a pas deja ete traite
   - Logger chaque event dans audit_logs

4. PAGE BILLING (src/app/(dashboard)/settings/billing/page.tsx) :
   - Plan actuel avec details (nom, prix, prochaine facturation)
   - Usage actuel vs limites (progress bars) :
     * X/5 outils IA
     * X/5 documents ce mois
     * X/2 membres d'equipe
   - Bouton "Changer de plan" → affiche les 3 plans avec upgrade/downgrade
   - Bouton "Gerer la facturation" → ouvre Stripe Customer Portal
   - Historique des factures (via Stripe API)

5. ENFORCEMENT DES LIMITES (src/lib/stripe/limits.ts) :
   - checkLimit(orgId, resource: 'tools' | 'documents' | 'team_members') → boolean
   - Appele AVANT chaque creation (outil, document, invitation)
   - Si limite atteinte → retourner erreur avec message "Upgrade required"
   - Afficher un UpgradeDialog avec les avantages du plan superieur

6. COMPOSANTS (src/features/billing/components/) :
   - PricingCard : card d'un plan avec features et CTA
   - PlanBadge : badge du plan actuel dans la sidebar
   - UsageMeter : barre de progression usage/limite
   - UpgradeDialog : dialog modale incitant a upgrade

REGLES :
- JAMAIS stocker les prix en dur dans le frontend — toujours depuis la config ou Stripe
- Le webhook est la source de verite pour l'etat de l'abonnement (pas le client)
- Tester avec stripe listen --forward-to en dev
- Le plan 'free' existe pour le trial (limites tres reduites : 2 outils, 1 document)
- Pas de periode d'essai gratuite — le plan free suffit comme freemium
```

---

### ETAPE 11 : Settings, Profil & Gestion d'Equipe

```
PROMPT ETAPE 11 — SETTINGS & TEAM

Contexte : Billing pret (Etape 10). Finalise les settings.

1. PAGE SETTINGS GENERAL (src/app/(dashboard)/settings/page.tsx) :
   - Informations de l'organisation : nom, slug, industrie, pays, logo (upload Supabase Storage)
   - Reglementations actives (toggles pour activer/desactiver EU AI Act, RGPD, NIS2, DORA)
   - Preferences de notification (email pour alertes critiques, weekly digest, etc.)
   - Zone danger : Supprimer l'organisation (confirm dialog avec saisie du nom)

2. PAGE PROFIL (src/app/(dashboard)/settings/profile/page.tsx) :
   - Avatar (upload)
   - Nom complet, email (readonly)
   - Changer le mot de passe
   - Theme preference (light/dark/system)
   - Langue (FR/EN)

3. PAGE EQUIPE (src/app/(dashboard)/settings/team/page.tsx) :
   - Liste des membres : avatar, nom, email, role (badge), date d'ajout
   - Modifier le role d'un membre (dropdown : Admin, Member, Viewer)
   - Supprimer un membre (confirm dialog)
   - Inviter un nouveau membre :
     * Dialog avec champ email + select role
     * Server Action : creer une invitation, envoyer un email via Resend
     * L'invite recoit un lien /invite/[token] qui l'ajoute a l'org
   - Liste des invitations en attente avec bouton "Annuler"

   Roles :
   - Owner : tout (un seul par org, celui qui a cree)
   - Admin : tout sauf supprimer l'org et changer le owner
   - Member : ajouter/editer outils et documents, lancer evaluations
   - Viewer : lecture seule

4. INVITATION FLOW (src/app/(auth)/invite/[token]/page.tsx) :
   - Si l'utilisateur est deja connecte : l'ajouter a l'org directement
   - Si pas connecte : formulaire d'inscription pre-rempli avec l'email
   - Apres acceptation → rediriger vers /dashboard

5. AUDIT LOG (accessible depuis settings ou /monitoring) :
   - Table chronologique de toutes les actions
   - Filtres : par utilisateur, par type d'action, par date
   - Colonnes : Date, Utilisateur, Action, Details, IP

REGLES :
- Seuls Owner et Admin peuvent gerer l'equipe et les settings org
- Viewer ne peut rien modifier (UI desactivee avec tooltip "Permissions insuffisantes")
- Les changements de settings sont logges dans audit_logs
- L'upload d'images passe par Supabase Storage avec un bucket dedie "avatars" et "logos"
- Limite de taille : 2MB max pour les images
- Les invitations expirent apres 7 jours
```

---

### ETAPE 12 : Tests, SEO, Performance & Deploiement

```
PROMPT ETAPE 12 — TESTS, SEO, PERFORMANCE & DEPLOY

Contexte : Toutes les features sont pretes. Finalise le produit pour la production.

1. TESTS UNITAIRES (tests/unit/) :
   Vitest pour :
   - Fonction de calcul du score de conformite
   - Validation Zod de tous les schemas
   - Fonctions utilitaires (formatDate, slugify, cn)
   - Service de classification des risques (mock Claude API)
   - Logique d'enforcement des limites par plan
   Objectif : couverture > 80% sur les services et utilitaires

2. TESTS E2E (tests/e2e/) :
   Playwright pour les flows critiques :
   - Flow complet inscription → onboarding → dashboard
   - Ajouter un outil IA → lancer evaluation → voir les risques
   - Generer un document → telecharger le PDF
   - Changer de plan (avec Stripe test mode)
   - Inviter un membre → accepter l'invitation
   - Login/logout
   Chaque test est independant (setup/teardown propre)

3. SEO AVANCE :
   - generateMetadata dynamique sur chaque page marketing
   - sitemap.ts : generateur de sitemap dynamique
   - robots.ts : config robots.txt
   - Schema.org JSON-LD :
     * Organization sur la home
     * SoftwareApplication sur pricing
     * FAQPage sur la FAQ
     * Article sur chaque blog post
   - OpenGraph images dynamiques via next/og (ImageResponse)

4. PERFORMANCE :
   - Analyser avec next build et verifier :
     * Pas de page > 200KB JS
     * First Load JS < 100KB sur les pages marketing
   - Images : next/image partout, formats WebP/AVIF
   - Fonts : next/font avec display: swap
   - Dynamic imports pour les composants lourds (Recharts, editeur markdown)
   - Prefetch des liens de navigation principaux

5. SECURITE :
   - Headers de securite dans next.config.ts :
     * Content-Security-Policy
     * X-Frame-Options: DENY
     * X-Content-Type-Options: nosniff
     * Referrer-Policy: strict-origin-when-cross-origin
   - Rate limiting sur les API routes (Upstash)
   - Sanitization des inputs avant insertion BDD
   - Validation Zod sur TOUS les endpoints/actions

6. MONITORING PRODUCTION :
   - Sentry : error tracking + performance monitoring
   - PostHog : analytics produit (page views, feature usage, funnel conversion)
   - Logger structure (pino) avec niveaux info/warn/error

7. DEPLOIEMENT :
   a) Supabase :
      - Creer le projet sur supabase.com
      - Appliquer toutes les migrations
      - Seed les reglementations (table regulations)
      - Activer RLS sur toutes les tables
      - Configurer les auth providers (Google OAuth, Email)
      - Configurer Supabase Storage (buckets avatars, logos, documents)

   b) Stripe :
      - Creer les Products et Prices dans Stripe Dashboard
      - Configurer le Customer Portal
      - Configurer le webhook endpoint (pointe vers /api/webhooks/stripe)
      - Tester en mode test

   c) Vercel :
      - Connecter le repo Git
      - Configurer toutes les variables d'environnement
      - Configurer le domaine custom (complipilot.com ou similar)
      - Activer les preview deploys sur chaque PR
      - Configurer le cron job (/api/cron/check-regulations, daily)

   d) DNS & Domain :
      - Configurer les DNS
      - SSL automatique via Vercel

8. CHECKLIST PRE-LAUNCH :
   [ ] Toutes les pages rendent correctement en light ET dark mode
   [ ] Responsive sur mobile, tablette, desktop
   [ ] Formulaires valides avec erreurs affichees
   [ ] Auth flow complet fonctionne (register, login, logout, reset password, OAuth)
   [ ] Onboarding flow complet
   [ ] Scanner IA : ajout, evaluation, detail
   [ ] Documents : generation, edition, export PDF
   [ ] Billing : checkout, webhook, limites
   [ ] Alertes : creation, affichage, mark as read
   [ ] Settings : profil, org, equipe, invitations
   [ ] Lighthouse > 90 sur toutes les pages marketing
   [ ] Zero erreur console
   [ ] Zero TypeScript error
   [ ] Tests unitaires passent
   [ ] Tests E2E passent
   [ ] Sentry capture les erreurs
   [ ] Analytics trackent les events

REGLES FINALES :
- NE PAS deployer sans avoir teste le flow complet en staging
- Premiere version = MVP. On shippe vite et on itere.
- Les features non essentielles (blog, i18n complet, bias audit) peuvent etre V2
```

---

## RESUME DES PRIORITES

Si tu manques de temps, voici l'ordre de priorite ABSOLU des etapes :

1. **Etape 1** (Setup) — 2h
2. **Etape 2** (Auth) — 4h
3. **Etape 3** (Design System) — 3h
4. **Etape 4** (Landing Page) — 4h
5. **Etape 6** (Scanner IA) — 6h — **CRITIQUE, c'est le coeur du produit**
6. **Etape 8** (Document Generator) — 6h — **CRITIQUE, c'est ce qui fait payer**
7. **Etape 5** (Dashboard) — 4h
8. **Etape 10** (Billing Stripe) — 4h
9. **Etape 7** (Risk Assessment) — 3h
10. **Etape 9** (Monitoring) — 3h
11. **Etape 11** (Settings/Team) — 3h
12. **Etape 12** (Tests/Deploy) — 4h

**Total estime : ~46h de dev pour un developpeur senior, soit 6-8 jours intensifs.**

---

*Document genere le 5 avril 2026 — CompliPilot Mega-Prompt v1.0*
