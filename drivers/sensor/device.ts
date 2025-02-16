import { SprutHubDevice } from "../SprutHubDevice";
import { ServiceMessage, CharacteristicMessage, getCharacteristicControl } from "../../lib/objects";
import { SprutHubDriver } from "../SprutHubDriver";


type CapabilityLinks = {
    capability: string
    service: ServiceMessage,
    characteristic: CharacteristicMessage
};

class SensorDevice extends SprutHubDevice {
    
    async onInit() {
            await super.onInit();
    
            const data = this.getData()
            const services = await (this.driver as SprutHubDriver).getServices(data.aid);

            const links: CapabilityLinks[] = [];

            services!.map(service => {
                service.characteristics!.map(characteristic => {
                    let capability = this.app.converter.getCapabilityByCharacteristicType(getCharacteristicControl(characteristic).type);
                    if (!capability) return;
                    const multiple = links.filter(l => l.capability.startsWith(capability!)).length;
                    if (multiple > 0) capability = `${capability}.${multiple}`;
                    links.push({ capability, service, characteristic });
                });
            });

            for (const link of links) {
                await this.makeCharacteristicWithNameCapabilities(link.characteristic, link.capability);
                if (!this.linkedServices.includes(link.service)) {
                    this.linkedServices.push(link.service);
                }
            }
           
            this.app.client.subscribeCharacteristicsEvent(this.alarmContact);
        }
    
        async onDeleted() {
            super.onDeleted();
            this.app.client.unsubscribeCharacteristicsEvent(this.alarmContact);
        }

        alarmContact = async (characteristics: any) => {
            const data = this.getData()
            for (let c of characteristics) {
                if (c.aId !== data.aid) continue;
                const characteristic = this.linkedServices?.find(serivece => serivece.sId === c.sId && serivece.aId === c.aId)?.characteristics?.find(char => char.cId === c.cId);
                if (!characteristic) return;
    
                if (getCharacteristicControl(characteristic).type == 'ContactSensorState') {
                    const value = getCharacteristicControl(c).value;
                    if (getCharacteristicControl(c).value.intValue === 1) {
                        await this.homey.flow.getDeviceTriggerCard('contact_sensor_open').trigger(this, {}, c);
                    } else {
                        await this.homey.flow.getDeviceTriggerCard('contact_sensor_close').trigger(this, {}, c);
                    }
    
                }
            }
        }

}

module.exports = SensorDevice;