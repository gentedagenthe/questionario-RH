-- Tabela do questionário Analista de Recursos Humanos (Genthe que Seleciona)
create table if not exists public.candidatos_analista_rh (
  id uuid primary key default gen_random_uuid(),
  criado_em timestamptz not null default now(),
  -- Dados Pessoais
  nome text, cpf text, email text, telefone text,
  cidade_atual text, estado_atual text, com_quem_mora text,
  -- Situação Profissional
  situacao_profissional text, empresa_atual text, cargo_atual text, disponibilidade_inicio text,
  -- Formação e Experiência
  formacao text, tempo_experiencia_rh text, experiencia_rh text, experiencia_varejo text,
  -- Captação, Seleção e Integração
  captacao_selecao text, quadro_completo text, integracao text,
  -- Desenvolvimento e Suporte às Lideranças
  treinamento text, suporte_liderancas text, avaliacoes text,
  -- Indicadores e Visão de Negócio
  indicadores text, iniciativa_criatividade text, sustentabilidade_negocio text,
  -- Perfil e Motivação
  motivacao_vaga text, contribuicao text, pretensao_salarial text,
  -- Localização e Disponibilidade
  reside_campo_grande text, disponibilidade_mudanca text, disponibilidade_horario text,
  -- LGPD
  lgpd_aceite boolean not null default false
);

alter table public.candidatos_analista_rh enable row level security;

drop policy if exists "anon_insert_analista_rh" on public.candidatos_analista_rh;
create policy "anon_insert_analista_rh" on public.candidatos_analista_rh
  for insert to anon with check (true);

drop policy if exists "anon_select_analista_rh" on public.candidatos_analista_rh;
create policy "anon_select_analista_rh" on public.candidatos_analista_rh
  for select to anon using (true);

notify pgrst, 'reload schema';
