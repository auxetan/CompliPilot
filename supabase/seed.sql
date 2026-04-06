-- CompliPilot seed data
-- Populates the regulations table with the 4 major EU regulations.

INSERT INTO regulations (code, name, full_name, jurisdiction, description, effective_date, last_updated, requirements, penalties, source_url) VALUES
(
  'eu_ai_act',
  'EU AI Act',
  'Regulation (EU) 2024/1689 on AI',
  'EU',
  'Le reglement europeen sur l''intelligence artificielle etablit un cadre juridique harmonise pour le developpement, la mise sur le marche et l''utilisation des systemes d''IA dans l''Union europeenne. Il adopte une approche fondee sur les risques, classant les systemes d''IA en quatre niveaux.',
  '2026-08-02',
  '2025-08-01',
  '[
    {"key": "risk_classification", "label": "Classification des risques", "description": "Classifier chaque systeme IA selon les 4 niveaux de risque : inacceptable, haut, limite et minimal."},
    {"key": "conformity_assessment", "label": "Evaluation de conformite", "description": "Realiser une evaluation de conformite avant la mise sur le marche pour les systemes IA a haut risque."},
    {"key": "transparency", "label": "Obligations de transparence", "description": "Informer les utilisateurs qu''ils interagissent avec un systeme IA et fournir des explications sur les decisions automatisees."},
    {"key": "technical_documentation", "label": "Documentation technique", "description": "Maintenir une documentation technique detaillee couvrant la conception, le developpement et les performances du systeme IA."},
    {"key": "human_oversight", "label": "Supervision humaine", "description": "Mettre en place des mecanismes de supervision humaine pour les systemes IA a haut risque, permettant l''intervention et l''arret."},
    {"key": "data_governance", "label": "Gouvernance des donnees", "description": "Garantir la qualite, la pertinence et la representativite des jeux de donnees utilises pour l''entrainement, la validation et les tests."}
  ]'::jsonb,
  'Jusqu''a 35 millions EUR ou 7% du chiffre d''affaires mondial annuel, selon le montant le plus eleve.',
  'https://eur-lex.europa.eu/eli/reg/2024/1689/oj'
),
(
  'gdpr',
  'RGPD',
  'General Data Protection Regulation (EU) 2016/679',
  'EU',
  'Le Reglement General sur la Protection des Donnees est le cadre juridique de reference pour la protection des donnees personnelles dans l''Union europeenne. Il s''applique a toute organisation traitant des donnees de residents europeens.',
  '2018-05-25',
  '2024-01-01',
  '[
    {"key": "processing_records", "label": "Registre des traitements", "description": "Tenir un registre detaille de toutes les activites de traitement de donnees personnelles effectuees par l''organisation."},
    {"key": "dpia", "label": "Analyses d''impact (DPIA)", "description": "Realiser des analyses d''impact sur la protection des donnees pour les traitements susceptibles d''engendrer un risque eleve."},
    {"key": "consent_management", "label": "Gestion du consentement", "description": "Recueillir et gerer le consentement explicite des personnes concernees avant tout traitement de leurs donnees."},
    {"key": "data_subject_rights", "label": "Droits des personnes", "description": "Garantir l''exercice des droits des personnes concernees : acces, rectification, effacement, portabilite et opposition."},
    {"key": "breach_notification", "label": "Notification des violations", "description": "Notifier l''autorite de controle dans les 72 heures suivant la decouverte d''une violation de donnees personnelles."},
    {"key": "dpo_designation", "label": "Designation d''un DPO", "description": "Designer un Delegue a la Protection des Donnees lorsque l''organisation effectue des traitements a grande echelle ou de donnees sensibles."}
  ]'::jsonb,
  'Jusqu''a 20 millions EUR ou 4% du chiffre d''affaires mondial annuel, selon le montant le plus eleve.',
  'https://eur-lex.europa.eu/eli/reg/2016/679/oj'
),
(
  'nis2',
  'NIS2',
  'Directive (EU) 2022/2555 on Network and Information Security',
  'EU',
  'La directive NIS2 renforce le cadre europeen de cybersecurite en elargissant le perimetre des entites concernees et en imposant des exigences plus strictes en matiere de gestion des risques et de notification des incidents.',
  '2024-10-18',
  '2024-10-18',
  '[
    {"key": "risk_management", "label": "Gestion des risques", "description": "Mettre en oeuvre des mesures techniques et organisationnelles appropriees pour gerer les risques pesant sur la securite des reseaux et systemes d''information."},
    {"key": "incident_reporting", "label": "Signalement des incidents", "description": "Signaler les incidents de securite significatifs aux autorites competentes dans les 24 heures (alerte initiale) et fournir un rapport complet sous 72 heures."},
    {"key": "supply_chain_security", "label": "Securite de la chaine d''approvisionnement", "description": "Evaluer et gerer les risques de cybersecurite lies aux fournisseurs et prestataires de services critiques."},
    {"key": "business_continuity", "label": "Continuite d''activite", "description": "Etablir et maintenir des plans de continuite d''activite et de reprise apres sinistre pour assurer la resilience operationnelle."}
  ]'::jsonb,
  'Jusqu''a 10 millions EUR ou 2% du chiffre d''affaires mondial annuel, selon le montant le plus eleve.',
  'https://eur-lex.europa.eu/eli/dir/2022/2555/oj'
),
(
  'dora',
  'DORA',
  'Digital Operational Resilience Act (EU) 2022/2554',
  'EU',
  'Le reglement DORA etablit un cadre uniforme pour la resilience operationnelle numerique du secteur financier europeen. Il impose des exigences strictes en matiere de gestion des risques TIC, de tests de resilience et de surveillance des prestataires tiers.',
  '2025-01-17',
  '2025-01-17',
  '[
    {"key": "ict_risk_management", "label": "Gestion des risques TIC", "description": "Mettre en place un cadre complet de gestion des risques lies aux technologies de l''information et de la communication, incluant identification, protection et detection."},
    {"key": "incident_reporting", "label": "Signalement des incidents TIC", "description": "Classifier et signaler les incidents majeurs lies aux TIC aux autorites competentes selon les delais et formats prescrits."},
    {"key": "resilience_testing", "label": "Tests de resilience numerique", "description": "Conduire regulierement des tests de resilience operationnelle numerique, y compris des tests de penetration avances (TLPT) pour les entites significatives."},
    {"key": "third_party_risk", "label": "Gestion des risques tiers", "description": "Evaluer et surveiller les risques lies aux prestataires de services TIC tiers, et maintenir un registre d''information sur les accords contractuels."}
  ]'::jsonb,
  'Les sanctions varient selon les Etats membres. Les autorites nationales competentes peuvent imposer des mesures administratives et des penalites financieres proportionnees.',
  'https://eur-lex.europa.eu/eli/reg/2022/2554/oj'
);
