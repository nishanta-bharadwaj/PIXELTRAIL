import Phaser from "phaser";

export default class CollectibleManager {

  constructor(scene) {

    this.scene = scene;

    this.collectibles = scene.physics.add.group({
      immovable: true,
      allowGravity: false
    });

    this.nextSpawnX = 480;

  }





  update(playerX, time) {
    if (!this.collectibles) return;

    while (this.nextSpawnX < playerX + 1500) {
      this.spawnCollectible(this.nextSpawnX);
      this.nextSpawnX += 140 + Math.random() * 200;
    }

    this.animateCollectibles(time);
    this.cleanup(playerX);

  }





  spawnCollectible(x) {
    if (!this.collectibles) return;

    const roll = Math.random();
    let type;

    if (roll < 0.65) type = "coin";
    else if (roll < 0.88) type = "diamond";
    else type = "heart";

    let y;

    if (type === "coin") {
      y = 560 + Math.random() * 40;
    }
    else if (type === "diamond") {
      y = 400 + Math.random() * 120;
    }
    else {
      y = 500 + Math.random() * 60;
    }

    const item = this.scene.physics.add.sprite(x, y, type);

    item.setData("type", type);
    item.setData("spawnTime", this.scene.time.now);
    item.setData("baseY", y);
    item.setData("phase", Math.random() * Math.PI * 2);

    item.setDepth(6);
    item.setScale(1.15);
    // Prevent horizontal reflection
    item.setFlipX(false);

    item.body.setAllowGravity(false);
    item.body.setCircle(12);

    const shadow =
      this.scene.add.ellipse(x, y + 14, 22, 7, 0x000000, 0.22)
        .setDepth(1);

    item.setData("shadow", shadow);

    this.collectibles.add(item);

  }





  animateCollectibles(time) {
    if (!this.collectibles) return;

    this.collectibles.getChildren().forEach(item => {

      if (!item.active) return;

      const baseY = item.getData("baseY");
      const phase = item.getData("phase");
      const type = item.getData("type");

      const nextY = baseY + Math.sin(time / 500 + phase) * 6;

      item.setPosition(item.x, nextY);

      if (item.body) {
        item.body.updateFromGameObject();
      }

      if (type === "diamond") {
        item.angle = Math.sin(time / 400 + phase) * 18;
      }
      else if (type === "coin") {
        item.setScale(
          1.1 + Math.sin(time / 300 + phase) * 0.08,
          1.15
        );
      }

      const shadow = item.getData("shadow");

      if (shadow && shadow.active) {
        shadow.setPosition(item.x, item.y + 14);
      }

    });

  }





  collect(item) {

    if (!item || !item.active || item.getData("collected")) return;

    item.setData("collected", true);
    item.body.enable = false;

    const type = item.getData("type");

    // Enhanced particle emitter with more variety
    const emitter =
      this.scene.add.particles(item.x, item.y, "particle", {
        speed: { min: 60, max: 150 },
        angle: { min: 0, max: 360 },
        scale: { start: 0.9, end: 0 },
        lifespan: 450,
        quantity: 14,
        tint: type === "coin"
          ? [0xff8f00, 0xffa000, 0xffc107, 0xffd54f, 0xfff176]
          : type === "diamond"
            ? [0x00bcd4, 0x00e5ff, 0x80d8ff, 0xffffff]
            : [0xc2185b, 0xe91e63, 0xf06292, 0xff8caa, 0xffffff]
      });

    emitter.setDepth(9);
    emitter.explode(16);

    this.scene.time.delayedCall(500, () => {
      if (emitter.active) emitter.destroy();
    });

    // Add glow effect based on collectible type
    const glowColor = type === "coin" ? 0xffeb3b : type === "diamond" ? 0x00e5ff : 0xff5b6e;
    const glow =
      this.scene.add.circle(item.x, item.y, 25, glowColor, 0.5)
        .setDepth(8);

    this.scene.tweens.add({
      targets: glow,
      alpha: 0,
      scale: 2.2,
      duration: 300,
      onComplete: () => glow.destroy()
    });

    // Enhanced collection animation
    this.scene.tweens.add({
      targets: item,
      scale: 2.2,
      alpha: 0,
      y: item.y - 40,
      duration: 220,
      ease: "Back.easeOut",
      onComplete: () => {

        const shadow = item.getData("shadow");

        if (shadow && shadow.active) shadow.destroy();

        item.destroy();

      }
    });

    // Add secondary sparkle effect
    this.scene.time.delayedCall(80, () => {
      const sparkle =
        this.scene.add.circle(item.x, item.y - 20, 10, 0xffffff, 0.8)
          .setDepth(10);

      this.scene.tweens.add({
        targets: sparkle,
        alpha: 0,
        scale: 1.5,
        duration: 200,
        onComplete: () => sparkle.destroy()
      });
    });

    if (type === "coin") {
      if (this.scene.audioManager) this.scene.audioManager.playCoin();
      this.scene.uiManager.addCoin();
    }
    else if (type === "diamond") {
      if (this.scene.audioManager) this.scene.audioManager.playDiamond();
      this.scene.uiManager.addDiamond();
    }
    else if (type === "heart") {
      if (this.scene.audioManager) this.scene.audioManager.playCoin();
      this.scene.uiManager.addHealth();
    }

  }





  cleanup(playerX) {
    if (!this.collectibles) return;

    this.collectibles.getChildren().forEach(item => {

      if (!item.active) return;

      if (item.x < playerX - 800) {

        const shadow = item.getData("shadow");

        if (shadow && shadow.active) shadow.destroy();

        item.destroy();

      }

    });

  }





  destroy() {
    console.log("Safe CollectibleManager destroy triggered");
    
    if (this.collectibles) {
      try {
        // Safely destroy using Phaser's recommended cleanup API
        this.collectibles.destroy();
      } catch (e) {
        // Ignore any trailing physics errors during shutdown
      }
      // Guarantee idempotency
      this.collectibles = null;
    }
  }


}
