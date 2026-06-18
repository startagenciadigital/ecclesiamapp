-- 01_multi_tenant_schema.sql

-- ==============================================================================
-- 1. Tabela de Tenants (Paróquias/Organizações)
-- ==============================================================================
CREATE TABLE public.tenants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    theme_color VARCHAR(50) DEFAULT 'blue',
    logo_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Habilitar RLS para tenants
ALTER TABLE public.tenants ENABLE ROW LEVEL SECURITY;

-- Políticas de RLS para tenants
-- Qualquer visitante pode ler os dados dos tenants (necessário para roteamento público / slug)
CREATE POLICY "Tenants are viewable by everyone" ON public.tenants
    FOR SELECT USING (true);


-- ==============================================================================
-- 2. Tabela de User Roles (Controle de Acesso)
-- ==============================================================================
-- Criação do tipo enumerado para as roles do sistema
CREATE TYPE public.app_role AS ENUM ('superadmin', 'admin', 'editor', 'member');

CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE, -- pode ser null se for superadmin global
    role public.app_role NOT NULL DEFAULT 'member',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE (user_id, tenant_id) -- Garante no máximo uma role por usuário em um mesmo tenant
);

-- Habilitar RLS
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Políticas de RLS para user_roles
-- 1. O próprio usuário logado pode ver suas roles
CREATE POLICY "Users can view their own roles" ON public.user_roles
    FOR SELECT USING (auth.uid() = user_id);

-- 2. Super admins podem ver e gerenciar todas as roles
CREATE POLICY "Superadmins can manage all roles" ON public.user_roles
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.user_roles ur
            WHERE ur.user_id = auth.uid() AND ur.role = 'superadmin'
        )
    );

-- ==============================================================================
-- Adicionando política de gerenciamento de Tenants para Super Admins
-- ==============================================================================
CREATE POLICY "Superadmins can manage tenants" ON public.tenants
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.user_roles ur
            WHERE ur.user_id = auth.uid() AND ur.role = 'superadmin'
        )
    );
