# Handoff Técnico — PsicoGestão NR-1

Este documento destina-se à equipe de engenharia para migração ou evolução do protótipo no Antigravity/Codex.

---

## 🏗️ Arquitetura do Sistema

O projeto é construído em React + TypeScript + Tailwind CSS com persistência desacoplada em repositório local.

```
src/
├── types/domain.ts            # Entidades de domínio (Company, Campaign, RiskAssessment, etc.)
├── data/seedData.ts           # Dados fictícios para demonstração
├── repositories/
│   └── storageRepository.ts   # Abstração de armazenamento em localStorage
├── services/
│   ├── calculationEngine.ts   # Funções puras de cálculo, normalização (0-100) e inversões
│   ├── privacyPolicy.ts       # Regra K=5 de supressão e sanitização do payload de IA
│   ├── aiActionPlanService.ts # Provedor de IA simulado e contrato de integração Gemini
│   └── reportGenerator.ts     # Compilador de snapshots imutáveis para relatórios
├── components/
│   ├── common/                # Componentes reutilizáveis (Header, Sidebar, Modals, Charts)
│   └── ...
└── pages/                     # As 8 telas administrativas + Tela do Participante
```

---

## 📋 Entidades de Domínio Principais

1. **Company & Department**: Estrutura organizacional sem cadastro nominal de pessoas.
2. **Campaign**: Mapeia pesquisas com frozen rules ao passar para status `aberta`.
3. **InstrumentVersion & QuestionDefinition**: Suporta congelamento e catálogo de instrumentos.
4. **AnonymousResponse**: Respostas puras sem vinculação de usuário.
5. **CalculationResult & DimensionScore**: Resultados apurados deterministicamente.
6. **RiskAssessment**: Registro do inventário com gradação por Severidade (1-5) e Probabilidade (1-5).
7. **ActionPlanItem**: Medida de controle com acompanhamento de eficacia conforme NR-1.

---

## ⚙️ Regras Implementadas

- **Separação Obrigatória**:
  - A. Resultado da pesquisa (evidência).
  - B. Avaliação do risco ocupacional (matriz técnica).
  - C. Proposta de ação (medida de controle organizacional).
- **Sem Percentual de Conformidade**: Proibida a criação de um "score global de conformidade NR-1".
- **Privacidade K ≥ 5**: Ocultação e supressão automática de grupos com amostra < 5.
- **Congelamento de Instrumento**: Quando a campanha é aberta, a versão do instrumento fica imutável.

---

## 🔮 Próximos Passos para Produção (Antigravity / Codex)

1. **Backend Server-Side**: Substituir o `storageRepository` por PostgreSQL / Cloud SQL via ORM (Drizzle/Prisma).
2. **Rota Proxy de IA**: Implementar endpoint Express `/api/ai/suggest-actions` executando `@google/genai` com chave de API mantida em variável de ambiente no servidor.
3. **Centralização de Respostas**: Permitir coleta em tempo real via WebSockets / REST API para sincronizar respostas de múltiplos dispositivos móveis.
