-- Tabela para coletar sugestões de dilemas (Crowdsourcing)
create table dilemma_suggestions (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  narrative_text text not null, -- "O que aconteceu?"
  dilemma_options jsonb not null, -- "Quais eram as escolhas?" (Ex: [{label: '...', effect: '...'}])
  barrier_fact text not null, -- "O que impediu a escolha óbvia?" (Lógica Freakonomics)
  location text, -- "Onde ocorreu?"
  contact_info text -- Opcional, para curadoria
);

-- Políticas de Segurança (Row Level Security)
alter table dilemma_suggestions enable row level security;

-- Permitir inserção pública (anon) - Qualquer um pode sugerir
create policy "Permitir inserção pública"
  on dilemma_suggestions
  for insert
  to anon
  with check (true);

-- Permitir leitura apenas para autenticados (admins/service_role)
create policy "Permitir leitura apenas admin"
  on dilemma_suggestions
  for select
  to authenticated
  using (true);
