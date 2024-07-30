import * as PowerUpEffects from './PowerUpEffects.js';

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
        this.soundBonus = scene.sound.add('bonus');
        this.soundBonus.volume = 0.1;
    }

    spawnPowerUps(map) {
        //Get tiled coordinates and spawn power-ups on the map
        const spawnPoints = map.getObjectLayer("PowerUpSpawner");
        spawnPoints.objects.forEach((object => {
            let powerUpType = this.powerUpTypes[Phaser.Math.Between(0,this.countTypes - 1)];
            let powerUp = this.scene.powerUpsGroup.create(object.x, object.y, powerUpType.image ).setScale(0.5).refreshBody();
            this.addParticles(powerUp);
            powerUp.setDepth(1);
            powerUp.setPipeline("Light2D");
            //Lights
            powerUp.light = this.scene.lights.addLight(0,0, 40, 0xffffff, 0.5);
            this.scene.lightManager.changeColor(powerUp.light, 1, 0.874, 0.729);
            powerUp.light.setPosition(powerUp.x, powerUp.y);

            powerUp.powerUpType = powerUpType.name;
            powerUp.image = powerUpType.image;
        }));
    }

    respawnPowerUp(deletedPowerUp) {
        //Get the same coordinates from the old power-up and spawn a new one in the same place
        let type = this.powerUpTypes[Phaser.Math.Between(0,this.countTypes - 1)];
        let powerUp = this.scene.powerUpsGroup.create(deletedPowerUp.x, deletedPowerUp.y, type.image ).setScale(0.5).refreshBody();
        this.addParticles(powerUp);
        powerUp.setDepth(1);
        //Lights
        powerUp.setPipeline("Light2D");
        powerUp.light = this.scene.lights.addLight(0,0, 40, 0xffffff, 0.5);
        this.scene.lightManager.changeColor(powerUp.light, 1, 0.874, 0.729);
        powerUp.light.setPosition(powerUp.x, powerUp.y);

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

    addParticles(powerUp) {
        powerUp.particles = this.scene.add.particles(powerUp.x, powerUp.y, 'particle', {
            //angle: {min: 0, max: -180},
            speed: 100,
            quantity: 3,
            scale: { start: 1, end: 0 },
            lifespan: 400,
            blendMode: 'ADD',
            frequency: 150,
        }).setDepth(0);
    }

    spawnBonus(map) {
        //Get tiled coordinates and spawn power-ups on the map
        const spawnPoints = map.getObjectLayer("BonusPoints");
        spawnPoints.objects.forEach((object => {
            let bonus = this.scene.bonusGroup.create(object.x, object.y, 'bonus-icon' ).setScale(0.5).refreshBody();
            bonus.anims.play('bonus');
            bonus.setPipeline("Light2D");
        }));
    }

    addBonus(player, bonus) {
        this.scene.starScore+=1;
        this.scene.starText.setText('x' + this.scene.starScore);
        this.soundBonus.play();
        bonus.destroy();
        return;
    }

    powerUpPickup(player, powerUp) {
        switch(powerUp.powerUpType) {
            case 'IncreasedSpeed':
                this.addPowerUp('IncreasedSpeed', new PowerUpEffects.IncreasedSpeed(player), 5000);
                break;
            case 'IncreasedFireRate':
                this.addPowerUp('IncreasedFireRate', new PowerUpEffects.IncreasedFireRate(this.scene.spellManager), 5000);
                break;
            case 'ShieldPlayer':
                this.addPowerUp('ShieldPlayer', new PowerUpEffects.ShieldPlayer(player), 2000);
                this.addPowerUp('ShieldPlayer', new PowerUpEffects.ShieldPlayer(player), 10000);
                break;
            case 'FreezeEnemies':
                this.addPowerUp('FreezeEnemies', new PowerUpEffects.FreezeEnemies(this.scene.enemiesGroup), 3000);
                break;
            default: 
                break;
        }
        this.scene.time.delayedCall( 20000, this.respawnPowerUp, [powerUp], this.scene.powerUpsManager);
        this.scene.soundEffects['powerUp'].play();
        this.scene.lights.removeLight(powerUp.light);
        powerUp.particles.stop();
        powerUp.particles.destroy();
        powerUp.destroy();
    }
}