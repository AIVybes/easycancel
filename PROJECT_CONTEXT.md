# PROJECT_CONTEXT.md

## Project

**EasyCancel**

A web application that allows users to cancel gym memberships online.
The system generates a cancellation letter and sends it via certified mail automatically.

---

# Tech Stack

Frontend

* Next.js (App Router)
* React
* Tailwind
* shadcn/ui components

Payments

* Stripe Checkout
* Stripe Webhooks

Backend Services

* Supabase (PostgreSQL database)
* Lob API (certified mail delivery)

---

# Core Workflow

User fills cancellation form
↓
Stripe checkout payment
↓
Stripe webhook triggers
↓
Generate cancellation letter PDF
↓
Detect gym chain from gym name
↓
Lookup corporate cancellation address
↓
Send certified letter via Lob
↓
Store tracking info in Supabase
↓
User checks status in dashboard

---

# Database Schema

## gyms

Stores all gym locations used for autocomplete.

| column | type            |
| ------ | --------------- |
| name   | text            |
| street | text            |
| city   | text            |
| state  | text            |
| zip    | text            |
| chain  | text (optional) |

Used for:

* gym autocomplete
* detecting gym chain

---

## gym_chains

Stores corporate cancellation addresses.

| column           | type |
| ---------------- | ---- |
| chain            | text |
| corporate_street | text |
| corporate_city   | text |
| corporate_state  | text |
| corporate_zip    | text |

Example:

Planet Fitness → Hampton NH HQ

---

## cancellations

Tracks user cancellation requests.

| column          | type      |
| --------------- | --------- |
| email           | text      |
| gym_name        | text      |
| chain           | text      |
| tracking_number | text      |
| status          | text      |
| created_at      | timestamp |

---

# Important Backend Files

## Frontend

app/page.tsx
Main landing page with intake form and gym autocomplete.

app/dashboard/page.tsx
User dashboard for checking cancellation status.

---

## API Routes

app/api/create-checkout-session/route.ts
Creates Stripe checkout session.

app/api/stripe-webhook/route.ts
Handles Stripe payment confirmation and triggers cancellation workflow.

app/api/gyms/route.ts
Gym autocomplete search endpoint.

app/api/cancellation-status/route.ts
Returns cancellation status for dashboard lookup.

---

## Library Files

lib/sendLetter.ts
Handles sending certified mail via Lob.

lib/generateLetter.ts
Generates cancellation letter PDF.

lib/detectChain.ts
Detects gym chain from gym name.

lib/supabase.ts
Supabase client configuration.

---

# Gym Autocomplete System

User types gym name → frontend queries:

/api/gyms?q=planet

Backend query:

SELECT *
FROM gyms
WHERE name ILIKE '%planet%'
LIMIT 5

Database optimized with:

pg_trgm extension
GIN trigram index

---

# Corporate Address Override Logic

If a gym belongs to a known chain:

Planet Fitness Chicago
↓
Detect chain = Planet Fitness
↓
Lookup corporate HQ
↓
Send cancellation to HQ instead of local gym

---

# External Services

Stripe
Handles payments and webhook triggers.

Supabase
Stores gyms database and cancellation records.

Lob
Handles printing and mailing certified letters.

---

# Current Features Implemented

✓ Stripe checkout flow
✓ Stripe webhook processing
✓ PDF cancellation letter generation
✓ Certified mail delivery via Lob
✓ Gym autocomplete (20k gyms)
✓ Corporate address override
✓ Dashboard cancellation lookup
✓ Email-based status retrieval

---

# Future Improvements

Letter preview before payment
Address verification before mailing
Debounced autocomplete search
Chain detection improvements
SEO pages for major gym chains

Example:

/cancel-planet-fitness
/cancel-la-fitness
/cancel-crunch-fitness

---

# Local Development

Run dev server:

npm run dev

Main routes:

/
Landing page

/dashboard
Cancellation lookup

/api/gyms?q=
Gym autocomplete endpoint

---

# Notes

The system prioritizes sending cancellations to **corporate HQ** for chains because many gyms ignore letters sent to local locations.

The gym database currently contains ~20,000 locations imported from OpenStreetMap.
