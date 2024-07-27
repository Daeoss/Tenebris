export default class PowerUpManager {
    constructor(scene) {
        this.scene = scene;
        this.powerUps = {};
        this.powerUpTypes = [
            {image: 'bullet-icon', name: 'IncreasedFireRate'},
            {image: 'speed-icon', name: 'IncreasedSpeed'},
            {image: 'shield-icon', name: 'ShieldPlayer'},
            {image: 'freeze-icon', name: 'FreezeEnemies'},
        ];
        this.countTypes = this.powerUpTypes.length;
        this.activePowerUps = [];

        this.UIPowerUpOffsetX = 360;
        this.UIPowerUpOffsetY = 115;
        this.UIPowerUpSpacing = 50;
        this.UIPowerUpCenterX = 400;
    }

    spawnPowerUps(map) {
        //Get tiled coordinates and spawn power-ups on the map
        const spawnPoints = map.getObjectLayer("PowerUpSpawner");
        spawnPoints.objects.forEach((object => {
            let powerUpType = this.powerUpTypes[Phaser.Math.Between(0,this.countTypes - 1)];
            let powerUp = this.scene.powerUpsGroup.create(object.x, object.y, powerUpType.image ).setScale(0.5).refreshBody();
            powerUp.powerUpType = powerUpType.name;
            powerUp.image = powerUpType.image;
        }));
    }

    respawnPowerUp(deletedPowerUp) {
        //Get the same coordinates from the old power-up and spawn a new one in the same place
        let type = this.powerUpTypes[Phaser.Math.Between(0,this.countTypes - 1)];
        let powerUp = this.scene.powerUpsGroup.create(deletedPowerUp.x, deletedPowerUp.y, type.image ).setScale(0.5).refreshBody();
        powerUp.powerUpType = type.name;
        powerUp.image = type.image;
    }

    addPowerUp(name, effect, duration) {
        if(this.powerUps[name]) {
            this.removePowerUp(name);
        }

        this.powerUps[name] = {
            effect,
            duration,
            timer: this.scene.time.delayedCall(duration, () => this.removePowerUp(name), [], this)
        };

        this.showOnUI(name);

        effect.activate();
    }

    removePowerUp(name) {
        if(this.powerUps[name]) {
            this.powerUps[name].effect.deactivate();
            this.powerUps[name].timer.remove();
            this.removeFromUI(name);
            delete this.powerUps[name];
        }
    }

    clearPowerUps() {
        Object.keys(this.powerUps).forEach(name => this.removePowerUp(name));
    }

    showOnUI(name) {
        const powerUpType = this.powerUpTypes.find(obj => obj.name == name);
        if(powerUpType && !this.activePowerUps[name]) {
            let spellImage = this.scene.add.image(0,0, powerUpType.image);
            spellImage.name = name;
            spellImage.setScale(0.5);
            spellImage.setScrollFactor(0);    
            this.activePowerUps[name] = spellImage;
        }
        this.repositionActivePowerUps();
    }

    removeFromUI(name) {
        let spellImage = this.activePowerUps[name];
        if(spellImage) {
            spellImage.destroy(); 
            delete this.activePowerUps[name]; 
        }
        this.repositionActivePowerUps();
    }

    repositionActivePowerUps() {
        const activeCount = Object.keys(this.activePowerUps).length;
        const totalWidth = (activeCount - 1) * this.UIPowerUpSpacing;
        const startX = this.UIPowerUpCenterX - totalWidth / 2;
        let offsetX = startX;
        let offsetY = this.UIPowerUpOffsetY;

        for(let name in this.activePowerUps) {
            this.activePowerUps[name].setPosition(offsetX, offsetY)
            offsetX += this.UIPowerUpSpacing;
        }
    }

    spawnBonus(map) {
        //Get tiled coordinates and spawn power-ups on the map
        const spawnPoints = map.getObjectLayer("BonusPoints");
        spawnPoints.objects.forEach((object => {
            this.scene.bonusGroup.create(object.x, object.y, 'bonus-icon' ).setScale(0.5).refreshBody();
        }));
    }

    addBonus(player, bonus) {
        this.score+=500;
        this.scoreText.setText('Score: ' + this.score);
        bonus.destroy();
        return;
    }
}