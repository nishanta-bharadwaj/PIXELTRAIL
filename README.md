# PixelTrail

**PixelTrail** is a fast-paced, endless pixel-art action runner game built with **Reddit Devvit** and **Phaser**. Running directly inside Reddit interactive posts, PixelTrail delivers a frictionless, highly replayable gameplay experience tailored for both desktop and mobile Reddit users...

---

## 🎮 Play the Game

Experience **PixelTrail** directly on Reddit:
👉 **[Play PixelTrail on Reddit](https://www.reddit.com/r/PixelTrailRunner/)**

Reddit users can launch and play PixelTrail instantly within their feed or expand to a dedicated fullscreen view on mobile devices without any external downloads or redirects.

---

## 🚀 Overview

In PixelTrail, the player guides a runner across an infinite series of floating platforms and hazard-filled terrain. The core gameplay loop focuses on high-speed survival, timing, and precision:
* **Continuous Auto-Running**: The player moves steadily to the right, navigating procedurally generated chasms.
* **Reflex Action**: Jump over gaps and obstacles, and fire bullets to blast through incoming ground and flying enemies.
* **Score Chase**: Score increases based on distance traveled, collectibles gathered, and enemies defeated. 
* **Dynamic Challenges**: Every run is completely unique, forcing the player to adapt on the fly to new layout formations and randomized threat combinations.

---

## 🪝 Why PixelTrail Has a Hook

Designed specifically for the theme of **Reddit’s Games with a Hook Hackathon**, PixelTrail keeps players engaged through several key mechanics:
* **Procedural Variation**: No two runs are the same. Gaps, platforms, and enemy spawns are procedurally generated, ensuring that each attempt is a fresh puzzle.
* **Leaderboard & Score Chasing**: Players are driven to improve their high scores, beat their personal bests, and climb the scoreboard.
* **Escalating Difficulty**: As the player travels further, game speed and hazard density increase, providing a scaling challenge that keeps gameplay intense.
* **Instant Replay Loop**: A fast reload process allows players to restart immediately after a run, minimizing downtime and encouraging "just one more try" behavior.
* **Bite-Sized Sessions**: Each run lasts from 30 seconds to a few minutes, making it the perfect casual experience to slide into a standard Reddit browsing session.
* **Community-Centric Play**: Embedding directly inside subreddits allows communities to organically post, share high scores, and compete for dominance on shared threads.

---

## ✨ Features

* **Endless Action Gameplay**: Fast-paced running, jumping, and shooting with scaling difficulty.
* **Procedural Terrain Chunks**: Floating platforms and ground systems spawn dynamically ahead of the player and clean up behind them for infinite play.
* **Procedural Pixel-Art Visuals**: All game textures and animations are drawn programmatically at runtime, ensuring a tiny app footprint and rapid load times.
* **Dynamic Day/Night Cycle**: A beautiful sky transition cycle shifting smoothly between daytime, sunset, deep starry night, and sunrise.
* **Score & Collectible Systems**: Gather gold coins, gems, and hearts to heal, gain points, and rack up score multipliers.
* **Flying & Ground Enemies**: Fight hopping ground cacti and hovering robotic bees that lock onto and chase the player using physical steering.
* **Desktop & Mobile Controls**: Full keyboard controls (Spacebar/Up Arrow) for desktop and custom ergonomic touch overlays (Jump/Shoot) for mobile.
* **Audio Synthesis**: Dynamic sound effects generated programmatically via the Web Audio API with a fully integrated mute toggle.
* **60 FPS Performance**: Optimized code loops and lightweight physics to guarantee smooth rendering and response on all devices.

---

## 🧑💻 Built for Reddit with Devvit

PixelTrail is built using **Reddit Devvit**, leveraging interactive post interfaces for maximum reach:
* **Feed Discovery**: The game displays inline within subreddit feeds, attracting users directly as they scroll.
* **Frictionless Play**: Deploys as a native interactive post, running instantly inside standard Reddit web or app containers.
* **Optimized Sessions**: Leverages the Devvit server-client architecture to manage web asset rendering while communicating cleanly with Hono-routed backend endpoints.
* **Cross-Platform Delivery**: Delivers identical rendering and physics on desktop Reddit and iOS/Android mobile clients.

---

## ⚡ Phaser Implementation

For the **Best Use of Phaser** prize category, PixelTrail showcases deep integration of the Phaser 2D engine:
* **Rendering & Camera Control**: Manages rendering pipelines, sprite sheets, particle explosions, and camera tracking. In portrait mode, the camera follow-offsets dynamically adjust to center the player visually and increase the visible runway.
* **Arcade Physics**: Manages gravity, jump vectors, bullet velocity, and enemy tracking. 
* **Dynamic Geometry Spawning**: Integrates Phaser's static and dynamic physics groups with procedural generation algorithms to continuously spawn platforms and hazards.
* **High-DPI Stability**: Utilizes canvas `resolution` configurations linked to the device pixel ratio, and `roundPixels` coordinate rounding to completely eliminate sub-pixel sprite jitter on mobile screens.

---

## 🛠️ Tech Stack

* **Reddit Devvit**: Reddit's developer platform for custom interactive posts and backend apps.
* **Phaser**: Core 2D HTML5 game framework.
* **TypeScript / JavaScript**: Game logic and platform integrations.
* **Vite**: Rapid asset compilation and bundling pipeline.
* **Hono**: Backend micro-framework powering Devvit server routes.

---

## 📂 Project Structure

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
* **Node.js**: Version 22 or higher
* **Devvit CLI**: Installed globally (`npm install -g devvit`)

### Setup and Install
1. Clone the repository and navigate to the project directory:
   ```bash
   cd pixeltrailrunner
   ```
2. Install dependencies:
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

## 📱 Mobile Experience & Polish

Optimized to meet strict **Polish** judging criteria, the mobile viewport features:
* **Dynamic Orientation Scaling**: Detects phone aspect ratios and reconfigures the Phaser canvas dynamically (switching between landscape width expansion and portrait taller viewports).
* **Ergonomic Touch Controls**: Sized-up touch buttons (`55px` radius) positioned specifically to fit natural thumb reach in both vertical and horizontal play.
* **Layout Centering**: Implements custom camera offsets to push the gameplay viewport downwards in portrait mode, centering the action perfectly and reducing empty space.
* **Input-Render Synchronization**: Locks physics logic to a stable `60 FPS` update rate and uses pixel rounding to ensure that moving entities (like coins and bee enemies) glide smoothly without any sub-pixel rendering jitter.

---

## 📸 Screenshots / Demo

* **Desktop Gameplay**: `[Placeholder: Widescreen Desktop Gameplay]`
* **Mobile Portrait View**: `[Placeholder: Mobile Portrait gameplay view showing responsive bottom-aligned layout]`
* **HUD and Start Menu**: `[Placeholder: Start Menu with Mute on/off controls]`
* **Gameplay Video/GIF**: `[Placeholder: Link to Gameplay GIF or YouTube demo]`

---

## 🏆 Hackathon Submission Details

This project was developed for the **Reddit’s Games with a Hook Hackathon**.

PixelTrail is designed to deliver a highly replayable, frictionless gameplay experience within Reddit. By combining a strong gameplay loop, procedural replayability, mobile-friendly design, and interactive subreddit post embedding, it showcases how Devvit and Phaser can merge to create a polished, community-focused game...
