import { SprutHubDriver } from "../SprutHubDriver";

class HomeAlarmDriver extends SprutHubDriver {
    async onInit() {
        await super.onInit();
        this.log('HomeAlarmDriver has been initialized');
    }

    async onPairListDevices() {
        return this.getDevicesWithType('SecuritySystem');
    }
}

module.exports = HomeAlarmDriver;