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
    scene.anims.create({
        key: 'left',
        frames: scene.anims.generateFrameNumbers('mainCharacter', { start: 0, end: 3 }),
        frameRate: 10,
        repeat: -1
    });

    scene.anims.create({
        key: 'turn',
        frames: scene.anims.generateFrameNumbers('mainCharacter', { start: 4, end: 5 }),
        frameRate: 5,
        repeat: -1
    });

    scene.anims.create({
        key: 'jump_up',
        frames: [ { key: 'mainCharacter', frame: 6 } ],
        frameRate: 20
    });

    scene.anims.create({
        key: 'jump_down',
        frames: [ { key: 'mainCharacter', frame: 7 } ],
        frameRate: 20
    });

    scene.anims.create( {
        key: 'right',
        frames: scene.anims.generateFrameNumbers('mainCharacter', {start:8, end:11}),
        frameRate: 10,
        repeat: -1
    });
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
        var sh = scene.add.image(x, y, 'spell-holder').setScale(3);
        sh.setDepth(1);
        sh.setScrollFactor(0);
    }
}