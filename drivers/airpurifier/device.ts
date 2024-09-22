import { SprutHubDevice } from "../SprutHubDevice";
import { ServiceMessage } from "../../lib/objects";

class ThermostatmDevice extends SprutHubDevice {
    
    async onInit() {
        await super.onInit();
    }
}


module.exports = ThermostatmDevice;