# PIXELTRAIL

**An endless, procedurally generated 2D action platformer built with Phaser 3 and React.**

Pixel Trail is a fast-paced, endless side-scrolling survival game. Run as far as you can across floating platforms, blast away enemies, and collect gems and coins to achieve the highest score—all while a dynamic day/night cycle transitions the world around you... 

## Overview

- **What the game is**: A 2D endless runner and shooter where the environment is generated dynamically as you progress.
- **Gameplay Objective**: Survive as long as possible while maximizing your score through distance traveled, enemies defeated, and items collected.
- **Core Gameplay Loop**: The player auto-runs to the right. You must time your jumps to navigate gaps between procedurally generated platforms and shoot incoming enemies before they deplete your health.
- **Win/Lose Conditions**: The game is endless, so there is no absolute "win" condition—the goal is to top the leaderboard. You lose if your health reaches zero (taking damage from enemies) or if you fall off the platforms into the abyss below.
- **Overall Concept**: A lightweight, performant, arcade-style experience emphasizing timing, reflexes, and high-score chasing.

## Features

- **Procedural Generation**: Platforms and ground chunks are spawned dynamically ahead of the player and destroyed behind them to ensure infinite gameplay without memory leaks.
- **Procedural Pixel Art**: All textures (player, enemies, ground, collectibles, backgrounds) are painted pixel-by-pixel programmatically at runtime. There are no external image assets to load!
- **Procedural Audio**: Sound effects (jumping, shooting, taking damage, UI interactions) are synthesized in real-time using the Web Audio API. 
- **Dynamic Day/Night Cycle**: The sky color smoothly interpolates between day, sunset, night, and sunrise based on the time elapsed.
- **Local Leaderboard**: The game saves your top 5 highest-scoring runs locally in your browser.
- **Mobile-Friendly Controls**: Includes on-screen touch controls for jumping and shooting if played on a touch device.
- **Responsive UI**: A fully integrated UI manager handling health, scores, damage flashing, and start/game-over overlays natively within the Phaser canvas.

## Gameplay

- **Player Movement**: The player automatically runs to the right at a constant speed.
- **Jumping**: The player can jump over pits and obstacles. 
- **Shooting**: The player can fire bullets directly ahead to damage and destroy enemies.
- **Enemy Behavior**: Enemies spawn randomly ahead of the player. They move to the left, acting as moving obstacles. If they collide with the player, the player takes damage and flashes red.
- **Collectibles**: Coins and Diamonds spawn randomly on the platforms. Collecting them grants points (Diamonds are worth more).
- **Score System**: Score increases passively based on distance traveled, and actively through collecting items and defeating enemies.
- **Health/Lives**: The player starts with 3 health points (hearts). Taking damage from an enemy removes 1 heart. Health can be restored if health pickups (if configured) are collected.
- **Restart Flow**: Upon death, a Game Over screen appears displaying your stats and the leaderboard. Clicking Restart immediately resets the game scene back to the start menu overlay.

## Controls

- **Shoot**: `[Spacebar]` or `[Left Mouse Click]`
- **Jump**: `[Up Arrow]`
- **Pause/Resume**: Click the `||` button in the top right corner.
- **Mute/Unmute**: Click the `SOUND` button on the start menu.

## Technologies Used

- **Phaser (v4.2.0)**: The core 2D game engine handling rendering, Arcade Physics, scene lifecycle, input, and collision. (Note: Installed as v4.2.0 but utilizes Phaser 3 API patterns).
- **React (v19.2.7)**: Used to construct the application wrapper and mount the Phaser canvas to the DOM.
- **Vite (v8.1.1)**: The lightning-fast build tool and development server used to bundle the application.
- **JavaScript (ES6+)**: The language used for all game logic, utilizing modern class-based architecture.
- **HTML5 Canvas**: Used by Phaser as the primary rendering context.
- **CSS**: Minimal styling in `index.css` and `App.css` to ensure the canvas fills the screen properly.

## Libraries & Dependencies

- `phaser`: The game engine providing the physics simulation (Arcade Physics), rendering pipeline, asset management, and input handling.
- `react` & `react-dom`: The UI libraries used strictly to bootstrap the web application and provide a mounting point (`Game.jsx`) for the Phaser instance.

