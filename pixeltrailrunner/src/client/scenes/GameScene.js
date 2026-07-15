import Phaser from "phaser";

import Bullet from "../entities/Bullet";
import Player from "../entities/Player";

import AudioManager from "../systems/AudioManager";
import ChunkManager from "../systems/ChunkManager";
import CollectibleManager from "../systems/CollectibleManager";
import DayNightManager from "../systems/DayNightManager";
import EnemyManager from "../systems/EnemyManager";
import UIManager from "../systems/UIManager";


export default class GameScene extends Phaser.Scene {

  constructor() {
    super("GameScene");
  }

  preload() {
    console.log("[GameScene] preload START");
    console.log("[GameScene] preload END");
  }

  create() {
    console.log("[GameScene] create START");
    try {
      console.log("Window Dimensions:", window.innerWidth, window.innerHeight);
      console.log("Scale Dimensions:", this.scale.width, this.scale.height);

      const worldWidth = 1000000;
      const worldHeight = this.scale.height > 0 ? this.scale.height : 720;

      this.physics.world.setBounds(0, 0, worldWidth, worldHeight);

      this.isGameOver = false;
      this.gameStarted = false;
      this.fallDeathY = 760;

    // Generate unique seed for this game session for different spawning
    this.gameSeed = Date.now() + Math.random() * 1000;

    this.ground = this.physics.add.staticGroup();
    this.platforms = this.physics.add.staticGroup();

    this.enemyManager = new EnemyManager(this, this.ground);

    this.chunkManager = new ChunkManager(
      this,
      this.ground,
      this.platforms,
      this.gameSeed
    );

    this.chunkManager.update(0);

    this.player = new Player(this, this.scale.width * 0.2, 500);

    this.physics.add.collider(this.player, this.ground);
    this.physics.add.collider(this.player, this.platforms);

    this.audioManager = new AudioManager(this);

    this.collectibleManager = new CollectibleManager(this);

    this.bullets = this.physics.add.group({
      classType: Bullet,
      maxSize: 40,
      runChildUpdate: true,
      allowGravity: false,
      gravityY: 0
    });

    this.uiManager = new UIManager(this);
    this.dayNightManager = new DayNightManager(this);

    this.physics.add.overlap(
      this.bullets,
      this.enemyManager.enemies,
      this.hitEnemy,
      this.canHitEnemy,
      this
    );

    this.physics.add.overlap(
      this.player,
      this.enemyManager.enemies,
      this.hitPlayer,
      this.canHitPlayer,
      this
    );

    this.physics.add.overlap(
      this.player,
      this.collectibleManager.collectibles,
      this.collect,
      this.canCollect,
      this
    );

    this.cameras.main.startFollow(this.player, true, 0.12, 0.08);
    this.cameras.main.setBounds(0, 0, worldWidth, worldHeight);

    if (this.scale.height > this.scale.width) {
      this.cameras.main.setFollowOffset(-140, 240);
    } else {
      this.cameras.main.setFollowOffset(0, 0);
    }

    this.cursors = this.input.keyboard.createCursorKeys();

    this.shootKey = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.SPACE
    );

    this.touchState = {
      left: false,
      right: false,
      jumpPressed: false,
      shootPressed: false,
      shootHeld: false
    };

    this.uiManager.createMobileControls(this.touchState);
    this.uiManager.createStartMenu();

    // Pause physics initially
    this.physics.world.pause();

    this.mouseDown = false;
    this.lastShotAt = 0;

    this.input.on("pointerdown", () => {
      this.mouseDown = true;
    });

    this.input.on("pointerup", () => {
      this.mouseDown = false;
    });

    } catch (error) {
      console.error("[GameScene] Error in create:", error);
    }
    console.log("[GameScene] create END");

