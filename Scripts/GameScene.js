import * as Setup from './Setup.js';
import Player from './Player.js';
import PowerUpsManager from './PowerUpsManager.js';
import SpellManager from './SpellManager.js';
import EnemyManager from './EnemyManager.js';
import LightsManager from './LightsManager.js';

var cam, background, cursors;

export default class GameScene extends Phaser.Scene
{
    static BOUNDS_X = 2560;
    static BOUNDS_Y = 1440;

    constructor() {
        super({key: 'GameScene'});
        this.highscore = 0;
    }
    preload ()
    {
        this.loadVariables();
        this.loadImages();
    }

    create (data)
    {
        //Music
        data.music.volume = 0.05;
        //Sound effects
        this.soundEffects['jump'] = this.sound.add("jump");
        this.soundEffects['jump'].volume = 0.5;

        this.soundEffects['powerUp'] = this.sound.add("powerUp");
        this.soundEffects['powerUp'].volume = 0.1;

        this.addSound('selectSpell', 0.1);
        this.addSound('attack', 0.05);
        this.addSound('enemyDeath', 0.3);

        //Lights
        this.lightManager = new LightsManager(this);
        this.playerLight = this.lights.addLight(0,0, 200, 0x000000, 1.5);
        this.lightManager.changeColor(this.playerLight, 1, 0.874, 0.729);

        //Animations
        Setup.setUpAnimations(this);

        //Camera
        cam = this.cameras.main;
        cam.setBounds(0,0,GameScene.BOUNDS_X, GameScene.BOUNDS_Y);

        //Enviorment
        background = this.add.tileSprite(400,300,cam.width,cam.height, 'behind');
        background.setScrollFactor(0); //keeps moving with the camera
        background.setPipeline("Light2D");

        //Tilemap
        const map = this.make.tilemap({key: 'map'});
        const tileset = map.addTilesetImage('mainTileset', 'tiles');

        //Platforms
        Setup.setUpPlatforms(this, map, tileset);

        //Ground
        this.grounds = map.createLayer("Ground", tileset, 0, 0);
        this.grounds.setCollisionByProperty({collides: true});
        this.grounds.setPipeline("Light2D");

        //Power-ups
        this.powerUpsManager = new PowerUpsManager(this);
        this.powerUpsGroup = this.physics.add.staticGroup();
        this.powerUpsManager.spawnPowerUps(map);

        //Bonuses
        this.bonusGroup = this.physics.add.staticGroup();
        this.powerUpsManager.spawnBonus(map);
        
        //Player
        this.player = new Player(this, 1280, 1300, 'mainCharacter');

        //Wand
        this.wand = this.physics.add.sprite(this.player.x, this.player.y, 'wand');
        this.wand.setOrigin(0.5,1);
        this.wand.body.setAllowGravity(false);

        //Spells
        this.spellManager = new SpellManager(this);
        this.spellManager.startAutoShoot();

        this.spells = this.physics.add.group({
            defaultKey: 'fire'
        })

        //Enemy
        this.enemyManager = new EnemyManager(this);
        // Create a group for enemies
        this.enemiesGroup = this.physics.add.group();
        //Spawn enemies in waves
        this.enemyManager.scheduleNextWave(this);

        //Mouse set-up
        this.input.on('pointerdown', (pointer) => {
            if (pointer.leftButtonDown()) {
                this.leftMouseJustDown = true;
            }

            if (pointer.rightButtonDown()) {
                this.rightMouseJustDown = true;
            }
        }, this);

        //Physics
        this.physics.world.setBounds(0,0,GameScene.BOUNDS_X, GameScene.BOUNDS_Y);

        //Collision with platforms
        this.addColliders();

        //Keyboard keys
        cursors = Setup.setUpKeyboardControls(this);

        //Camera movement
        cam.startFollow(this.player);

        /************
        * IMPORTANT
        * 
        * The on screen UI needs to be the last one
        */

        Setup.setUpUI(this);
    }

    update () 
    {
        //Game over
        if(this.isGameOver == true) {
            //return;
        }

        //Movement
        this.player.Movement(cursors);

        //Enemy movement
        this.enemyManager.aiMovement(this, this.player);

        //Spell selection
        //Rune N
        if (Phaser.Input.Keyboard.JustDown(cursors.firstSpell)) {
            this.spellManager.addSpellToSlot(this, 'fire', 'rune_n');
            this.playSound('selectSpellPool');
        }

        //Rune Y
        if (Phaser.Input.Keyboard.JustDown(cursors.secondSpell)) {
            this.spellManager.addSpellToSlot(this, 'water', 'rune_y');
            this.playSound('selectSpellPool');
        }

        //Rune X
        if(this.leftMouseJustDown == true) {
            this.spellManager.addSpellToSlot(this, 'air', 'rune_x');
            this.playSound('selectSpellPool');
            this.leftMouseJustDown = false; // Only click for 1 frame
        }

        //Rune T
        if(this.rightMouseJustDown == true) {
            this.spellManager.addSpellToSlot(this, 'earth', 'rune_t');
            this.playSound('selectSpellPool');
            this.rightMouseJustDown = false; // Only click for 1 frame
        }

        //Wand sticks to player
        this.player.AttachWandToPlayerAndRotate(this);


        if(this.spells.getChildren().length > 0) {
            this.spells.getChildren().forEach((spell) => {
                spell.light.setPosition(spell.x, spell.y);
            });
        }
        
        //Remove spells from world if out of bounds
        this.spellManager.removeSpellIfOutOfBounds(this, GameScene.BOUNDS_X, GameScene.BOUNDS_Y);
        
        //Background movement with the player
        background.tilePositionX = cam.scrollX;
        //background.tilePositionY = cam.scrollY;
    }

