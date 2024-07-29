export function setUpKeyboardControls(scene) {
    var cursors = scene.input.keyboard.addKeys({
        'left': Phaser.Input.Keyboard.KeyCodes.A,
        'up': Phaser.Input.Keyboard.KeyCodes.W,
        'right': Phaser.Input.Keyboard.KeyCodes.D,
        'down': Phaser.Input.Keyboard.KeyCodes.S,
        'firstSpell': Phaser.Input.Keyboard.KeyCodes.Q,
        'secondSpell': Phaser.Input.Keyboard.KeyCodes.E,
    });
    return cursors;
}

export function setUpAnimations(scene) {
    if(!scene.anims.exists('left')) {
        scene.anims.create({
            key: 'left',
            frames: scene.anims.generateFrameNumbers('mainCharacter', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        });
    }

    if(!scene.anims.exists('turn')) {
        scene.anims.create({
            key: 'turn',
            frames: scene.anims.generateFrameNumbers('mainCharacter', { start: 4, end: 5 }),
            frameRate: 3,
            repeat: -1
        });
    }

    if(!scene.anims.exists('jump_up')) {
        scene.anims.create({
            key: 'jump_up',
            frames: [ { key: 'mainCharacter', frame: 6 } ],
            frameRate: 20
        });
    }

    if(!scene.anims.exists('jump_down')) {
        scene.anims.create({
            key: 'jump_down',
            frames: [ { key: 'mainCharacter', frame: 7 } ],
            frameRate: 20
        });
    }

    if(!scene.anims.exists('right')) {
        scene.anims.create( {
            key: 'right',
            frames: scene.anims.generateFrameNumbers('mainCharacter', {start:8, end:11}),
            frameRate: 10,
            repeat: -1
        });
    }

    // scene.anims.create({
    //     key: 'shoot',
    //     frames: scene.anims.generateFrameNumbers('shootEffect', {start:0, end:4}),
    //     frameRate: 30,
    //     repeat: 0,
    //     onComplete: function() {
    //         this.sprite.setFrame(0);
    //     }
    // })
}

export function setUpPlatforms(scene, map, tileset) {
    scene.platforms = map.createLayer("Platforms", tileset, 0, 0);
    scene.platforms.setCollisionByProperty({collides: true});
    //Pass through platforms
    scene.platforms.forEachTile((tile) => {
        if(tile.collides) {
            tile.collideDown = false;
            tile.collideLeft = false;
            tile.collideRight = false;
        }
    });
}

export function setUpUI(scene) {
    for(let holder in scene.spellHolders) {
        let x = scene.spellHolders[holder].x;
        let y = scene.spellHolders[holder].y;
        var sh = scene.add.image(x, y, 'spell-holder').setScale(2);
        //sh.setDepth(1);
        sh.setScrollFactor(0);
    }
}