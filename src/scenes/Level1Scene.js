class Level1Scene extends Phaser.Scene {
  constructor() {
      super({ key: 'level1scene' });
  }

  preload() {
      // Load necessary assets if any
  }

  create() {
      this.cameras.main.fadeIn(500, 0, 0, 0);
      this.cursors = this.input.keyboard.createCursorKeys();
      this.keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
      this.keyS = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
      this.keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
      this.keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);

      this.level1_music = this.sound.add("level1_theme", {
          mute: false,
          volume: 0.7,
          seek: 0,
          loop: true,
          delay: 0
      });
      this.level1_music.play();

      this.buttonSound = this.sound.add('button');
      this.expl = this.sound.add('expl');
      this.diverSaved = this.sound.add('coin');

      this.FadeActive = false;
      this.StopCounter = false;

      this.bgParallax1 = this.add.tileSprite(1920 / 2, 1080 / 2, config.width, config.height - 200, 'bg_level1_1');
      this.bgParallax2 = this.add.tileSprite(1920 / 2, 1080 / 2, config.width, config.height - 200, 'bg_level1_2');
      this.bgParallax3 = this.add.tileSprite(1920 / 2, 1080 / 2, config.width, config.height - 200, 'bg_level1_3');
      this.bgParallax4 = this.add.tileSprite(1920 / 2, 1080 / 2, config.width, config.height - 200, 'bg_level1_4');

      this.add.image(config.width / 2, 50, 'metalTexture');
      this.add.image(config.width / 2, config.height - 50, 'metalTexture');
      this.add.image(155, config.height - 45, 'lifeIcons', 'threeLives').setScale(1.4);
      this.add.image(config.width / 2 - 325, config.height - 45, 'o2Icon').setScale(1.4);
      this.add.image(config.width / 2 + 175, config.height - 50, 'torpedoIcon').setScale(1.4);
      this.add.image(config.width - 250, config.height - 45, 'diverIcons', 'zeroDivers').setScale(1.4);

      this.buttonQuit = this.addButton(1890, 30, 'sprites', this.doBack, this, 'close_hl', 'close', 'close_hl', 'close');

      this.player = this.physics.add.sprite(1920 / 2 + 800, 1080 / 2 - 400, 'player').setCollideWorldBounds(true);
      this.physics.world.setBounds(0, 100, this.game.config.width, this.game.config.height - 200);
      this.player.play('player_animation', true);
      this.player.flipX = true;
      this.player.setSize(80, 54).setOffset(10, 10);

      this.torpedoCount = 60;
      this.PlayerCooldown = 25;
      this.ScoreCount = 0;
      this.LiveCount = 3;
      this.LostLife = false;
      this.CollisionTimer = 0;
      this.Oxygen = 6000;
      this.DiversSavedCount = 0;

      this.torpedoes = new Torpedoes(this);
      this.enemies = this.add.group();
      this.divers = this.add.group();

      this.time.addEvent({
          delay: 250,
          callback: this.spawnEntities,
          callbackScope: this,
          loop: true
      });

      this.physics.add.overlap(this.torpedoes, this.enemies, this.torpedoHitsEnemy, null, this);
      this.physics.add.overlap(this.player, this.enemies, this.playerHitsEnemy, null, this);
      this.physics.add.overlap(this.player, this.divers, this.playerSavesDiver, null, this);
      this.physics.add.overlap(this.divers, this.enemies, this.diverHitsEnemy, null, this);

      this.add.text(32, 16, 'Level: 1', { fontSize: '72px', fill: '#ffffff', fontFamily: 'pixel_font' });

      this.ScoreText = this.add.text(1420, 16, 'Score: ' + this.ScoreCount, {
          fontSize: '72px',
          fill: '#ffffff',
          fontFamily: 'pixel_font'
      }).setDepth(1);

      this.TorpedoCountText = this.add.text(config.width / 2 + 190, config.height - 85, this.torpedoCount, {
          fontSize: '72px',
          fill: '#ffffff',
          fontFamily: 'pixel_font'
      }).setDepth(1);

      this.OxygenText = this.add.text(config.width / 2 - 360, config.height - 85, this.Oxygen, {
          fontSize: '72px',
          fill: '#ffffff',
          fontFamily: 'pixel_font'
      }).setDepth(1);
  }

  update() {
      this.checkOxygen();
      this.checkCollisionProtection();

      if (this.PlayerCooldown < 25) this.PlayerCooldown++;

      if (this.PlayerCooldown === 25 && this.cursors.space.isDown && this.torpedoCount > 0) {
          this.torpedoes.fireTorpedo(this.player.x - 100, this.player.y);
          this.PlayerCooldown = 0;
          this.torpedoCount--;
          if (this.torpedoCount === 0) this.TorpedoCountText.setTint(0xff0000);
          this.TorpedoCountText.setText(this.torpedoCount);
      }

      if (this.cursors.left.isDown || this.keyA.isDown) this.player.setVelocityX(-500);
      else if (this.cursors.right.isDown || this.keyD.isDown) this.player.setVelocityX(600);
      else this.player.setVelocityX(0);

      if (this.cursors.up.isDown || this.keyW.isDown) this.player.setVelocityY(-500);
      else if (this.cursors.down.isDown || this.keyS.isDown) this.player.setVelocityY(500);
      else this.player.setVelocityY(0);

      this.bgParallax1.tilePositionX -= 2.5;
      this.bgParallax2.tilePositionX -= 5;
      this.bgParallax3.tilePositionX -= 7.5;
      this.bgParallax4.tilePositionX -= 10;
  }

  spawnEntities() {
      let enemy = null;
      let diver = null;
      let spawnRate = this.getSpawnRate();

      if (Phaser.Math.Between(0, 1000) >= spawnRate) {
          enemy = new Enemy(
              this,
              Phaser.Math.Between(-600, -400),
              Phaser.Math.Between(180, this.game.config.height - 180)
          );
      } else {
          diver = new Diver(
              this,
              -100,
              Phaser.Math.Between(180, this.game.config.height - 180)
          );
      }

      if (enemy) this.enemies.add(enemy);
      if (diver) this.divers.add(diver);
  }

  getSpawnRate() {
      if (this.Oxygen > 5000) return 10;
      if (this.Oxygen > 3000) return 60;
      if (this.Oxygen > 2000) return 90;
      return 120;
  }

  torpedoHitsEnemy(torpedo, enemy) {
      this.expl.play();
      enemy.disableBody(true, true);
      torpedo.destroy();
      this.ScoreCount += 100;
      this.ScoreText.setText('Score: ' + this.ScoreCount);
  }

  playerHitsEnemy(player, enemy) {
      if (!this.LostLife) {
          enemy.disableBody(true, true);
          this.expl.play();
          enemy.explode();
      }

      if (this.CollisionTimer === 0) {
          this.LiveCount--;
          this.updateLives();
          this.LostLife = true;

          if (this.LiveCount === 0) this.YouLost();
          else this.player.setPosition(1920 / 2 + 800, 1080 / 2 - 400);
      }
  }

  updateLives() {
      const lifeImages = ['zeroLives', 'oneLife', 'twoLives', 'threeLives'];
      this.add.image(155, config.height - 45, 'lifeIcons', lifeImages[this.LiveCount]).setScale(1.4);
  }

  playerSavesDiver(player, diver) {
      this.diverSaved.play();
      diver.destroy();
      this.ScoreCount += 1000;
      this.ScoreText.setText('Score: ' + this.ScoreCount);
      this.DiversSavedCount++;
      this.updateDiversSaved();
  }

  updateDiversSaved() {
      const diverImages = ['zeroDivers', 'oneDiver', 'twoDivers', 'threeDivers', 'fourDivers', 'fiveDivers'];
      this.add.image(config.width - 250, config.height - 45, 'diverIcons', diverImages[this.DiversSavedCount]).setScale(1.4);

      if (this.DiversSavedCount === 5) this.YouWon();
  }

  diverHitsEnemy(diver, enemy) {
      diver.disableBody(true, true);
      diver.die();
  }

  checkOxygen() {
      if (!this.StopCounter) {
          if (this.Oxygen !== 0) {
              if (this.Oxygen < 1000) this.OxygenText.setTint(0xff0000);
              this.Oxygen--;
              this.OxygenText.setText(this.Oxygen);
          } else {
              this.events.once('NoOxygen', this.YouLost, this);
              this.events.emit('NoOxygen');
          }
      }
  }

  checkCollisionProtection() {
      if (this.CollisionTimer <= 100 && this.LostLife) {
          this.CollisionTimer++;
          this.player.setTint(0xff0000);

          if (this.CollisionTimer === 100) {
              this.LostLife = false;
              this.CollisionTimer = 0;
              this.player.clearTint();
          }
      }
  }

  YouLost() {
      if (!this.FadeActive) {
          this.buttonQuit.disableInteractive();
          this.StopCounter = true;
          this.FadeActive = true;
          this.physics.pause();
          this.level1_music.stop();
          this.player.setTint(0xff0000);
          this.cameras.main.fadeOut(500, 0, 0, 0);
          this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, (cam, effect) => {
              this.scene.start('gameoverscene', { currentScene: 'level1scene' });
          });
      }
  }

  YouWon() {
      if (!this.FadeActive) {
          this.buttonQuit.disableInteractive();
          this.StopCounter = true;
          this.FadeActive = true;
          this.physics.pause();
          this.level1_music.stop();
          this.cameras.main.fadeOut(500, 0, 0, 0);
          this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, (cam, effect) => {
              this.scene.start('victoryscene');
          });
      }
  }

  doBack() {
      this.buttonQuit.disableInteractive();
      this.level1_music.stop();
      this.buttonSound.play();
      this.cameras.main.fadeOut(500, 0, 0, 0);
      this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, (cam, effect) => {
          this.scene.start('menuscene');
      });
  }
}