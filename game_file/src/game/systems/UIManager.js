export default class UIManager {

  constructor(scene) {

    this.scene = scene;

    this.score = 0;
    this.coins = 0;
    this.diamonds = 0;
    this.kills = 0;

    this.health = 3;
    this.maxHealth = 3;

    this.gameOverVisible = false;

    this.panel =
      scene.add.rectangle(150, 85, 280, 150, 0x102030, 0.55)
        .setScrollFactor(0)
        .setDepth(19);

    this.scoreText =
      scene.add.text(30, 25, "Score: 0", {
        fontFamily: "monospace",
        fontSize: "22px",
        fontStyle: "bold",
        color: "#ffffff",
        stroke: "#000000",
        strokeThickness: 4
      })
        .setScrollFactor(0)
        .setDepth(20);

    this.coinText =
      scene.add.text(30, 55, "Coins: 0", {
        fontFamily: "monospace",
        fontSize: "20px",
        color: "#ffd166",
        stroke: "#000000",
        strokeThickness: 3
      })
        .setScrollFactor(0)
        .setDepth(20);

    this.diamondText =
      scene.add.text(30, 80, "Gems: 0", {
        fontFamily: "monospace",
        fontSize: "20px",
        color: "#58dcff",
        stroke: "#000000",
        strokeThickness: 3
      })
        .setScrollFactor(0)
        .setDepth(20);

    this.killText =
      scene.add.text(30, 105, "Kills: 0", {
        fontFamily: "monospace",
        fontSize: "20px",
        color: "#ff5b6e",
        stroke: "#000000",
        strokeThickness: 3
      })
        .setScrollFactor(0)
        .setDepth(20);

    this.healthText =
      scene.add.text(220, 30, "", {
        fontFamily: "monospace",
        fontSize: "22px",
        color: "#ff5b6e",
        stroke: "#000000",
        strokeThickness: 3
      })
        .setScrollFactor(0)
        .setDepth(20);

    this.damageFlash =
      scene.add.rectangle(640, 360, 1280, 720, 0xff0000, 0)
        .setScrollFactor(0)
        .setDepth(25);

    this.pauseButton =
      scene.add.circle(scene.scale.width - 50, 50, 25, 0x17213e, 0.8)
        .setScrollFactor(0)
        .setDepth(30)
        .setInteractive();

    scene.add.text(scene.scale.width - 50, 50, "||", {
      fontSize: "20px",
      color: "#ffffff"
    })
      .setOrigin(0.5)
      .setScrollFactor(0)
      .setDepth(31);

    this.pauseButton.on("pointerdown", () => {
      if (scene.scene.isPaused()) {
        scene.scene.resume();
      }
      else if (!this.gameOverVisible) {
        scene.scene.pause();
      }
    });

    this.createGameOverUI();

    this.refresh();

  }





  createGameOverUI() {

    this.gameOverGroup = this.scene.add.container(640, 360)
      .setScrollFactor(0)
      .setDepth(40)
      .setVisible(false);

    const overlay =
      this.scene.add.rectangle(0, 0, 1280, 720, 0x000000, 0.65);

    const title =
      this.scene.add.text(0, -140, "GAME OVER", {
        fontFamily: "monospace",
        fontSize: "52px",
        fontStyle: "bold",
        color: "#ff5b6e",
        stroke: "#000000",
        strokeThickness: 6
      })
        .setOrigin(0.5);

    const stats =
      this.scene.add.text(0, 0, "", {
        fontFamily: "monospace",
        fontSize: "20px",
        color: "#ffffff",
        align: "center",
        stroke: "#000000",
        strokeThickness: 3
      })
        .setOrigin(0.5);

    this.gameOverStats = stats;

    const restartBtn =
      this.scene.add.rectangle(0, 180, 220, 50, 0x2ecc71, 1)
        .setInteractive({ useHandCursor: true })
        .setScrollFactor(0);

    const restartText =
      this.scene.add.text(0, 180, "RESTART", {
        fontFamily: "monospace",
        fontSize: "24px",
        fontStyle: "bold",
        color: "#102030"
      })
        .setOrigin(0.5);

    restartBtn.on("pointerover", () => {
      restartBtn.setFillStyle(0x27ae60);
    });

    restartBtn.on("pointerout", () => {
      restartBtn.setFillStyle(0x2ecc71);
    });

    restartBtn.on("pointerdown", () => {
      console.log("Restart button clicked!");
      try {
        this.scene.scene.restart();
      } catch (e) {
        console.error("Error restarting GameScene:", e);
      }
    });

    this.gameOverGroup.add([
      overlay,
      title,
      stats,
      restartBtn,
      restartText
    ]);

  }





  createStartMenu() {
    this.startMenuGroup = this.scene.add.container(640, 360)
      .setScrollFactor(0)
      .setDepth(100);

    const overlay = this.scene.add.rectangle(0, 0, 1280, 720, 0x000000, 0.65);

    const title = this.scene.add.text(0, -100, "PIXELTRAIL", {
      fontFamily: '"Impact", "Arial Black", "monospace"',
      fontSize: "80px",
      fontStyle: "bold",
      color: "#ffffff",
      stroke: "#000000",
      strokeThickness: 12
    }).setOrigin(0.5).setShadow(6, 6, '#000000', 0, false, true);

    this.scene.tweens.add({
      targets: title,
      scale: { from: 1, to: 1.05 },
      duration: 1500,
      yoyo: true,
      repeat: -1,
      ease: "Sine.easeInOut"
    });

    const startBtn = this.scene.add.rectangle(0, 80, 250, 60, 0x2ecc71, 1)
      .setInteractive({ useHandCursor: true });

    const startText = this.scene.add.text(0, 80, "START GAME", {
      fontFamily: "monospace",
      fontSize: "28px",
      fontStyle: "bold",
      color: "#102030"
    }).setOrigin(0.5);

    startBtn.on("pointerover", () => startBtn.setFillStyle(0x27ae60));
    startBtn.on("pointerout", () => startBtn.setFillStyle(0x2ecc71));
    startBtn.on("pointerdown", () => {
      this.scene.tweens.add({
        targets: this.startMenuGroup,
        alpha: 0,
        duration: 400,
        onComplete: () => {
          this.startMenuGroup.setVisible(false);
          this.scene.startGame();
        }
      });
    });

    const isMuted = this.scene.audioManager ? this.scene.audioManager.isMuted() : false;
    const soundBtn = this.scene.add.rectangle(0, 160, 200, 50, isMuted ? 0xe74c3c : 0x3498db, 1)
      .setInteractive({ useHandCursor: true });

    const soundText = this.scene.add.text(0, 160, `SOUND: ${isMuted ? "OFF" : "ON"}`, {
      fontFamily: "monospace",
      fontSize: "22px",
      fontStyle: "bold",
      color: "#ffffff"
    }).setOrigin(0.5);

    soundBtn.on("pointerover", () => soundBtn.setFillStyle(isMuted ? 0xc0392b : 0x2980b9));
    soundBtn.on("pointerout", () => soundBtn.setFillStyle(isMuted ? 0xe74c3c : 0x3498db));
    soundBtn.on("pointerdown", () => {
      if (this.scene.audioManager) {
        const currentlyMuted = this.scene.audioManager.toggleMute();
        soundText.setText(`SOUND: ${currentlyMuted ? "OFF" : "ON"}`);
        soundBtn.setFillStyle(currentlyMuted ? 0xe74c3c : 0x3498db);
        
        // Rebind pointer events for new colors
        soundBtn.off("pointerover");
        soundBtn.off("pointerout");
        soundBtn.on("pointerover", () => soundBtn.setFillStyle(currentlyMuted ? 0xc0392b : 0x2980b9));
        soundBtn.on("pointerout", () => soundBtn.setFillStyle(currentlyMuted ? 0xe74c3c : 0x3498db));
      }
    });

    const controlsText = this.scene.add.text(0, 250, "CONTROLS\n[SPACE] or [CLICK *] to Shoot\n[UP ARROW] or [CLICK ^] to Jump", {
      fontFamily: "monospace",
      fontSize: "18px",
      align: "center",
      color: "#aaaaaa",
      lineSpacing: 8
    }).setOrigin(0.5);

    this.startMenuGroup.add([overlay, title, startBtn, startText, soundBtn, soundText, controlsText]);
  }

  createMobileControls(touchState) {

    const { width, height } = this.scene.scale;

    const createButton = (x, y, label, down, up) => {

      const button =
        this.scene.add.circle(x, y, 42, 0x173c50, 0.75)
          .setStrokeStyle(3, 0xffffff, 0.6)
          .setScrollFactor(0)
          .setDepth(30)
          .setInteractive();

      this.scene.add.text(x, y, label, {
        fontSize: "24px",
        fontStyle: "bold",
        color: "#ffffff"
      })
        .setOrigin(0.5)
        .setScrollFactor(0)
        .setDepth(31);

      button.on("pointerdown", down);
      button.on("pointerup", up);
      button.on("pointerout", up);

    };

    // Jump button on the left
    createButton(
      170,
      height - 70,
      "^",
      () => { touchState.jumpPressed = true; },
      () => {}
    );

    // Aim/Shoot button on the right
    createButton(
      width - 170,
      height - 70,
      "*",
      () => {
        touchState.shootHeld = true;
        touchState.shootPressed = true;
      },
      () => { touchState.shootHeld = false; }
    );

  }





  flashDamage() {

    this.damageFlash.setAlpha(0.45);

    this.scene.tweens.add({
      targets: this.damageFlash,
      alpha: 0,
      duration: 350,
      ease: "Quad.easeOut"
    });

  }





  showGameOver() {

    this.gameOverVisible = true;

    // Fetch leaderboard
    let highScores = [];
    try {
      highScores = JSON.parse(localStorage.getItem("pixeltrail_highscores") || "[]");
    } catch (e) {
      console.error(e);
    }

    let leaderboardText = "\n\n--- TOP 5 LEADERBOARD ---\n";
    if (highScores.length === 0) {
      leaderboardText += "No scores yet!\n";
    } else {
      highScores.forEach((entry, i) => {
        const dateStr = new Date(entry.date).toLocaleString();
        const killsStr = entry.kills !== undefined ? entry.kills : 0;
        leaderboardText += `${i + 1}. Score: ${entry.score} | Kills: ${killsStr} | ${dateStr}\n`;
      });
    }

    this.gameOverStats.setText(
      `Current Run -> Score: ${this.score} | Kills: ${this.kills} | Coins: ${this.coins} | Gems: ${this.diamonds}`
      + leaderboardText
    );

    this.gameOverGroup.setVisible(true);

  }





  setDistanceScore(distance) {

    if (distance > this.score) {
      this.score = distance;
    }

    this.refresh();

  }





  addScore(points) {

    this.score += points;

    this.scoreText.setScale(1.15);

    this.scene.tweens.add({
      targets: this.scoreText,
      scale: 1,
      duration: 150
    });

    this.refresh();

  }





  addCoin() {

    this.coins++;
    this.refresh();

  }





  addDiamond() {
    this.diamonds++;
    this.addScore(50);
    this.refresh();
  }

  addEnemyKill() {
    this.kills++;
    this.refresh();
  }

  damage() {
    this.health--;
    this.refresh();
    return this.health <= 0;
  }

  addHealth() {
    this.heal();
  }





  heal() {

    this.health = Math.min(this.maxHealth, this.health + 1);
    this.refresh();

  }





  refresh() {

    this.scoreText.setText(`Score: ${this.score}`);
    this.coinText.setText(`Coins: ${this.coins}`);
    this.diamondText.setText(`Gems: ${this.diamonds}`);
    this.killText.setText(`Kills: ${this.kills}`);

    const hearts =
      "♥".repeat(this.health)
      + "♡".repeat(this.maxHealth - this.health);

    this.healthText.setText(hearts);

  }


}
