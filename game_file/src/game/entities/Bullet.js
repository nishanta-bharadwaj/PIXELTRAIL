import Phaser from "phaser";


export default class Bullet extends Phaser.Physics.Arcade.Sprite {


  constructor(scene,x,y,angle){

    super(
      scene,
      x,
      y,
      "bullet"
    );


    scene.add.existing(this);
    scene.physics.add.existing(this);

   


    this.setDepth(8);

  this.body.setAllowGravity(false);
  this.body.setGravityY(0);
  this.body.setGravityX(0);


    this.speed=1200;

    this.rotation=angle;



    this.body.setSize(
      20,
      10
    );
    
    // Center the hitbox for better accuracy
    this.body.setOffset(-3, -2);


    this.life=3000;

  }

  fire(angle) {
    this.rotation = angle;
    this.setVelocity(
      Math.cos(angle) * this.speed,
      Math.sin(angle) * this.speed
    );
  }




  preUpdate(time,delta){

    super.preUpdate(
      time,
      delta
    );


    this.life-=delta;


    if(this.life<=0){

      this.destroy();

    }

  }


}