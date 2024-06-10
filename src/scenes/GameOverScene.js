class GameOverScene extends Phaser.Scene {
    constructor() {
        super({ key: 'gameoverscene' });
    }

    init(data) {
        this.currentScene = data.currentScene;
    }


    create() {
        this.cameras.main.fadeIn(500, 0, 0, 0);
        this.gameOverMusic = this.sound.add('lose');
        this.gameOverMusic.play();

        let image = this.add.image(this.cameras.main.width / 2, this.cameras.main.height / 2, 'gameOver');
        let scaleX = this.cameras.main.width / image.width;
        let scaleY = this.cameras.main.height / image.height;
        let scale = Math.max(scaleX, scaleY);
        image.setScale(scale).setScrollFactor(0);

        this.buttonTryAgain = this.addButton(
            1920 / 2,
            1080 / 2 + 60,
            'buttons',
            this.doTryAgain,
            this,
            'try_again_hl',
            'try_again',
            'try_again_hl',
            'try_again'
        );
        this.buttonMainMenu = this.addButton(
            1920 / 2,
            1080 / 2 + 160,
            'buttons',
            this.doMainMenu,
            this,
            'main_menuLOSE_hl',
            'main_menuLOSE',
            'main_menuLOSEl',
            'main_menuLOSE'
        );

        this.buttonSound = this.sound.add('button');
    }

    doTryAgain() {
        this.buttonTryAgain.disableInteractive();
        this.gameOverMusic.stop();
        this.buttonSound.play();
        this.cameras.main.fadeOut(500, 0, 0, 0);
        this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, (cam, effect) => {
            this.scene.start(this.currentScene);
        });
    }

    doMainMenu() {
        this.buttonMainMenu.disableInteractive();
        this.gameOverMusic.stop();
        this.buttonSound.play();
        this.cameras.main.fadeOut(500, 0, 0, 0);
        this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, (cam, effect) => {
            this.scene.start('menuscene');
        });
    }
}