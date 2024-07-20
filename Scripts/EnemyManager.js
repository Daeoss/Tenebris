import Enemy from "./Enemy.js";

export function calculateDamage(enemy, scene) {
    let matches = 0;
    let armorTypesTemp = [...enemy.armorTypes]; //Create a copy of the enemy's armor types
    scene.spellsStorage.forEach((spell, i) => { //Loop over the selected spells
        if(armorTypesTemp.includes(spell.name)) {
            matches++;
            var index = armorTypesTemp.indexOf(spell.name);
            armorTypesTemp.splice(index, 1); //Delete the current type of armor from the temporary array in order to avoid reiterating over it and adding additional damage
        }
    });
    return matches;
}

export function spawnEnemy() {
    const spawnSide = Phaser.Math.Between(0,3);
    let worldWidth = this.physics.world.bounds.width;
    let worldHeight = this.physics.world.bounds.height;
    let x,y;

    switch(spawnSide) {
        case 0: // top
            x = Phaser.Math.Between(0,worldWidth);
            y = -50;
            break;
        case 1: //right
            x = worldWidth + 50;
            y = Phaser.Math.Between(0, worldHeight);
            break;
        case 2: //bottom
            x = Phaser.Math.Between(0, worldWidth);
            y = worldHeight + 50;
            break;
        case 3: //left
            x = -50;
            y = Phaser.Math.Between(0, worldHeight);
            break;
        default:
            break;
    }

    let enemy = new Enemy(this, x, y, 'flying-shadow');
    //addArmorIndicators(enemy.armorTypes);
    this.enemiesGroup.add(enemy);
}

export function killEnemy(spell, enemy) {
    let damage = calculateDamage(enemy, this);
    enemy.health -= damage;
    if(enemy.health <= 0) {
        enemy.destroy();
        this.score++;
        this.scoreText.setText('Score: ' + this.score);    
    }
    spell.destroy();
}

export function aiMovement(scene, player) {
    scene.enemiesGroup.getChildren().forEach((enemy) => {
        // Enemy follows the player
        scene.physics.moveToObject(enemy, player, 100);
    });
}

export function addArmorIndicators(armorTypes) {
    armorTypes.forEach((type, i) => {
        if(!spell.image) {
            spell.image = scene.add.image(0,0,spell.imageName);
            spell.image.setScrollFactor(0);
            spell.image.setDepth(0);
        }

        spell.image.x = slot.x;
        spell.image.y = slot.y;
        spell.image.setVisible(true);
        spell.image.setScale(3);
    });
}