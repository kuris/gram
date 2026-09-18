-- ============================================================
-- 문법아 놀자! (gram) Supabase 스키마 마이그레이션
-- Supabase 대시보드 > SQL Editor에 붙여넣고 실행하세요.
-- 계정은 공용 auth.users, 가입 여부는 public.service_members,
-- 학습 데이터는 gram 스키마에 저장합니다.
-- RLS로 본인 데이터만 읽고 쓸 수 있습니다.
-- ============================================================

-- 1) 스키마
create schema if not exists gram;
grant usage on schema gram to anon, authenticated, service_role;

-- 2) updated_at 자동 갱신 (없으면 생성)
create or replace function public.handle_gram_updated_at()
returns trigger language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- 3) 테이블
create table if not exists gram.user_settings (
  user_id uuid primary key references auth.users(id) on delete cascade,
  school_level text,
  grade_level text,
  nickname text,
  daily_goal int not null default 3,
  preferred_category text not null default 'integrated',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists gram.concept_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  concept_id text not null,
  school_level text,
  grade_level text,
  category text,
  unit text,
  viewed_count int not null default 0,
  practiced_count int not null default 0,
  correct_count int not null default 0,
  wrong_count int not null default 0,
  mastered boolean not null default false,
  last_viewed_at timestamptz,
  last_practiced_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, concept_id)
);

create table if not exists gram.practice_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  school_level text,
  grade_level text,
  category text not null,
  unit text,
  concept_id text,
  level text not null default 'normal',
  total_count int not null default 0,
  correct_count int not null default 0,
  wrong_count int not null default 0,
  streak_count int not null default 0,
  best_streak int not null default 0,
  last_practiced_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists gram.quiz_results (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  quiz_type text not null,
  school_level text,
  grade_level text,
  category text,
  unit text,
  concept_id text,
  level text,
  total_questions int not null,
  correct_count int not null,
  score int not null,
  duration_seconds int,
  result_data jsonb,
  created_at timestamptz not null default now()
);

create table if not exists gram.wrong_notes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  school_level text,
  grade_level text,
  category text not null,
  unit text,
  concept_id text,
  level text,
  question_text text not null,
  correct_answer text not null,
  user_answer text,
  explanation text,
  solved boolean not null default false,
  retry_count int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists gram.study_log (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  activity_type text not null,
  school_level text,
  grade_level text,
  category text,
  unit text,
  concept_id text,
  level text,
  count_total int not null default 0,
  count_correct int not null default 0,
  duration_seconds int,
  created_at timestamptz not null default now()
);

-- 4) updated_at 트리거
drop trigger if exists trg_gram_user_settings_updated on gram.user_settings;
create trigger trg_gram_user_settings_updated
  before update on gram.user_settings
  for each row execute function public.handle_gram_updated_at();
drop trigger if exists trg_gram_concept_progress_updated on gram.concept_progress;
create trigger trg_gram_concept_progress_updated
  before update on gram.concept_progress
  for each row execute function public.handle_gram_updated_at();
drop trigger if exists trg_gram_practice_progress_updated on gram.practice_progress;
create trigger trg_gram_practice_progress_updated
  before update on gram.practice_progress
  for each row execute function public.handle_gram_updated_at();
drop trigger if exists trg_gram_wrong_notes_updated on gram.wrong_notes;
create trigger trg_gram_wrong_notes_updated
  before update on gram.wrong_notes
  for each row execute function public.handle_gram_updated_at();

-- 5) RLS 활성화
alter table gram.user_settings enable row level security;
alter table gram.concept_progress enable row level security;
alter table gram.practice_progress enable row level security;
alter table gram.quiz_results enable row level security;
alter table gram.wrong_notes enable row level security;
alter table gram.study_log enable row level security;

-- 6) 정책 (본인 데이터만)
drop policy if exists "own_rows" on gram.user_settings;
create policy "own_rows" on gram.user_settings
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
drop policy if exists "own_rows" on gram.concept_progress;
create policy "own_rows" on gram.concept_progress
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
drop policy if exists "own_rows" on gram.practice_progress;
create policy "own_rows" on gram.practice_progress
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
drop policy if exists "own_select" on gram.quiz_results;
create policy "own_select" on gram.quiz_results
  for select using (auth.uid() = user_id);
drop policy if exists "own_insert" on gram.quiz_results;
create policy "own_insert" on gram.quiz_results
  for insert with check (auth.uid() = user_id);
drop policy if exists "own_rows" on gram.wrong_notes;
create policy "own_rows" on gram.wrong_notes
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
drop policy if exists "own_select" on gram.study_log;
create policy "own_select" on gram.study_log
  for select using (auth.uid() = user_id);
drop policy if exists "own_insert" on gram.study_log;
create policy "own_insert" on gram.study_log
  for insert with check (auth.uid() = user_id);

-- 7) 인덱스
create index if not exists concept_progress_user_idx on gram.concept_progress (user_id);
create index if not exists concept_progress_concept_idx on gram.concept_progress (user_id, concept_id);
create index if not exists practice_progress_user_idx on gram.practice_progress (user_id);
create index if not exists quiz_results_user_idx on gram.quiz_results (user_id, created_at desc);
create index if not exists wrong_notes_user_idx on gram.wrong_notes (user_id, created_at desc);
create index if not exists wrong_notes_solved_idx on gram.wrong_notes (user_id, solved);
create index if not exists study_log_user_idx on gram.study_log (user_id, created_at desc);

-- 8) 권한
grant all on all tables in schema gram to anon, authenticated, service_role;
alter default privileges in schema gram grant all on tables to anon, authenticated, service_role;

-- 9) 화면 조회수 및 접속 시간대 통계 (admin 5탭 대시보드용)
-- ※ admin.html 시스템 탭의 SQL과 동일합니다. 둘 중 한 곳에서 실행하면 됩니다.
create table if not exists gram.page_views (
  id bigint generated always as identity primary key,
  path text not null,
  page_title text,
  referrer text,
  user_id uuid references auth.users on delete set null,
  hour int not null default extract(hour from (now() at time zone 'Asia/Seoul')),
  day date not null default (current_date at time zone 'Asia/Seoul')::date,
  created_at timestamptz not null default now()
);
alter table gram.page_views enable row level security;
drop policy if exists "page_views_insert_all" on gram.page_views;
create policy "page_views_insert_all" on gram.page_views for insert with check (true);
drop policy if exists "page_views_select_admin" on gram.page_views;
create policy "page_views_select_admin" on gram.page_views
  for select using ((auth.jwt()->>'email' = 'phiskim@gmail.com'));
grant all on table gram.page_views to anon, authenticated, service_role;
create index if not exists page_views_day_idx on gram.page_views (day desc);
create index if not exists page_views_path_idx on gram.page_views (path);

-- 10) gram 서비스 가입은 클라이언트에서 첫 이용 시 처리합니다.
-- await sb.schema('public').from('service_members')
--   .insert({ user_id: user.id, service: 'gram', nickname: nick });
