# AI-Powered Youth Wellbeing Triage and Support Matching Platform

Progressive Web App (PWA) that connects youth patients with certified volunteer counselors through AI triage, vector-based counselor matching, and real-time chat.

## Product Goal

Build a polished, production-ready MVP for a hackathon timeline:

- Patients and counselors sign in with Supabase Auth.
- Patients complete a short AI triage chat (3 to 5 empathetic questions).
- The system extracts structured triage JSON and mental health keywords.
- A vector similarity matchmaker assigns the best-fit counselor.
- Patient and counselor communicate through secure real-time chat.

## MVP Scope

### Roles

- PATIENT
- COUNSELOR

### Core Features

1. Authentication and role-based onboarding.
2. AI triage chatbot for new patients.
3. Embedding + pgvector similarity matching.
4. Supabase Realtime chat (frontend direct subscription).
5. Patient and counselor dashboards.
6. PWA support (manifest + service worker).

## Architecture

### Frontend

- Next.js 16 App Router
- TypeScript
- Tailwind CSS v4
- Hosted on Vercel

### Backend

- FastAPI in serverless endpoints under api/ (Vercel functions)
- Stateless endpoints only (no websocket server in Python)

### Data and Auth

- Supabase Auth for sessions and signup
- Supabase Postgres for storage
- Supabase Row Level Security (RLS)
- Supabase Realtime subscriptions for chat

### AI and Matching

- Groq API for low-latency triage generation
- Embedding provider for keyword vectors
- Supabase pgvector + RPC function for cosine similarity search

## User Flows

### Patient Flow

1. Register anonymously (email/password).
2. Complete AI triage chat.
3. Receive counselor match.
4. Resume chat from dashboard.

### Counselor Flow

1. Register and choose specialties.
2. View matched patients.
3. Review AI triage summary before chat.
4. Continue real-time conversation.

## Design and UX Direction

From DESIGN.md:

- Bright, joyful, and safe atmosphere.
- Light mode first.
- Rounded UI elements.
- Responsive layout:
	- Desktop: top navigation
	- Mobile: bottom tab bar

Suggested token values:

- Primary: #9AB17A
- Secondary: #A98B76
- Background: #FDFBF7
- Text: #2B2D42

## Recommended Project Structure

```text
app/
	(auth)/
	(patient)/
	(counselor)/
	chat/[matchId]/
	layout.tsx
	page.tsx
api/
	triage.py
	match.py
	health.py
lib/
	supabase/
	ai/
	embeddings/
public/
	icons/
	sw.js
    offline.html
supabase/
	migrations/
```

## Environment Variables

Create a .env.local file:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

GROQ_API_KEY=
EMBEDDING_API_KEY=
```

Notes:

- Frontend auth and realtime use NEXT_PUBLIC_SUPABASE_*.
- Serverless matching and embedding tasks can use service role key.
- Keep server-side keys out of client bundles.

## Local Development

```bash
pnpm install
pnpm dev
```

App runs on http://localhost:3000.

## Database Schema (Supabase)

Run SQL in Supabase SQL Editor or as migrations.

```sql
-- Enable extension
create extension if not exists vector;

-- Role enum
do $$
begin
	if not exists (select 1 from pg_type where typname = 'user_role') then
		create type user_role as enum ('PATIENT', 'COUNSELOR');
	end if;
end $$;

-- Users table (mirrors auth.users via trigger)
create table if not exists public.users (
	id uuid primary key references auth.users(id) on delete cascade,
	role user_role not null,
	username text,
	specialties text[] null,
	embedding vector(1536) null,
	created_at timestamptz not null default now()
);

-- Matches table
create table if not exists public.matches (
	id uuid primary key default gen_random_uuid(),
	patient_id uuid not null references public.users(id) on delete cascade,
	counselor_id uuid not null references public.users(id) on delete cascade,
	triage_summary jsonb not null,
	status text not null check (status in ('ACTIVE', 'CLOSED')),
	created_at timestamptz not null default now()
);

