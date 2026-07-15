import Phaser from "phaser";

export default class Enemy extends Phaser.Physics.Arcade.Sprite {

  constructor(scene, x, y, type) {

    // Generate the bee texture here to bypass any BootScene caching issues
    if (!scene.textures.exists("injected-bee")) {
      const g = scene.add.graphics();
      
      // Simple bee body
      g.fillStyle(0xffd54f, 1);
      g.fillRect(8, 10, 22, 12);
      g.fillStyle(0x000000, 1);
      g.fillRect(12, 10, 4, 12);
      g.fillRect(20, 10, 4, 12);
      g.fillStyle(0x000000, 1);
      g.fillRect(8, 12, 4, 4);
      g.fillStyle(0xffffff, 1);
      g.fillRect(10, 0, 8, 10);
      g.fillRect(20, 0, 8, 10);
      
      g.generateTexture("injected-bee", 38, 30);
      g.destroy();
    }

    super(
      scene,
      x,
      y,
      type === "flyingEnemy"
        ? "injected-bee"
        : type === "platformEnemy"
          ? "cactus"
          : "enemy-ground"
    );

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.type = type;
    this.originY = y;
    this.isDying = false;
    this.currentFlapFrame = "";

    this.oscillationOffset =
      Phaser.Math.FloatBetween(0, Math.PI * 2);

    this.setDepth(5);
    this.setScale(type === "flyingEnemy" ? 1.15 : type === "platformEnemy" ? 2.0 : 1.15);

    this.hp = 1;

    this.shadow =
      scene.add.ellipse(x, y + 20, 35, 10, 0x000000, 0.25)
        .setDepth(2);

    if (type === "groundEnemy") {
      this.body.setAllowGravity(true);
      this.setVelocityX(-55);
      this.body.setSize(38, 30);
      this.body.setOffset(0, 0);
    }
    else if (type === "platformEnemy") {
      this.body.setAllowGravity(true);
      this.setVelocityX(0);
      this.body.setSize(18, 24);
      this.body.setOffset(0, 0);
      this.body.setBounce(0); // Ensure they don't bounce off platforms
      this.body.setDragX(200); // Add drag so they stop moving horizontally if pushed
    }
    else {
      this.body.setAllowGravity(false);
      this.setVelocityX(-40);
      this.body.setSize(38, 30);
      this.body.setOffset(0, 0);

      // Removed animation call to ensure the injected texture displays correctly
    }

  }





  update(time, playerX) {

    if (this.isDying) return;

    if (this.type === "flyingEnemy") {
      // Temporarily removed manual texture swapping to test single-texture rendering.

      const player = this.scene.player;
      if (player && player.active && !player.isDying) {
        const dist = Phaser.Math.Distance.Between(this.x, this.y, player.x, player.y);
        
        // Attack range of 450 pixels
        if (dist < 450) {
          const angle = Phaser.Math.Angle.Between(this.x, this.y, player.x, player.y);
          const speed = 135;
          this.setVelocityX(Math.cos(angle) * speed);
          this.setVelocityY(Math.sin(angle) * speed);
          
          // Rotate to face the player (texture faces left by default)
          this.rotation = angle - Math.PI;
        } else {
          // Reset rotation smoothly when returning to cruise
          if (this.rotation !== 0) {
            this.originY = this.y;
            this.rotation = 0;
          }
          
          const floatY =
            this.originY
            + Math.sin(time / 320 + this.oscillationOffset) * 28;

          const vy = (floatY - this.y) * 20;
          this.setVelocityY(vy);

          const drift = Phaser.Math.Clamp(
            (playerX - this.x) * 0.015,
            -30,
            30
          );

          this.setVelocityX(-45 + drift);
          this.setVelocityY(0);
        }
      }
    }

    this.shadow.setPosition(this.x, this.y + 22);

    if (this.type === "groundEnemy") {
      this.angle = Math.sin(time / 120) * 2;
    }

  }





  takeDamage() {

    if (this.isDying) return;

    this.hp--;

    this.setTint(0xffffff);

    this.scene.time.delayedCall(80, () => {
      if (this.active) this.clearTint();
    });

    if (this.scene.audioManager) {
      this.scene.audioManager.playEnemyHit();
    }

    if (this.hp <= 0) {
      this.die();
    }

  }





  die() {
    if (this.isDying) return;

    this.isDying = true;
    this.body.enable = false;

    if (this.scene.uiManager) {
      this.scene.uiManager.addEnemyKill();
    }

    if (this.scene.audioManager) {
      this.scene.audioManager.playEnemyDeath();
    }

    // Enhanced explosion with glow
    const explosion =
      this.scene.add.sprite(this.x, this.y, "explosion")
        .setDepth(12)
        .setScale(0.5);

    const explosionGlow =
      this.scene.add.circle(this.x, this.y, 30, 0xff5722, 0.4)
        .setDepth(11);

    this.scene.tweens.add({
      targets: explosion,
      scale: 2.2,
      alpha: 0,
      duration: 320,
      onComplete: () => explosion.destroy()
    });

    this.scene.tweens.add({
      targets: explosionGlow,
      alpha: 0,
      scale: 2.5,
      duration: 350,
      onComplete: () => explosionGlow.destroy()
    });

    // Enhanced particle emitter with more particles
    const emitter =
      this.scene.add.particles(this.x, this.y, "particle", {
        speed: { min: 80, max: 250 },
        angle: { min: 0, max: 360 },
        scale: { start: 1.1, end: 0 },
        lifespan: 550,
        quantity: 18,
        tint: this.type === "flyingEnemy"
          ? [0x7b1fa2, 0x9575cd, 0xd6c2ff, 0xff8c42, 0xffffff]
          : [0xc2185b, 0xe91e63, 0xf06292, 0xff8c42, 0xfff3a6]
      });

    emitter.setDepth(11);
    emitter.explode(20);

    this.scene.time.delayedCall(600, () => {
      if (emitter.active) emitter.destroy();
    });

    // Add secondary smaller explosion
    this.scene.time.delayedCall(100, () => {
      const secondaryExplosion =
        this.scene.add.circle(this.x, this.y, 15, 0xffffff, 0.6)
          .setDepth(13);

      this.scene.tweens.add({
        targets: secondaryExplosion,
        alpha: 0,
        scale: 1.8,
        duration: 200,
        onComplete: () => secondaryExplosion.destroy()
      });
    });

    this.scene.tweens.add({
      targets: [this, this.shadow],
      scaleX: 0,
      scaleY: 0,
      alpha: 0,
      duration: 250,
      ease: "Back.easeIn",
      onComplete: () => this.destroy()
    });

  }





  destroy(fromScene) {

    if (this.shadow && this.shadow.active) {
      this.shadow.destroy();
    }

    super.destroy(fromScene);

  }


}
