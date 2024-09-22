import Homey from "homey";
import { SprutHubDriver } from "../SprutHubDriver";
import { SprutHubDevice } from "../SprutHubDevice";

class ThermostatDriver extends SprutHubDriver {
    async onInit() {
        await super.onInit();
        this.log('ThermostatmDriver has been initialized');


        this.homey.flow.getActionCard('fanSpeed')
            .registerArgumentAutocompleteListener('speed', (query, args) => {
                if (!(args.device as SprutHubDevice).hasCapability('fan_speed')) return [];
                try {
                    const options = (args.device as SprutHubDevice).getCapabilityOptions('fan_speed');
                    return options.values.map((value: any) => {
                        return {
                            name: value.title,
                            id: value.id
                        }
                    });
                } catch {
                    return [];
                }
            })
            .registerRunListener(async (args) => {
                const device: SprutHubDevice = args.device;
                const link = device.links.find(l => l.capability === 'fan_speed')!;
                let capabilityOptions;
                try {
                    capabilityOptions = device.getCapabilityOptions('fan_speed');
                } catch {
                    return;
                }

                await this.app.converter.convertFromHomey(link.characteristic, args.speed.id, capabilityOptions)
                    .then(value => this.app.client.characteristic.value(link.characteristic.aId, link.characteristic.sId, link.characteristic.cId, value, link.characteristic));

            });
    }

    async onPairListDevices() {
        return this.getDevicesWithType('Thermostat');
    }
}

module.exports = ThermostatDriver;