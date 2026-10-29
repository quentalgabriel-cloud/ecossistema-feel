-- Núcleo da Feel unificada (Onda 3): relações, trabalhos, acordos, assinaturas e convites.
--
-- Só tabelas novas. Nada aqui altera as tabelas feel_* da v12 (feel_profiles,
-- feel_user_preferences, feel_workspace_projects) nem as da Geração 1 (perfis, provas,
-- assinaturas, oportunidades).
--
-- As regras do ciclo valem no banco, não só na tela:
--   · a pessoa só afirma o que pode afirmar sozinha (declarado / em processo);
--     "assinado" e as provas só nascem da dupla assinatura;
--   · o acordo é carimbado pelo servidor e nunca muda;
--   · os estágios só andam para a frente;
--   · assinar exige e-mail confirmado (sessão anônima pode criar, não pode assinar).

-- ---------------------------------------------------------------------------
-- Relações (estado de verdade da pessoa com cada entidade do catálogo)
-- ---------------------------------------------------------------------------

create table public.feel_relacoes (
  owner_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  entidade_id text not null check (char_length(entidade_id) between 1 and 100),
  tipo text not null check (tipo in ('identifica_se', 'interesse', 'membro', 'contribui', 'organiza', 'acompanha')),
  estado text not null check (estado in ('declarado', 'em_processo', 'confirmado', 'assinado')),
  provas integer not null default 0 check (provas >= 0),
  atualizado_em timestamptz not null default now(),
  primary key (owner_id, entidade_id)
);

comment on table public.feel_relacoes is
  'Estado de verdade da pessoa com cada entidade do catálogo. A pessoa só grava declarado/em_processo; assinado e provas nascem de feel_assinar.';

alter table public.feel_relacoes enable row level security;

create policy relacoes_ler_proprias on public.feel_relacoes
  for select to authenticated using ((select auth.uid()) = owner_id);

create policy relacoes_criar_declaradas on public.feel_relacoes
  for insert to authenticated
  with check (
    (select auth.uid()) = owner_id
    and estado in ('declarado', 'em_processo')
    and provas = 0
    and tipo in ('identifica_se', 'interesse', 'acompanha', 'membro')
  );

create policy relacoes_mudar_declaradas on public.feel_relacoes
  for update to authenticated
  using ((select auth.uid()) = owner_id and estado in ('declarado', 'em_processo'))
  with check (
    (select auth.uid()) = owner_id
    and estado in ('declarado', 'em_processo')
    and provas = 0
    and tipo in ('identifica_se', 'interesse', 'acompanha', 'membro')
  );

create policy relacoes_apagar_declaradas on public.feel_relacoes
  for delete to authenticated
  using ((select auth.uid()) = owner_id and estado in ('declarado', 'em_processo'));

-- ---------------------------------------------------------------------------
-- Trabalhos (o ciclo do negócio)
-- ---------------------------------------------------------------------------

create table public.feel_trabalhos (
  id uuid primary key default gen_random_uuid(),
  contratante_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  profissional_id uuid references auth.users (id) on delete set null,
  perfil_demo text check (perfil_demo is null or char_length(perfil_demo) between 1 and 60),
  texto text not null default '' check (char_length(texto) <= 400),
  entendimento jsonb check (entendimento is null or pg_column_size(entendimento) <= 4096),
  economia jsonb not null default '{}'::jsonb check (pg_column_size(economia) <= 1024),
  funil jsonb not null default '{}'::jsonb check (pg_column_size(funil) <= 1024),
  estagio text not null default 'rascunho'
    check (estagio in ('rascunho', 'proposta', 'aceita', 'em_andamento', 'entregue', 'encerrado')),
  veredito text check (veredito is null or char_length(btrim(veredito)) between 1 and 400),
  criado_em timestamptz not null default now(),
  atualizado_em timestamptz not null default now(),
  check (profissional_id is null or profissional_id <> contratante_id)
);

create index feel_trabalhos_contratante on public.feel_trabalhos (contratante_id);
create index feel_trabalhos_profissional on public.feel_trabalhos (profissional_id);

alter table public.feel_trabalhos enable row level security;

create policy trabalhos_ler_participante on public.feel_trabalhos
  for select to authenticated
  using ((select auth.uid()) in (contratante_id, profissional_id));

