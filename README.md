# PsicoGestão NR-1 — Protótipo de Gestão de Riscos Psicossociais

**PsicoGestão NR-1** é um aplicativo web navegável desenvolvido para avaliação, gestão e monitoramento de fatores de risco psicossociais relacionados ao trabalho, atuando como subsídio técnico ao Gerenciamento de Riscos Ocupacionais (GRO) e ao Programa de Gerenciamento de Riscos (PGR), conforme a Norma Regulamentadora nº 1 (NR-1) do Ministério do Trabalho e Emprego (MTE).

---

## 📌 Principais Funcionalidades

1. **Empresa e Setores**: Cadastro de dados do estabelecimento e mapeamento dos grupos expostos por setor, sem coleta de dados nominais de trabalhadores.
2. **Campanhas de Coleta**: Gestão do ciclo de vida da pesquisa (Rascunho, Aberta, Encerrada, Em análise, Finalizada). Congelamento do instrumento ao abrir a campanha.
3. **Questionário do Participante**: Interface isolada orientada a celular com garantia de anonimato, barreira de privacidade e proteção simples contra duplo envio.
4. **Motor de Cálculo Determinístico**: Apuração pura de escores normalizados (0-100), inversão de itens e aplicação rigorosa da regra de privacidade (K ≥ 5 respostas para exibição de grupos).
5. **Inventário de Riscos Ocupacionais**: Registro e gradação de perigos por Severidade x Probabilidade com matriz técnica demonstrativa.
6. **Sugestões de Ação com IA (Gemini Simulated)**: Proposição automatizada de medidas de controle focadas na organização do trabalho (carga, autonomia, metas e clareza de papéis), sem propostas puramente individuais ou palestras genéricas.
7. **Planos de Ação e Eficácia**: Controle de prazos, responsáveis, evidências de execução e verificação obrigatória de eficácia conforme NR-1.
8. **Relatórios e Impressão A4**: Emissão de relatórios estruturados com marca d'água de demonstração, bloco de assinaturas e exportação de snapshot JSON imutável.
9. **Metodologia e Fontes**: Área de fundamentação com links para MTE/NR-1 e COPSOQ International Network, distinção entre escores psicométricos e gradação de risco ocupacional.

---

## 🛠️ Execução e Persistência Local

- **Modo Demonstrativo**: O protótipo opera 100% no navegador utilizando dados fictícios isolados no `localStorage`.
- **Restauração de Dados**: Disponível via botão "Restaurar dados demonstrativos" no cabeçalho.
- **Sem Backend ou Chaves de API**: A geração de sugestões por IA utiliza um provedor simulado robusto, pronto para substituição por rota de servidor Gemini.

---

## ⚡ Fluxo de Demonstração Recomendado

1. Acesse o **Dashboard** para visualizar os indicadores consolidados.
2. Navegue até **Campanhas** e clique em **Link & QR Code** ou **Simular +15 Respostas** para preencher dados na campanha principal.
3. Teste a experiência do trabalhador clicando em **Abrir Questionário (Mobile)** ou acessando `#/responder/camp-2026-01`.
4. Confira a apuração em **Resultados** e verifique a supressão de grupos pequenos em **RH e Estratégia** (K < 5).
5. Acesse o **Inventário de Riscos** para analisar os registros graduados por Severidade x Probabilidade.
6. Vá em **Planos de Ação**, clique em **Sugerir Medidas com IA**, edite as propostas e aprove-as para inserção no plano.
7. Visualize e imprima o **Relatório de Subsídio ao GRO/PGR** na tela de **Relatórios**.
