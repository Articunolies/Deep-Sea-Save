class MenuScene extends Phaser.Scene {
    constructor() {
        super({ key: 'menuscene' });
    }

    preload() {
        // Load necessary assets if any
    }

    create() {
        this.cameras.main.fadeIn(500, 0, 0, 0);
        this.menuMusic = this.sound.add("menu_theme");
        let musicConfig = {
            mute: 0,
            volume: 0.6,
            seek: 0,
            loop: true,
            delay: 0
        };
        this.menuMusic.play(musicConfig);

        this.bg_menu1 = this.add.tileSprite(1920 / 2, 1080 / 2, config.width, config.height, 'bg_menu1');
        this.bg_menu2 = this.add.tileSprite(1920 / 2, 1080 / 2, config.width, config.height, 'bg_menu2');
        this.add.image(config.width / 2, config.height / 2 - 275, 'logo');

        this.buttonPlay = this.addButton(1920 / 2, 1080 / 2 - 50, 'buttons', this.doPlay, this, 'play_hl', 'play', 'play_hl', 'play');
        this.buttonCredits = this.addButton(1920 / 2, 1080 / 2 + 50, 'buttons', this.doCredits, this, 'credits_hl', 'credits', 'credits_hl', 'credits');

        if (this.sound.mute) {
            this.buttonMute = this.addButton(1920 - 100, 1080 - 100, 'sprites', this.doUnmute, this, 'sound_off_hl', 'sound_off', 'sound_off_hl', 'sound_off');
        } else {
            this.buttonMute = this.addButton(1920 - 100, 1080 - 100, 'sprites', this.doMute, this, 'sound_on_hl', 'sound_on', 'sound_on_hl', 'sound_on');
        }

        this.buttonSound = this.sound.add('button');
    }

    update() {
        this.bg_menu1.tilePositionX -= 2;
        this.bg_menu2.tilePositionX -= 2;
    }

    doPlay() {
        this.buttonPlay.disableInteractive();
        this.menuMusic.stop();
        this.buttonSound.play();
        this.cameras.main.fadeOut(500, 0, 0, 0);
        this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, (cam, effect) => {
            this.scene.start('level1scene');
        });
    }

    doCredits() {
        this.buttonCredits.disableInteractive();
        this.menuMusic.stop();
        this.buttonSound.play();
        this.cameras.main.fadeOut(500, 0, 0, 0);
        this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, (cam, effect) => {
            this.scene.start('creditsscene');
        });
    }

    doMute() {
        this.buttonMute.destroy();
        this.sound.mute = true;
        this.buttonMute = this.addButton(1920 - 100, 1080 - 100, 'sprites', this.doUnmute, this, 'sound_off_hl', 'sound_off', 'sound_off_hl', 'sound_off');
    }

    doUnmute() {
        this.buttonSound.play();
        this.buttonMute.destroy();
        this.sound.mute = false;
        this.buttonMute = this.addButton(1920 - 100, 1080 - 100, 'sprites', this.doMute, this, 'sound_on_hl', 'sound_on', 'sound_on_hl', 'sound_on');
    }
}