    // Listen for scene shutdown to clean up
    this.events.once("shutdown", this.shutdown, this);

  }



  update(time) {

    if (this.isGameOver || !this.gameStarted) return;

    const pointer = this.input.activePointer;
    pointer.updateWorldPoint(this.cameras.main);

    this.player.update(
      this.cursors,
      this.touchState,
      pointer.worldX,
      pointer.worldY,
      time
    );

    this.checkFallDeath();

    this.chunkManager.update(this.player.x);

    this.enemyManager.update(time, this.player.x);
    this.enemyManager.updateEnemies(time, this.player.x);

    this.collectibleManager.update(this.player.x, time);

    this.uiManager.setDistanceScore(
      Math.floor(this.player.x / 10)
    );

    this.dayNightManager.update(time);

    this.cleanupBullets();

    const shoot =
      Phaser.Input.Keyboard.JustDown(this.shootKey)
      || this.mouseDown
      || this.touchState.shootHeld;

    if (shoot) {
      this.shoot(time);
    }

    this.touchState.jumpPressed = false;
    this.touchState.shootPressed = false;

  }



  checkFallDeath() {

    if (this.player.y > this.fallDeathY) {
      this.triggerDeath("fall");
    }

  }

  startGame() {
    this.gameStarted = true;
    this.physics.world.resume();
  }



  shoot(time) {

    if (this.isGameOver) return;

    if (time - this.lastShotAt < 180) return;

    // Get the muzzle position and angle from player
    const muzzle = this.player.getMuzzle();

    // Create bullet using muzzle position and angle
    const bullet = new Bullet(
      this,
      muzzle.x,
      muzzle.y,
      muzzle.angle  // This is already in radians
    );

    this.bullets.add(bullet);
    
    // Call fire after adding to group to ensure velocity is set properly
    bullet.fire(muzzle.angle);

    this.player.triggerShoot(time);

    this.spawnMuzzleFlash(muzzle.x, muzzle.y, muzzle.angle);

    if (this.audioManager) {
      this.audioManager.playShoot();
    }

    this.lastShotAt = time;

  }



  spawnMuzzleFlash(x, y, angle) {

    const flash =
      this.add.sprite(x, y, "muzzle-flash")
        .setDepth(15)
        .setRotation(angle)
        .setScale(0.8);

    // Add glow effect
    const glow =
      this.add.circle(x, y, 20, 0xffeb3b, 0.4)
        .setDepth(14);

    this.tweens.add({
      targets: flash,
      alpha: 0,
      scale: 1.4,
      duration: 90,
      onComplete: () => flash.destroy()
    });

    this.tweens.add({
      targets: glow,
      alpha: 0,
      scale: 1.8,
      duration: 120,
      onComplete: () => glow.destroy()
    });

  }



  cleanupBullets() {

    this.bullets.getChildren().forEach(bullet => {
      if (!bullet.active) return;

      if (
        bullet.x < this.player.x - 400
        || bullet.x > this.player.x + 1500
        || bullet.y < -50
        || bullet.y > 800
      ) {
        bullet.destroy();
      }

    });

  }



  canHitEnemy(bullet, enemy) {
    return bullet.active && enemy.active && !enemy.isDying;
  }



  canHitPlayer(player, enemy) {
    return (
      !this.isGameOver
      && player.active
      && enemy.active
      && !enemy.isDying
      && !player.getData("invulnerable")
    );
  }



  canCollect(player, collectible) {
    return !this.isGameOver && player.active && collectible.active;
  }



  hitEnemy(bullet, enemy) {

    bullet.destroy();
    enemy.takeDamage();

    this.uiManager.addScore(50);

    // Add hit effect
    const hitFlash =
      this.add.circle(enemy.x, enemy.y, 25, 0xffffff, 0.6)
        .setDepth(13);

    this.tweens.add({
      targets: hitFlash,
      alpha: 0,
      scale: 1.5,
      duration: 150,
      onComplete: () => hitFlash.destroy()
    });

  }



  hitPlayer(player, enemy) {

    if (!player.takeDamage(this.time.now)) return;

    enemy.takeDamage();

    this.uiManager.flashDamage();

    this.cameras.main.shake(280, 0.018);

    // Enhanced damage effect
    const damageFlash =
      this.add.rectangle(this.scale.width / 2, this.scale.height / 2, this.scale.width, this.scale.height, 0xff0000, 0.15)
        .setScrollFactor(0)
        .setDepth(25);

    this.tweens.add({
      targets: damageFlash,
      alpha: 0,
      duration: 200,
      onComplete: () => damageFlash.destroy()
    });

    if (this.audioManager) {
      this.audioManager.playDamage();
    }

    if (this.uiManager.damage()) {
      this.triggerDeath("damage");
    }

  }



  collect(player, collectible) {

    this.collectibleManager.collect(collectible);

    // Add collection sparkle effect
    const sparkle =
      this.add.circle(collectible.x, collectible.y, 15, 0xffffff, 0.8)
        .setDepth(14);

    this.tweens.add({
      targets: sparkle,
      alpha: 0,
      scale: 2,
      duration: 300,
      onComplete: () => sparkle.destroy()
    });

  }

  saveHighScore() {
    try {
      const score = this.uiManager.score;
      const highScores = JSON.parse(localStorage.getItem("pixeltrail_highscores") || "[]");
      const newScore = {
        score: score,
        kills: this.uiManager.kills || 0,
        date: new Date().toISOString()
      };
      
      highScores.push(newScore);
      highScores.sort((a, b) => b.score - a.score);
      const top5 = highScores.slice(0, 5);
      
      localStorage.setItem("pixeltrail_highscores", JSON.stringify(top5));
    } catch (e) {
      console.error("Error saving high score:", e);
    }
  }



  triggerDeath(reason) {

    if (this.isGameOver) return;

    this.isGameOver = true;

    this.player.die();

    if (this.audioManager) {
      this.audioManager.playDeath();
    }

    this.cameras.main.shake(400, 0.025);

    this.uiManager.flashDamage();

    // Save high score before showing game over
    this.saveHighScore();

    this.time.delayedCall(1200, () => {
      this.uiManager.showGameOver();
    });

  }

  shutdown() {
    console.log("GameScene shutdown called");
    try {
      // Clean up all managers and objects
      if (this.chunkManager && this.chunkManager.destroy) {
        this.chunkManager.destroy();
      }
      if (this.enemyManager && this.enemyManager.destroy) {
        this.enemyManager.destroy();
      }
      if (this.collectibleManager && this.collectibleManager.destroy) {
        this.collectibleManager.destroy();
      }
      if (this.player && this.player.destroy) {
        this.player.destroy();
      }
      if (this.bullets) {
        try { this.bullets.destroy(); } catch (e) {}
        this.bullets = null;
      }
      if (this.ground) {
        try { this.ground.destroy(); } catch (e) {}
        this.ground = null;
      }
      if (this.platforms) {
        try { this.platforms.destroy(); } catch (e) {}
        this.platforms = null;
      }
    } catch (e) {
      console.error("Error during GameScene shutdown:", e);
    }
  }


}