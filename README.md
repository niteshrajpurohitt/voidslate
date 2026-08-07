<div align="center">

#  VOID SLATE

**Cast your thoughts into the void**

[Live Demo](https://voidslate.niteshrajpurohit.in) • [GitHub Repository](https://github.com/niteshrajpurohitt/voidslate)

</div>

---

##  Overview

**Voidslate** is a privacy-first, synthesizer-like web device designed for emotional catharsis and mental clarity. Got a secret, a random rant, or something heavy you just need to get off your chest without telling anyone? Type it out, select destruction mode, press execute and watch your words disappear into nothingness.

Every thought you enter is processed 100% locally in your browser. **Your words never leave your browser. Zero server logs, zero database storage.** A clean slate every single time.

---

##  Key Features

### 1. Tactical Hardware Synth Interface
- **Sekuya & Inter Typography**: Retro industrial hardware brand typography paired with crisp, high-legibility UI fonts.
- **3D Parallax Chassis**: Smooth hover tilt (`±5.5°`) around the outer desktop canvas that freezes level (`0°`) when your cursor enters the chassis frame for steady typing.
- **Depth-of-Field Focus**: When **EXECUTE** is tapped, the chassis frame, header, and keycaps blur (`blur(3.5px)`), keeping the main screen card crystal sharp (`z-40`).

###  2. Procedural WebAudio Synth Engine
- Built-in real-time WebAudio synthesis delivering rich acoustic feedback:
  - **Layered mechanical keyboard typing sound**: 3-layer synthesis (click snap, thock body resonance, pitch-drop key tone) with per-keypress micro-variation — modelled after Cherry MX Blue switches. Each keystroke sounds subtly unique.
  - **Separate button click sound**: Distinct crisp bandpass click for UI buttons, keeping button and typing feedback acoustically different.
  - Spring-tension mechanics when initiating destruction.
  - Custom acoustic profiles for **DUST**, **BURN**, and **SHRED** modes.
  - **Explicit Sound Toggle**: Dedicated `[ SOUND ON ]` / `[ SOUND OFF ]` pill with `localStorage` state persistence.

###  3. Three Destruction Modes
- **`[01] DUST`**: Particle disaggregation — your text breaks down into fading micro-dust particles.
- **`[02] BURN`**: Ember ignition — your words char and burn into floating embers.
- **`[03] SHRED`**: Mechanical paper shredder — slicing your thought into vertical strips before vanishing.

###  4. Live Odometer Global Counter
- **Teenage Engineering Inspired Ticker**: Features a mechanical slot-machine rolling number animation (`NumberTicker`).
- **Persistent Global Count**: Backed by **Upstash Redis** via a Vercel serverless function (`/api/counter`). Uses atomic `INCR` — no race conditions, no data loss on refresh.
- **Optimistic UI**: Counter updates instantly on screen before the API confirms, then syncs the real value from Redis.
- **Live Background Sync**: Polls every 15 seconds to display authentic global thought purges worldwide.

###  5. Zero-Server Privacy Guarantee
- **100% Client-Side Processing**: No text data is ever stored, logged, or transmitted over any network. Once executed, your thoughts vanish forever.
- Only the **count** (a single integer) is stored in Redis — never the content of any thought.

###  6. SPA Routing
- Clean HTML5 PushState routing (`/` for Landing, `/device` for Console).
- `vercel.json` rewrite rule ensures refreshing `/device` never returns a 404.

---

##  Tech Stack

- **Core**: React 19, TypeScript, Vite
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion (Odometer slot-machine tickers, camera transitions, blur layers)
- **Audio**: WebAudio API (Real-time acoustic synthesis — zero audio files)
- **Global Counter**: Upstash Redis + Vercel Serverless Function (`/api/counter`)

---

##  Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- npm / pnpm / yarn
- A [Vercel](https://vercel.com) account with an [Upstash Redis](https://upstash.com) database connected to your project

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/niteshrajpurohitt/voidslate.git
   cd voidslate
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:

   Link your local project to Vercel and pull the Upstash env vars:
   ```bash
   npx vercel link
   npx vercel env pull .env.development.local
   ```
   This creates a `.env.development.local` file with your `KV_REST_API_URL` and `KV_REST_API_TOKEN` credentials. These are **never committed** to Git (covered by `.gitignore`).

4. **Start the development server** (with API routes):
   ```bash
   npx vercel dev
   ```
   Open your browser at `http://localhost:3000`.

   > Note: Use `npx vercel dev` instead of `npm run dev` if you want the `/api/counter` route to work locally. `npm run dev` runs the Vite-only frontend — the counter will show 0 but everything else works fine.

5. **Build for production**:
   ```bash
   npm run build
   ```

---

##  Deployment

Voidslate is deployed on Vercel with automatic Git integration:

- Production Domain: `https://voidslate.niteshrajpurohit.in`
- Routing: `vercel.json` rewrites all paths to `index.html` for SPA support.
- Counter: Upstash Redis database connected via Vercel Storage integration.

---

##  License

This project is licensed under the MIT License. See [LICENSE](./LICENSE) for details.
