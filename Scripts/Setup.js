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
        frames: scene.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
        frameRate: 10,
        repeat: -1
    });

    scene.anims.create({
        key: 'turn',
        frames: [ { key: 'dude', frame: 4 } ],
        frameRate: 20
    });

    scene.anims.create( {
        key: 'right',
        frames: scene.anims.generateFrameNumbers('dude', {start:5, end:8}),
        frameRate: 10,
        repeat: -1
    });
}

export function setUpPlatforms(scene) {
    //Platforms
    var platforms = scene.physics.add.staticGroup();
    platforms.create(400,900, 'ground');
    platforms.create(900,700, 'ground');

    //Pass-through platforms
    platforms.getChildren().forEach((platform, index) => {
        platform.body.checkCollision.left = false;
        platform.body.checkCollision.right = false;
        platform.body.checkCollision.down = false;
    });

    return platforms;
}