create policy trabalhos_criar_rascunho on public.feel_trabalhos
  for insert to authenticated
  with check (
    (select auth.uid()) = contratante_id
    and estagio = 'rascunho'
    and profissional_id is null
    and veredito is null
  );

create policy trabalhos_mudar_contratante on public.feel_trabalhos
  for update to authenticated
  using ((select auth.uid()) = contratante_id)
  with check ((select auth.uid()) = contratante_id);

create policy trabalhos_apagar_rascunho on public.feel_trabalhos
  for delete to authenticated
  using ((select auth.uid()) = contratante_id and estagio = 'rascunho');

-- ---------------------------------------------------------------------------
-- Acordos (carimbados pelo servidor; nunca mudam)
-- ---------------------------------------------------------------------------

create table public.feel_acordos (
  trabalho_id uuid primary key references public.feel_trabalhos (id) on delete cascade,
  perfil_demo text not null check (char_length(perfil_demo) between 1 and 60),
  entregaveis text[] not null check (cardinality(entregaveis) between 1 and 10),
  direitos text not null check (direitos in ('organico', 'repost', 'impulsionamento')),
  prazo text not null default '' check (char_length(prazo) <= 40),
  esperamos text not null check (char_length(btrim(esperamos)) between 1 and 280),
  erramos_se text not null check (char_length(btrim(erramos_se)) between 1 and 280),
  carimbado_em timestamptz not null default now()
);

alter table public.feel_acordos enable row level security;

create policy acordos_ler_participante on public.feel_acordos
  for select to authenticated
  using (
    exists (
      select 1 from public.feel_trabalhos t
      where t.id = trabalho_id and (select auth.uid()) in (t.contratante_id, t.profissional_id)
    )
  );
-- Sem política de insert/update/delete: o acordo só nasce por feel_carimbar_acordo.

-- ---------------------------------------------------------------------------
-- Assinaturas (a dupla assinatura que vira prova)
-- ---------------------------------------------------------------------------

create table public.feel_assinaturas (
  trabalho_id uuid not null references public.feel_trabalhos (id) on delete cascade,
  lado text not null check (lado in ('contratante', 'profissional')),
  assinante_id uuid not null references auth.users (id) on delete cascade,
  assinado_em timestamptz not null default now(),
  primary key (trabalho_id, lado)
);

alter table public.feel_assinaturas enable row level security;

create policy assinaturas_ler_participante on public.feel_assinaturas
  for select to authenticated
  using (
    exists (
      select 1 from public.feel_trabalhos t
      where t.id = trabalho_id and (select auth.uid()) in (t.contratante_id, t.profissional_id)
    )
  );
-- Sem política de escrita: assinatura só por feel_assinar.

-- ---------------------------------------------------------------------------
-- Convites (o link que leva quem cria para dentro do trabalho)
-- ---------------------------------------------------------------------------

create table public.feel_convites (
  token uuid primary key default gen_random_uuid(),
  trabalho_id uuid not null unique references public.feel_trabalhos (id) on delete cascade,
  criado_em timestamptz not null default now(),
  expira_em timestamptz not null default now() + interval '14 days',
  aceito_em timestamptz
);

alter table public.feel_convites enable row level security;

create policy convites_ler_contratante on public.feel_convites
  for select to authenticated
  using (
    exists (
      select 1 from public.feel_trabalhos t
      where t.id = trabalho_id and t.contratante_id = (select auth.uid())
    )
  );
-- Criar e aceitar só por feel_convidar / feel_aceitar_convite.

-- ---------------------------------------------------------------------------
-- Regras que nenhum cliente contorna
-- ---------------------------------------------------------------------------

-- Chamado direto pelo cliente, current_user é 'authenticated'. Dentro das funções
-- security definer abaixo, é o dono delas: só elas podem fazer as mudanças privilegiadas.
create function public.feel_trabalhos_regras()
returns trigger
language plpgsql
set search_path = ''
as $$
declare
  privilegiado boolean := current_user not in ('authenticated', 'anon');
