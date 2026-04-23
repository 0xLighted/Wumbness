# Project Requirements Document (PRD)
**Project Name:** AI-Powered Youth Wellbeing Triage & Support Matching Platform
**Platform:** Progressive Web App (PWA) - Mobile & Desktop
**Target Audience:** Youth seeking mental wellbeing support & Certified Volunteer Counselors
**Timeline:** Due on 25 April

---

## 1. Project Overview
A web-based and mobile-friendly application designed to connect youth patients with certified volunteer counselors. The system replaces standard medical intake forms with an AI-driven triage chatbot, intelligently matches patients to the right counselors using ML vector search, and facilitates secure real-time communication.

**Development Philosophy:** For the AI agent generating this codebase, prioritize functional completeness, clean architecture, and modularity over complex feature creep. The goal is a highly polished MVP within a strict hackathon timeframe, leveraging managed services (Vercel + Supabase) to completely eliminate infrastructure overhead.

---

## 2. Proposed Tech Stack
*This stack is optimized for rapid AI integration, real-time communication, PWA capabilities, and serverless/cloud deployment without cold starts.*

* **Frontend:** Next.js with Tailwind CSS. Hosted on **Vercel**.
* **Backend:** Python with FastAPI. Hosted on **Vercel** via Serverless Functions (`/api` directory routing).
* **Database & Auth:** **Supabase**. Handles PostgreSQL database, User Authentication, Row Level Security (RLS), and Realtime subscriptions.
* **AI/ML:**
    * *Chatbot:* **Groq AI Cloud API** (leveraged for ultra-fast, low-latency LLM inference to avoid Vercel's 10-second timeout limit) for empathetic triage and keyword extraction.
    * *Matchmaker:* **Supabase `pgvector`**. The FastAPI backend generates embeddings of mental health keywords via an external Embedding API (to avoid Vercel's 250MB bundle limit) and saves them to Supabase, which natively computes Cosine Similarity against counselor tags.
* **Real-time:** **Supabase Realtime** (frontend subscribes directly to PostgreSQL database inserts; strictly zero backend WebSocket management required).

---

## 3. Core Features & System Requirements

### 3.1. Authentication & Role Management
* **Roles:** `PATIENT` and `COUNSELOR`.
* **Requirements:**
    * Utilize **Supabase Auth** directly on the frontend.
    * Patients can register anonymously (email/password).
    * Counselors register with specific "specialties" (e.g., anxiety, school stress, family dynamics), selected from a check box.
    * Use Supabase Triggers to automatically populate a public `users` table upon Auth signup.

### 3.2. AI Triage Chatbot (Patient Onboarding)
* **Trigger:** Immediately after a new patient signs up.
* **Requirements:**
    * A UI chat interface connecting to a Vercel-hosted FastAPI endpoint (`/api/triage`).
    * LLM (via Groq API) equipped with a strict system prompt to act as an empathetic, non-diagnostic listener.
    * Asks 3 to 5 questions to understand the user's primary concerns.
    * **Output:** Once the conversation concludes, the LLM must generate a structured JSON summary extracting important mental health keywords (e.g., `{"keywords": ["school stress", "overwhelmed", "anxiety"], "severity": "moderate", "summary": "Patient is feeling overwhelmed by upcoming exams..."}`).

### 3.3. AI Matchmaker System (Vector Search)
* **Trigger:** Following the completion of the AI Triage.
* **Requirements:**
    * FastAPI takes the structured JSON keyword list from the triage bot and generates a vector embedding via an external API (e.g., OpenAI or Groq embeddings).
    * Save this triage embedding to the patient's record in Supabase.
    * Call a Supabase RPC (Remote Procedure Call) database function to perform a `pgvector` Cosine Similarity search against available counselor specialty embeddings.
    * Assign the patient to the counselor with the highest match score. Update database status to `MATCHED`.

### 3.4. Real-Time Chat (Supabase Realtime)
* **Trigger:** Once matched, both parties can access the chat room.
* **Requirements:**
    * **No WebSockets in FastAPI.** The React frontend must use `@supabase/supabase-js` realtime services to create the chat. the channel name should be the counsellors id and patients id encrypted.
    * New messages are sent directly from the frontend to Supabase via standard API.

### 3.5. Main Dashboards
* **Patient Dashboard:**
    * View current matched counselor status.
    * "Resume Chat" button.
* **Counselor Dashboard:**
    * List of matched patients.
    * View patient's AI-generated triage summary *before* entering the chat.

---

## 4. PWA & UI/UX Requirements
* **Design System:** Minimal layout, bright joyful colors (Refer to @design.md for specific design rules).
* **Theme:** Light mode.
* **Navigation:** Responsive layout. Top nav-bar for desktop view. Bottom tab-bar for mobile view.
* **PWA Specifics:**
    * Must include `manifest.json` (icons, theme_color, background_color).
    * Must include a basic Service Worker for offline fallback (caching the app shell).

---

## 5. Data Models (Supabase PostgreSQL Schema)

**users (Table)**
* `id` (UUID, references auth.users)
* `role` (String: 'PATIENT' or 'COUNSELOR')
* `username` (String)
* `specialties` (Array of Strings - null for patients)
* `embedding` (Vector - pgvector generated from specialties for counselors, or issues from patients)

**matches (Table)**
* `id` (UUID, Primary Key)
* `patient_id` (UUID, references users.id)
* `counselor_id` (UUID, references users.id)
* `triage_summary` (JSONB)
* `status` (String: 'ACTIVE', 'CLOSED')
* `created_at` (Timestamp)

**messages (Table) - Supabase Realtime Enabled**
* `id` (UUID, Primary Key)
* `match_id` (UUID, references matches.id)
* `sender_id` (UUID, references users.id)
* `content` (Text)
* `created_at` (Timestamp)

---

## 6. AI Agent Prompting Instructions
When generating code for this project, strictly adhere to the following constraints:
1.  **Vercel Architecture:** Ensure FastAPI code is placed in an `/api` folder with an accompanying `vercel.json` file configuring the `rewrites` or `builds` to route API traffic appropriately. Keep Python dependencies lightweight (under 250MB).
2.  **Strictly Stateless Backend:** Do not use `websockets` or any stateful memory in FastAPI. Vercel serverless functions will kill the connection.
3.  **Timeout Limits:** All `/api` endpoints must execute quickly. Ensure Groq API streaming or rapid JSON responses are optimized to stay well under Vercel's 10-second Hobby tier limit.
4.  **Supabase Auth & Realtime:** Rely exclusively on `@supabase/supabase-js` on the frontend for user sessions and real-time chat subscriptions. Do not build JWT middleware in Python.
5.  **Vector Search:** Assume `pgvector` is enabled on Supabase. Provide the necessary SQL setup commands (or migrations) to create the vector columns and the matching RPC function.