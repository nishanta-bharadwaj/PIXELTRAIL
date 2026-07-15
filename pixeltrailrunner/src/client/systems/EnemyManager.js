import Enemy from "../entities/Enemy";

export default class EnemyManager {

  constructor(scene, ground) {

    this.scene = scene;
    this.ground = ground;

    this.enemies = scene.physics.add.group();

    this.nextGroundSpawnX = 750;
    this.nextFlyingSpawnX = 900;
    this.spawnCounter = 0;

  }





  update(time, playerX) {

    while (this.nextGroundSpawnX < playerX + 1600) {
      this.spawnGroundEnemy(this.nextGroundSpawnX);
      this.nextGroundSpawnX += 320 + Math.random() * 280;
    }

    while (this.nextFlyingSpawnX < playerX + 1600) {
      this.spawnFlyingEnemy(this.nextFlyingSpawnX);
      this.nextFlyingSpawnX += 280 + Math.random() * 240;
    }

    this.cleanup(playerX);

  }





  spawnPlatformEnemy(x, y) {

    const enemy = new Enemy(
      this.scene,
      x,
      y,
      "platformEnemy"
    );

    this.enemies.add(enemy);

    this.scene.physics.add.collider(
      enemy,
      this.ground
    );

    this.scene.physics.add.collider(
      enemy,
      this.scene.platforms
    );

  }





  spawnGroundEnemy(x) {

    const enemy = new Enemy(
      this.scene,
      x,
      560,
      "groundEnemy"
    );

    this.enemies.add(enemy);

    this.scene.physics.add.collider(
      enemy,
      this.ground
    );

    this.scene.physics.add.collider(
      enemy,
      this.scene.platforms
    );

  }





  spawnFlyingEnemy(x, customY) {

    const heightRoll = Math.random();
    let y;

    if (customY !== undefined) {
      y = customY;
    }
    else if (heightRoll < 0.33) {
      y = 280 + Math.random() * 60;
    }
    else if (heightRoll < 0.66) {
      y = 360 + Math.random() * 70;
    }
    else {
      y = 450 + Math.random() * 80;
    }

    const enemy = new Enemy(
      this.scene,
      x,
      y,
      "flyingEnemy"
    );

    this.enemies.add(enemy);

  }





  updateEnemies(time, playerX) {

    this.enemies.getChildren().forEach(enemy => {
      if (!enemy.active) return;
      enemy.update(time, playerX);
    });

  }





  cleanup(playerX) {

    this.enemies.getChildren().forEach(enemy => {
      if (!enemy.active) return;

      if (enemy.x < playerX - 900) {
        enemy.destroy();
      }

    });

  }





  destroy() {
    if (this.enemies) {
      try {
        this.enemies.destroy();
      } catch (e) {
        // Ignore destroy errors during shutdown
      }
      this.enemies = null;
    }
  }


}