begin
  if old.estagio = 'encerrado' then
    raise exception 'trabalho encerrado não muda';
  end if;
  if new.contratante_id <> old.contratante_id then
    raise exception 'o contratante não muda';
  end if;
  if new.profissional_id is distinct from old.profissional_id and not privilegiado then
    raise exception 'quem cria entra pelo convite';
  end if;
  if new.estagio <> old.estagio then
    if not (
      (old.estagio, new.estagio) in (('aceita', 'em_andamento'), ('em_andamento', 'entregue'))
      or (privilegiado and (old.estagio, new.estagio) in
          (('rascunho', 'proposta'), ('proposta', 'aceita'), ('entregue', 'encerrado')))
    ) then
      raise exception 'estágio % não vai para %', old.estagio, new.estagio;
    end if;
  end if;
  if old.estagio <> 'rascunho'
     and (new.texto, new.entendimento, new.economia, new.perfil_demo)
         is distinct from (old.texto, old.entendimento, old.economia, old.perfil_demo) then
    raise exception 'a necessidade fica congelada depois do acordo';
  end if;
  if new.funil is distinct from old.funil and old.estagio not in ('aceita', 'em_andamento', 'entregue') then
    raise exception 'o funil só é medido com o trabalho em curso';
  end if;
  if new.veredito is distinct from old.veredito then
    if old.estagio <> 'entregue'
       or exists (select 1 from public.feel_assinaturas a where a.trabalho_id = old.id) then
      raise exception 'veredito só na entrega e antes das assinaturas';
    end if;
  end if;
  new.atualizado_em := now();
  return new;
end;
$$;

create trigger feel_trabalhos_regras
  before update on public.feel_trabalhos
  for each row execute function public.feel_trabalhos_regras();

create function public.feel_imutavel()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  raise exception '% é imutável', tg_table_name;
end;
$$;

create trigger feel_acordos_imutavel
  before update on public.feel_acordos
  for each row execute function public.feel_imutavel();

create trigger feel_assinaturas_imutavel
  before update on public.feel_assinaturas
  for each row execute function public.feel_imutavel();

create function public.feel_relacoes_atualizado()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.atualizado_em := now();
  return new;
end;
$$;

create trigger feel_relacoes_atualizado
  before update on public.feel_relacoes
  for each row execute function public.feel_relacoes_atualizado();

-- ---------------------------------------------------------------------------
-- Operações (RPC)
-- ---------------------------------------------------------------------------

-- Carimba o acordo: "Esperamos" e "Erramos se" obrigatórios, data do servidor.
create function public.feel_carimbar_acordo(
  p_trabalho uuid,
  p_perfil text,
  p_entregaveis text[],
  p_direitos text,
  p_prazo text,
  p_esperamos text,
  p_erramos_se text
)
returns timestamptz
language plpgsql
security definer
set search_path = ''
as $$
declare
  t public.feel_trabalhos;
  carimbo timestamptz;
begin
  select * into t from public.feel_trabalhos where id = p_trabalho for update;
  if not found or t.contratante_id is distinct from auth.uid() then
    raise exception 'trabalho não encontrado';
  end if;
  if t.estagio <> 'rascunho' then
    raise exception 'acordo já carimbado';
  end if;
  insert into public.feel_acordos (trabalho_id, perfil_demo, entregaveis, direitos, prazo, esperamos, erramos_se)
  values (p_trabalho, p_perfil, p_entregaveis, p_direitos, coalesce(btrim(p_prazo), ''), btrim(p_esperamos), btrim(p_erramos_se))
  returning carimbado_em into carimbo;
  update public.feel_trabalhos set estagio = 'proposta', perfil_demo = p_perfil where id = p_trabalho;
  return carimbo;
end;
$$;

-- Gera (ou devolve) o convite para quem cria entrar no trabalho.
create function public.feel_convidar(p_trabalho uuid)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  t public.feel_trabalhos;
  tok uuid;
begin
  select * into t from public.feel_trabalhos where id = p_trabalho;
  if not found or t.contratante_id is distinct from auth.uid() then
    raise exception 'trabalho não encontrado';
  end if;
  if t.estagio = 'rascunho' then
    raise exception 'convite só depois do acordo';
  end if;
  insert into public.feel_convites (trabalho_id) values (p_trabalho)
  on conflict (trabalho_id) do nothing;
  select token into tok from public.feel_convites where trabalho_id = p_trabalho;
  return tok;
