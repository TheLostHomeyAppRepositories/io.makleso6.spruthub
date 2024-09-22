import { SprutHubDriver } from "../SprutHubDriver";

class SocketDriver extends SprutHubDriver {
    async onInit() {
        await super.onInit();
        this.log('SocketDriver has been initialized');
    }

    async onPairListDevices() {
        const devices = await this.getDevicesWithTypes(['Switch', 'Outlet'])
        return devices.filter((device: any) => {
            if (device.data) {
                return device.data.aid !== 3 // remove sprut hub zigbee nodes
            }
            return false
        })
    }
}

module.exports = SocketDriver;