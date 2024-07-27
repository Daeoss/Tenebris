export default class Enemy extends Phaser.Physics.Arcade.Sprite {
    static MAX_ARMORS = 3;
    static idCounter = 0;
    constructor(scene, x, y, texture) {
        //Scene setup
        super(scene, x, y, texture);
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.setCollideWorldBounds(true);
        //Armor setup
        this.allArmorTypes = [
            { name: 'fire', imageName: 'rune_n' },
            { name: 'water', imageName: 'rune_y' },
            { name: 'air', imageName: 'rune_x' },
            { name: 'earth', imageName: 'rune_t' },
        ];
        this.armorTypes = this.pickArmorTypes(this.allArmorTypes);
        //Attributes setup
        this.health = this.armorTypes.length;
        scene.enemiesGroup.add(this);
        this.speed = 100;
    }

    pickArmorTypes(armorTypes) {
        const numOfArmors = Phaser.Math.Between(1,Enemy.MAX_ARMORS);
        const shuffled = Phaser.Utils.Array.Shuffle(armorTypes);
        return shuffled.slice(0, numOfArmors);
    }

    generateUniqueId() {
        return ++Enemy.idCounter;
    }
}