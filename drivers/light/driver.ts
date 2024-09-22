import { SprutHubDriver } from "../SprutHubDriver";

class LightDriver extends SprutHubDriver {

    async onInit() {
        await super.onInit();
        this.log('LightDriver has been initialized');
    }

    async onPairListDevices() {
        return this.getDevicesWithType('Lightbulb')
    }
}

module.exports = LightDriver;

