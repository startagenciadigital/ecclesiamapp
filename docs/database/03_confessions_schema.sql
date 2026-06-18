-- 03_confessions_schema.sql

-- ==============================================================================
-- Limpeza prévia para segurança (re-execuções)
-- ==============================================================================
DROP TABLE IF EXISTS public.confession_appointments CASCADE;
DROP TABLE IF EXISTS public.confession_schedules CASCADE;

-- ==============================================================================
-- 1. Tabela de Configuração da Agenda de Confissões (Turnos)
-- ==============================================================================
CREATE TABLE public.confession_schedules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    day_of_week VARCHAR(20) NOT NULL, -- Ex: 'Segunda-feira', 'Sexta-feira'
    start_time TIME NOT NULL, -- Ex: 14:00
    end_time TIME NOT NULL, -- Ex: 16:00
    slot_duration_minutes INT NOT NULL DEFAULT 15, -- Para fatiar o calendário automaticamente na interface
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.confession_schedules ENABLE ROW LEVEL SECURITY;

-- Qualquer visitante/fiel pode ver a agenda para saber os horários de plantão
CREATE POLICY "Schedules are viewable by everyone" ON public.confession_schedules
    FOR SELECT USING (true);

-- ==============================================================================
-- 2. Tabela de Agendamentos Reais (Blocos Ocupados)
-- ==============================================================================
CREATE TABLE public.confession_appointments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    
    -- Se o fiel agendar pelo app, fica registrado o ID oficial dele
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- Se a secretaria agendar para um fiel pelo telefone, o user_id fica null e anota-se o nome
    manual_name VARCHAR(255),
    
    appointment_date DATE NOT NULL,
    appointment_time TIME NOT NULL,
    status VARCHAR(20) DEFAULT 'scheduled', -- 'scheduled', 'completed', 'canceled'
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    
    -- REGRA CRÍTICA DE NEGÓCIO: Garantir 1 pessoa por bloco de horário!
    -- Ninguém pode agendar no mesmo dia e no mesmo minuto naquela paróquia. O banco bloqueia.
    UNIQUE (tenant_id, appointment_date, appointment_time)
);

ALTER TABLE public.confession_appointments ENABLE ROW LEVEL SECURITY;

-- Os horários ocupados são visíveis para que a interface esconda esses "slots" dos outros fiéis.
-- IMPORTANTE: A nível de front-end, o sistema não exibirá QUEM agendou, apenas que o horário sumiu.
CREATE POLICY "Appointments are viewable by everyone" ON public.confession_appointments
    FOR SELECT USING (status = 'scheduled');

-- Fiel pode criar o seu próprio agendamento (somente se estiver logado com sua conta)
CREATE POLICY "Users can insert own appointment" ON public.confession_appointments
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Fiel pode alterar seu próprio agendamento (apenas para cancelar e liberar a vaga)
CREATE POLICY "Users can cancel own appointment" ON public.confession_appointments
    FOR UPDATE USING (auth.uid() = user_id);

-- ==============================================================================
-- Políticas Globais de Acesso para Administradores (Secretaria Local)
-- ==============================================================================

-- A secretaria pode criar os turnos/horários de atendimento do padre
CREATE POLICY "Admins can manage confession schedules" ON public.confession_schedules
    FOR ALL USING (public.user_has_tenant_access(tenant_id));

-- A secretaria pode ver todos que agendaram e agendar manualmente para idosos (manual_name)
CREATE POLICY "Admins can manage confession appointments" ON public.confession_appointments
    FOR ALL USING (public.user_has_tenant_access(tenant_id));
