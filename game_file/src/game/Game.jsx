import { useEffect, useRef } from "react";
import Phaser from "phaser";

import BootScene from "./scenes/BootScene";
import GameScene from "./scenes/GameScene";

export default function Game() {
  const gameRef = useRef(null);
  const phaserGame = useRef(null);

  useEffect(() => {
    const game = new Phaser.Game({
      type: Phaser.AUTO,
      width: 1280,
      height: 720,
      parent: gameRef.current,
      backgroundColor: "#4fc3f7",

      scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 1280,
        height: 720,
      },

      physics: {
        default: "arcade",
        arcade: {
          gravity: {
            y: 1000,
          },
          debug: false,
        },
      },

      scene: [BootScene, GameScene],
    });

    phaserGame.current = game;

    return () => {
      phaserGame.current?.destroy(true);
      phaserGame.current = null;
    };
  }, []);

  return (
    <div
      ref={gameRef}
      style={{
        width: "100vw",
        height: "100vh",
        margin: "0 auto",
      }}
    />
  );
}
