export default class Tutorial extends Phaser.Scene {
    constructor() {
        super({ key: 'Tutorial' });
    }

    preload() {
        //Images
        this.load.image('tutorial', '../Assets/Media/Finished/tutorial.png');
    }

    create() {
        //Sound effects
        this.soundEffects = [];
        this.addSound('hoverOverButton', 0.5);
        this.soundEffects['pressButton'] = this.sound.add('pressButton');

        //Add background image for menu
        this.add.image(400,300, 'tutorial');

        // Create the 'Return' button
        this.setUpButton(100,105,'<', () => {
            this.goBack();
        }, {x:1, y:1});

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

    goBack() {
        // Switch to the Game Scene
        this.scene.start('StartMenu');
    }

    setUpButton(x, y, text, callback, scale = {x:2, y:2}) {
        const button = this.add.sprite(x, y, 'buttonNormal')
        .setScale(scale.x, scale.y)
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
