# Glasgow Executive Chauffeurs

Marketing site and booking wizard for [gec.limo](https://gec.limo) — a chauffeur service operating across Glasgow and Scotland.

## Stack

- **Next.js 15** (App Router) on **React 19**, deployed to **Cloudflare Workers** via [`@opennextjs/cloudflare`](https://github.com/opennextjs/opennextjs-cloudflare)
- **Tailwind CSS 3** with self-hosted Playfair Display / DM Sans / Space Mono via `next/font`
- **MapLibre GL** + MapTiler tiles for interactive maps; **OSRM** for driving routes
- **Resend** for transactional email (contact + booking submissions)

## Project layout

```
app/                         # 8 pre-rendered routes + edge contact endpoint
  layout.jsx                 # Root metadata, fonts, JSON-LD
  page.jsx                   # Home
  airport-transfers/
  scotland-tours/
  corporate-chauffeurs/
  fleet/
  about/
  contact/
  not-found.jsx
  sitemap.js                 # Dynamic sitemap
  robots.js                  # Dynamic robots.txt
  api/contact/route.js       # Edge runtime: validates and forwards via Resend

components/                  # Shared site components (Navbar, Footer, Maps, etc.)
  BookingWizard.jsx          # Orchestrator: state, persistence, submission
  booking/                   # Atoms, molecules, step organisms (atomic design)
    FieldLabel, PinIcon, Stepper, ProgressBar
    LocationField, TimePicker, TripSummary
    Step1Service, Step2Trip, Step3Quote, Step4Details
    constants.js, payload.js

lib/
  pricing.js                 # Vehicle classes, quotes, surcharge tiers
  scheduling.js              # ASAP / arrive-by / depart-at logic, freshness checks
  geocode.js                 # MapTiler search + reverse geocode + browser geo
  routing.js                 # OSRM trip duration
  seo.js                     # Per-page metadata + JSON-LD builders
```

## Development

```bash
npm install
npm run dev              # Next dev server on :3000
```

### Environment variables

Set in `.env.local` for dev, and as Workers secrets/vars for prod:

| Variable                     | Purpose                                            |
| ---------------------------- | -------------------------------------------------- |
| `NEXT_PUBLIC_MAPTILER_KEY`   | MapTiler tiles + geocoding (used client-side)      |
| `RESEND_API_KEY`             | Resend API key for the contact endpoint            |
| `TO_EMAIL`                   | Booking inbox (defaults to `bookings@gec.limo`)    |

## Build & deploy

```bash
npm run build            # Standard Next.js production build
npm run preview          # Build via OpenNext + run locally on Workers runtime
npm run deploy           # Build via OpenNext + push to Cloudflare Workers
```

`npm run deploy` invokes `wrangler deploy` under the hood; bindings and secrets are configured in [wrangler.toml](wrangler.toml).

## Booking wizard

The wizard at `/contact` walks the user through:

1. **Service** — Point-to-point, hourly, or Scotland tour
2. **Trip** — Locations (with autocomplete + map), date/time, optional flight number for airport transfers
3. **Quote** — Vehicle class selection with live price ranges (includes short-notice surcharges)
4. **Details** — Contact info, freshness re-check, submit

Draft state is persisted to `localStorage` (versioned via `STORAGE_VERSION`). A 60-second tick re-evaluates surcharge tiers and schedule freshness while the tab is open. On submit, the payload is rendered to an HTML email and sent via the edge `/api/contact` endpoint.