end;
$$;

-- Quem cria aceita o convite: entra no trabalho, que passa a "aceita".
create function public.feel_aceitar_convite(p_token uuid)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  c public.feel_convites;
  t public.feel_trabalhos;
  eu uuid := auth.uid();
begin
  if eu is null then
    raise exception 'sem sessão';
  end if;
  select * into c from public.feel_convites where token = p_token for update;
  if not found or c.expira_em < now() then
    raise exception 'convite inválido ou vencido';
  end if;
  select * into t from public.feel_trabalhos where id = c.trabalho_id for update;
  if t.contratante_id = eu then
    raise exception 'quem contrata não aceita o próprio convite';
  end if;
  if t.profissional_id is not null and t.profissional_id <> eu then
    raise exception 'convite já aceito por outra pessoa';
  end if;
  update public.feel_trabalhos
    set profissional_id = eu,
        estagio = case when estagio = 'proposta' then 'aceita' else estagio end
    where id = t.id;
  update public.feel_convites set aceito_em = coalesce(aceito_em, now()) where token = p_token;
  return t.id;
end;
$$;

-- Assina um lado. Exige e-mail confirmado. Com os dois lados, o trabalho se encerra
-- e a prova volta para a identidade dos dois (feel_relacoes: assinado, provas + 1).
create function public.feel_assinar(p_trabalho uuid, p_lado text)
returns text
language plpgsql
security definer
set search_path = ''
as $$
declare
  t public.feel_trabalhos;
  eu uuid := auth.uid();
  anonimo boolean := coalesce((auth.jwt() ->> 'is_anonymous')::boolean, true);
  nicho text;
begin
  if eu is null then
    raise exception 'sem sessão';
  end if;
  if anonimo then
    raise exception 'assinar pede e-mail confirmado';
  end if;
  if p_lado not in ('contratante', 'profissional') then
    raise exception 'lado inválido';
  end if;
  select * into t from public.feel_trabalhos where id = p_trabalho for update;
  if not found then
    raise exception 'trabalho não encontrado';
  end if;
  if (p_lado = 'contratante' and t.contratante_id <> eu)
     or (p_lado = 'profissional' and t.profissional_id is distinct from eu) then
    raise exception 'esta assinatura não é sua';
  end if;
  if t.estagio <> 'entregue' or t.veredito is null then
    raise exception 'assinatura só depois da entrega e do veredito';
  end if;
  insert into public.feel_assinaturas (trabalho_id, lado, assinante_id) values (p_trabalho, p_lado, eu);
  if (select count(*) from public.feel_assinaturas where trabalho_id = p_trabalho) = 2 then
    update public.feel_trabalhos set estagio = 'encerrado' where id = p_trabalho;
    nicho := t.entendimento -> 'nichos' ->> 0;
    if nicho is not null then
      insert into public.feel_relacoes (owner_id, entidade_id, tipo, estado, provas)
      values (t.contratante_id, nicho, 'contribui', 'assinado', 1),
             (t.profissional_id, nicho, 'contribui', 'assinado', 1)
      on conflict (owner_id, entidade_id) do update
        set tipo = 'contribui', estado = 'assinado', provas = public.feel_relacoes.provas + 1;
    end if;
    return 'encerrado';
  end if;
  return 'entregue';
end;
$$;

revoke all on function public.feel_carimbar_acordo(uuid, text, text[], text, text, text, text) from public, anon;
revoke all on function public.feel_convidar(uuid) from public, anon;
revoke all on function public.feel_aceitar_convite(uuid) from public, anon;
revoke all on function public.feel_assinar(uuid, text) from public, anon;
revoke all on function public.feel_trabalhos_regras() from public, anon, authenticated;
revoke all on function public.feel_imutavel() from public, anon, authenticated;
revoke all on function public.feel_relacoes_atualizado() from public, anon, authenticated;

grant execute on function public.feel_carimbar_acordo(uuid, text, text[], text, text, text, text) to authenticated;
grant execute on function public.feel_convidar(uuid) to authenticated;
grant execute on function public.feel_aceitar_convite(uuid) to authenticated;
grant execute on function public.feel_assinar(uuid, text) to authenticated;
