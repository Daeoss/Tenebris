export default class StartMenu extends Phaser.Scene {
    constructor() {
        super({ key: 'StartMenu' });
    }

    preload() {
        this.load.image('title', '../Assets/Media/Finished/title.png');
        this.load.image('buttonNormal', '../Assets/Media/Finished/buttonNormal.png');
        this.load.image('buttonHover', '../Assets/Media/Finished/buttonHover.png');
        this.load.image('buttonPressed', '../Assets/Media/Finished/buttonPressed.png');
    }

    create() {

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
    }

    startGame() {
        // Switch to the Game Scene
        this.scene.start('GameScene');
    }

    quitGame() {
        // Quit the game (if in a browser, reload or redirect)
        window.close(); // May not always work in some browsers; consider window.location.href or window.history.back()
    }

    setUpButton(x, y, text, callback) {
        const button = this.add.sprite(x, y, 'buttonNormal')
        .setScale(2)
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
