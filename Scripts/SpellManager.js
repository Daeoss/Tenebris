export default class SpellManager {
    constructor(scene) {
        this.scene = scene;
        this.fireRate = 500;
        this.autoShootEvent = null;
    }

    setFireRate(fireRate) {
        this.fireRate = fireRate;
        if(this.autoShootEvent) {
            this.autoShootEvent.remove();
            this.startAutoShoot();
        }
    }

    startAutoShoot() {
        this.autoShootEvent = this.scene.time.addEvent({
            delay: this.fireRate,
            callback: this.shootSpell,
            callbackScope: this.scene,
            loop: true
        });
    }

    shootSpell() {
    //If we want to add a power-up where shooting multiple bullets is possible
    // for(let i = 0; i < 10; i++) {
        // let startPlace = Phaser.Math.Between(0,60);

        let pointer = this.input.activePointer;
        let spell = this.spells.get(this.wand.x, this.wand.y-this.wand.height);
        if(spell) {
            // spell.body.setAllowGravity(false);
            spell.body.velocity.setTo(0,0);
    
            // let recoil = Phaser.Math.Between(-150,150);
            let angle = Phaser.Math.Angle.Between(this.wand.x, this.wand.y, pointer.worldX, pointer.worldY);
    
            this.physics.velocityFromRotation(angle, 500, spell.body.velocity);
            spell.rotation = angle;
        }
    // }
    }

    addSpellImageToUI(scene) {
        var slot;
        scene.spellsStorage.forEach((spell, i) => {
            if(!spell.image) {
                spell.image = scene.add.image(0,0,spell.imageName);
                spell.image.setScrollFactor(0);
                spell.image.setDepth(0);
            }
    
            slot = scene.spellHolders[i];
    
            spell.image.x = slot.x;
            spell.image.y = slot.y;
            spell.image.setVisible(true);
            spell.image.setScale(3);
        });
    }
    
    addSpellToSlot(scene, spellName, spellImageName) {
        let max_player_spells = 2;
        if(scene.spellsStorage.length >= max_player_spells) {
            var lastSpell = scene.spellsStorage.pop();
            if(lastSpell.image) {
                lastSpell.image.destroy();
            }
        }
        //Add element to array
        scene.spellsStorage.unshift({
            name: spellName,
            imageName: spellImageName
        });
    
        this.addSpellImageToUI(scene);
    }
    
    removeSpellIfOutOfBounds(scene, boundX, boundY) {
        scene.spells.getChildren().forEach((spell, index) => {
            if (spell.x < 0 || spell.x > boundX || spell.y < 0 || spell.y > boundY) {
                //Destroy the bullet
                spell.destroy();
            }
        })
    }
}




