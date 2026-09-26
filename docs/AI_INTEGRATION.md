# Contrato e Diretrizes para Integração com IA (Gemini)

Este documento especifica o contrato de dados, as instruções do modelo e as salvaguardas de privacidade para a futura conexão do Gemini via backend server-side.

---

## 🔒 Proteção de Informações Agregadas

1. **Apenas Dados Desidentificados**: O contexto enviado ao Gemini NUNCA conterá nomes de trabalhadores, CPFs, matrículas, e-mails ou textos livres de respostas individuais.
2. **Filtro K ≥ 5**: Caso a amostra do setor possua menos de 5 respostas válidas, a chamada à IA é bloqueada preventivamente pela função `prepareAiContextData`.

---

## 📝 Instruções para o Modelo Gemini (System Instruction)

```text
Você é um especialista sênior em Engenharia de Segurança, Ergonomia e Organização do Trabalho.
Sua tarefa é propor medidas de controle preventivas de fatores de risco psicossociais ocupacionais (NR-1).

DIRETRIZES OBRIGATÓRIAS:
1. PRIORIDADE: Foque estritamente na modificação das condições e da ORGANIZAÇÃO DO TRABALHO (distribuição de carga, metas, pausamento, autonomia, clareza de papéis, liderança e apoio).
2. NUNCA restrinja propostas a "palestras de bem-estar", "mindfulness", "ginástica laboral" ou "gestão do estresse individual".
3. Considere as medidas preventivas já existentes no setor e proponha melhorias concretas.
4. NUNCA invente exigências legais inexistentes ou citações falsas.
5. NUNCA prometa eliminar 100% dos riscos psicossociais.
6. Apenas relacione propostas aos RISCOS EXPLICITAMENTE FORNECIDOS no contexto. Não invente novos riscos.
```

---

## 🧱 Eschema do Payload de Entrada (Input Contract)

```json
{
  "empresa": "Nome da Empresa",
  "setor": "Atendimento e Suporte",
  "trabalhadoresExpostos": 45,
  "medidasPreventivasAtuais": "Pausas da NR-17",
  "riscosSelecionados": [
    {
      "codigo": "R-001",
      "fatorRisco": "Sobrecarga quantitativa de trabalho e pressão temporal",
      "situacaoTrabalho": "Operação de atendimento telefônico receptivo com metas de TMA",
      "nivelRisco": "critico"
    }
  ]
}
```

---

## 📤 Eschema da Resposta Estruturada (Output Contract)

```json
{
  "suggestions": [
    {
      "linkedRiskCode": "R-001",
      "title": "Revisão do dimensionamento de equipes e regras de repactuação de metas",
      "actionDescription": "Mapear a volatilidade das demandas diárias, estabelecendo teto de chamados...",
      "justification": "Ação focada na causa raiz da sobrecarga e fadiga psicofisiológica.",
      "implementationSteps": [
        "Realizar cronoanálise amostral...",
        "Ajustar sistema de distribuição de tarefas..."
      ],
      "suggestedResponsibleRole": "Gestão de Operações e Engenharia de Processos",
      "estimatedTimeframe": "60 dias",
      "requiredResources": "Software de gestão de fluxo de trabalho...",
      "executionIndicator": "Percentual de adequação da carga diária distribuída (Meta >= 90%).",
      "efficacyIndicator": "Redução na percepção de pressão temporal nas reavaliações.",
      "verificationMethod": "Análise trimestral dos relatórios de volume...",
      "assumptions": "Premissa de flexibilidade no sistema de PABX.",
      "missingInformation": "Verificar se há necessidade de contratação temporária suplementar."
    }
  ]
}
```

---

## ⚠️ Validação e Salvaguardas no Frontend

1. **Rejeição de Riscos Inexistentes**: O frontend valida se os códigos retornados pertencem aos riscos selecionados.
2. **Preservação de Edições Humanas**: Qualquer modificação feita pelo responsável técnico sobre a sugestão da IA é mantida de forma imutável após a aprovação.
