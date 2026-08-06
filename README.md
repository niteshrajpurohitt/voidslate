<div align="center">

#  VOID SLATE

**Cast your thoughts into the void**

[Live Demo](https://voidslate.niteshrajpurohit.in) • [GitHub Repository](https://github.com/niteshrajpurohitt/voidslate)

</div>

---

##  Overview

**Voidslate** is a privacy-first, synthesizer-like web device designed for emotional catharsis and mental clarity. Got a secret, a random rant, or something heavy you just need to get off your chest without telling anyone? Type it out, select destruction mode, press execute  button and watch your words disappear into nothingness.

Every thought you enter is processed 100% locally in your browser. **Your words never leave your browser—zero server logs, zero database storage.** A clean slate every single time.

---

##  Key Features

### 1. Tactical Hardware Synth Interface
- **Sekuya & Inter Typography**: Retro industrial hardware brand typography paired with crisp, high-legibility UI fonts.
- **3D Parallax Chassis**: Smooth hover tilt (`±5.5°`) around the outer desktop canvas that freezes level (`0°`) when your cursor enters the chassis frame for steady typing.
- **Depth-of-Field Focus**: When **EXECUTE** is tapped, the chassis frame, header, and keycaps blur (`blur(3.5px)`), keeping the main screen card crystal sharp (`z-40`).

###  2. Procedural WebAudio Synth Engine
- Built-in real-time WebAudio synthesis delivering rich acoustic feedback:
  - Tactile mechanical keycap clicks on every keystroke.
  - Spring-tension mechanics when initiating destruction.
  - Custom acoustic profiles for **DUST**, **BURN**, and **SHRED** modes.
  - **Explicit Sound Toggle**: Dedicated `[ 🟢 SOUND ON ]` / `[ 🔴 SOUND OFF ]` pill with `localStorage` state persistence.

###  3. Three Destruction Modes
- **`[01] DUST`**: Particle disaggregation—your text breaks down into fading micro-dust particles.
- **`[02] BURN`**: Ember ignition—your words char and burn into floating embers.
- **`[03] SHRED`**: Mechanical paper shredder—slicing your thought into vertical strips before vanishing.

###  4. Live Odometer Global Counter
- **Teenage Engineering Inspired Ticker**: Features a mechanical slot-machine rolling number animation (`NumberTicker`).
- **Environment Isolation**: Automatically separates local testing (`thoughts_purged_dev`) from live production (`thoughts_purged_prod`) so local debugging never inflates the real global counter.
- **Live Background Sync**: Polls every 12 seconds to display authentic global thought purges worldwide.

###  5. Zero-Server Privacy Guarantee
- **100% Client-Side Processing**: No text data is ever stored, logged, or transmitted over any network. Once executed, your thoughts vanish forever.

---

##  Tech Stack

- **Core**: React 19, TypeScript, Vite
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion (Odometer slot-machine tickers, camera transitions, blur layers)
- **Audio**: WebAudio API (Real-time acoustic synthesis)
- **Global Ticker API**: CountAPI (Atomic HTTPS REST counter)

---

##  Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- npm / pnpm / yarn

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

3. **Start the development server**:
   ```bash
   npm run dev
   ```
   Open your browser at `http://localhost:5173`.

4. **Build for production**:
   ```bash
   npm run build
   ```

---

##  Deployment

Voidslate is optimized for zero-config deployment on Vercel or any static edge provider:

- Production Domain: `https://voidslate.niteshrajpurohit.in`
- Routing: HTML5 PushState (`/` for Landing, `/device` for Console).

---

##  License

This project is licensed under the MIT License.
