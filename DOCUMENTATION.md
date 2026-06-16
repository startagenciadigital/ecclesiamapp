# Casa Digital Paroquial - Protocolo de Desenvolvimento (SSOT)

## 1. Escopo do Projeto (Raiz do Escopo - Ideia Inicial)

Este trecho define a raiz do escopo e a visão do projeto de presença digital e evangelização para a **Catedral de Colatina (Paróquia Sagrado Coração de Jesus)**.

### A. Nosso Propósito
O objetivo deste projeto é construir a nova **Casa Digital** da Catedral de Colatina. Queremos usar a tecnologia para aproximar os fiéis da Igreja, facilitar a evangelização e tornar o acesso às informações e aos atendimentos paroquiais muito mais simples, prático e acolhedor para todas as idades.

### B. O Que Vamos Construir?
Iremos desenvolver uma plataforma completa e integrada, composta por:
- **Um Novo Portal (Site Web)**: Moderno, acessível e fácil de navegar por qualquer computador ou celular.
- **Um Aplicativo Exclusivo**: Um aplicativo de celular oficial da paróquia, colocando a Igreja na palma da mão dos paroquianos.
Tudo isso será criado com uma identidade visual solene e fraterna, refletindo a seriedade e o acolhimento da nossa comunidade.

### C. Principais Benefícios e Funcionalidades

#### 1. Evangelização e Informação Sempre à Mão
- **Horários de Missas Atualizados**: Facilidade extrema para o fiel encontrar os horários de missas e confissões em tempo real, inclusive em dias festivos.
- **Mural de Notícias e Avisos**: Um canal direto para comunicar eventos, festas e avisos importantes da paróquia.
- **Transmissões ao Vivo**: Integração fácil para que os fiéis acompanhem as missas de casa quando não puderem estar presentes.

#### 2. Secretaria Mais Ágil e Descomplicada
- **Central de Atendimento**: Um local centralizado para organizar pedidos de sacramentos (Batismo, Casamento, Crisma) e intenções de missa.
- **Contato Direto**: Botões práticos para o fiel falar diretamente com a secretaria via WhatsApp, tirando dúvidas de forma rápida e diminuindo a burocracia.

#### 3. Dízimo e Partilha de Forma Segura e Respeitosa
- **Facilidade Digital**: Um ambiente totalmente seguro e prático para o fiel contribuir com seu dízimo ou fazer ofertas digitalmente (via PIX ou Cartão).
- **Abordagem Humana**: Todo o sistema de devolução do dízimo foi pensado para não parecer uma "cobrança". Tratamos o dízimo com a sensibilidade litúrgica que ele exige, focando na gratidão e na partilha.

#### 4. Integração de Todas as Comunidades
- A plataforma não será apenas para a Igreja Matriz. Ela será capaz de organizar e dar visibilidade para todas as capelas e comunidades filiadas, permitindo que cada uma tenha seus próprios avisos e horários de celebração.

### D. Para Quem Estamos Construindo?
- **Para os Fiéis**: Pessoas de todas as idades. A tela será simples e intuitiva, garantindo que mesmo o público mais idoso consiga usar o aplicativo sem dificuldades.
- **Para as Pastorais**: Coordenadores terão um espaço para divulgar os horários e locais de seus encontros.
- **Para a Secretaria**: A equipe administrativa terá uma ferramenta poderosa para gerenciar as rotas diárias com menos papelada e confusão.

**Nossa Missão**: Usar a tecnologia não para afastar as pessoas, mas para conectá-las ainda mais à vida em comunidade e aos sacramentos, sempre com uma linguagem respeitosa, litúrgica e acolhedora.

---

## 2. Visão Geral de Engenharia
Este documento serve como a **Fonte Única de Verdade (SSOT)** para a arquitetura, regras de negócio e estabilização da plataforma de rede social e portal de avisos para paróquias e comunidades.

## 3. Padrões de Interface (UI/UX)
- **Acessibilidade para Todos (Fiéis):** Como o público da igreja abrange pessoas idosas, o contraste tipográfico deve ser máximo. Fontes com tamanhos confortáveis (mínimo `14px` para textos corridos, ideal `16px` no mobile).
- **Esquema de Cores Sóbrio e Litúrgico:** 
  - Fundo principal (Tema Claro): `#fcfcfc` com superfícies em branco puro `#ffffff`.
  - Fundo principal (Tema Escuro): `#09090b` com superfícies em `zinc-900/950` (`#18181b`).
  - Cores de Destaque: Azul eclesial escuro, dourado litúrgico ou verde oliva dependendo da paróquia.
- **Modais e Portais (Stacking Context):**
  - Toda modal (ex: solicitação de sacramento, formulário de intenção) que precise cobrir 100% da tela DEVE ser renderizada via **React Portals** (`createPortal(..., document.body)`) para evitar quebra de layout de z-index em visualizações PWA ou embeds.

## 4. Segurança e Dados (RLS)
- **Isolamento de Tenants:** Todo insert na tabela `posts`, `sacrament_requests` ou `mass_intentions` deve carregar obrigatoriamente o `parish_id` do perfil do usuário logado.
- **Políticas de Leitura:** Fiéis só podem ler posts da paróquia ativa. Visitantes anônimos só leem posts marcados como `status = 'published'` e de paróquias com status ativo.

## 5. Estrutura de Roteamento Dinâmico (App Router)
- `/[slug]` -> Renderiza o portal público da paróquia.
- `/[slug]/comunidade/[communitySlug]` -> Filtra avisos e horários específicos de uma capela/comunidade filial.
- `/dashboard` -> Painel de controle da secretaria da paróquia.
- `/login` -> Fluxo híbrido com OTP de 6 dígitos para fiéis e senha para secretaria.

## 6. Dízimo e Ofertas (Experiência Humana)
- O fluxo de doação deve exibir mensagens personalizadas focadas em gratidão e acolhimento em vez de alertas de faturamento frios de e-commerce.
