import { SprutHubDriver } from "../SprutHubDriver";

class OutletDriver extends SprutHubDriver {
    async onInit() {
        await super.onInit();
        this.log('SocketDriver has been initialized');
    }

    async onPairListDevices() {
        return await this.getDevicesWithType('Outlet')

    }
}

module.exports = OutletDriver;