    gameOver(player,enemy) {
        if(!player.isShielded) {
            this.isGameOver = true;
            this.score = this.deathsScore + (this.starScore * 500);
            if(this.score > this.highscore) {
                this.highscore = this.score;
            }
            this.scene.start("EndGameScene", {score: this.score, highscore: this.highscore});
        }
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

    addColliders() {
        this.physics.add.collider(this.player, this.platforms);
        //this.physics.add.collider(this.enemiesGroup, this.platforms);

        //Collision with ground
        this.physics.add.collider(this.player, this.grounds);
        //this.physics.add.collider(this.enemiesGroup, grounds);

        //Player-Enemy collision
        this.physics.add.collider(this.player,this.enemiesGroup, this.gameOver, null, this);

        //Spell-Enemy collision
        this.physics.add.collider(this.spells, this.enemiesGroup, this.enemyManager.killEnemy.bind(this.enemyManager));

        //Power-ups collision
        this.physics.add.overlap(this.player, this.powerUpsGroup, this.powerUpsManager.powerUpPickup.bind(this.powerUpsManager), null, this);
        
        //Bonus collision
        this.physics.add.overlap(this.player, this.bonusGroup, this.powerUpsManager.addBonus, null, this.powerUpsManager);
    }

    loadVariables() {
        this.score = 0;
        this.starScore = 0;
        this.deathsScore = 0;
        this.currentWaveIndex = 0;

        this.player = null;
        this.playerLight = null;
        this.enemiesGroup = null;
        this.powerUpsGroup = null;
        this.bonusGroup = null;
        this.wand = null;
        this.spells = null;
        this.spellManager = null;
        this.powerUpsManager = null;
        this.enemyManager = null;
        this.scoreText = null;
        this.starText = null;
        this.killsText = null;
        this.grounds = null;
        this.platforms = null;
        this.bgMusic = null;
        this.LightsManager = null;
        this.soundEffects = [];
        this.isGameOver = false;
        this.leftMouseJustDown = false;
        this.rightMouseJustDown = false;
        this.spellsStorage = [];
        this.spellHolders = {
            0: {x:350,y:50}, 
            1: {x:450,y:50},
        };
    }

    loadImages() {
        //Images
        this.load.image('sky', 'Assets/Media/Finished/sky.png');
        this.load.image('behind', 'Assets/Media/Finished/behind.png');
        this.load.image('ground', 'Assets/Media/Finished/platform.png');
        this.load.image('star', 'Assets/Media/Finished/star.png');
        this.load.image('bomb', 'Assets/Media/Finished/bomb.png');
        this.load.image('shadow', 'Assets/Media/Finished/Shadow.png');
        this.load.image('flying-shadow', 'Assets/Media/Finished/FlyingShadow.png');
        this.load.image('wand', 'Assets/Media/Finished/wand.png');
        this.load.image('fire', 'Assets/Media/Finished/fire.png');
        this.load.image('rune_n', 'Assets/Media/Finished/rune_n.png');
        this.load.image('rune_y', 'Assets/Media/Finished/rune_y.png');
        this.load.image('rune_x', 'Assets/Media/Finished/rune_x.png');
        this.load.image('rune_t', 'Assets/Media/Finished/rune_t.png');
        this.load.image('spell-holder', 'Assets/Media/Finished/spell-holder.png');
        this.load.image('bullet-icon', 'Assets/Media/Finished/bullet-icon.png');
        this.load.image('speed-icon', 'Assets/Media/Finished/speed-icon.png');
        this.load.image('shield-icon', 'Assets/Media/Finished/shield-icon.png');
        this.load.image('freeze-icon', 'Assets/Media/Finished/freeze-icon.png');
        this.load.image('skull-icon', 'Assets/Media/Finished/skull-icon.png');
        this.load.image('star-icon', 'Assets/Media/Finished/star-icon.png');
        
        this.load.image('player-shield', 'Assets/Media/Finished/player-shield.png');
        this.load.image('particle', 'Assets/Media/Finished/particle.png');
        this.load.image('bloodParticle', 'Assets/Media/Finished/bloodParticle.png');
        //Sprites
        this.load.spritesheet('mainCharacter', 'Assets/Media/Finished/mainCharacter.png', { frameWidth: 32, frameHeight: 48 });
        this.load.spritesheet('shootEffect', 'Assets/Media/Finished/shootEffect.png', { frameWidth: 16, frameHeight: 16 });
        this.load.spritesheet('bonus-icon', 'Assets/Media/Finished/bonus-icon.png', { frameWidth: 48, frameHeight: 48 });
        this.load.spritesheet('enemy', 'Assets/Media/Finished/enemy.png', { frameWidth: 128, frameHeight: 128 });
        //Map
        this.load.image("tiles", "Assets/Media/Finished/tileset.png");
        this.load.tilemapTiledJSON("map", "Assets/Tiles/mainTileset.json");
        //Sound
        this.load.audio("selectSpell", "../Assets/Sounds/Effects/selectSpell.wav");
        this.load.audio("attack", "../Assets/Sounds/Effects/attack.wav");
        this.load.audio("enemyDeath", "../Assets/Sounds/Effects/enemyDeath.wav");
        this.load.audio("jump", "../Assets/Sounds/Effects/jump.wav");
        this.load.audio("powerUp", "../Assets/Sounds/Effects/powerUp.wav");
        this.load.audio("bonus", "../Assets/Sounds/Effects/bonus.wav");
    }
}