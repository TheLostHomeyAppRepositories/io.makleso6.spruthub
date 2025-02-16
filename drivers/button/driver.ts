import { SprutHubDriver } from "../SprutHubDriver";
import { SprutHubDevice} from "../SprutHubDevice";
import { getCharacteristicControl } from "../../lib/objects";
import { link } from "fs";

class ButtonDriver extends SprutHubDriver {
    async onInit() {
        await super.onInit();
        this.log('ButtonDriver has been initialized');

        this.homey.flow.getDeviceTriggerCard('button_clicks')
        .registerArgumentAutocompleteListener('click_type', (query, args) => {
            const device = args.device as SprutHubDevice;
            const characteristics = device.links.map( link => { return link.characteristic })
            
            return characteristics.flatMap(characteristic => {
                if (getCharacteristicControl(characteristic).type === 'ProgrammableSwitchEvent') {
                    const val = getCharacteristicControl(characteristic).validValues
                    ?.filter(value => value.checked === true)
                    ?.map(filteredValue => ({ 
                        name: filteredValue.name, 
                        value: filteredValue,
                        aId: characteristic.aId,
                        sId: characteristic.sId,
                        cId: characteristic.cId
                    })) || [];
                    console.log(val);
                    return val
                }
                return [];
            });
            
        })
        .registerRunListener(async (args, state) => {
            if (state.aId === args.click_type.aId && state.sId === args.click_type.sId && state.cId === args.click_type.cId) {
                return Object.values(state.control.value)[0] === Object.values(args.click_type.value.value)[0];
            }
            return false;
        });
    }

    async onPairListDevices() {
        return await this.getDevicesWithType('StatelessProgrammableSwitch')
    }
}

module.exports = ButtonDriver;