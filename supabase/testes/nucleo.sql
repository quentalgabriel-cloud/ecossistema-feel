-- Testes das regras do núcleo (migração feel_nucleo).
--
-- Roda inteiro dentro de um bloco DO que termina com RAISE: tudo o que ele grava
-- (inclusive os três usuários de teste) é desfeito no fim. O resultado vem na
-- mensagem do erro final, uma linha por caso: "ok — …" ou "FALHOU — …".
--
-- Pessoas: A = contratante, B = quem cria, X = intruso.
-- Para simular cada uma: role authenticated + request.jwt.claims com sub e is_anonymous.

do $$
declare
  a uuid := gen_random_uuid();
  b uuid := gen_random_uuid();
  x uuid := gen_random_uuid();
  t uuid;
  tok uuid;
  txt text;
  n int;
  res text[] := '{}';
begin
  insert into auth.users (id, email, aud, role)
  values (a, 'a@teste.invalid', 'authenticated', 'authenticated'),
         (b, 'b@teste.invalid', 'authenticated', 'authenticated'),
         (x, 'x@teste.invalid', 'authenticated', 'authenticated');

  -- ---------- relações ----------
  perform set_config('request.jwt.claims', json_build_object('sub', a, 'role', 'authenticated', 'is_anonymous', true)::text, true);
  execute 'set local role authenticated';

  begin
    insert into public.feel_relacoes (entidade_id, tipo, estado) values ('feira-bairro', 'identifica_se', 'declarado');
    res := res || 'ok — A declara uma relação';
  exception when others then res := res || ('FALHOU — A declara uma relação: ' || sqlerrm); end;

  begin
    insert into public.feel_relacoes (entidade_id, tipo, estado) values ('ilustracao', 'contribui', 'assinado');
    res := res || 'FALHOU — A se autopromove a assinado';
  exception when others then res := res || 'ok — A não se autopromove a assinado'; end;

  begin
    insert into public.feel_relacoes (entidade_id, tipo, estado, provas) values ('ilustracao', 'identifica_se', 'declarado', 3);
    res := res || 'FALHOU — A inventa provas';
  exception when others then res := res || 'ok — A não inventa provas'; end;

  begin
    update public.feel_relacoes set estado = 'confirmado' where entidade_id = 'feira-bairro';
    res := res || 'FALHOU — A confirma a própria relação';
  exception when others then res := res || 'ok — A não confirma a própria relação'; end;

  execute 'reset role';
  perform set_config('request.jwt.claims', json_build_object('sub', x, 'role', 'authenticated', 'is_anonymous', true)::text, true);
  execute 'set local role authenticated';
  select count(*) into n from public.feel_relacoes where owner_id = a;
  res := res || case when n = 0 then 'ok — X não lê relações de A' else 'FALHOU — X lê relações de A' end;

  -- B já tinha declarado café: a prova vai virar essa relação em "assinado".
  execute 'reset role';
  perform set_config('request.jwt.claims', json_build_object('sub', b, 'role', 'authenticated', 'is_anonymous', true)::text, true);
  execute 'set local role authenticated';
  insert into public.feel_relacoes (entidade_id, tipo, estado) values ('cafe-especial', 'identifica_se', 'declarado');

  -- ---------- trabalho e acordo ----------
  execute 'reset role';
  perform set_config('request.jwt.claims', json_build_object('sub', a, 'role', 'authenticated', 'is_anonymous', true)::text, true);
  execute 'set local role authenticated';

  insert into public.feel_trabalhos (texto, entendimento, economia)
  values ('cafeteria no Recife Antigo', '{"nichos":["cafe-especial"],"praca":"Recife"}', '{"ticketMedio":45}')
  returning id into t;
  res := res || 'ok — A cria um trabalho em rascunho';

  begin
    insert into public.feel_trabalhos (texto, estagio) values ('pulando etapa', 'proposta');
    res := res || 'FALHOU — A cria trabalho já em proposta';
  exception when others then res := res || 'ok — trabalho só nasce em rascunho'; end;

  begin
    update public.feel_trabalhos set estagio = 'aceita' where id = t;
    res := res || 'FALHOU — A pula de rascunho para aceita';
  exception when others then res := res || 'ok — estágio não pula'; end;

  begin
    insert into public.feel_acordos (trabalho_id, perfil_demo, entregaveis, direitos, esperamos, erramos_se)
    values (t, 'bia', '{Reels}', 'organico', 'x', 'y');
    res := res || 'FALHOU — acordo gravado direto, sem carimbo';
  exception when others then res := res || 'ok — acordo só nasce pelo carimbo'; end;

  begin
    perform public.feel_carimbar_acordo(t, 'bia', '{Reels}', 'organico', 'Dezembro', '20 clientes com cupom', 'menos de 8 clientes');
    select estagio into txt from public.feel_trabalhos where id = t;
    res := res || case when txt = 'proposta' then 'ok — carimbo leva o trabalho a proposta' else 'FALHOU — carimbo não mudou o estágio: ' || txt end;
  exception when others then res := res || ('FALHOU — carimbo: ' || sqlerrm); end;

  begin
    perform public.feel_carimbar_acordo(t, 'bia', '{Reels}', 'organico', '', 'outra', 'outra');
    res := res || 'FALHOU — segundo carimbo aceito';
  exception when others then res := res || 'ok — não há segundo carimbo'; end;

  begin
    update public.feel_trabalhos set texto = 'reescrevendo a necessidade' where id = t;
    res := res || 'FALHOU — necessidade editada depois do acordo';
  exception when others then res := res || 'ok — necessidade congela depois do acordo'; end;

  execute 'reset role';
  begin
    update public.feel_acordos set esperamos = 'ajustado depois' where trabalho_id = t;
    res := res || 'FALHOU — acordo alterado (nem o dono do banco deveria)';
  exception when others then res := res || 'ok — acordo é imutável até para o dono do banco'; end;

  -- ---------- convite ----------
  perform set_config('request.jwt.claims', json_build_object('sub', x, 'role', 'authenticated', 'is_anonymous', true)::text, true);
  execute 'set local role authenticated';
  begin
    perform public.feel_convidar(t);
    res := res || 'FALHOU — X gera convite de trabalho alheio';
  exception when others then res := res || 'ok — só o contratante convida'; end;

  execute 'reset role';
  perform set_config('request.jwt.claims', json_build_object('sub', a, 'role', 'authenticated', 'is_anonymous', true)::text, true);
  execute 'set local role authenticated';
  tok := public.feel_convidar(t);
  res := res || case when tok is not null then 'ok — A gera o convite' else 'FALHOU — convite nulo' end;
  begin
    perform public.feel_aceitar_convite(tok);
    res := res || 'FALHOU — A aceita o próprio convite';
  exception when others then res := res || 'ok — contratante não aceita o próprio convite'; end;

  execute 'reset role';
  perform set_config('request.jwt.claims', json_build_object('sub', b, 'role', 'authenticated', 'is_anonymous', true)::text, true);
  execute 'set local role authenticated';
  begin
    perform public.feel_aceitar_convite(tok);
    select estagio into txt from public.feel_trabalhos where id = t;
    res := res || case when txt = 'aceita' then 'ok — B aceita e o trabalho fica "aceita"' else 'FALHOU — estágio depois do aceite: ' || coalesce(txt, 'B não enxerga') end;
  exception when others then res := res || ('FALHOU — B aceita: ' || sqlerrm); end;

  update public.feel_trabalhos set estagio = 'em_andamento' where id = t;
  get diagnostics n = row_count;
  res := res || case when n = 0 then 'ok — B não move estágio de trabalho alheio' else 'FALHOU — B moveu o estágio' end;

  execute 'reset role';
  perform set_config('request.jwt.claims', json_build_object('sub', x, 'role', 'authenticated', 'is_anonymous', true)::text, true);
  execute 'set local role authenticated';
  begin
    perform public.feel_aceitar_convite(tok);
    res := res || 'FALHOU — X toma o convite já aceito';
  exception when others then res := res || 'ok — convite aceito não troca de dono'; end;
  select count(*) into n from public.feel_trabalhos where id = t;
  res := res || case when n = 0 then 'ok — X não enxerga o trabalho' else 'FALHOU — X enxerga o trabalho' end;

  -- ---------- andamento, veredito, assinaturas ----------
  execute 'reset role';
  perform set_config('request.jwt.claims', json_build_object('sub', a, 'role', 'authenticated', 'is_anonymous', true)::text, true);
  execute 'set local role authenticated';
  update public.feel_trabalhos set estagio = 'em_andamento' where id = t;
  update public.feel_trabalhos set funil = '{"contatos":120,"clientes":23,"gasto":1840}' where id = t;
  update public.feel_trabalhos set estagio = 'entregue' where id = t;
  update public.feel_trabalhos set veredito = 'Vieram 23 clientes com o cupom.' where id = t;
  res := res || 'ok — A conduz até a entrega e registra o veredito';

  begin
    perform public.feel_assinar(t, 'contratante');
    res := res || 'FALHOU — sessão anônima assinou';
  exception when others then res := res || 'ok — sessão anônima não assina'; end;

  execute 'reset role';
  perform set_config('request.jwt.claims', json_build_object('sub', a, 'role', 'authenticated', 'is_anonymous', false)::text, true);
  execute 'set local role authenticated';
  begin
    perform public.feel_assinar(t, 'profissional');
    res := res || 'FALHOU — A assinou pelo outro lado';
  exception when others then res := res || 'ok — ninguém assina pelo outro lado'; end;

  txt := public.feel_assinar(t, 'contratante');
  res := res || case when txt = 'entregue' then 'ok — A assina (com e-mail confirmado)' else 'FALHOU — retorno da 1ª assinatura: ' || txt end;

  begin
    update public.feel_trabalhos set veredito = 'mudando depois de assinar' where id = t;
    res := res || 'FALHOU — veredito mudou depois da assinatura';
  exception when others then res := res || 'ok — veredito fica fixo depois da 1ª assinatura'; end;

  execute 'reset role';
  perform set_config('request.jwt.claims', json_build_object('sub', b, 'role', 'authenticated', 'is_anonymous', false)::text, true);
  execute 'set local role authenticated';
  txt := public.feel_assinar(t, 'profissional');
  res := res || case when txt = 'encerrado' then 'ok — B assina e o trabalho se encerra' else 'FALHOU — retorno da 2ª assinatura: ' || txt end;

  execute 'reset role';
  select count(*) into n from public.feel_relacoes
   where entidade_id = 'cafe-especial' and estado = 'assinado' and provas = 1 and owner_id in (a, b);
  res := res || case when n = 2 then 'ok — a prova volta para os dois (assinado, 1 prova)' else 'FALHOU — relações assinadas: ' || n end;

  perform set_config('request.jwt.claims', json_build_object('sub', a, 'role', 'authenticated', 'is_anonymous', false)::text, true);
  execute 'set local role authenticated';
  begin
    update public.feel_trabalhos set funil = '{}' where id = t;
    res := res || 'FALHOU — trabalho encerrado mudou';
  exception when others then res := res || 'ok — trabalho encerrado não muda'; end;

  delete from public.feel_relacoes where entidade_id = 'cafe-especial';
  get diagnostics n = row_count;
  res := res || case when n = 0 then 'ok — A não apaga a própria prova' else 'FALHOU — A apagou a prova' end;

  execute 'reset role';
  raise exception E'RESULTADO\n%', array_to_string(res, E'\n');
end;
$$;
