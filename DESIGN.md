# Design Document: AI-Powered Youth Wellbeing Triage & Support Matching Platform

## 1. Overview
A Progressive Web App (PWA) designed to support youth mental wellbeing by offering free, accessible support. The platform intelligently matches youth patients with certified professional volunteer counselors. Upon onboarding, patients interact with an empathetic AI chatbot that gently triages their situation to understand their specific challenges. This data is fed into an AI matchmaker to pair them with the most suitable counselor, after which they can communicate in a secure, real-time chat environment.

**Hackathon Constraint Noted:** No marketing landing page. Focus is entirely on core application flow and functional primary pages.

---

## 2. Design System & UI/UX Principles

### 2.1. Vibe & Atmosphere
The design aims to feel **safe, welcoming, and uplifting**. We avoid clinical or overly sterile medical designs. Instead, the UI uses minimal layouts accented with bright, joyful colors to emphasize hope, happiness, and recovery.

### 2.2. Color Palette
To emphasize joy and calmness, we use a vibrant yet soothing palette:
* **Primary (Joy/Energy):** Sage Green `#98BC88`
* **Secondary (Calm/Growth):** Brown `#A98B76`
* **Light Mode Background:** Soft Pearl White `#FDFBF7` — Less harsh than pure white.
* **Light Mode Text:** Deep Charcoal `#2B2D42` — For high readability without the starkness of pure black.

### 2.3. Typography & UI Elements
* **Font Family:** `Nunito (Bold)` as Heading, `Nunito` as Body, `Dongle` as Sub-text
* **Shapes:** Heavy use of rounded corners (e.g., `border-radius: 16px` to `24px` for cards, buttons, and input fields) to make the interface feel "soft" and approachable.
* **Language:** Conversational, jargon-free, and highly empathetic (e.g., "How are you feeling today?" instead of "Input symptoms").

### 2.4. Layout & Spacing Tokens (PWA Uniform Standards)
All chat-based views (Triage, Chat Room) and dashboard cards share these consistent tokens to ensure visual harmony across the app.

* **Chat Container Width:** `max-w-2xl` (672 px cap), centered via `mx-auto`.
* **Chat Container Shadow:** `shadow-md` — medium elevation to lift from `bg-pearl` page.
* **Chat Container Background:** `bg-pearl` (`#FDFBF7`).
* **Header Bar:** `px-4 py-3`, `bg-white/90 backdrop-blur-md`, `border-b border-gray-100`.
* **Message Area Padding:** `p-4 sm:p-6` (inner scroll region).
* **Message Bubble Padding:** `px-4 py-3` mobile, `sm:px-5 sm:py-3` desktop.
* **Message Bubble Max-Width:** `max-w-[75%]` on all breakpoints.
* **Message Font Size:** `text-[15px]` body, `leading-relaxed`.
* **Message Bottom Margin:** `mb-5` — consistent vertical rhythm between bubbles.
* **Own-Message Bubble:** `bg-sage text-white rounded-3xl rounded-tr-sm shadow-sm`.
* **Received-Message Bubble:** `bg-white text-charcoal border border-gray-100 rounded-3xl rounded-tl-sm shadow-sm`.
* **Input Bar:** `px-4 py-3`, `bg-white/90 backdrop-blur-md`, `border-t border-gray-100`.
* **Input Field:** `rounded-3xl`, `bg-gray-50 border border-gray-200`, focus ring `ring-sage/50`.
* **Send Button:** `w-11 h-11 sm:w-12 sm:h-12`, `rounded-full bg-sage text-white`.
* **Typing Indicator Dots:** `w-2 h-2`, `rounded-full bg-gray-400 animate-bounce`.
* **Cards & Widgets:** `rounded-3xl`, `p-6`, `shadow-sm border border-gray-50`, `bg-white`.

---

## 3. Application Layout & Navigation

Given the PWA requirement for seamless web and mobile support:
* **Desktop View:** Top Navigation Bar featuring a Logo, Dashboard, Messages, and Profile buttons.
* **Mobile View:** Bottom Navigation Bar (Tab bar) for thumb-friendly ergonomics (Home, Chat, Profile).
* **Responsiveness:** Fluid grid systems (CSS Grid/Flexbox) that naturally scale chat bubbles and dashboard cards from a single column on mobile to multi-column on desktop.

---

## 4. Core Components & Pages

### 4.1. Authentication (Login/Register)
* **Design:** Minimal centered card.
* **Features:** Role selection (Youth / Volunteer Counselor). OAuth options (Google/Apple) for friction-free sign-up, ensuring anonymity and privacy are highlighted.

### 4.2. Patient Survey Chatbot (Triage phase)
* **Purpose:** Replaces the traditional, boring, and intimidating intake form.
* **UI:** A friendly chat interface. The AI (represented by a cute, abstract rounded avatar) asks one question at a time.
* **Features:**
    * Typing indicators to feel natural.
    * Quick-reply suggestion chips (e.g., "School stress", "Family issues", "Just feeling down") alongside free-text input.
    * Progress indicator (e.g., "Just a few more questions to find your perfect match!").

### 4.3. The AI Match Maker (Backend/Loading UI)
* **Purpose:** Machine learning model (e.g., NLP clustering or vector similarity) mapping the patient's chatbot transcript to counselor specialties.
* **UI:** A calming transition screen with a subtle CSS pulse/breathing animation. Text: *"Finding the best counselor for you..."*

### 4.4. Main Dashboard (Role-Based)
* **For Youth (Patient):**
    * "Your Counselor" card (photo, name, brief bio, online status).
    * Quick button to "Resume Chat".
    * Daily mood check-in widget (emoji-based).
* **For Volunteer Counselor:**
    * Queue of matched patients (anonymous or first-name basis).
    * Triage summary cards (AI-generated bullet points from the patient's intake chat so the counselor goes in prepared).
    * Quick stats (patients helped, hours volunteered).

### 4.5. Counselor & Patient Chat Room
* **Purpose:** The core support delivery mechanism using WebSockets for real-time messaging.
* **UI:** * Standard modern chat layout (user messages on right, counselor on left).
    * Timestamp and "Read" receipts.
    * **Emergency Feature:** A highly visible, but non-intrusive "SOS / Crisis Resources" button fixed at the top of the chat.
    * Soft colored chat bubbles matching the app's palette.

---

## 5. Development Milestones (4-Day Hackathon)
1.  **Day 1:** App shell, routing, Authentication, and basic UI system (Tailwind/CSS setup with color palette & dark mode).
2.  **Day 2:** Build out the AI Chatbot interface and integrate the LLM API for triage.
3.  **Day 3:** WebSocket implementation for the real-time counselor-patient chat. Develop the matching logic.
4.  **Day 4:** PWA configuration (Manifest, Service Workers), responsive design polish, bug fixing, and demo prep.