-- Messages table
create table if not exists public.messages (
	id uuid primary key default gen_random_uuid(),
	match_id uuid not null references public.matches(id) on delete cascade,
	sender_id uuid not null references public.users(id) on delete cascade,
	content text not null,
	created_at timestamptz not null default now()
);

create index if not exists idx_users_role on public.users(role);
create index if not exists idx_messages_match_id_created_at on public.messages(match_id, created_at);
create index if not exists idx_users_embedding on public.users using ivfflat (embedding vector_cosine_ops) with (lists = 100);
```

### Auth Trigger: Populate public.users

```sql
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
	insert into public.users (id, role, username, specialties)
	values (
		new.id,
		coalesce((new.raw_user_meta_data->>'role')::user_role, 'PATIENT'),
		new.raw_user_meta_data->>'username',
		case
			when new.raw_user_meta_data ? 'specialties'
			then array(select jsonb_array_elements_text(new.raw_user_meta_data->'specialties'))
			else null
		end
	)
	on conflict (id) do nothing;

	return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
	after insert on auth.users
	for each row execute procedure public.handle_new_user();
```

### RPC: Counselor Similarity Search

```sql
create or replace function public.match_counselor(
	query_embedding vector(1536),
	min_score float default 0.55,
	limit_count int default 1
)
returns table (
	counselor_id uuid,
	score float
)
language sql
stable
as $$
	select
		u.id as counselor_id,
		1 - (u.embedding <=> query_embedding) as score
	from public.users u
	where u.role = 'COUNSELOR'
		and u.embedding is not null
		and (1 - (u.embedding <=> query_embedding)) >= min_score
	order by u.embedding <=> query_embedding asc
	limit limit_count;
$$;
```

## Realtime Chat Model

- Chat messages are inserted directly from frontend to public.messages.
- Frontend subscribes to realtime changes filtered by match_id.
- Do not implement websocket handling in FastAPI.

Recommended channel naming pattern:

- Hash of counselor_id + patient_id (stable and non-guessable)

## API Contracts (FastAPI on Vercel)

### POST /api/triage

Purpose:

- Continue triage chat turns.
- Return empathetic assistant response.
- Return final structured summary when triage is complete.

Response shape:

```json
{
	"reply": "I hear how heavy this feels. Can you tell me what has been hardest this week?",
	"done": false,
	"triage": null
}
```

Final response shape:

```json
{
	"reply": "Thank you for sharing this with me.",
	"done": true,
	"triage": {
		"keywords": ["school stress", "overwhelmed", "anxiety"],
		"severity": "moderate",
		"summary": "Patient feels overwhelmed by exams and recurring anxiety symptoms."
	}
}
```

### POST /api/match

Purpose:

- Generate embedding from triage keywords/summary.
- Save patient embedding.
- Call match_counselor RPC.
- Insert match row and return match metadata.

## RLS Guidelines

Minimum policy expectations:

- users: each user can read own profile; counselors can read matched patients as needed.
- matches: patient/counselor can read their own matches only.
- messages: only participants of a match can read/write corresponding messages.

## PWA Requirements

1. app/manifest.ts (or app/manifest.json) with app name, icons, display mode, theme color, and background color.
2. Service worker (public/sw.js) for app shell caching and offline fallback.
3. Register service worker in client layout entry point.

## Performance and Serverless Constraints

- Keep API handlers stateless and fast.
- Avoid long blocking calls; keep responses under Vercel limits.
- Keep Python dependencies lightweight.
- Prefer managed Supabase services over custom infra.

## Deployment

### Frontend

- Deploy Next.js app to Vercel.

### Backend

- Deploy FastAPI serverless endpoints under api/ with Vercel routing.
- Add vercel.json when needed to explicitly route API paths.

## Current Status

This repository currently contains the Next.js app shell and baseline tooling. Core product modules (auth flow, triage endpoint, matching pipeline, dashboards, realtime chat, and PWA artifacts) should be implemented according to this README and the PRD.

## References

- PRD.md
- DESIGN.md
- AGENTS.md
