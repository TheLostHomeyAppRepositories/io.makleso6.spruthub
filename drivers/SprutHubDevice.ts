import Homey from "homey";
import { SprutHub } from "../app";
import { AccessoryMessage, CharacteristicMessage, getCharacteristicControl, ServiceMessage } from "../lib/objects";
import { SprutHubDriver } from "./SprutHubDriver";

type CapabilityLink = {
    capability: string,
    characteristic: CharacteristicMessage
};

export class SprutHubDevice extends Homey.Device {
    app!: SprutHub;
    links: CapabilityLink[] = [];
    linkedServices: ServiceMessage[] = [];

    async onInit() {
        super.onInit()

        this.log('SprutHubDevice has been initialized');
        this.app = this.homey.app as SprutHub;
        const data = this.getData()

        try {
            const baseService = await (this.driver as SprutHubDriver).getService(data.aid, data.sid);
            if (baseService) {
                this.linkedServices.push(baseService);
                await this.makeCapabilities(baseService);
            }
        } catch(error) {
            this.error(error);
        }
        
        const batteryService = await (this.driver as SprutHubDriver).getServiceWithType(data.aid, 'BatteryService');
        if (batteryService) {
            this.linkedServices.push(batteryService);
            await this.makeCapabilities(batteryService);
        }
        this.subscribeCharacteristicsUpdate()

        const device = await (this.driver as SprutHubDriver).getAccessory(data.aid);
        if (device.online) {
            console.log
            await this.setAvailable()
        } else {
            await this.setUnavailable('device offline init');
        }

        const accessoryInformation = await (this.driver as SprutHubDriver).getServiceWithType(data.aid, 'AccessoryInformation')
        const room = accessoryInformation?.characteristics?.find(c => c.control?.type === "C_Room")?.control?.value.stringValue
        if (room) {
            await this.setSettings({room: room});
        }

        const manufacturer = accessoryInformation?.characteristics?.find(c => c.control?.type === "Manufacturer")?.control?.value.stringValue
        if (manufacturer) {
            await this.setSettings({manufacturer: manufacturer});

        }

        const model = accessoryInformation?.characteristics?.find(c => c.control?.type === "Model")?.control?.value.stringValue
        if (model) {
            await this.setSettings({model: model})
        }

        const name = accessoryInformation?.characteristics?.find(c => c.control?.type === "Name")?.control?.value.stringValue
        if (name) {
            await this.setSettings({name: name})
        }

        const serialNumber = accessoryInformation?.characteristics?.find(c => c.control?.type === "SerialNumber")?.control?.value.stringValue
        if (serialNumber) {
            await this.setSettings({serialNumber: serialNumber})
        }

        const firmware = accessoryInformation?.characteristics?.find(c => c.control?.type === "FirmwareRevision")?.control?.value.stringValue
        if (firmware) {
            await this.setSettings({firmware: firmware})
        }

    }

    subscribeCharacteristicsUpdate() {
        this.app.client.subscribeCharacteristicsEvent(this.onCharacteristic);
        this.app.client.subscribeStatusEvent(this.onStatus);
        this.app.client.subscribeSocketReconected(this.onConnected);
        this.app.client.subscribeSocketClose(this.onClose);
    }

    async onDeleted() {
        this.app.client.unsubscribeCharacteristicsEvent(this.onCharacteristic);
        this.app.client.unsubscribeCharacteristicsEvent(this.onStatus);
        this.app.client.unsubscribeSocketReconected(this.onConnected);
        this.app.client.unsubscribeSocketClose(this.onClose);
    }

    onClose = async () => {
        await this.setUnavailable('websocet close');
    }

    onConnected = async (accessories: any) => {
        const data = this.getData()
        for (let a of accessories) {
            if (a.id !== data.aid) continue;
            if (a.online === true) {
                await this.setAvailable()
            } else {
                await this.setUnavailable('device offline');
            }
        }
    }

    onStatus = async (accessories: any) => {
        const data = this.getData()
        for (let a of accessories) {
            if (a.id !== data.aid) continue;
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
            const { capability, characteristic } = link;
            if (!c.control) continue;
            if (!c.control.value) continue;
            let capabilityOptions;
            try {
                capabilityOptions = this.getCapabilityOptions(capability);
            } catch {
                capabilityOptions = {};
            }

            await this.app.converter.convertToHomey(characteristic, c.control.value, capabilityOptions)
                .then(async value => {
                    await this.setCapabilityValue(capability, value);
                }).catch(err => { });
        }
    }

    async makeCapabilities(service: ServiceMessage) {
        for (const characteristic of service.characteristics!) {
            await this.makeCharacteristicCapabilities(characteristic);
        }
    }

    async makeCharacteristicWithNameCapabilities(characteristic: CharacteristicMessage, capability: string) {
        const characteristicOptions = this.app.converter.getCharacteristicOptions(characteristic);
        let capabilityOptions;
        if (this.hasCapability(capability)) {
            try {
                capabilityOptions = this.getCapabilityOptions(capability);
            } catch(error) {
                capabilityOptions = {};
            }
        } else {
            // console.log('no Capability', capability);
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

    async makeCharacteristicCapabilities(characteristic: CharacteristicMessage) {
        let capability = this.app.converter.getCapabilityByCharacteristicType(getCharacteristicControl(characteristic).type);
        if (!capability) return;
        await this.makeCharacteristicWithNameCapabilities(characteristic, capability)        
    }
}