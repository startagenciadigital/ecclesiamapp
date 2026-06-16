# Prompt de Continuidade - Ecclesiam (Rede Social de Paróquias)

## 📌 Contexto Atual
- **Design System**: A base visual (estilo Portal Clássico/Moderno) foi estabelecida em `globals.css` e `layout.tsx` utilizando as fontes Playfair Display e Inter.
- **Sistema de Cores Litúrgicas Dinâmicas**: Criamos a lógica em `lib/liturgical-calendar.ts` e injetamos através do `LiturgicalProvider`. O sistema já se adapta automaticamente ao tempo da Igreja (Verde, Roxo, Branco/Dourado, etc).
- **White Label**: Removemos as referências codificadas ('hardcoded') de "Ecclesiam". O app agora consome a variável de ambiente `NEXT_PUBLIC_TENANT_NAME` para definir títulos e logotipos da paróquia cliente.
- **Situação do Git**: Todas essas fundações estão *commitadas* de forma limpa na branch `main`.

## 🎯 Objetivo da Sessão Atual
O usuário aprovou o fluxo do **MAIN ADMIN & Arquitetura Multi-Tenant**. Este plano dita que o próximo passo é criar o "cérebro" da operação SaaS, que gerencia as paróquias (Tenants).

## 🚀 Próximos Passos (Ação Imediata para o Agente)
Por favor, retome a execução baseada no último Plano de Implementação aprovado. Suas próximas tarefas de desenvolvimento de código são:

1. **Criar os Scripts do Banco de Dados (Supabase)**:
   - Criar o arquivo `docs/database/01_multi_tenant_schema.sql` contendo:
     - Tabela `tenants` (id, name, slug, theme_color, etc).
     - Tabela `user_roles` (user_id, role, tenant_id).
     - Definição do RLS (Row Level Security) básico.

2. **Criar a Rota do Super Admin**:
   - Criar `app/superadmin/layout.tsx` (layout isolado para gestão).
   - Criar `app/superadmin/page.tsx` (Dashboard do SaaS que listará os Tenants).

3. **Atualizar o Middleware de Autenticação**:
   - Editar `middleware.ts` para proteger a rota `/superadmin/*`, garantindo que apenas usuários logados com a role `'superadmin'` no Supabase tenham acesso.

4. **Tarefas de Acompanhamento (`task.md`)**:
   - Crie o artefato `task.md` refletindo esses 3 passos de execução para acompanharmos o progresso durante esta próxima sessão.
