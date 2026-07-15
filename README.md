<<<<<<< HEAD
# PixelTrail
=======
# PIXELTRAIL
>>>>>>> 1789f0ba6d849be7327490eda116651588eeaf13

**PixelTrail** is an endless pixel-art action-runner game built using **Reddit Devvit** (Reddit's developer platform) and **Phaser 4/3** (compiled via Vite and Hono). It offers seamless, responsive play across both desktop web browsers and the native Reddit mobile application.

---

## 🎮 Play the Game
Experience **PixelTrail** directly on Reddit:
👉 **[Play PixelTrail on Reddit](https://www.reddit.com/r/PixelTrailRunner/)**

---

## 🚀 Overview
PixelTrail is a fast-paced, endless side-scrolling survival runner. Guide your hero across procedurally generated floating platforms, blast away ground and flying enemies, collect coins and gems, and chase the high score—all while a dynamic day/night cycle transitions the sky color around you.

The game is embedded as a custom post type on Reddit, booting instantly into the feed or expanding to fit full-screen displays on mobile.

---

## ✨ Features
* **Endless Runner Gameplay**: Test your reflexes as the speed and difficulty scale the further you travel.
* **Procedurally Generated Terrain**: Platforms and ground chunks are generated ahead of the player dynamically and cleaned up behind them to keep memory consumption low.
* **Procedural Pixel-Art Visuals**: All game sprites (player animations, coins, gems, hearts, trees, and enemies) are drawn pixel-by-pixel programmatically at runtime.
* **Dynamic Day/Night Cycle**: The background sky color smoothly shifts from bright daytime to sunset, deep starry night, and sunrise.
* **Comprehensive Collectible & Score System**: Collect gold coins, gems, and hearts to heal, increase your score, and rack up kills.
* **Dynamic Ground & Flying Enemies**: Battle hopping ground cacti and flying robotic bees that chase you with proportional physics-steering velocity.
* **Responsive Mobile Controls**: Optimized touch buttons (Jump and Shoot) scale dynamically and float to comfortable thumb locations on mobile portrait or landscape.
* **Audio Effects manager**: Real-time sound synthesis using the Web Audio API (no external sound files required) with instant mute controls.
* **Physics & Render Stability**: Uses Arcade Physics locked to 60 FPS and subpixel rounding (`roundPixels`) to eliminate sprite shimmer and jitter on mobile screens.

---

## 🛠️ Tech Stack
* **Reddit Devvit**: Reddit's developer platform for custom interactive posts and backend services.
* **Phaser**: The core 2D game framework managing Arcade Physics, collisions, scales, and render cycles.
* **TypeScript & JavaScript (ES6+)**: Combines typed configurations with modular ES6 game classes.
* **Vite**: Ultra-fast bundler for compiling WebViews and server/client assets.
* **Hono**: The routing engine used as the backend for the Devvit custom post servers.

---

## 📦 Project Structure (Integrated Devvit)
```
pixeltrailrunner/
├── devvit.json               # Devvit application configurations and WebView entrypoints
├── vite.config.ts            # Vite bundler configurations
├── package.json              # Backend/Frontend dependencies
└── src/
    ├── client/               # Phaser game source (WebView Client)
    │   ├── game.ts           # Game configuration and DOM bootstrap
    │   ├── game.html         # Main client HTML template
    │   ├── game.css          # Viewport layout and responsive CSS
    │   ├── scenes/
    │   │   ├── BootScene.js  # Procedural texture generator
    │   │   └── GameScene.js  # Main gameplay scene
    │   ├── entities/         # Game object logic (Player, Bullet, Enemy)
    │   └── systems/          # Manager modules (Audio, DayNight, UI, Chunks)
    ├── server/               # Hono backend triggers, forms, and post creation
    └── shared/               # Shared type definitions
```

---

## 💻 How to Run Locally

### Prerequisites
* [Node.js](https://nodejs.org/) (v22 or higher)
* [Devvit CLI](https://developers.reddit.com/docs/cli) (`npm install -g devvit`)

### Setup and Install
1. Clone the repository and navigate to the project directory:
   ```bash
   cd pixeltrailrunner
   ```
2. Install the dependencies:
   ```bash
   npm install
   ```

### Running the Dev Server / Playtest
1. Start the Devvit playtest watcher:
   ```bash
   npm run dev
   ```
   *This compiles the WebView, starts the server routing, and uploads your app package to your personal sandbox subreddit.*
2. Devvit will provide a playtest URL, for example:
   `https://www.reddit.com/r/YOUR_SUBREDDIT/?playtest=pixeltrailrunner`
3. Load the URL on your desktop browser (or your Reddit mobile app) to play and test the game.

### Building for Production
To build static production bundles for both client (Phaser WebView) and server:
```bash
npm run build
```

---

## 📸 Screenshots
*(Insert gameplay images here)*
* **Desktop Landscape View**: `[Placeholder: Desktop Gameplay screenshot]`
* **Mobile Portrait View**: `[Placeholder: Mobile Portrait gameplay screenshot showing responsive bottom-aligned layout]`
* **HUD and Start Menu**: `[Placeholder: Start Menu with Sound on/off controls]`

---

## 🏆 Hackathon Submission Details
This project was developed for the **Reddit Developer Platform Hackathon**. 
* **The Goal**: Create a highly engaging, zero-asset, infinite platformer game that leverages Devvit's interactive custom posts to run smoothly on both desktop Reddit and native iOS/Android mobile clients.
* **Key Achievements**:
  * Clean, responsive scaling across varying aspect ratios (from widescreen 16:9 to vertical mobile portrait viewports).
  * Auto-adaptive HUD positioning and optimized controls for mobile.
  * Real-time procedural textures and synthesizers, keeping the bundle size extremely lightweight (under 12MB of static client assets) for fast loading times.
