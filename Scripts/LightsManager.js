export default class SpellManager {
    constructor(scene) {
        scene.add.existing(this);
        this.scene = scene;
        this.light = scene.lights.enable();
        this.light.setAmbientColor(0x3A2A1E);
    }

    changeColor(light,r,g,b) {
        light.color.r = r;
        light.color.g = g;
        light.color.b = b;
    }
}




