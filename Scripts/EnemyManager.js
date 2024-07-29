import Enemy from "./Enemy.js";

export default class EnemyManager {
    constructor(scene) {
        this.scene = scene;
        this.waves  = [
            {
                title:'wave1',
                time: 1000,
                enemies: [
                    { type: 'flying', count:100, interval: 1000 }
                ],
            },
            {
                title:'wave2', 
                time: 5000,
                enemies: [
                    { type: 'flying', count:1, interval: 1000 }
                ],
            },
            {
                title:'wave3', 
                time: 25000,
                enemies: [
                    {  type: 'flying', count:1, interval: 500 }
                ],
            },
            {
                title:'wave4', 
                time: 50000,
                enemies: [
                    {  type: 'flying', count:1, interval: 2000 }
                ],
            },
        ]
    }

    calculateDamage(enemy) {
        let matches = 0;
        let armorTypesTemp = [...enemy.armorTypes]; //Create a copy of the enemy's armor types
        this.scene.spellsStorage.forEach((spell, i) => { // Loop over the selected spells
            // Find the index of the spell name in the armorTypesTemp array
            let index = armorTypesTemp.findIndex(armor => armor.name === spell.name);
    
            if (index !== -1) {
                matches++;
                armorTypesTemp.splice(index, 1); // Delete the matched armor type from the temporary array
            }
        });
        return matches;
    }
    
    spawnEnemy() {
        const spawnSide = Phaser.Math.Between(0,3);
        let worldWidth = this.scene.physics.world.bounds.width;
        let worldHeight = this.scene.physics.world.bounds.height;
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
    
        let enemy = new Enemy(this.scene, x, y, 'flying-shadow');
        this.addArmorIndicators(this.scene, enemy.armorTypes, enemy);
    }
    
    killEnemy(spell, enemy) {
        let damage = this.calculateDamage(enemy);
        enemy.health -= damage;
    
        if(enemy.health <= 0) {
            //Remove the armor UI
            if (enemy.armorIndicators) {
                enemy.armorIndicators.forEach((indicator) => {
                    indicator.image.destroy();
                    indicator.imagePlaceholder.destroy();
                });
            }
            //On death blood particles
            this.bloodParticles(enemy);
            //Kill the enemy
            enemy.destroy();
            //Set score
            this.scene.score++;
            this.scene.scoreText.setText('Score: ' + this.scene.score);    
        }
    
        //Spell particles
        spell.particles.stop();
        spell.particles.destroy();
        spell.destroy();
    }
    
    aiMovement(scene, player) {
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
    
    addArmorIndicators(scene, armorTypes, enemy) {
        enemy.armorIndicators = [];
        armorTypes.forEach((type, i) => {
            if(!type.image) {
                type.imagePlaceholder = scene.add.image(0,0,'spell-holder');
                type.image = scene.add.image(0,0,type.imageName);
            }
            enemy.armorIndicators.push({image: type.image, imagePlaceholder: type.imagePlaceholder});
        });
    }
    
    scheduleNextWave(scene) {
        if(scene.currentWaveIndex < this.waves.length) {
            let wave = this.waves[scene.currentWaveIndex];
            scene.time.delayedCall(wave.time, () => {
                this.spawnWave(scene, wave);
                scene.currentWaveIndex++;
                this.scheduleNextWave(scene);
            });
        }
    }

    spawnWave(scene, wave) {
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
}

