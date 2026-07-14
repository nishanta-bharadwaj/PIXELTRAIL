import Phaser from "phaser";
import heroUrl from "../../assets/hero.png";

export default class BootScene extends Phaser.Scene {

  constructor() {
    super("BootScene");
  }


  preload() {
    this.load.image("legacy-hero", heroUrl);
  }


  create() {

    this.createPixelTextures();
    this.createAnimations();

    this.scene.start("GameScene");

  }



  createPixelTextures() {


    const drawTexture = (key, width, height, draw) => {

      if (this.textures.exists(key)) return;

      const graphics =
        this.make.graphics({
          add: false
        });

      draw(graphics);

      graphics.generateTexture(
        key,
        width,
        height
      );

      graphics.destroy();

    };



    const drawHero = (key, legOffset, armOffset, gunRaised = false) => {

      drawTexture(
        key,
        32,
        48,
        (g) => {
          // Body - more detailed with shading
          g.fillStyle(0x1a237e, 1);
          g.fillRect(7, 1, 18, 46);
          g.fillStyle(0x283593, 1);
          g.fillRect(8, 2, 16, 44);
          g.fillStyle(0x3949ab, 1);
          g.fillRect(9, 3, 14, 42);

          // Visor/helmet - more detailed
          g.fillStyle(0x0d47a1, 1);
          g.fillRect(8, 2, 16, 14);
          g.fillStyle(0x1565c0, 1);
          g.fillRect(9, 3, 14, 12);

          // Face - more detailed
          g.fillStyle(0xffcc80, 1);
          g.fillRect(10, 5, 12, 10);
          g.fillStyle(0xffb74d, 1);
          g.fillRect(11, 6, 10, 8);

          // Eyes - glowing effect
          g.fillStyle(0x00e5ff, 1);
          g.fillRect(11, 7, 10, 4);
          g.fillStyle(0x80d8ff, 1);
          g.fillRect(12, 8, 3, 2);
          g.fillRect(17, 8, 3, 2);

          // Chest armor - more detailed
          g.fillStyle(0x2e7d32, 1);
          g.fillRect(7, 17, 18, 17);
          g.fillStyle(0x43a047, 1);
          g.fillRect(8, 18, 16, 15);
          g.fillStyle(0x66bb6a, 1);
          g.fillRect(9, 19, 14, 13);

          // Emblem on chest
          g.fillStyle(0xffeb3b, 1);
          g.fillRect(13, 20, 6, 5);
          g.fillStyle(0xffc107, 1);
          g.fillRect(14, 21, 4, 3);

          // Arms - more detailed
          g.fillStyle(0xffcc80, 1);
          if (gunRaised) {
            g.fillRect(22, 14, 5, 10);
            g.fillRect(3, 22 + armOffset, 5, 10);
            g.fillStyle(0xffb74d, 1);
            g.fillRect(23, 15, 3, 8);
            g.fillRect(4, 23 + armOffset, 3, 8);
          }
          else {
            g.fillRect(3, 20 + armOffset, 5, 12);
            g.fillRect(24, 20 - armOffset, 5, 12);
            g.fillStyle(0xffb74d, 1);
            g.fillRect(4, 21 + armOffset, 3, 10);
            g.fillRect(25, 21 - armOffset, 3, 10);
          }

          // Legs - more detailed
          g.fillStyle(0x1a237e, 1);
          g.fillRect(9, 34, 6, 11 + legOffset);
          g.fillRect(18, 34, 6, 11 - legOffset);
          g.fillStyle(0x283593, 1);
          g.fillRect(10, 35, 4, 9 + legOffset);
          g.fillRect(19, 35, 4, 9 - legOffset);

          // Boots - more detailed
          g.fillStyle(0x424242, 1);
          g.fillRect(7, 44 + legOffset, 9, 4);
          g.fillRect(17, 44 - legOffset, 9, 4);
          g.fillStyle(0x616161, 1);
          g.fillRect(8, 45 + legOffset, 7, 3);
          g.fillRect(18, 45 - legOffset, 7, 3);

        }
      );

    };


    drawHero("hero-idle-a", 0, 0);
    drawHero("hero-idle-b", 0, 1);
    drawHero("hero-run-a", 2, 2);
    drawHero("hero-run-b", -2, -2);
    drawHero("hero-jump", 1, 0);
    drawHero("hero-shoot", 0, 0, true);
    drawHero("hero-hurt", -1, 3);
    drawHero("hero-dead", 3, 0);


    drawTexture(
      "gun",
      30,
      10,
      (g) => {
        // Main body - more detailed
        g.fillStyle(0x212121, 1);
        g.fillRect(0, 2, 30, 6);
        g.fillStyle(0x424242, 1);
        g.fillRect(1, 3, 28, 4);
        g.fillStyle(0x616161, 1);
        g.fillRect(2, 4, 26, 2);

        // Energy core - glowing effect
        g.fillStyle(0x00bcd4, 1);
        g.fillRect(12, 1, 14, 2);
        g.fillStyle(0x00e5ff, 1);
        g.fillRect(13, 1, 12, 1);

        // Muzzle - more detailed
        g.fillStyle(0xff9800, 1);
        g.fillRect(26, 3, 4, 4);
        g.fillStyle(0xffb74d, 1);
        g.fillRect(27, 4, 2, 2);

        // Handle detail
        g.fillStyle(0x757575, 1);
        g.fillRect(4, 5, 8, 3);

      }
    );



    drawTexture(
      "bullet",
      14,
      6,
      (g) => {
        // Main body - glowing effect
        g.fillStyle(0xffeb3b, 1);
        g.fillRect(0, 1, 14, 4);
        g.fillStyle(0xfff176, 1);
        g.fillRect(1, 2, 12, 2);

        // Trail - more detailed
        g.fillStyle(0xff5722, 1);
        g.fillRect(10, 0, 4, 6);
        g.fillStyle(0xff7043, 1);
        g.fillRect(11, 1, 2, 4);

        // Glow effect
        g.fillStyle(0xffffff, 0.5);
        g.fillRect(2, 2, 8, 2);

      }
    );



    drawTexture(
      "particle",
      8,
      8,
      (g) => {
        // More detailed particle with glow
        g.fillStyle(0xffffff, 1);
        g.fillCircle(4, 4, 4);
        g.fillStyle(0xffeb3b, 0.8);
        g.fillCircle(4, 4, 2);
        g.fillStyle(0xffffff, 0.5);
        g.fillCircle(4, 4, 1);

      }
    );



    drawTexture(
      "muzzle-flash",
      16,
      16,
      (g) => {
        // Main flash - more detailed
        g.fillStyle(0xffeb3b, 1);
        g.fillTriangle(0, 8, 16, 2, 16, 14);
        g.fillStyle(0xfff176, 1);
        g.fillTriangle(1, 8, 14, 3, 14, 13);

        // Core - more detailed
        g.fillStyle(0xff5722, 1);
        g.fillCircle(5, 8, 4);
        g.fillStyle(0xff7043, 1);
        g.fillCircle(5, 8, 2);
        g.fillStyle(0xffffff, 0.8);
        g.fillCircle(5, 8, 1);

        // Outer glow
        g.fillStyle(0xffeb3b, 0.3);
        g.fillCircle(5, 8, 6);

      }
    );



    drawTexture(
      "explosion",
      24,
      24,
      (g) => {
        // Outer explosion - more detailed
        g.fillStyle(0xff5722, 1);
        g.fillCircle(12, 12, 10);
        g.fillStyle(0xff7043, 1);
        g.fillCircle(12, 12, 8);

        // Inner explosion - more detailed
        g.fillStyle(0xffeb3b, 1);
        g.fillCircle(12, 12, 6);
        g.fillStyle(0xfff176, 1);
        g.fillCircle(12, 12, 4);

        // Core - more detailed
        g.fillStyle(0xffffff, 1);
        g.fillCircle(12, 12, 2);

        // Sparks
        g.fillStyle(0xff5722, 1);
        g.fillRect(4, 10, 16, 4);
        g.fillRect(10, 4, 4, 16);

      }
    );



    drawTexture(
      "enemy-ground",
      38,
      30,
      (g) => {
        // Body - more detailed
        g.fillStyle(0x1a237e, 1);
        g.fillRect(2, 5, 34, 23);
        g.fillStyle(0x283593, 1);
        g.fillRect(3, 6, 32, 21);
        g.fillStyle(0x3949ab, 1);
        g.fillRect(4, 7, 30, 19);

        // Core - more detailed
        g.fillStyle(0xe91e63, 1);
        g.fillRect(5, 8, 28, 16);
        g.fillStyle(0xf06292, 1);
        g.fillRect(6, 9, 26, 14);
        g.fillStyle(0xf48fb1, 1);
        g.fillRect(7, 10, 24, 12);

        // Eyes - more detailed with glow
        g.fillStyle(0xffffff, 1);
        g.fillRect(10, 11, 5, 5);
        g.fillRect(23, 11, 5, 5);
        g.fillStyle(0xffeb3b, 1);
        g.fillRect(11, 12, 3, 3);
        g.fillRect(24, 12, 3, 3);

        // Spikes
        g.fillStyle(0x1a237e, 1);
        g.fillRect(8, 4, 4, 4);
        g.fillRect(26, 4, 4, 4);
        g.fillRect(8, 24, 4, 4);
        g.fillRect(26, 24, 4, 4);

      }
    );



    drawTexture(
      "flying-bee-1",
      38,
      30,
      (g) => {
        // Simple bee body (Yellow)
        g.fillStyle(0xffd54f, 1);
        g.fillRect(8, 10, 22, 12);
        
        // Black stripes
        g.fillStyle(0x000000, 1);
        g.fillRect(12, 10, 4, 12);
        g.fillRect(20, 10, 4, 12);
        
        // Eyes
        g.fillStyle(0x000000, 1);
        g.fillRect(8, 12, 4, 4);
        
        // Wings UP (White)
        g.fillStyle(0xffffff, 1);
        g.fillRect(10, 0, 8, 10);
        g.fillRect(20, 0, 8, 10);
      }
    );

    drawTexture(
      "flying-bee-2",
      38,
      30,
      (g) => {
        // Simple bee body (Yellow)
        g.fillStyle(0xffd54f, 1);
        g.fillRect(8, 10, 22, 12);
        
        // Black stripes
        g.fillStyle(0x000000, 1);
        g.fillRect(12, 10, 4, 12);
        g.fillRect(20, 10, 4, 12);
        
        // Eyes
        g.fillStyle(0x000000, 1);
        g.fillRect(8, 12, 4, 4);
        
        // Wings DOWN (White)
        g.fillStyle(0xffffff, 1);
        g.fillRect(10, 22, 8, 8);
        g.fillRect(20, 22, 8, 8);
      }
    );



    drawTexture(
      "coin",
      20,
      20,
      (g) => {
        // Outer ring - more detailed
        g.fillStyle(0xff8f00, 1);
        g.fillCircle(10, 10, 8);
        g.fillStyle(0xffa000, 1);
        g.fillCircle(10, 10, 7);

        // Main body - more detailed
        g.fillStyle(0xffc107, 1);
        g.fillCircle(10, 10, 6);
        g.fillStyle(0xffd54f, 1);
        g.fillCircle(10, 10, 5);

        // Inner detail - more detailed
        g.fillStyle(0xff8f00, 1);
        g.fillRect(7, 7, 6, 6);
        g.fillStyle(0xffa000, 1);
        g.fillRect(8, 8, 4, 4);

        // Shine
        g.fillStyle(0xffffff, 0.6);
        g.fillCircle(8, 8, 2);

      }
    );



    drawTexture(
      "diamond",
      22,
      22,
      (g) => {
        // Outer shape - more detailed
        g.fillStyle(0x00bcd4, 1);
        g.fillTriangle(11, 1, 21, 11, 11, 21);
        g.fillTriangle(11, 1, 1, 11, 11, 21);
        g.fillStyle(0x00e5ff, 1);
        g.fillTriangle(11, 2, 20, 11, 11, 20);
        g.fillTriangle(11, 2, 2, 11, 11, 20);

        // Inner facets - more detailed
        g.fillStyle(0x0097a7, 1);
        g.fillTriangle(11, 5, 16, 11, 11, 16);
        g.fillTriangle(11, 5, 6, 11, 11, 16);
        g.fillStyle(0x00bcd4, 1);
        g.fillTriangle(11, 7, 14, 11, 11, 14);

        // Shine
        g.fillStyle(0xffffff, 0.7);
        g.fillTriangle(11, 3, 13, 6, 11, 6);

      }
    );



    drawTexture(
      "heart",
      22,
      20,
      (g) => {
        // Left lobe - more detailed
        g.fillStyle(0xc62828, 1);
        g.fillCircle(7, 7, 6);
        g.fillStyle(0xe53935, 1);
        g.fillCircle(7, 7, 5);
        g.fillStyle(0xef5350, 1);
        g.fillCircle(7, 7, 4);

        // Right lobe - more detailed
        g.fillStyle(0xc62828, 1);
        g.fillCircle(15, 7, 6);
        g.fillStyle(0xe53935, 1);
        g.fillCircle(15, 7, 5);
        g.fillStyle(0xef5350, 1);
        g.fillCircle(15, 7, 4);

        // Bottom - more detailed
        g.fillStyle(0xc62828, 1);
        g.fillTriangle(1, 9, 21, 9, 11, 19);
        g.fillStyle(0xe53935, 1);
        g.fillTriangle(2, 9, 20, 9, 11, 18);

        // Inner detail - more detailed
        g.fillStyle(0xc62828, 1);
        g.fillRect(9, 10, 4, 5);
        g.fillStyle(0xef5350, 1);
        g.fillRect(10, 11, 2, 3);

        // Shine
        g.fillStyle(0xffffff, 0.5);
        g.fillCircle(5, 5, 2);
        g.fillCircle(17, 5, 2);

      }
    );



    drawTexture(
      "platform",
      64,
      16,
      (g) => {
        // Base - more detailed
        g.fillStyle(0x3e2723, 1);
        g.fillRect(0, 0, 64, 16);
        g.fillStyle(0x4e342e, 1);
        g.fillRect(1, 1, 62, 14);
        g.fillStyle(0x5d4037, 1);
        g.fillRect(2, 2, 60, 12);

        // Top surface - more detailed
        g.fillStyle(0x795548, 1);
        g.fillRect(2, 2, 60, 6);
        g.fillStyle(0x8d6e63, 1);
        g.fillRect(3, 3, 58, 4);

        // Grass/moss - more detailed
        g.fillStyle(0x2e7d32, 1);
        g.fillRect(0, 0, 64, 4);
        g.fillStyle(0x43a047, 1);
        g.fillRect(0, 1, 64, 2);
        g.fillStyle(0x66bb6a, 1);
        g.fillRect(0, 2, 64, 1);

        // Detail lines
        g.fillStyle(0x3e2723, 1);
        g.fillRect(8, 8, 48, 1);
        g.fillRect(8, 11, 48, 1);

      }
    );



    drawTexture(
      "pink-square",
      18,
      24,
      (g) => {
        g.fillStyle(0xef476f, 1);
        g.fillRect(0, 0, 18, 24);
        g.fillStyle(0xd81b60, 1);
        g.fillRect(2, 2, 14, 20);
        g.fillStyle(0xffffff, 0.8);
        g.fillRect(4, 4, 4, 4);
      }
    );



    drawTexture(
      "cactus",
      18,
      24,
      (g) => {
        // Main stem: green cactus column (X: 5 to 13, Y: 4 to 24)
        g.fillStyle(0x1b5e20, 1); // Dark green border/shading
        g.fillRect(5, 3, 8, 21);
        g.fillStyle(0x2e7d32, 1); // Medium green main body
        g.fillRect(6, 4, 6, 20);
        g.fillStyle(0x43a047, 1); // Light green highlight
        g.fillRect(7, 4, 3, 20);
        
        // Left arm (X: 1 to 5, Y: 10 to 16)
        g.fillStyle(0x1b5e20, 1);
        g.fillRect(1, 9, 5, 7);
        g.fillStyle(0x2e7d32, 1);
        g.fillRect(2, 10, 4, 5);
        // Left arm vertical tip (X: 1 to 3, Y: 7 to 9)
        g.fillStyle(0x1b5e20, 1);
        g.fillRect(1, 6, 3, 3);
        g.fillStyle(0x2e7d32, 1);
        g.fillRect(2, 7, 1, 2);
        
        // Right arm (X: 13 to 17, Y: 8 to 14)
        g.fillStyle(0x1b5e20, 1);
        g.fillRect(12, 7, 5, 7);
        g.fillStyle(0x2e7d32, 1);
        g.fillRect(12, 8, 4, 5);
        // Right arm vertical tip (X: 15 to 17, Y: 4 to 7)
        g.fillStyle(0x1b5e20, 1);
        g.fillRect(14, 4, 3, 3);
        g.fillStyle(0x2e7d32, 1);
        g.fillRect(15, 5, 1, 2);
        
        // Spikes (yellow dots/pixels)
        g.fillStyle(0xffeb3b, 1);
        g.fillRect(9, 6, 1, 1);
        g.fillRect(4, 11, 1, 1);
        g.fillRect(13, 11, 1, 1);
        g.fillRect(9, 14, 1, 1);
        g.fillRect(9, 20, 1, 1);
        g.fillRect(3, 18, 1, 1);
        g.fillRect(14, 17, 1, 1);
        
        // Flower on top (X: 8 to 10, Y: 0 to 2)
        g.fillStyle(0xe91e63, 1); // Pink flower
        g.fillRect(7, 0, 4, 3);
        g.fillStyle(0xffffff, 1); // White center
        g.fillRect(8, 1, 2, 1);
      }
    );

  }



  createAnimations() {


    const create = (key, frames, rate, repeat = -1) => {

      if (!this.anims.exists(key)) {

        this.anims.create({
          key: key,
          frames: frames.map(t => ({ key: t })),
          frameRate: rate,
          repeat: repeat
        });

      }

    };



    create(
      "hero-idle",
      ["hero-idle-a", "hero-idle-b"],
      2
    );

    create(
      "hero-run",
      ["hero-run-a", "hero-run-b"],
      10
    );

    create(
      "hero-jump",
      ["hero-jump"],
      1,
      0
    );

    create(
      "hero-shoot",
      ["hero-shoot"],
      1,
      0
    );

    create(
      "hero-hurt",
      ["hero-hurt"],
      1,
      0
    );

    create(
      "hero-dead",
      ["hero-dead"],
      1,
      0
    );

    create(
      "flying-bee-anim",
      ["flying-bee-1", "flying-bee-2"],
      7
    );

  }


}