**Development Dependencies:**
- `vite`: Serves the project locally with Hot Module Replacement (HMR) and bundles it for production.
- `@vitejs/plugin-react`: Vite plugin to support React JSX syntax.
- `eslint` & plugins (`@eslint/js`, `eslint-plugin-react-hooks`, `eslint-plugin-react-refresh`): Used for static code analysis to catch errors and enforce code quality.
- `@types/react` & `@types/react-dom`: TypeScript definitions for React, utilized by the IDE for autocomplete and intellisense despite the project being JS-based.
- `globals`: Provides predefined global variables for ESLint configuration.

## Project Structure

```
game_file/
├── src/
│   ├── assets/               # Placeholder for external assets (currently unused as all are generated)
│   ├── game/
│   │   ├── entities/         # Game object classes
│   │   │   ├── Bullet.js     # Bullet physics and lifecycle
│   │   │   ├── Enemy.js      # Enemy logic and health
│   │   │   └── Player.js     # Player physics, jumping, and input processing
│   │   ├── scenes/           # Phaser Scene controllers
│   │   │   ├── BootScene.js  # Procedurally generates textures and starts the game
│   │   │   └── GameScene.js  # Main gameplay loop and collision coordination
│   │   ├── systems/          # Manager classes that handle specific domains
│   │   │   ├── AudioManager.js       # Web Audio API synthesizer
│   │   │   ├── ChunkManager.js       # Procedural platform generation
│   │   │   ├── CollectibleManager.js # Spawns and manages coins/gems
│   │   │   ├── DayNightManager.js    # Sky color interpolation
│   │   │   ├── EnemyManager.js       # Spawns and cleans up enemies
│   │   │   └── UIManager.js          # Handles HUD, menus, and score tracking
│   │   └── Game.jsx          # React component that initializes Phaser
│   ├── App.jsx               # Root React component
│   ├── index.css             # Global CSS reset
│   └── main.jsx              # React entry point
├── index.html                # HTML entry point
├── package.json              # Project metadata and dependencies
└── vite.config.js            # Vite build configuration
```

## Code Architecture

- **Application Entry Point**: The app boots via `main.jsx`, which renders `App.jsx`, which in turn renders `Game.jsx`. 
- **React Initialization**: `Game.jsx` contains a React `useEffect` hook that instantiates the `Phaser.Game` object, binding it to a DOM reference and passing the configuration (resolution, physics engine, scene list).
- **Phaser Initialization**: The engine starts with `BootScene.js`. Instead of loading external images, this scene procedurally draws pixel art onto internal canvas textures, saves them to Phaser's texture manager, and transitions to the main game.
- **Scene Lifecycle**: `GameScene.js` handles the entire gameplay state. It utilizes a `gameStarted` flag to pause physics and logic, allowing `UIManager` to draw a transparent start menu over the fully rendered world.
- **Rendering Loop**: Phaser's internal clock calls `update(time)` on `GameScene.js` up to 60 times a second, which then cascades down to update the Player and all System Managers.
- **Physics**: Phaser's Arcade Physics engine handles gravity and velocity. Everything is either a dynamic body (Player, Enemies, Bullets) or a static body (Ground, Platforms).
- **Collision Detection**: `GameScene.js` registers overlaps and colliders. For example, when a bullet overlaps an enemy, it triggers `hitEnemy()`, resolving damage.
- **Input Handling**: Keyboard input (`cursors` and `shootKey`) and pointer events (clicks/touches) are parsed in `GameScene.update()` and passed to `Player.update()` to apply upward velocity (jumping) or spawn bullets (shooting).
- **Enemy & Collectible Management**: Enemies and items are spawned just off-screen to the right by their respective managers. As the player runs past them, they are destroyed when they fall too far off-screen to the left to conserve memory.
- **UI Updates**: The `UIManager.js` draws text and shapes directly to the Phaser canvas on a static, non-scrolling camera layer (`setScrollFactor(0)`), ensuring the HUD stays fixed while the world moves.
- **Score & Health**: Centralized in `UIManager.js`. Health deductions trigger a red flash tween, and reaching zero triggers the Game Over sequence.
- **Restart Logic**: When the player dies, the scene halts. Pressing restart calls `this.scene.restart()`, tearing down all physics groups safely (bypassing internal garbage collection issues) and rebuilding the scene from scratch.

## Installation

```bash
npm install
npm run dev
npm run build
npm run preview
```
