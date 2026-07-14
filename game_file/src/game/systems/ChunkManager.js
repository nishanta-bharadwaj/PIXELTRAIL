import Phaser from "phaser";

export default class ChunkManager {

  constructor(scene, ground, platforms, seed = null) {

    this.scene = scene;
    this.ground = ground;
    this.platforms = platforms;

    this.chunkWidth = 640;
    this.groundY = 680;
    this.groundSurfaceY = 640;

    this.chunks = new Map();

    this.aheadChunks = 4;
    this.behindChunks = 2;
    
    // Use provided seed or generate random one
    this.seed = seed || Date.now();

  }



  update(playerX) {

    const currentChunk =
      Math.floor(playerX / this.chunkWidth);

    const minChunk =
      Math.max(0, currentChunk - this.behindChunks);

    const maxChunk =
      currentChunk + this.aheadChunks;

    for (let i = minChunk; i <= maxChunk; i++) {
      if (!this.chunks.has(i)) {
        this.createChunk(i);
      }
    }

    for (const [index, chunk] of this.chunks) {
      if (index < minChunk || index > maxChunk) {
        this.removeChunk(index, chunk);
      }
    }

  }





  createChunk(index) {

    const x = index * this.chunkWidth;

    const random =
      new Phaser.Math.RandomDataGenerator([
        `pixeltrail-${this.seed}-${index}`
      ]);

    const farBg =
      this.scene.add.graphics()
        .setDepth(-20)
        .setScrollFactor(0.15);

    // More detailed far background mountains with gradients
    for (let i = 0; i < 5; i++) {
      const mx = x + random.between(0, this.chunkWidth);
      const height = random.between(280, 380);
      const width = random.between(100, 160);
      
      // Base mountain
      farBg.fillStyle(0x37474f, 1);
      farBg.fillTriangle(
        mx,
        this.groundSurfaceY - height,
        mx - width,
        this.groundSurfaceY - 40,
        mx + width,
        this.groundSurfaceY - 40
      );
      
      // Mountain highlight
      farBg.fillStyle(0x455a64, 1);
      farBg.fillTriangle(
        mx,
        this.groundSurfaceY - height,
        mx - width * 0.7,
        this.groundSurfaceY - 40,
        mx + width * 0.7,
        this.groundSurfaceY - 40
      );
      
      // Snow cap
      farBg.fillStyle(0x90a4ae, 1);
      farBg.fillTriangle(
        mx,
        this.groundSurfaceY - height,
        mx - 25,
        this.groundSurfaceY - height + 40,
        mx + 25,
        this.groundSurfaceY - height + 40
      );
    }

    const midBg =
      this.scene.add.graphics()
        .setDepth(-15)
        .setScrollFactor(0.35);

    // More detailed mid background hills with variety
    for (let i = 0; i < 7; i++) {
      const mx = x + random.between(0, this.chunkWidth);
      const height = random.between(180, 260);
      const width = random.between(60, 100);
      
      // Hill base
      const hillColor = random.between(0, 1) > 0.5 ? 0x5d8aa8 : 0x4a7c9b;
      midBg.fillStyle(hillColor, 1);
      midBg.fillTriangle(
        mx,
        this.groundSurfaceY - height,
        mx - width,
        this.groundSurfaceY,
        mx + width,
        this.groundSurfaceY
      );
      
      // Hill highlight
      midBg.fillStyle(0x6d9bc3, 1);
      midBg.fillTriangle(
        mx,
        this.groundSurfaceY - height,
        mx - width * 0.6,
        this.groundSurfaceY,
        mx + width * 0.6,
        this.groundSurfaceY
      );
      
      // Add small trees on hills
      if (random.frac() > 0.6) {
        const treeX = mx + random.between(-30, 30);
        const treeY = this.groundSurfaceY - height * 0.4;
        midBg.fillStyle(0x2e7d32, 1);
        midBg.fillTriangle(treeX, treeY - 30, treeX - 15, treeY, treeX + 15, treeY);
        midBg.fillStyle(0x388e3c, 1);
        midBg.fillTriangle(treeX, treeY - 25, treeX - 10, treeY, treeX + 10, treeY);
      }
    }

    const nearBg =
      this.scene.add.graphics()
        .setDepth(-12)
        .setScrollFactor(0.55);

    // More detailed clouds with variety
    for (let i = 0; i < 4; i++) {
      const cx = x + random.between(20, this.chunkWidth - 20);
      const cy = random.between(50, 220);
      const cloudSize = random.between(20, 35);
      
      // Cloud base with gradient effect
      nearBg.fillStyle(0xffffff, 0.7);
      nearBg.fillCircle(cx, cy, cloudSize);
      nearBg.fillCircle(cx + cloudSize * 0.8, cy + 5, cloudSize * 0.7);
      nearBg.fillCircle(cx - cloudSize * 0.6, cy + 3, cloudSize * 0.6);
      nearBg.fillCircle(cx + cloudSize * 0.3, cy - cloudSize * 0.4, cloudSize * 0.5);
      
      // Cloud highlight
      nearBg.fillStyle(0xffffff, 0.85);
      nearBg.fillCircle(cx - 5, cy - 5, cloudSize * 0.4);
      nearBg.fillCircle(cx + cloudSize * 0.6, cy, cloudSize * 0.3);
    }

    const terrainPieces = [];
    const platformPieces = [];

    let cursor = x + 20;
    const chunkEnd = x + this.chunkWidth - 20;

    while (cursor < chunkEnd) {

      const roll = random.frac();
      const safeZoneEnd = index === 0 ? x + 520 : x + 80;
      const allowGap = cursor > safeZoneEnd && index > 0;

      if (roll < 0.18 && allowGap) {
        const gapWidth = random.between(90, 180);
        
        // Spawn a flying enemy in the void
        if (this.scene.enemyManager) {
           const voidEnemyY = random.between(400, 550);
           this.scene.enemyManager.spawnFlyingEnemy(cursor + gapWidth / 2, voidEnemyY);
        }
        
        cursor += gapWidth;
        continue;
      }

      const segWidth = random.between(100, 260);

      const terrain =
        this.scene.add.rectangle(
          cursor + segWidth / 2,
          this.groundY,
          segWidth,
          80,
          0x33691e
        );

      terrain.setDepth(2);
      terrain.setStrokeStyle(3, 0x558b2f);

      this.scene.physics.add.existing(terrain, true);
      this.ground.add(terrain);
      terrainPieces.push(terrain);

      cursor += segWidth;

    }

    const platformCount = random.between(1, 3);

    for (let p = 0; p < platformCount; p++) {

      const sizes = [
        { w: 90, label: "short" },
        { w: 160, label: "medium" },
        { w: 240, label: "long" }
      ];

      const sizeRoll = random.frac();
      let size;

      if (sizeRoll < 0.4) size = sizes[0];
      else if (sizeRoll < 0.75) size = sizes[1];
      else size = sizes[2];

      const platformX =
        x + random.between(60, this.chunkWidth - size.w - 60);

      const platformY =
        random.between(380, 560);

      const platform =
        this.scene.add.rectangle(
          platformX + size.w / 2,
          platformY,
          size.w,
          20,
          0x6d4c41
        );

      platform.setDepth(3);
      platform.setStrokeStyle(2, 0x4caf50);

      this.scene.physics.add.existing(platform, true);
      this.platforms.add(platform);
      platformPieces.push(platform);

      if (random.frac() > 0.55) {
        if (this.scene.enemyManager) {
          this.scene.enemyManager.spawnPlatformEnemy(
            platformX + size.w * 0.6,
            platformY - 22
          );
        }
      }

    }

    const decorations =
      this.scene.add.graphics()
        .setDepth(3);

    // More detailed grass layer with gradient
    decorations.fillStyle(0x1b5e20, 1);
    decorations.fillRect(x, this.groundSurfaceY - 40, this.chunkWidth, 40);
    decorations.fillStyle(0x2e7d32, 1);
    decorations.fillRect(x, this.groundSurfaceY - 35, this.chunkWidth, 35);
    decorations.fillStyle(0x43a047, 1);
    decorations.fillRect(x, this.groundSurfaceY - 30, this.chunkWidth, 30);

    const treeCount = random.between(3, 6);

    for (let i = 0; i < treeCount; i++) {

      const treeX =
        x + random.between(50, this.chunkWidth - 50);

      const height = random.between(100, 170);
      const trunkWidth = random.between(12, 18);
      
      // Enhanced shadow
      decorations.fillStyle(0x000000, 0.2);
      decorations.fillEllipse(treeX, this.groundSurfaceY - 5, 80, 18);

      // Trunk with detail
      decorations.fillStyle(0x5d4037, 1);
      decorations.fillRect(treeX - trunkWidth/2, this.groundSurfaceY - height, trunkWidth, height);
      decorations.fillStyle(0x6d4c41, 1);
      decorations.fillRect(treeX - trunkWidth/2 + 2, this.groundSurfaceY - height, trunkWidth - 4, height);
      
      // Trunk texture
      decorations.fillStyle(0x4e342e, 1);
      for (let t = 0; t < 3; t++) {
        const ty = this.groundSurfaceY - height + 20 + t * 25;
        decorations.fillRect(treeX - 2, ty, 4, 8);
      }

      // Foliage layers for more depth
      const foliageColor1 = random.between(0, 1) > 0.5 ? 0x2e7d32 : 0x388e3c;
      const foliageColor2 = random.between(0, 1) > 0.5 ? 0x43a047 : 0x4caf50;
      
      // Bottom foliage layer
      decorations.fillStyle(foliageColor1, 1);
      decorations.fillCircle(treeX, this.groundSurfaceY - height + 10, 45);
      decorations.fillCircle(treeX - 35, this.groundSurfaceY - height + 30, 35);
      decorations.fillCircle(treeX + 35, this.groundSurfaceY - height + 30, 35);
      
      // Middle foliage layer
      decorations.fillStyle(foliageColor2, 1);
      decorations.fillCircle(treeX, this.groundSurfaceY - height - 10, 38);
      decorations.fillCircle(treeX - 28, this.groundSurfaceY - height + 5, 28);
      decorations.fillCircle(treeX + 28, this.groundSurfaceY - height + 5, 28);
      
      // Top foliage layer
      decorations.fillStyle(0x66bb6a, 1);
      decorations.fillCircle(treeX, this.groundSurfaceY - height - 25, 30);
      decorations.fillCircle(treeX - 20, this.groundSurfaceY - height - 15, 22);
      decorations.fillCircle(treeX + 20, this.groundSurfaceY - height - 15, 22);
      
      // Highlight
      decorations.fillStyle(0x81c784, 1);
      decorations.fillCircle(treeX - 10, this.groundSurfaceY - height - 30, 12);
      decorations.fillCircle(treeX + 15, this.groundSurfaceY - height - 20, 10);

    }

    // More detailed grass tufts with variety
    const grassColors = [0x43a047, 0x4caf50, 0x66bb6a, 0x81c784];
    for (let i = 0; i < random.between(6, 12); i++) {
      const bx = x + random.between(20, this.chunkWidth - 20);
      const grassColor = grassColors[random.between(0, grassColors.length - 1)];
      decorations.fillStyle(grassColor, 1);
      decorations.fillCircle(
        bx,
        this.groundSurfaceY - 25,
        random.between(10, 18)
      );
      // Highlight
      decorations.fillStyle(0xa5d6a7, 0.6);
      decorations.fillCircle(
        bx - 2,
        this.groundSurfaceY - 28,
        random.between(4, 8)
      );
    }

    // More detailed rocks with shading
    for (let i = 0; i < random.between(3, 6); i++) {
      const rx = x + random.between(20, this.chunkWidth - 20);
      const rockSize = random.between(10, 16);
      decorations.fillStyle(0x616161, 1);
      decorations.fillCircle(rx, this.groundSurfaceY - 15, rockSize);
      decorations.fillStyle(0x757575, 1);
      decorations.fillCircle(rx - 2, this.groundSurfaceY - 17, rockSize * 0.7);
      decorations.fillStyle(0x9e9e9e, 1);
      decorations.fillCircle(rx - 3, this.groundSurfaceY - 19, rockSize * 0.4);
    }

    // More detailed flowers with variety
    const flowerColors = [0xff5c8a, 0xff79b0, 0xff4081, 0xe91e63, 0xf48fb1];
    for (let i = 0; i < random.between(5, 10); i++) {
      const fx = x + random.between(20, this.chunkWidth - 20);
      const flowerColor = flowerColors[random.between(0, flowerColors.length - 1)];
      const flowerSize = random.between(3, 5);
      
      // Stem
      decorations.fillStyle(0x33691e, 1);
      decorations.fillRect(fx, this.groundSurfaceY - 45, 2, 15);
      
      // Petals
      decorations.fillStyle(flowerColor, 1);
      decorations.fillCircle(fx, this.groundSurfaceY - 48, flowerSize);
      decorations.fillCircle(fx - 3, this.groundSurfaceY - 46, flowerSize * 0.7);
      decorations.fillCircle(fx + 3, this.groundSurfaceY - 46, flowerSize * 0.7);
      
      // Center
      decorations.fillStyle(0xffeb3b, 1);
      decorations.fillCircle(fx, this.groundSurfaceY - 47, 2);
    }
    
    // Add small mushrooms occasionally
    if (random.frac() > 0.7) {
      const mx = x + random.between(50, this.chunkWidth - 50);
      decorations.fillStyle(0x8d6e63, 1);
      decorations.fillRect(mx - 2, this.groundSurfaceY - 20, 4, 8);
      decorations.fillStyle(0xef5350, 1);
      decorations.fillCircle(mx, this.groundSurfaceY - 22, 5);
      decorations.fillStyle(0xffffff, 0.8);
      decorations.fillCircle(mx - 2, this.groundSurfaceY - 23, 1.5);
      decorations.fillCircle(mx + 2, this.groundSurfaceY - 23, 1.5);
    }

    this.chunks.set(index, {
      farBg,
      midBg,
      nearBg,
      decorations,
      terrainPieces,
      platformPieces
    });

  }





  removeChunk(index, chunk) {

    try {
      chunk.terrainPieces.forEach(piece => {
        if (this.ground && this.ground.scene) {
          this.ground.remove(piece, true, true);
        }
      });
    } catch {
      // Ignore physics removal error during scene shutdown
    }

    try {
      chunk.platformPieces.forEach(piece => {
        if (this.platforms && this.platforms.scene) {
          this.platforms.remove(piece, true, true);
        }
      });
    } catch {
      // Ignore physics removal error during scene shutdown
    }

    chunk.farBg.destroy();
    chunk.midBg.destroy();
    chunk.nearBg.destroy();
    chunk.decorations.destroy();

    this.chunks.delete(index);

  }





  destroy() {

    for (const [index, chunk] of this.chunks) {
      this.removeChunk(index, chunk);
    }

  }


}
