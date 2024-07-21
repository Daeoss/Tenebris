export default class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture) {
        super(scene, x, y, texture);
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.setCollideWorldBounds(true);
        this.enemiesKilled = 0;
    }

    Movement(cursors, speed) {
        if (cursors.left.isDown)
        {
            this.setVelocityX(-speed);
            this.anims.play('left', true);
        }
        else if (cursors.right.isDown)
        {
            this.setVelocityX(speed);
            this.anims.play('right', true);
        }
        else
        {
            this.setVelocityX(0);
            this.anims.play('turn');
        }
        if (cursors.up.isDown && this.body.blocked.down)
        {
            this.setVelocityY(-360);
        }
    }

    AttachWandToPlayerAndRotate(scene) {
        scene.wand.setPosition(this.x, this.y);
        // Capture mouse position
        let pointer = scene.input.activePointer;
        let angle = Phaser.Math.Angle.Between(scene.wand.x, scene.wand.y, pointer.worldX, pointer.worldY);
        // Rotate the wand towards the mouse
        scene.wand.rotation = angle;
    }
}