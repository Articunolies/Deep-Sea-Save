class Entity extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, key) {
    super(scene, x, y, key);
    this.scene = scene;
    this.scene.add.existing(this);
    this.scene.physics.world.enableBody(this, 0);
  }
  explode(){
    this.setScale(2)
    this.play("explosion-big");
    this.on('animationcomplete', function() {
        this.destroy();
    }, this);
  }


  die(){
    this.setScale(3)
    this.play("diver-death");
    this.on('animationcomplete', function() {
      this.destroy();
  }, this);
  }
}
class Enemy extends Entity {
  constructor(scene, x, y) {
    super(scene, x, y);
    this.body.velocity.x = Phaser.Math.Between(700, 900);
    this.setSize(25, 28).setOffset(20, 14);
    this.setScale(3.5);
    this.flipX = false;
    this.play("monster3", true);
  }
  preUpdate(time, delta) {
    super.preUpdate(time, delta);
    if (this.x > config.width + 200) this.destroy();
  }
}

class Diver extends Entity {
  constructor(scene, x, y) {
    super(scene, x, y);
    this.body.velocity.x = 700;
    this.setScale(2);
    this.setSize(60, 24).setOffset(10, 26);
    this.flipX = false;
    this.play("diver", true);
  }
  preUpdate(time, delta) {
    super.preUpdate(time, delta);
    if (this.x > config.width + 200) this.destroy()
  }
}