import Homey from "homey";
import { SprutHub } from "../app";
import { AccessoryMessage, CharacteristicMessage, getCharacteristicControl, ServiceMessage } from "../lib/objects";
import { SprutHubDriver } from "./SprutHubDriver";
import { v4 as uuid } from 'uuid';

type CapabilityLink = {
    capability: string,
    characteristic: CharacteristicMessage
};

export class SprutHubDevice extends Homey.Device {
    app!: SprutHub;
    service!: ServiceMessage;
    links: CapabilityLink[] = [];

    async onInit() {
        super.onInit()
        this.log('SprutHubDevice has been initialized');
        this.app = this.homey.app as SprutHub;
        const data = this.getData()
        this.service = await (this.driver as SprutHubDriver).getService(data.aid, data.sid);
        await this.makeCapabilities(this.service);

        const batteryService = await (this.driver as SprutHubDriver).getServiceWithType(data.aid, 'BatteryService')
        if (batteryService) {
            await this.makeCapabilities(batteryService);
        }
        this.subscribeCharacteristicsUpdate()

        const device = (await (this.driver as SprutHubDriver).getAccessory(data.aid))
        if (device.online) {
            console.log
            await this.setAvailable()
        } else {
            await this.setUnavailable('device offline');
        }
    }

    async onDeleted() {
        this.app.client.unsubscribeCharacteristicsEvent(this.onCharacteristic);
        this.app.client.unsubscribeCharacteristicsEvent(this.onStatus);
    }

    subscribeCharacteristicsUpdate() {
        this.app.client.subscribeCharacteristicsEvent(this.onCharacteristic);
        this.app.client.subscribeStatusEvent(this.onStatus);
    }

    onStatus = async (accessories: any) => {
        console.log(accessories);
        for (let a of accessories) {
            if (a.id !== this.service.aId) return;
            if (a.online === true) {
                await this.setAvailable()
            } else {
                await this.setUnavailable('device offline');
            }
        }
    }

    onCharacteristic = async (characteristics: any) => {
        for (let c of characteristics) {
            const link = this.links.find(l => l.characteristic.sId === c.sId && l.characteristic.cId === c.cId && l.characteristic.aId === c.aId);
            if (!link) continue;
            console.log(link.characteristic.sId, c.sId);
            console.log(link.characteristic.cId, c.cId);
            console.log(link.characteristic.aId, c.aId);
            const { capability, characteristic } = link;
            if (!c.control) continue;
            if (!c.control.value) continue;
            console.log(c.control);
            let capabilityOptions;
            try {
                capabilityOptions = this.getCapabilityOptions(capability);
            } catch {
                capabilityOptions = {};
            }
            console.log(c.control.value);

            await this.app.converter.convertToHomey(characteristic, c.control.value, capabilityOptions)
                .then(async value => {
                    await this.setCapabilityValue(capability, value);
                }).catch(err => { });
        }
    }

    async makeCapabilities(service: ServiceMessage) {
        for (const characteristic of service.characteristics!) {
            let capability = this.app.converter.getCapabilityByCharacteristicType(getCharacteristicControl(characteristic).type);
            if (!capability) continue;
            const characteristicOptions = this.app.converter.getCharacteristicOptions(characteristic);
            let capabilityOptions;
            if (this.hasCapability(capability)) {
                try {
                    capabilityOptions = this.getCapabilityOptions(capability);
                } catch(error) {
                    capabilityOptions = {};
                }
            } else {
                await this.addCapability(capability);
                capabilityOptions = {};
            }
            this.links.push({ capability: capability, characteristic: characteristic })

            const options = {
                ...capabilityOptions,
                ...characteristicOptions,
            };
            await this.setCapabilityOptions(capability, options);
            if (getCharacteristicControl(characteristic).write) {
                this.registerCapabilityListener(capability, async value => {
                    const { aId, sId, cId } = characteristic;
                    await this.app.converter.convertFromHomey(characteristic, value, options)
                        .then(value => this.app.client.characteristic.value(aId, sId, cId, value, characteristic));
                });
            }

            await this.app.converter.convertToHomey(characteristic, getCharacteristicControl(characteristic).value, options)
                .then(async value => this.setCapabilityValue(capability, value))
                .catch(err => console.log(err));
        }
    }
}