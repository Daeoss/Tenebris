export function shootSpell() {
    let pointer = this.input.activePointer;
    let spell = this.spells.get(this.wand.x, this.wand.y-this.wand.height);
    if(spell) {
        //spell.body.setAllowGravity(false);
        spell.body.velocity.setTo(0,0);

        let angle = Phaser.Math.Angle.Between(this.wand.x, this.wand.y, pointer.worldX, pointer.worldY);

        this.physics.velocityFromRotation(angle, 500, spell.body.velocity);
        spell.rotation = angle;
    }
}

export function addSpellImageToUI(scene) {
    var slot;
    scene.spellsStorage.forEach((spell, i) => {
        if(!spell.image) {
            spell.image = scene.add.image(0,0,spell.imageName);
            spell.image.setScrollFactor(0);
            spell.image.setDepth(0);
        }
        
        switch(i){
            case 0:
                slot = scene.spellHolders['holder1'];
                break;
            case 1:
                slot = scene.spellHolders['holder2'];
                break;
            case 2:
                slot = scene.spellHolders['holder3'];
                break;
        }

        spell.image.x = slot.x;
        spell.image.y = slot.y;
        spell.image.setVisible(true);
        spell.image.setScale(3);
    });
}

export function addSpellToSlot(scene, spellName, spellImageName) {
    if(scene.spellsStorage.length >= 3) {
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

    addSpellImageToUI(scene);
}

export function removeSpellIfOutOfBounds(scene, boundX, boundY) {
    scene.spells.getChildren().forEach((spell, index) => {
        if (spell.x < 0 || spell.x > boundX || spell.y < 0 || spell.y > boundY) {
            //Destroy the bullet
            spell.destroy();
        }
    })
}
