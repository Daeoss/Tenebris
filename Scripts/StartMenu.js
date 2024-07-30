export default class StartMenu extends Phaser.Scene {
    constructor() {
        super({ key: 'StartMenu' });
    }

    preload() {
        //Images
        this.load.image('title', '../Assets/Media/Finished/title.png');
        this.load.image('buttonNormal', '../Assets/Media/Finished/buttonNormal.png');
        this.load.image('buttonHover', '../Assets/Media/Finished/buttonHover.png');
        this.load.image('buttonPressed', '../Assets/Media/Finished/buttonPressed.png');
        this.load.image('sound_on', '../Assets/Media/Finished/sound_on.png');
        this.load.image('sound_off', '../Assets/Media/Finished/sound_off.png');

        //Sounds
        this.load.audio("bg-music", "../Assets/Sounds/Music/ThreeRedHearts-DeepBlue.ogg");
        this.load.audio("hoverOverButton", "../Assets/Sounds/Effects/hoverOverButton.wav");
        this.load.audio("pressButton", "../Assets/Sounds/Effects/pressButton.wav");
    }

    create() {
        //Music
        this.bgMusic = this.sound.add("bg-music", {loop: true});
        this.bgMusic.volume = 0.025;
        this.bgMusic.play();

        //Sound effects
        this.soundEffects = [];
        this.addSound('hoverOverButton', 0.5);

        this.soundEffects['pressButton'] = this.sound.add('pressButton');

        //Add background image for menu
        this.add.image(400,300, 'title');

        // Create the 'Play' button
        this.setUpButton(400,375,'Play', () => {
            this.startGame();
        });

        // Create the 'Quit' button
        this.setUpButton(400,450,'Quit', () => {
            this.quitGame();
        });

        //Mute audio
        let isOn = true;
        const button = this.add.sprite(760, 50, 'sound_on')
        .setInteractive()
        .on('pointerup', () => {
            if(isOn) {
                button.setTexture('sound_off');
                this.game.sound.mute = true;
                isOn = false;
            }else{
                button.setTexture('sound_on');
                this.game.sound.mute = false;
                isOn = true;
            }
        });
    }

    startGame() {
        // Switch to the Game Scene
        this.scene.start('GameScene', {music: this.bgMusic});
    }

    quitGame() {
        // Quit the game (if in a browser, reload or redirect)
        window.close(); // May not always work in some browsers; consider window.location.href or window.history.back()
    }

    setUpButton(x, y, text, callback) {
        const button = this.add.sprite(x, y, 'buttonNormal')
        .setScale(2)
        .setInteractive()
        .on('pointerover', () => {
                button.setTexture('buttonHover');
                this.playSound('hoverOverButtonPool');
            }
        ) 
        .on('pointerout', () => button.setTexture('buttonNormal'))
        .on('pointerdown', () => {
                button.setTexture('buttonPressed');
                this.soundEffects['pressButton'].play();
            }
        )
        .on('pointerup', () => {
            button.setTexture('buttonHover');
            if(callback) {
                callback();
            }
        });
        const buttonText = this.add.text(x, y, text, { fontSize: '32px', fill: '#fff' })
            .setOrigin(0.5)
    }

    addSound(name, volume, poolSize = 10, loopBool = false) {
        this.soundEffects[name+'Pool'] = [];
        for(let i = 0; i < poolSize; i++) {
            let sound = this.sound.add(name, {loop: loopBool});
            sound.volume = volume;
            this.soundEffects[name+'Pool'].push(sound);
        }
    }

    playSound(poolName) {
        let soundInstance = this.soundEffects[poolName].find(s => !s.isPlaying);
        if(!soundInstance) {
            soundInstance = this.soundEffects[poolName][0];
            soundInstance.stop();
        }
        soundInstance.play();
    }
}
