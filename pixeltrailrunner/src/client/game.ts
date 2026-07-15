import BootScene from './scenes/BootScene';
import GameScene from './scenes/GameScene';
import * as Phaser from 'phaser';
import { AUTO, Game } from 'phaser';

const getGameDimensions = () => {
  const isPortrait = window.innerHeight > window.innerWidth;
  if (isPortrait) {
    return { width: 720, height: 1280 }; // Mobile portrait
  } else {
    const ratio = window.innerWidth / window.innerHeight;
    const width = Math.min(Math.max(720 * ratio, 1280), 2000); // Caps landscape width
    return { width, height: 720 };
  }
};

const config: Phaser.Types.Core.GameConfig = {
  type: AUTO,
  parent: 'game-container',
  backgroundColor: '#4fc3f7',
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: getGameDimensions().width,
    height: getGameDimensions().height,
    autoRound: true,
  },
  pixelArt: true,
  render: {
    antialias: false,
    roundPixels: true,
    resolution: window.devicePixelRatio || 1,
  },
  physics: {
    default: "arcade",
    arcade: {
      gravity: {
        y: 1000,
      },
      debug: false,
      fps: 60,
    },
  },
  scene: [BootScene, GameScene],
};

const StartGame = (parent: string) => {
  return new Game({ ...config, parent });
};

const init = () => {
  console.log("game.html loaded");
  StartGame('game-container');
  console.log("Phaser started");
};

if (document.readyState === 'complete' || document.readyState === 'interactive') {
  init();
} else {
  document.addEventListener('DOMContentLoaded', init);
}
