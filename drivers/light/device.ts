import { SprutHubDevice } from "../SprutHubDevice";
import { SprutHub } from "../../app";
import {  getCharacteristicControl } from "../../lib/objects";

class LightDevice extends SprutHubDevice {
    async onInit() {
        await super.onInit()
        this.app.client.subscribeCharacteristicsEvent(this.capabilityChanged);
    }

    async onDeleted() {
        super.onDeleted();
        this.app.client.unsubscribeCharacteristicsEvent(this.capabilityChanged);
    }

    capabilityChanged = async (characteristics: any) => {

        for (let c of characteristics) {
            if (c.aId !== this.service.aId) return;
            const characteristic = this.service.characteristics?.find(v => v.sId === c.sId && v.cId === c.cId && v.aId === c.aId);
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

