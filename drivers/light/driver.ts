import { SprutHubDriver } from "../SprutHubDriver";
import { AccessoryMessage, CharacteristicMessage, getCharacteristicControl, ServiceMessage } from "../../lib/objects";

class LightDriver extends SprutHubDriver {

    async onInit() {
        await super.onInit();
        this.log('LightDriver has been initialized');

        const card = this.homey.flow.getDeviceTriggerCard("capability_changed")
        card.registerRunListener((args, state) => {

            console.log('capability_changed');
            return true;
        });

    }

    async onPairListDevices() {        
        return await this.getDevicesWithType('Lightbulb');
    }

    
}

module.exports = LightDriver;

