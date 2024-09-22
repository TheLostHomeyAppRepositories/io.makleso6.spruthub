import { SprutHubDevice } from "../SprutHubDevice";
import { ServiceMessage } from "../../lib/objects";

class ThermostatDevice extends SprutHubDevice {
    
    async onInit() {
        await super.onInit();
    }
}


module.exports = ThermostatDevice;