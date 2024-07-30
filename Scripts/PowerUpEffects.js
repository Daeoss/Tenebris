export class IncreasedSpeed {
    constructor(player) {
        this.player = player;
    }

    activate() {
        this.player.speed *= 2;
    }

    deactivate() {
        this.player.speed /= 2;
    }
}

export class IncreasedFireRate {
    constructor(spellManager) {
        this.spellManager = spellManager;
    }

    activate() {
        this.spellManager.setFireRate(100);
        this.spellManager.increasedFireRate = true;
    }

    deactivate() {
        this.spellManager.setFireRate(500);
        this.spellManager.increasedFireRate = false;
    }
}

export class ShieldPlayer {
    constructor(player) {
        this.player = player;
    }

    activate() {
        this.player.isShielded = true;
        this.player.shield.setVisible(true);
    }

    deactivate() {
        this.player.isShielded = false;
        this.player.shield.setVisible(false);
    }
}

export class FreezeEnemies {
    constructor(enemies) {
        this.velocities = [];
        this.enemies = enemies;
    }

    activate() {
        this.enemies.getChildren().forEach((enemy) => {
            this.velocities.push({id: enemy.id, velocity: enemy.speed});
            enemy.speed = 0;
        });
    }

    deactivate() {
        this.enemies.getChildren().forEach((enemy) => {
            const velocityData = this.velocities.find(v => v.id === enemy.id);
            if(velocityData) {
                enemy.speed = velocityData.velocity;
            }
        });
        this.velocities = [];
    }
}