class VictoryScene extends Phaser.Scene {
    constructor() {
        super({ key: 'victoryscene' });
    }


    create() {
        this.cameras.main.fadeIn(500, 0, 0, 0);

        this.victoryMusic = this.sound.add('win');
        this.victoryMusic.play();

        let image = this.add.image(this.cameras.main.width / 2, this.cameras.main.height / 2, 'victory');
        let scaleX = this.cameras.main.width / image.width;
        let scaleY = this.cameras.main.height / image.height;
        let scale = Math.max(scaleX, scaleY);
        image.setScale(scale).setScrollFactor(0);

        this.buttonSound = this.sound.add('button');


        this.buttonMainMenu = this.add.image(this.cameras.main.width / 2, this.cameras.main.height / 2 + 160, 'buttons', 'main_menuWIN')
            .setInteractive()
            .on('pointerdown', this.doMainMenu, this)
            .on('pointerover', () => this.buttonMainMenu.setTexture('buttons', 'main_menuWIN_hl'))
            .on('pointerout', () => this.buttonMainMenu.setTexture('buttons', 'main_menuWIN'));
    }


    doMainMenu() {
        this.buttonMainMenu.disableInteractive();
        this.victoryMusic.stop();
        this.buttonSound.play();
        this.cameras.main.fadeOut(500, 0, 0, 0);
        this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
            this.scene.start('menuscene');
        });
    }
}