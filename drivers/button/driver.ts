import { SprutHubDriver } from "../SprutHubDriver";
import { SprutHubDevice } from "../SprutHubDevice";
import { getCharacteristicControl } from "../../lib/objects";

class ButtonDriver extends SprutHubDriver {
    async onInit() {
        await super.onInit();
        this.log('ButtonDriver has been initialized');

        this.homey.flow.getDeviceTriggerCard('multy_button_clicks')
            .registerArgumentAutocompleteListener('button', async (query, args) => {
                const device = args.device as SprutHubDevice;
                const data = device.getData()
                const services = await (device.driver as SprutHubDriver).getServices(data.aid);
                const filter = services?.filter(service => service.type === 'StatelessProgrammableSwitch')
                return filter?.map(service => ({
                    name: service.name,
                    aid: service.aId,
                    sid: service.sId
                })) || [];;

            })
            .registerArgumentAutocompleteListener('click_type', async (query, args) => {
                if (!(args.button)) {
                    return [];
                }
                const device = args.device as SprutHubDevice;
                const data = device.getData()
                const service = await (device.driver as SprutHubDriver).getService(args.button.aid, args.button.sid);

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
                        console.log(val);
                        return val
                    }
                    return [];
                }) || [];
            })
            .registerRunListener(async (args, state) => {
                if (state.aId === args.click_type.aId && state.sId === args.click_type.sId && state.cId === args.click_type.cId) {
                    return Object.values(state.control.value)[0] === Object.values(args.click_type.value.value)[0];
                }
                return false;
            });
    }

    async onPairListDevices() {

        const types = [
            'StatelessProgrammableSwitch'
        ]

        const devices: any[] = [];

        const allAccessories = await this.getAccessories(false);

        allAccessories.forEach(accessory => {
            accessory.services?.forEach(service => {
                if (types.includes(service.type)) {
                    const exists = devices.some(device => device.data.aid === accessory.id)
                    if (!exists) {
                        devices.push({ name: accessory.name, data: { aid: accessory.id } });
                    }
                }
            });
        })

        return devices;
    }
}

module.exports = ButtonDriver;