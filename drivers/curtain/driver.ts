import { SprutHubDriver } from "../SprutHubDriver";

class CurtainDriver extends SprutHubDriver {

    async onInit() {
        await super.onInit();
        this.log('CurtainDriver has been initialized');
    }

    async onPairListDevices() {
        return await this.getDevicesWithType('WindowCovering')
    }
}

module.exports = CurtainDriver;

