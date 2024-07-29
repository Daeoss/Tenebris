import GameScene from '../Scripts/GameScene.js';

export default class EndGameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'EndGameScene' });
    }

    preload() {
        this.load.image('EndGameScreen', '../Assets/Media/Finished/EndGameScreen.png');
        this.load.image('buttonNormal', '../Assets/Media/Finished/buttonNormal.png');
        this.load.image('buttonHover', '../Assets/Media/Finished/buttonHover.png');
        this.load.image('buttonPressed', '../Assets/Media/Finished/buttonPressed.png');
    }

    create(data) {

        //Background
        this.add.image(400,300, 'EndGameScreen');

        //Create highscore text
        const highscore = data.highscore;
        const highscoreText = this.add.text(400, 200, 'Highscore: ' + highscore, { fontSize: '64px', fill: '#fff' }).setOrigin(0.5);

        //Create score text
        const score = data.score;
        const scoreText = this.add.text(400, 250, 'Score: ' + score, { fontSize: '32px', fill: '#fff' }).setOrigin(0.5);

        // Create the 'Replay' button
        this.setUpButton(400,375,'Replay',2.5, () => {
            this.restartGame();
        });
    }

    restartGame() {
        this.scene.stop('EndGameScene');
        this.scene.launch('GameScene');
    }

    quitGame() {
        // Quit the game (if in a browser, reload or redirect)
        window.close(); // May not always work in some browsers; consider window.location.href or window.history.back()
    }

    setUpButton(x, y, text, scale, callback) {
        const button = this.add.sprite(x, y, 'buttonNormal')
        .setScale(scale)
        .setInteractive()
        .on('pointerover', () => button.setTexture('buttonHover'))
        .on('pointerout', () => button.setTexture('buttonNormal'))
        .on('pointerdown', () => button.setTexture('buttonPressed'))
        .on('pointerup', () => {
            button.setTexture('buttonHover');
            if(callback) {
                callback();
            }
        });
        const buttonText = this.add.text(x, y, text, { fontSize: '32px', fill: '#fff' })
            .setOrigin(0.5)
    }
}