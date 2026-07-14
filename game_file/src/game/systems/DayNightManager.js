import Phaser from "phaser";

export default class DayNightManager {

  constructor(scene) {

    this.scene = scene;

    this.cycleDuration = 60000;

    // Enhanced night overlay with gradient effect
    this.nightOverlay =
      scene.add.rectangle(640, 360, 1280, 720, 0x0a1929, 0)
        .setScrollFactor(0)
        .setDepth(20);

    // More detailed sun with glow effect
    this.sun =
      scene.add.circle(1100, 120, 45, 0xffdd55, 1)
        .setScrollFactor(0)
        .setDepth(5);
    this.sunGlow =
      scene.add.circle(1100, 120, 65, 0xffdd55, 0.3)
        .setScrollFactor(0)
        .setDepth(4);

    // More detailed moon with glow effect
    this.moon =
      scene.add.circle(1100, 120, 35, 0xe8f1ff, 1)
        .setScrollFactor(0)
        .setDepth(6);
    this.moonGlow =
      scene.add.circle(1100, 120, 50, 0xe8f1ff, 0.2)
        .setScrollFactor(0)
        .setDepth(5);

    this.moon.setAlpha(0);
    this.moonGlow.setAlpha(0);

    // Enhanced stars with variety
    this.stars =
      scene.add.graphics()
        .setScrollFactor(0)
        .setDepth(15);

    this.createStars();

    // Add shooting stars
    this.shootingStars = [];
    this.lastShootingStar = 0;

    this.currentPhase = "day";

  }





  createStars() {

    this.stars.clear();

    // Create stars with varying sizes and brightness
    for (let i = 0; i < 120; i++) {
      const x = Phaser.Math.Between(0, 1280);
      const y = Phaser.Math.Between(20, 350);
      const size = Phaser.Math.Between(1, 3);
      const brightness = Phaser.Math.FloatBetween(0.5, 1);
      
      this.stars.fillStyle(0xffffff, brightness);
      this.stars.fillCircle(x, y, size);
      
      // Add glow to larger stars
      if (size > 2) {
        this.stars.fillStyle(0xffffff, brightness * 0.3);
        this.stars.fillCircle(x, y, size + 2);
      }
    }

    // Add some colored stars
    const starColors = [0x80d8ff, 0xff80ab, 0xffff80, 0x80ff80];
    for (let i = 0; i < 15; i++) {
      const x = Phaser.Math.Between(0, 1280);
      const y = Phaser.Math.Between(20, 350);
      const color = starColors[Phaser.Math.Between(0, starColors.length - 1)];
      
      this.stars.fillStyle(color, 0.8);
      this.stars.fillCircle(x, y, 2);
    }

    this.stars.setAlpha(0);

  }





