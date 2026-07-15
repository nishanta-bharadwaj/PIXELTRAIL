import Phaser from "phaser";

export default class Player extends Phaser.Physics.Arcade.Sprite {

  constructor(scene, x, y) {

    super(scene, x, y, "hero-idle-a");

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.forwardSpeed = 260;
    this.strafeSpeed = 70;
    this.minForwardSpeed = 180;
    this.jumpSpeed = 560;

    this.aimAngle = 0;
    this.isDead = false;
    this.isHurt = false;
    this.shootingUntil = 0;
    this.invulnerableUntil = 0;

    this.setScale(1.35);
    this.setDepth(4);
    this.setCollideWorldBounds(false);

    this.body.setSize(20, 40);
    this.body.setOffset(6, 5);

    this.gun = scene.add.sprite(x, y, "gun");
    this.gun.setOrigin(0.15, 0.5);
    this.gun.setDepth(5);

    this.shadow =
      scene.add.ellipse(x, y + 30, 35, 10, 0x000000, 0.3)
        .setDepth(1);

    this.setData("invulnerable", false);

    this.play("hero-idle");

  }



  update(cursors, touchState, aimX, aimY, time) {

    if (this.isDead) return;

    // Calculate aim angle in RADIANS from player body to mouse pointer
    this.aimAngle = Phaser.Math.Angle.Between(
      this.x,
      this.y - 8,
      aimX,
      aimY
    );

    


    this.updateGun();

    if (!this.isHurt) {
      this.updateMovement(cursors, touchState);
    }

    this.updateAnimation(time);

    this.shadow.setPosition(this.x, this.y + 30);

    if (time < this.invulnerableUntil) {
      this.setAlpha(Math.sin(time / 60) > 0 ? 1 : 0.35);
      this.gun.setAlpha(this.alpha);
    }
    else {
      this.setAlpha(1);
      this.gun.setAlpha(1);
      this.setData("invulnerable", false);
    }

  }



  updateGun() {

    const gunPivotX = this.x + 4;
    const gunPivotY = this.y - 8;

    this.gun.setPosition(gunPivotX, gunPivotY);
    this.gun.setRotation(this.aimAngle);
    this.gun.setFlipY(this.aimAngle > Math.PI / 2 || this.aimAngle < -Math.PI / 2);

  }



  updateMovement(cursors, touchState) {

    // Endless runner: always move forward at constant speed
    this.setVelocityX(this.forwardSpeed);
    this.setFlipX(false);

    if (
      Phaser.Input.Keyboard.JustDown(cursors.up)
      || touchState.jumpPressed
    ) {
      if (this.body.blocked.down || this.body.touching.down) {
        this.setVelocityY(-this.jumpSpeed);

        // Jump dust effect
        this.spawnJumpDust();

        if (this.scene.audioManager) {
          this.scene.audioManager.playJump();
        }

      }
    }

  }



  updateAnimation(time) {

    if (this.isHurt) return;

    if (time < this.shootingUntil) {
      this.play("hero-shoot", true);
      return;
    }

    if (!this.body.blocked.down && !this.body.touching.down) {
      this.play("hero-jump", true);
    }
    else {
      this.play("hero-run", true);
    }

  }



  triggerShoot(time) {

    this.shootingUntil = time + 140;

  }



  getMuzzle() {

    const gunLength = 34;
    const pivotX = this.x + 4;
    const pivotY = this.y - 8;

    // Calculate muzzle position along the gun barrel
    const muzzleX = pivotX + Math.cos(this.aimAngle) * gunLength;
    const muzzleY = pivotY + Math.sin(this.aimAngle) * gunLength;

    // Return angle in RADIANS for Phaser physics
    return {
      x: muzzleX,
      y: muzzleY,
      angle: this.aimAngle
    };

  }



  takeDamage(time) {

    if (this.isDead) return false;

    if (time < this.invulnerableUntil) return false;

    this.isHurt = true;
    this.invulnerableUntil = time + 1400;
    this.setData("invulnerable", true);

    this.play("hero-hurt", true);
    this.setTint(0xff4444);

    // Damage particles
    this.spawnDamageParticles();

    this.scene.time.delayedCall(280, () => {
      this.clearTint();
      this.isHurt = false;
    });

    return true;

  }



  die() {

    if (this.isDead) return;

    this.isDead = true;
    this.setVelocity(0, 0);
    this.body.enable = false;

    this.play("hero-dead", true);
    this.gun.setVisible(false);

    // Death particles
    this.spawnDeathParticles();

    this.scene.tweens.add({
      targets: this,
      alpha: 0,
      angle: -90,
      y: this.y + 20,
      duration: 900,
      ease: "Quad.easeIn"
    });

    this.scene.tweens.add({
      targets: this.shadow,
      alpha: 0,
      duration: 600
    });

  }



  spawnJumpDust() {
    const dust =
      this.scene.add.particles(this.x, this.y + 20, "particle", {
        speed: { min: 30, max: 80 },
        angle: { min: 200, max: 340 },
        scale: { start: 0.6, end: 0 },
        lifespan: 400,
        quantity: 8,
        tint: [0x8d6e63, 0x6d4c41, 0x5d4037]
      });

    dust.setDepth(3);
    dust.explode(10);

    this.scene.time.delayedCall(450, () => {
      if (dust.active) dust.destroy();
    });
  }

  spawnDamageParticles() {
    const particles =
      this.scene.add.particles(this.x, this.y, "particle", {
        speed: { min: 50, max: 150 },
        angle: { min: 0, max: 360 },
        scale: { start: 0.8, end: 0 },
        lifespan: 500,
        quantity: 12,
        tint: [0xff4444, 0xff6666, 0xffffff]
      });

    particles.setDepth(10);
    particles.explode(15);

    this.scene.time.delayedCall(550, () => {
      if (particles.active) particles.destroy();
    });
  }

  spawnDeathParticles() {
    const particles =
      this.scene.add.particles(this.x, this.y, "particle", {
        speed: { min: 80, max: 200 },
        angle: { min: 0, max: 360 },
        scale: { start: 1, end: 0 },
        lifespan: 800,
        quantity: 20,
        tint: [0x1a237e, 0x283593, 0x3949ab, 0xffffff]
      });

    particles.setDepth(11);
    particles.explode(25);

    this.scene.time.delayedCall(850, () => {
      if (particles.active) particles.destroy();
    });
  }

  destroy() {

    if (this.gun) this.gun.destroy();
    if (this.shadow) this.shadow.destroy();

    super.destroy();

  }


}