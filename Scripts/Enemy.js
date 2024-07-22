export default class Enemy extends Phaser.Physics.Arcade.Sprite {
    static MAX_ARMORS = 2;
    constructor(scene, x, y, texture) {
        //Scene setup
        super(scene, x, y, texture);
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.setCollideWorldBounds(true);
        //Armor setup
        this.allArmorTypes = [
            { name: 'fire', imageName: 'fireUI' },
            { name: 'water', imageName: 'waterUI' },
            { name: 'air', imageName: 'airUI' },
            { name: 'earth', imageName: 'earthUI' },
        ];
        this.armorTypes = this.pickArmorTypes(this.allArmorTypes);
        //Attributes setup
        this.health = this.armorTypes.length;
        scene.enemiesGroup.add(this);
    }

    pickArmorTypes(armorTypes) {
        const numOfArmors = Phaser.Math.Between(1,Enemy.MAX_ARMORS);
        const shuffled = Phaser.Utils.Array.Shuffle(armorTypes);
        return shuffled.slice(0, numOfArmors);
    }
}