  update(time) {

    const daylight =
      (
        Math.sin(
          (time / this.cycleDuration) * Math.PI * 2 - Math.PI / 2
        ) + 1
      ) / 2;

    // Enhanced color palette for smoother transitions
    const dayColor = { r: 135, g: 206, b: 235 };
    const sunsetColor = { r: 255, g: 140, b: 90 };
    const nightColor = { r: 15, g: 25, b: 60 };
    const dawnColor = { r: 255, g: 183, b: 120 };

    let r;
    let g;
    let b;

    // More nuanced color transitions
    if (daylight > 0.7) {
      // Day to sunset
      const t = (daylight - 0.7) / 0.3;
      r = Phaser.Math.Linear(sunsetColor.r, dayColor.r, t);
      g = Phaser.Math.Linear(sunsetColor.g, dayColor.g, t);
      b = Phaser.Math.Linear(sunsetColor.b, dayColor.b, t);
    }
    else if (daylight > 0.4) {
      // Sunset to night
      const t = (daylight - 0.4) / 0.3;
      r = Phaser.Math.Linear(nightColor.r, sunsetColor.r, t);
      g = Phaser.Math.Linear(nightColor.g, sunsetColor.g, t);
      b = Phaser.Math.Linear(nightColor.b, sunsetColor.b, t);
    }
    else {
      // Night to dawn
      const t = daylight / 0.4;
      r = Phaser.Math.Linear(nightColor.r, dawnColor.r, t);
      g = Phaser.Math.Linear(nightColor.g, dawnColor.g, t);
      b = Phaser.Math.Linear(nightColor.b, dawnColor.b, t);
    }

    const sky = Phaser.Display.Color.GetColor(r, g, b);

    this.scene.cameras.main.setBackgroundColor(sky);

    // Enhanced night overlay with phase-based intensity
    const nightIntensity = (1 - daylight) * 0.6;
    this.nightOverlay.setAlpha(nightIntensity);
    this.nightOverlay.setFillStyle(0x0a1929, nightIntensity);

    // Enhanced sun movement and glow
    this.sun.setAlpha(daylight);
    this.sun.y = 120 - Math.sin(daylight * Math.PI) * 70;
    this.sun.x = 1100 + Math.cos(daylight * Math.PI * 2) * 50;
    this.sunGlow.setAlpha(daylight * 0.4);
    this.sunGlow.y = this.sun.y;
    this.sunGlow.x = this.sun.x;
    
    // Sun color changes during sunset
    if (daylight < 0.7 && daylight > 0.4) {
      const sunsetT = (daylight - 0.4) / 0.3;
      this.sun.setFillStyle(
        Phaser.Display.Color.GetColor(
          Phaser.Math.Linear(255, 255, sunsetT),
          Phaser.Math.Linear(140, 221, sunsetT),
          Phaser.Math.Linear(90, 85, sunsetT)
        )
      );
    } else {
      this.sun.setFillStyle(0xffdd55, 1);
    }

    const night = 1 - daylight;

    // Enhanced moon movement and glow
    this.moon.setAlpha(night);
    this.moon.y = 120 - Math.sin(night * Math.PI) * 70;
    this.moon.x = 1100 + Math.cos(night * Math.PI * 2) * 50;
    this.moonGlow.setAlpha(night * 0.3);
    this.moonGlow.y = this.moon.y;
    this.moonGlow.x = this.moon.x;

    // Enhanced stars with twinkling effect
    this.stars.setAlpha(night * 0.95);
    if (night > 0.5) {
      this.twinkleStars(time);
    }

    // Shooting stars during night
    if (night > 0.7 && time - this.lastShootingStar > 3000) {
      if (Phaser.Math.Between(0, 100) < 3) {
        this.createShootingStar();
        this.lastShootingStar = time;
      }
    }
    this.updateShootingStars();

    // Enhanced phase detection
    if (daylight > 0.7) {
      this.currentPhase = "day";
    }
    else if (daylight > 0.4) {
      this.currentPhase = "sunset";
    }
    else {
      this.currentPhase = "night";
    }

  }





  twinkleStars(time) {
    // Subtle twinkling effect by adjusting alpha slightly
    const twinkle = 0.85 + Math.sin(time / 200) * 0.1;
    this.stars.setAlpha(twinkle);
  }

  createShootingStar() {
    const startX = Phaser.Math.Between(200, 1000);
    const startY = Phaser.Math.Between(50, 200);
    
    const star = this.scene.add.graphics()
      .setScrollFactor(0)
      .setDepth(16);
    
    star.lineStyle(2, 0xffffff, 1);
    star.beginPath();
    star.moveTo(startX, startY);
    star.lineTo(startX + 60, startY + 40);
    star.strokePath();
    
    star.setData('vx', 8);
    star.setData('vy', 5);
    star.setData('life', 30);
    
    this.shootingStars.push(star);
  }

  updateShootingStars() {
    for (let i = this.shootingStars.length - 1; i >= 0; i--) {
      const star = this.shootingStars[i];
      const life = star.getData('life');
      
      if (life <= 0) {
        star.destroy();
        this.shootingStars.splice(i, 1);
        continue;
      }
      
      star.setData('life', life - 1);
      star.x += star.getData('vx');
      star.y += star.getData('vy');
      star.alpha = life / 30;
    }
  }

  destroy() {

    this.nightOverlay.destroy();
    this.sun.destroy();
    this.sunGlow.destroy();
    this.moon.destroy();
    this.moonGlow.destroy();
    this.stars.destroy();
    
    this.shootingStars.forEach(star => star.destroy());
    this.shootingStars = [];

  }


}
