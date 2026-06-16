# Arquitetura do Sistema de Notificações - Casa Digital Paroquial

Este documento apresenta a proposta arquitetural para a implementação do sistema de notificações para fiéis e administradores cadastrados na plataforma da Catedral de Colatina (e outras paróquias do ecossistema).

---

## 1. Canais de Notificação Recomendados

Dado o perfil do público da igreja (que inclui jovens e idosos), sugerimos uma estratégia **omnichannel** focada na facilidade de acesso:

```
                  ┌───────────────┐
                  │ Evento no DB  │
                  └───────┬───────┘
                          │
            ┌─────────────┴─────────────┐
            ▼                           ▼
    [Ações Administrativas]     [Mural / Avisos Gerais]
            │                           │
    ┌───────┼───────┐                   ├──────────────────┐
    ▼       ▼       ▼                   ▼                  ▼
[WhatsApp] [Email] [In-App]        [Web Push]       [Email Semanal]
```

1. **In-App (Central de Notificações - Sino)**
   * **Como funciona**: Um ícone de sino no cabeçalho do portal/dashboard do usuário.
   * **Uso**: Avisos de alteração de status de sacramentos, respostas a intenções de missas, novas pastorais.
   * **Tecnologia**: Tabela `notifications` no banco de dados e **Supabase Realtime** para atualização instantânea em tela.

2. **WhatsApp (Canal Principal para o Brasil)**
   * **Como funciona**: Envio de mensagens automáticas de confirmação e status diretamente no número do celular do fiel.
   * **Uso**: Confirmação de recebimento de intenção de missa, aprovação de documentos de sacramentos, lembrete de dízimo ("Mensagem de Gratidão").
   * **Tecnologia**: APIs parceiras (ex: *Z-API*, *Evolution API*, *Twilio* ou *WhatsApp Business Cloud API*).

3. **E-mail (Transacional e Informativo)**
   * **Como funciona**: E-mails personalizados enviados em segundo plano.
   * **Uso**: Confirmação de cadastro, resumo dominical de avisos paroquiais (Newsletter da Catedral), comprovante litúrgico do Dízimo.
   * **Tecnologia**: **Resend** (excelente para Next.js) ou Amazon SES.

4. **Web Push (Notificações de Navegador/PWA)**
   * **Como funciona**: Alertas pop-up no celular ou computador, mesmo com o site fechado.
   * **Uso**: Anúncio de transmissões ao vivo ("A missa está começando!"), avisos urgentes do Bispo/Pároco.
   * **Tecnologia**: **OneSignal** (abstrai complexidades de iOS/Android) ou Web Push nativo com chaves VAPID.

---

## 2. Modelagem do Banco de Dados (Supabase)

Para gerenciar o estado das notificações e as preferências de cada fiel, propomos as seguintes tabelas e estruturas:

### A. Tabela: `notifications` (Histórico In-App)
Registra todas as notificações destinadas a um usuário específico.
```sql
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  parish_id UUID REFERENCES parishes(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  type TEXT NOT NULL, -- 'sacrament', 'intention', 'general_notice', 'donation'
  link TEXT, -- URL interna para onde redirecionar o usuário (ex: '/dashboard/sacramentos')
  read_at TIMESTAMP WITH TIME ZONE, -- NULL indica não lida
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Habilitar RLS
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Política: Usuário só lê suas próprias notificações
CREATE POLICY "Users view own notifications" 
ON notifications FOR SELECT 
TO authenticated 
USING (user_id = auth.uid());
```

### B. Tabela: `user_notification_preferences` (Opções de Envio)
Permite ao fiel selecionar por quais canais deseja receber cada tipo de notificação.
```sql
CREATE TABLE user_notification_preferences (
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  allow_email BOOLEAN DEFAULT true,
  allow_whatsapp BOOLEAN DEFAULT true,
  allow_push BOOLEAN DEFAULT true,
  
  -- Frequências específicas
  weekly_digest BOOLEAN DEFAULT true, -- Resumo da semana no domingo
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
```

---

## 3. Fluxo de Disparo Automático (Arquitetura Severless)

Para evitar lentidão no frontend, os disparos de notificações externas (WhatsApp, E-mail, Push) devem rodar em segundo plano utilizando um modelo orientado a eventos:

### Fluxo Sugerido:
1. **Trigger de Banco de Dados**: O usuário solicita uma Intenção de Missa $\rightarrow$ Um novo registro é inserido na tabela `mass_intentions` com `status = 'pending'`.
2. **Webhook do Supabase**: O Supabase dispara um **Database Webhook** configurado para escutar alterações/inserções na tabela de intenções.
3. **Edge Function ou API Route (Next.js)**: O webhook bate em uma rota segura do Next.js (ex: `/api/webhooks/notifications`), que lê os detalhes do evento.
4. **Verificação de Preferências**: A API checa na tabela `user_notification_preferences` se o usuário aceita WhatsApp ou E-mail.
5. **Fila de Envio (Queue)**: Se aceito, a rota envia a carga para o serviço de mensageria correspondente (*Resend* para e-mail ou a API do *WhatsApp*).

---

## 4. Cronograma de Implementação Sugerido

Recomendamos dividir a entrega em fases para focar primeiro no valor imediato para a secretaria da Catedral de Colatina:

* **Fase 1 (Essencial - MVP)**:
  * Sistema de Notificação **In-App** (Tabela `notifications` + ícone de sino com Supabase Realtime).
  * Envio de **E-mail de boas-vindas** e confirmações transacionais via **Resend**.
* **Fase 2 (Engajamento e Atendimento)**:
  * Integração com **WhatsApp API** para envio de atualizações críticas (aprovação de sacramentos e intenções).
  * Preferências de Notificação no perfil do usuário.
* **Fase 3 (Mobilidade)**:
  * Configuração de Web Push no PWA usando **OneSignal** para avisos em tempo real da paróquia.
