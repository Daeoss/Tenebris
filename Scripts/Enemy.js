export default class Enemy extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture) {
        super(scene, x, y, texture);
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.setCollideWorldBounds(true);
        this.armorTypes = [
            {
                name: 'fire',
                imageName: 'fireUI'
            },
            {
                name: 'water',
                imageName: 'waterUI'
            },
            {
                name: 'fire',
                imageName: 'fireUI'
            },
        ];
        this.health = this.armorTypes.length;
    }
}