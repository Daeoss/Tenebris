// Import the scene classes
import StartMenu from './Scripts/StartMenu.js';
import GameScene from './Scripts/GameScene.js';
import EndGameScene from './Scripts/EndGameScene.js';

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    scene: [StartMenu, GameScene, EndGameScene],
    pixelArt: true,
    disableContextMenu: true, //Disable right mouse button menu
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false
        }
    }
};

const game = new Phaser.Game(config);

