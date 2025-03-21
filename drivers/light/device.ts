import { SprutHubDevice } from "../SprutHubDevice";
import { SprutHub } from "../../app";
import { getCharacteristicControl } from "../../lib/objects";

class LightDevice extends SprutHubDevice {
    async onInit() {
        await super.onInit()

        if (!this.hasCapability('light_mode')) {
            if (this.hasCapability('light_temperature') && this.hasCapability('light_hue')) {
                this.addCapability('light_mode');
                this.registerCapabilityListener('light_mode', async value => {
                    console.log('*** change light mode to', value);
                });
            }
        } else {
            this.registerCapabilityListener('light_mode', async value => {
                console.log('*** change light mode to', value);
            });
        }

        // if (!this.hasCapability('light_mode')) {
        //     if (this.hasCapability('light_temperature') && this.hasCapability('light_hue')) {
        //         this.addCapability('light_mode');
        //     }
        // } else {
        //     if (!this.hasCapability('light_temperature') && !this.hasCapability('light_hue')) {
        //         this.removeCapability('light_mode');
        //     }
        // }
        this.app.client.subscribeCharacteristicsEvent(this.capabilityChanged);
    }

    async onDeleted() {
        super.onDeleted();
        this.app.client.unsubscribeCharacteristicsEvent(this.capabilityChanged);
    }

    async setTemperatureRelative(args: any) {
        if (args.light_temperature_rel) {
            let lightTemperature = this.getCapabilityValue('light_temperature');
            lightTemperature += args.light_temperature_rel;
            if (lightTemperature > 1) {
                lightTemperature = 1;
            }
            if (lightTemperature < 0) {
                lightTemperature = 0;
            }
            args["light_temperature"] = lightTemperature;

            const link =  this.links.find(l => l.capability === 'light_temperature')
            if (link) {
                await this.app.converter.convertFromHomey(link.characteristic, lightTemperature, {})
                .then(value => this.app.client.characteristic.value(link.characteristic.aId, link.characteristic.sId, link.characteristic.cId, value, link.characteristic));
            }
            await this.setCapabilityValue('light_temperature', lightTemperature);
        }
    }

    capabilityChanged = async (characteristics: any) => {
        const data = this.getData()

        for (let c of characteristics) {
            if (c.aId !== data.aid) return;
            const characteristics = this.links.map(link => { return link.characteristic })
            const characteristic = characteristics.find(v => v.sId === c.sId && v.cId === c.cId && v.aId === c.aId);
            const link = this.links.find(l => l.characteristic.sId === c.sId && l.characteristic.cId === c.cId && l.characteristic.aId === c.aId);
            if (!link) return;
            if (!characteristic) return;

            const capability = link.capability;

            let capabilityOptions;
            try {
                capabilityOptions = this.getCapabilityOptions(capability);
            } catch {
                capabilityOptions = {};
            }

            let dim: number
            if (getCharacteristicControl(characteristic).type == 'Brightness') {
                dim = await this.app.converter.convertToHomey(characteristic, c.control.value, capabilityOptions);
                console.log('dim', dim);
            } else {
                dim = this.getCapabilityValue('dim') ?? 0
            }

            let onoff: boolean
            if (getCharacteristicControl(characteristic).type == 'On') {
                onoff = await this.app.converter.convertToHomey(characteristic, c.control.value, capabilityOptions);
                console.log('onoff', onoff);
            } else {
                onoff = this.getCapabilityValue('onoff')
            }

            let temperature: number
            if (getCharacteristicControl(characteristic).type == 'ColorTemperature') {
                temperature = await this.app.converter.convertToHomey(characteristic, c.control.value, capabilityOptions);
                console.log('temperature', temperature);
            } else {
                temperature = this.getCapabilityValue('light_temperature') ?? 0
            }

            const tokens = { dim: dim, temperature: temperature, onoff: onoff };
            await this.homey.flow.getDeviceTriggerCard('capability_changed').trigger(this, tokens).catch(error => { this.error(error) });


        }
    }
}

module.exports = LightDevice;