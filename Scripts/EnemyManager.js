import Enemy from "./Enemy.js";

export function calculateDamage(enemy, scene) {
    let matches = 0;
    let armorTypesTemp = [...enemy.armorTypes]; //Create a copy of the enemy's armor types
    scene.spellsStorage.forEach((spell, i) => { // Loop over the selected spells
        // Find the index of the spell name in the armorTypesTemp array
        let index = armorTypesTemp.findIndex(armor => armor.name === spell.name);

        if (index !== -1) {
            matches++;
            armorTypesTemp.splice(index, 1); // Delete the matched armor type from the temporary array
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
    addArmorIndicators(this, enemy.armorTypes, enemy);
}

export function killEnemy(spell, enemy) {
    let damage = calculateDamage(enemy, this);
    enemy.health -= damage;

    if(enemy.health <= 0) {
        //Remove the armor UI
        if (enemy.armorIndicators) {
            enemy.armorIndicators.forEach((indicator) => {
                indicator.image.destroy();
                indicator.imagePlaceholder.destroy();
            });
        }
        //Kill the enemy
        enemy.destroy();
        //Set score
        this.score++;
        this.scoreText.setText('Score: ' + this.score);    
    }
    //On hit blood particles
    
    //Spell particles
    spell.particles.stop();
    spell.particles.destroy();
    spell.destroy();
}

export function aiMovement(scene, player) {
    scene.enemiesGroup.getChildren().forEach((enemy) => {
        // Enemy follows the player
        scene.physics.moveToObject(enemy, player, enemy.speed);

        if (enemy.armorIndicators) {
            let offset = -25;
            enemy.armorIndicators.forEach((indicator) => {
                indicator.image.setPosition(enemy.x + offset, enemy.y - 30).setScale(0.7);
                indicator.imagePlaceholder.setPosition(enemy.x + offset, enemy.y - 30).setScale(0.7);
                offset += 25;
            });
        }
    });
}

export function addArmorIndicators(scene, armorTypes, enemy) {
    enemy.armorIndicators = [];
    armorTypes.forEach((type, i) => {
        if(!type.image) {
            type.imagePlaceholder = scene.add.image(0,0,'spell-holder');
            type.image = scene.add.image(0,0,type.imageName);
        }
        enemy.armorIndicators.push({image: type.image, imagePlaceholder: type.imagePlaceholder});
    });
}

export function scheduleNextWave(scene) {
    if(scene.currentWaveIndex < scene.waves.length) {
        let wave = scene.waves[scene.currentWaveIndex];
        scene.time.delayedCall(wave.time, () => {
            spawnWave(scene, wave);
            scene.currentWaveIndex++;
            scheduleNextWave(scene);
        });
    }
}

export function spawnWave(scene, wave) {
    wave.enemies.forEach((info) => {
        for(let i = 0; i<info.count; i++) {
            scene.time.addEvent({
                delay: info.interval * i,
                callback: spawnEnemy,
                callbackScope: scene,
            });
        }
    });
}