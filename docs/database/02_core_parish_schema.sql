-- 02_core_parish_schema.sql

-- Limpeza de tabelas parciais para evitar erro 'already exists'
DROP TABLE IF EXISTS public.mass_schedules CASCADE;
DROP TABLE IF EXISTS public.posts CASCADE;
DROP TABLE IF EXISTS public.sacrament_requests CASCADE;
DROP TABLE IF EXISTS public.mass_intentions CASCADE;
DROP TABLE IF EXISTS public.communities CASCADE;
-- ==============================================================================
-- 1. Tabela de Comunidades / Capelas
-- ==============================================================================
CREATE TABLE public.communities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL,
    address TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE (tenant_id, slug)
);

ALTER TABLE public.communities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Communities are viewable by everyone" ON public.communities
    FOR SELECT USING (true);

-- ==============================================================================
-- 2. Tabela de Agendas de Missas
-- ==============================================================================
CREATE TABLE public.mass_schedules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    community_id UUID REFERENCES public.communities(id) ON DELETE CASCADE, -- null indica que é na Matriz
    day_of_week VARCHAR(20) NOT NULL,
    time TIME NOT NULL,
    description VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.mass_schedules ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Mass schedules are viewable by everyone" ON public.mass_schedules
    FOR SELECT USING (true);

-- ==============================================================================
-- 3. Tabela de Posts (Mural de Avisos e Notícias)
-- ==============================================================================
CREATE TABLE public.posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    author_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    title VARCHAR(255) NOT NULL,
    content TEXT,
    image_url TEXT,
    status VARCHAR(20) DEFAULT 'draft', -- 'draft', 'published', 'archived'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

-- Somente posts publicados são visíveis por padrão (para fiéis e visitantes)
CREATE POLICY "Published posts are viewable by everyone" ON public.posts
    FOR SELECT USING (status = 'published');

-- ==============================================================================
-- 4. Tabela de Atendimentos / Sacramentos
-- ==============================================================================
CREATE TABLE public.sacrament_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    sacrament_type VARCHAR(50) NOT NULL, -- 'baptism', 'matrimony', 'confirmation', 'unction'
    status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'approved', 'rejected', 'completed'
    details JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.sacrament_requests ENABLE ROW LEVEL SECURITY;

-- Usuários só podem ver seus próprios pedidos
CREATE POLICY "Users can view own sacrament requests" ON public.sacrament_requests
    FOR SELECT USING (auth.uid() = user_id);

-- Usuários podem criar seus próprios pedidos
CREATE POLICY "Users can insert own sacrament requests" ON public.sacrament_requests
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ==============================================================================
-- 5. Tabela de Intenções de Missa
-- ==============================================================================
CREATE TABLE public.mass_intentions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    intention_type VARCHAR(50) NOT NULL, -- 'thanksgiving', 'deceased', 'health', 'other'
    content TEXT NOT NULL,
    requested_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.mass_intentions ENABLE ROW LEVEL SECURITY;

-- Usuários só podem ver suas próprias intenções
CREATE POLICY "Users can view own mass intentions" ON public.mass_intentions
    FOR SELECT USING (auth.uid() = user_id);

-- Usuários podem criar suas próprias intenções
CREATE POLICY "Users can insert own mass intentions" ON public.mass_intentions
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ==============================================================================
-- Políticas Globais de Acesso para Administradores (Secretaria)
-- ==============================================================================

-- Função auxiliar que verifica se o usuário logado tem permissão de gerência no tenant
CREATE OR REPLACE FUNCTION public.user_has_tenant_access(check_tenant_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.user_roles ur 
        WHERE ur.user_id = auth.uid() 
        AND (ur.tenant_id = check_tenant_id OR ur.role = 'superadmin')
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Aplicação da função nas tabelas
CREATE POLICY "Admins can manage mass schedules" ON public.mass_schedules
    FOR ALL USING (public.user_has_tenant_access(tenant_id));

CREATE POLICY "Admins can manage communities" ON public.communities
    FOR ALL USING (public.user_has_tenant_access(tenant_id));

CREATE POLICY "Admins can manage posts" ON public.posts
    FOR ALL USING (public.user_has_tenant_access(tenant_id));

CREATE POLICY "Admins can manage sacrament requests" ON public.sacrament_requests
    FOR ALL USING (public.user_has_tenant_access(tenant_id));

CREATE POLICY "Admins can manage mass intentions" ON public.mass_intentions
    FOR ALL USING (public.user_has_tenant_access(tenant_id));
