-- Prévia do convite: quem cria vê o combinado carimbado ANTES de aceitar.
--
-- Sem isto, aceitar seria às cegas (antes do aceite, quem cria não participa do
-- trabalho e as regras de leitura não deixam ver nada). O token é um uuid aleatório
-- que só existe no link enviado pelo contratante: quem tem o link pode ler a prévia.
-- A prévia não leva ids de pessoas, só o que é preciso para decidir.

create function public.feel_ver_convite(p_token uuid)
returns jsonb
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
  c public.feel_convites;
  t public.feel_trabalhos;
  a public.feel_acordos;
  eu uuid := auth.uid();
begin
  if eu is null then
    raise exception 'sem sessão';
  end if;
  select * into c from public.feel_convites where token = p_token;
  if not found or c.expira_em < now() then
    raise exception 'convite inválido ou vencido';
  end if;
  select * into t from public.feel_trabalhos where id = c.trabalho_id;
  if t.profissional_id is not null and t.profissional_id <> eu then
    raise exception 'convite já aceito por outra pessoa';
  end if;
  select * into a from public.feel_acordos where trabalho_id = t.id;
  return jsonb_build_object(
    'trabalho', t.id,
    'texto', t.texto,
    'praca', t.entendimento ->> 'praca',
    'estagio', t.estagio,
    'souContratante', t.contratante_id = eu,
    'aceito', coalesce(t.profissional_id = eu, false),
    'acordo', jsonb_build_object(
      'perfil_demo', a.perfil_demo,
      'entregaveis', to_jsonb(a.entregaveis),
      'direitos', a.direitos,
      'prazo', a.prazo,
      'esperamos', a.esperamos,
      'erramos_se', a.erramos_se,
      'carimbado_em', a.carimbado_em
    )
  );
end;
$$;

revoke all on function public.feel_ver_convite(uuid) from public, anon;
grant execute on function public.feel_ver_convite(uuid) to authenticated;
