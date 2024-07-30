import Enemy from "./Enemy.js";

export default class EnemyManager {
    constructor(scene) {
        this.scene = scene;
        this.waves  = [
            {
                title:'wave1',
                time: 100,
                enemies: [
                    { type: 'flying', count:100, interval: 1250 }
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
        const spawnSide = Phaser.Math.Between(0,2);
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
            // case 2: //bottom
            //     x = Phaser.Math.Between(0, worldWidth);
            //     y = worldHeight + 50;
            //     break;
            case 2: //left
                x = -50;
                y = Phaser.Math.Between(0, worldHeight);
                break;
            default:
                break;
        }
    
        let enemy = new Enemy(this.scene, x, y, 'enemy');
        enemy.setPipeline("Light2D");
        enemy.light = this.scene.lights.addLight(0,0, 75, 0x000000, 1);
        this.scene.lightManager.changeColor(enemy.light, 0.353, 0.231, 0.172);
        this.addArmorIndicators(this.scene, enemy.armorTypes, enemy);
    }
    
    killEnemy(spell, enemy) {
        let damage = this.calculateDamage(enemy);
        enemy.health -= damage;
        enemy.setTint(0xff0000);
        this.scene.time.delayedCall(100, () => {
            enemy.clearTint();
        });
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
            this.scene.lights.removeLight(enemy.light);
            //Kill the enemy
            enemy.destroy();

            this.playSound();
            //Set score
            this.scene.deathsScore++;
            this.scene.killsText.setText('x' + this.scene.deathsScore);    
        }
    
        //Spell particles
        spell.particles.stop();
        spell.particles.destroy();
        this.scene.lights.removeLight(spell.light);
        spell.destroy();
    }
    
    aiMovement(scene, player) {
        scene.enemiesGroup.getChildren().forEach((enemy) => {
            // Enemy follows the player
            scene.physics.moveToObject(enemy, player, enemy.speed);
    
            //Add armor indicator
            if (enemy.armorIndicators) {
                let offset = -25;
                enemy.armorIndicators.forEach((indicator) => {
                    indicator.image.setPosition(enemy.x + offset, enemy.y - 30).setScale(0.7);
                    indicator.imagePlaceholder.setPosition(enemy.x + offset, enemy.y - 30).setScale(0.7);
                    offset += 25;
                });
            }

            //Flip to look at player
            if(enemy) {
                if (player.x < enemy.x) {
                    enemy.setFlipX(true);
                } else {
                    enemy.setFlipX(false);
                }
            }
            
            enemy.light.setPosition(enemy.x, enemy.y);
        });
    }
    
    addArmorIndicators(scene, armorTypes, enemy) {
        enemy.armorIndicators = [];
        armorTypes.forEach((type, i) => {
            if(!type.image) {
                type.imagePlaceholder = scene.add.image(0,0,'spell-holder');
                type.imagePlaceholder.setPipeline("Light2D");
                type.image = scene.add.image(0,0,type.imageName);
                type.image.setPipeline("Light2D");
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
                    callback: this.spawnEnemy.bind(this),
                });
            }
        });
    }

    bloodParticles(enemy) {
        let bloodParticle = this.scene.add.particles(0, 0, 'bloodParticle', {
            speed: 200,
            scale: {start:1, end:0},
            blendMode: 'NORMAL',
        });
        bloodParticle.explode(30, enemy.x, enemy.y);
    }

    playSound() {
        let soundInstance = this.scene.soundEffects['enemyDeathPool'].find(s => !s.isPlaying);
        if(!soundInstance) {
            soundInstance = this.scene.soundEffects['enemyDeathPool'][0];
            soundInstance.stop();
        }
        soundInstance.play();
    }
}

