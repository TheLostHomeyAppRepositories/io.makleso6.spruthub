import Homey from "homey";
import { SprutHubDriver } from "../SprutHubDriver";

class ThermostatmDriver extends SprutHubDriver {
    async onInit() {
        await super.onInit();

    }

    async onPairListDevices() {
        return this.getDevicesWithType('AirPurifier');
    }
}

module.exports = ThermostatmDriver;