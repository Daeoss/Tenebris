export default class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture) {
        super(scene, x, y, texture);
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.body.setSize(this.width*0.5, this.height);
        this.setCollideWorldBounds(true);
        this.body.setAccelerationY(1000);
        this.speed = 200;
        this.gravity = -360;
        this.isShielded = false;
        this.shield = scene.add.image(0,0, 'player-shield');
        this.shield.setVisible(false);
        this.facing = 'right';
        this.setPipeline("Light2D");
    }

    Movement(cursors) {
        if (cursors.left.isDown)
        {
            this.setVelocityX(-this.speed);
            this.anims.play('left', true);
            this.facing = 'right';
        }
        else if (cursors.right.isDown)
        {
            this.setVelocityX(this.speed);
            this.anims.play('right', true);
            this.facing = 'left';
        }
        else
        {
            this.setVelocityX(0);
            if(this.body.velocity.y < 0) {
                this.anims.play('jump_up', true);
            }else if(this.body.velocity.y > 0){
                this.anims.play('jump_down', true);
            }else{
                this.anims.play('turn', true);
            }
        }
        if ((cursors.up.isDown || cursors.space.isDown) && this.body.blocked.down)
        {
            this.scene.soundEffects['jump'].play();
            this.setVelocityY(-650);
        }

        // Handle down cursor key
        if (cursors.down.isDown) {
            this.body.setAllowGravity(false);
            this.canPassThrough = true; 
        } else {
            this.body.setAllowGravity(true);
            this.canPassThrough = false;
        }

        if(this.canPassThrough) {
            this.scene.platforms.forEachTile((tile) => {
                tile.collideUp = false;
            });
        }else{
            this.scene.platforms.forEachTile((tile) => {
                tile.collideUp = true;
            });
        }
        
        //Follow the player
        this.scene.playerLight.setPosition(this.x, this.y);
        this.shield.setPosition(this.x, this.y);
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