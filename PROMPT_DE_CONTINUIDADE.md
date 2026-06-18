# Prompt de Continuidade - Ecclesiam (Rede Social de Paróquias)

## 📌 Contexto Atual
- **Design System**: Base visual estabelecida em `globals.css` e `layout.tsx` (Playfair Display e Inter). Cores Litúrgicas Dinâmicas (`LiturgicalProvider`).
- **Arquitetura Multi-Tenant Base**: O sistema suporta múltiplas paróquias sob o mesmo banco (isoladas via `tenant_id` no Row Level Security).
- **Banco de Dados Concluído**:
  - `01_multi_tenant_schema`: Tabelas `tenants` e `user_roles`.
  - `02_core_parish_schema`: Tabelas vitais da paróquia (`communities`, `mass_schedules`, `posts`, `sacrament_requests` renomeado no escopo para `pastoral_processes`, e `mass_intentions`).
  - `03_confessions_schema`: Inteligência em slots para agendamento direto de confissões (tabelas `confession_schedules` e `confession_appointments`), impedindo choques de horários.
- **Painel do SaaS (Super Admin)**: A rota base `/superadmin` foi desenhada e atualizada com métricas avançadas (Stripe, MRR, Total de Fiéis), servindo exclusivamente como gerenciador do negócio SaaS.

## 🎯 Objetivo da Sessão Atual
O usuário deve escolher em qual frente visual o desenvolvimento deve seguir, já que todo o alicerce de banco de dados e arquitetura está montado e validado.

## 🚀 Próximos Passos (Ação Imediata para o Agente)
Por favor, pergunte ao usuário qual das duas rotas de programação visual ele deseja priorizar agora:

**[ OPÇÃO 1 ] - Foco Comercial (SaaS Onboarding)**
- Criar a Landing Page de conversão de novas paróquias (`app/saas/page.tsx`).
- Criar o fluxo de Auto-Cadastro e Assinatura.
- Criar o *Assistente de Onboarding (Wizard)* que a secretaria de uma paróquia nova deverá preencher (cor, logo e padroeiro) antes de acessar o sistema.

**[ OPÇÃO 2 ] - Foco no Produto Final (Dashboard do Assinante)**
- Criar a interface oficial da **Secretaria Local** (ex: `/[slug]/dashboard`).
- Implementar as telas práticas baseadas no novo banco de dados: O mural para postar Avisos e a tela de Gestão da Agenda de Confissões (onde a secretaria vê quem agendou e pode marcar manualmente).
