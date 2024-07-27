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

        effect.activate();
    }

    removePowerUp(name) {
        if(this.powerUps[name]) {
            this.powerUps[name].effect.deactivate();
            this.powerUps[name].timer.remove();
            delete this.powerUps[name];
        }
    }

    clearPowerUps() {
        Object.keys(this.powerUps).forEach(name => this.removePowerUp(name));
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