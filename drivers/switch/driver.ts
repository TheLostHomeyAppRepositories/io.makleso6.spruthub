import { SprutHubDriver } from "../SprutHubDriver";

class SwitchDriver extends SprutHubDriver {
    async onInit() {
        await super.onInit();
        this.log('SocketDriver has been initialized');
    }

    async onPairListDevices() {

        const devices = await this.getDevicesWithType('Switch');
        return devices.filter((device: any) => {
            if (device.data) {
                return device.data.aid !== 3 // remove sprut hub zigbee nodes
            }
            return false
        })
    }
}

module.exports = SwitchDriver;