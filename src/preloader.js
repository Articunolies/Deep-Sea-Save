class Preloader extends Phaser.Scene {
    constructor() {
        super({
            key: 'preloader',
            pack: {
                files: [
                    { type: 'image', key: 'loading_screen', url: 'assets/img/loading_screen.png' },
                    { type: 'image', key: 'loadingbar_bg', url: 'assets/img/loadingbar_bg.png' },
                    { type: 'image', key: 'loadingbar_fill', url: 'assets/img/loadingbar_fill.png' }
                ]
            }
        });
    }

    loadFont(name, url) {
        const newFont = new FontFace(name, `url(${url})`);
        newFont.load().then((loaded) => {
            document.fonts.add(loaded);
        }).catch((error) => {
            console.error('Error loading font:', error);
        });
    }

    setPreloadSprite(sprite) {
        this.input.setDefaultCursor('url(assets/img/cursor.cur), pointer');
        this.preloadSprite = { sprite: sprite, width: sprite.width, height: sprite.height };
        sprite.visible = true;

        this.load.on('progress', this.onProgress, this);
        this.load.on('fileprogress', this.onFileProgress, this);
    }

    onProgress(value) {
        if (this.preloadSprite) {
            const w = Math.floor(this.preloadSprite.width * value);

            this.preloadSprite.sprite.frame.width = (w <= 0 ? 1 : w);
            this.preloadSprite.sprite.frame.cutWidth = w;

            this.preloadSprite.sprite.frame.updateUVs();
        }
    }

    onFileProgress(file) {}

    preload() {
        this.loadFont('pixel_font', 'assets/fnt/pixel_font.ttf');

        const image = this.add.image(this.cameras.main.width / 2, this.cameras.main.height / 2, 'loading_screen');
        const scaleX = this.cameras.main.width / image.width;
        const scaleY = this.cameras.main.height / image.height;
        const scale = Math.max(scaleX, scaleY);
        image.setScale(scale).setScrollFactor(0);

        this.loadingbar_bg = this.add.sprite(1920 / 2, 1080 / 2, 'loadingbar_bg').setScale(2);
        this.loadingbar_fill = this.add.sprite(1920 / 2, 1080 / 2, 'loadingbar_fill').setScale(2);
        this.setPreloadSprite(this.loadingbar_fill);

        // backgrounds
        // menu
        this.load.image('bg_menu1', 'assets/bg/bg_menu1.png');
        this.load.image('bg_menu2', 'assets/bg/bg_menu2.png');
        // level 1
        this.load.image('bg_level1_1', 'assets/bg/bg_level1_1.png');
        this.load.image('bg_level1_2', 'assets/bg/bg_level1_2.png');
        this.load.image('bg_level1_3', 'assets/bg/bg_level1_3.png');
        this.load.image('bg_level1_4', 'assets/bg/bg_level1_4.png');

        // images
        this.load.image('logo', 'assets/img/logo.png');
        this.load.image('credits_bg', 'assets/img/credits_bg.png');
        this.load.image('gameOver', 'assets/img/game_over.png');
        this.load.image('victory', 'assets/img/victory.png');
        this.load.image('torpedo', 'assets/img/torpedo.png');
        this.load.image('bomb', 'assets/img/bomb.png');
        this.load.image('mine', 'assets/img/mine-big.png');
        this.load.image('click_screen', 'assets/img/click_screen.png');
        this.load.image('metalTexture', 'assets/img/metalTexture.png');

        // icons
        this.load.image('torpedoIcon', 'assets/icn/torpedoIcon.png');
        this.load.image('o2Icon', 'assets/icn/o2Icon.png');
        this.load.image('skullIcon', 'assets/icn/skullIcon.png');
        this.load.image('timeIcon', 'assets/icn/timeIcon.png');
        this.load.image('bombIcon', 'assets/icn/bombIcon.png');

        // atlases and spritesheets (for animations)
        this.load.atlas('sprites', 'assets/sprt/spritearray.png', 'assets/sprt/spritearray.json');
        this.load.atlas('buttons', 'assets/sprt/buttons.png', 'assets/sprt/buttons.json');
        this.load.atlas('lifeIcons', 'assets/sprt/lifeIcons.png', 'assets/sprt/lifeIcons.json');
        this.load.atlas('diverIcons', 'assets/sprt/diverIcons.png', 'assets/sprt/diverIcons.json');

        this.load.spritesheet('player', 'assets/sprt/yellow_submarine.png', { frameWidth: 200, frameHeight: 70 });
        this.load.spritesheet('monster3', 'assets/sprt/monster3.png', { frameWidth: 54, frameHeight: 49 });


        this.load.spritesheet('diver', 'assets/sprt/diver.png', { frameWidth: 80, frameHeight: 80 });
        this.load.spritesheet('diver-death', 'assets/sprt/diver-death.png', { frameWidth: 52, frameHeight: 53 });
        this.load.spritesheet('explosion-big', 'assets/sprt/explosion-big.png', { frameWidth: 78, frameHeight: 87 });

        // music and sound effects
        this.load.audio('coin', ['assets/snd/coin.mp3', 'assets/snd/coin.ogg']);
        this.load.audio('expl', ['assets/snd/expl.mp3', 'assets/snd/expl.ogg']);
        this.load.audio('button', ['assets/snd/button.mp3', 'assets/snd/button.ogg']);
        this.load.audio('lose', 'assets/snd/lose.mp3');
        this.load.audio('win', 'assets/snd/win.mp3');
        this.load.audio('menu_theme', 'assets/snd/menu_theme.mp3');
        this.load.audio('level1_theme', 'assets/snd/level1_theme.mp3');
        this.load.audio('utilities_theme', 'assets/snd/utilities_theme.mp3');
    }

    create() {
        this.anims.create({
            key: 'player_animation',
            frames: this.anims.generateFrameNumbers('player'),
            frameRate: 5,
            repeat: -1
        });
        this.anims.create({
            key: 'monster3',
            frames: this.anims.generateFrameNumbers('monster3'),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: 'diver',
            frames: this.anims.generateFrameNumbers('diver'),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: 'explosion-big',
            frames: this.anims.generateFrameNumbers('explosion-big'),
            frameRate: 20,
            repeat: 0,
            hideOnComplete: true
        });
        this.anims.create({
            key: 'diver-death',
            frames: this.anims.generateFrameNumbers('diver-death'),
            frameRate: 10,
            repeat: 0,
            hideOnComplete: true
        });

        this.loadingbar_bg.destroy();
        this.loadingbar_fill.destroy();
        this.preloadSprite = null;

        this.scene.start('clickscene');
    }
}