import { SprutHubDriver } from "../SprutHubDriver";
import { SprutHubDevice } from "../SprutHubDevice";
import { getCharacteristicControl } from "../../lib/objects";

class ButtonDriver extends SprutHubDriver {
    async onInit() {
        await super.onInit();
        this.log('ButtonDriver has been initialized');

        let triggerCard = this.homey.flow.getDeviceTriggerCard('multy_button_clicks')
        triggerCard.registerArgumentAutocompleteListener('button', async (query, args) => {
            const device = args.device as SprutHubDevice;
            const data = device.getData()
            const services = await (device.driver as SprutHubDriver).getServices(data.aid);
            const filter = services?.filter(service => service.type === 'StatelessProgrammableSwitch')
            for (const value of filter || []) {
                console.log('*** aid', value.aId, typeof value.aId);
                console.log('*** sid', value.sId, typeof value.sId);

            }
            return filter?.map(service => ({
                name: service.name,
                aid: Number(service.aId),
                sid: Number(service.sId)
            })) || [];;

        })
        triggerCard.registerArgumentAutocompleteListener('click_type', async (query, args) => {
            if (!(args.button)) {
                return [];
            }
            const device = args.device as SprutHubDevice;
            const data = device.getData()
            console.log('*** aid', args.button.aid, typeof args.button.aid);
            console.log('*** sid', args.button.sid, typeof args.button.sid);
            const service = await (device.driver as SprutHubDriver).getService(Number(args.button.aid), Number(args.button.sid));

            return service.characteristics?.flatMap(characteristic => {
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
                    return val
                }
                return [];
            }) || [];
        })
        triggerCard.registerRunListener(async (args, state) => {
            if (state.aId === args.click_type.aId && state.sId === args.click_type.sId && state.cId === args.click_type.cId) {
                let value = Object.values(state.control.value)[0] === Object.values(args.click_type.value.value)[0];
                console.log('*** value', value);
                return value
            }
            return false;
        });
    }

    async onPairListDevices() {

        const types = [
            'StatelessProgrammableSwitch'
        ]

        return this.getAccessoryDevices(types);

        // const devices: any[] = [];

        // const allAccessories = await this.getAccessories(false);

        // allAccessories.forEach(accessory => {
        //     accessory.services?.forEach(service => {
        //         if (types.includes(service.type)) {
        //             const exists = devices.some(device => device.data.aid === accessory.id)
        //             if (!exists) {
        //                 devices.push({ name: accessory.name, data: { aid: accessory.id } });
        //             }
        //         }
        //     });
        // })

        // return devices;
    }
}

module.exports = ButtonDriver;



