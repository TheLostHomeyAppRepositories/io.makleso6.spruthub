import Homey from "homey";
import { SprutHub } from "../app";
import { ServiceMessage, CharacteristicMessage } from "../lib/objects";

export type CapabilityLinks = {
    capability: string
    service: ServiceMessage,
    characteristic: CharacteristicMessage
};

export interface Device {
    name: string;
    data: any;
    icon?: string;
}

export class SprutHubDriver extends Homey.Driver {
    app!: SprutHub;

    async onInit() {
        this.log('SprutHubDriver has been initialized');
        this.app = this.homey.app as SprutHub;
    }

    async onPair(session: Homey.Driver.PairSession) {
        
        session.setHandler('showView', async (view) => {
            if (view === "starting") {
                const hasCredentionals = await this.app.testConnection();
                await session.showView(hasCredentionals === true ? "list_devices" : "login_credentials");
            }
        });

        session.setHandler("list_devices", async () => {
            return await this.onPairListDevices();
        });

        session.setHandler("login", async (data) => {
            return await this.app.connect(data.username, data.password)
        });
    }

    async getAccessories(force: boolean = false) {
        return await this.app.client.accessory.list(force);
    }

    async getAccessory(id: number, force: boolean = false) {
        const accessories = await this.getAccessories(force);
        const found = accessories.find(a => a.id === id);
        if (!found) throw "Устройство не найдено";
        return found;
    }

    async getServices(aid: number, force: boolean = false) {
        const accessories = await this.getAccessories(force);
        const accessory = accessories.find(a => a.id === aid);
        if (!accessory) throw "Устройство не найдено";
        return accessory.services;
    }

    async getService(aid: number, sid: number, force: boolean = false) {
        const accessories = await this.getAccessories(force);
        const accessory = accessories.find(a => a.id === aid);
        if (!accessory) throw "Устройство не найдено";
        const service = accessory.services?.find(s => s.sId === sid)
        if (!service) throw "Сервис не найден";
        return service;
    }

    async getServiceWithType(aid: number, type: String) {
        const accessories = await this.getAccessories(false);
        const accessory = accessories.find(a => a.id === aid);

        return accessory?.services?.find(s => s.type === type);
    }

    async getServicesWithType(aid: number, type: String) {
        const accessories = await this.getAccessories(false);
        const accessory = accessories.find(a => a.id === aid);
        const services: ServiceMessage[] = [];

        accessory?.services?.forEach(service => {
            if (service.type === type) {
                services.push(service);
            }
        });
        return services;
    }

    async getServicesWithTypes(aid: number, types: string[]) {
        const services = [];

        for (const type of types) {
            const devicesWithType = await this.getServicesWithType(aid, type);
            services.push(...devicesWithType);
        }

        return services;

    }

    async getAccessoryDevices(types: string[]): Promise<Device[]> {

        const devices: Device[] = [];
        const uniqueDeviceIds = new Set<number>(); // или Set<string>, если accessory.id — строка
    
        const allAccessories = await this.getAccessories(false);
    
        // Используем for...of для корректной работы с await
        for (const accessory of allAccessories) {
            for (const service of accessory.services || []) {
                if (types.includes(service.type)) {
                    // Проверяем, существует ли устройство в uniqueDeviceIds
                    if (!uniqueDeviceIds.has(accessory.id)) {
                        uniqueDeviceIds.add(accessory.id); // Добавляем ID в Set
    
                        // Получаем информацию об устройстве
                        const accessoryInfo = await this.getServiceWithType(accessory.id, 'AccessoryInformation');
                        const model = this.getStringValue(accessoryInfo, "Model");
                        const manufacturer = this.getStringValue(accessoryInfo, "Manufacturer");
                        const room = this.getStringValue(accessoryInfo, "C_Room");
                        const icon = this.app.converter.deviceIcon(model);
    


                        console.log(manufacturer, model, accessory.name, room);
                        const device: Device = {
                            name: accessory.name,
                            data: { aid: accessory.id },
                        };
    
                        if (icon) {
                            device.icon = icon;
                        }
    
                        devices.push(device);
                    }
                    break; // Прерываем цикл по сервисам, так как устройство уже добавлено
                }
            }
        }
        return devices;
    }
    
    async getDevicesWithType(type: string): Promise<Device[]> {
        const accessories = await this.getAccessories(true);
        const devices: Device[] = [];
    
        // Используем for...of для корректной работы с await
        for (const accessory of accessories) {
            for (const service of accessory.services || []) {
                if (service.type === type) {
                    try {
                        // Получаем информацию об устройстве
                        const accessoryInfo = await this.getServiceWithType(accessory.id, 'AccessoryInformation');
                        const model = this.getStringValue(accessoryInfo, "Model");
                        const icon = this.app.converter.deviceIcon(model);
    
                        const device: Device = {
                            name: service.name,
                            data: {
                                aid: accessory.id,
                                sid: service.sId,
                            },
                        };
    
                        if (icon) {
                            device.icon = icon;
                        }
    
                        devices.push(device);
                    } catch (error) {
                        console.error(`Error processing accessory ${accessory.id}:`, error);
                    }
                }
            }
        }
    
        return devices;
    }

    getStringValue(servive: ServiceMessage | undefined, type: string) {
        return servive?.characteristics?.find(c => c.control?.type === type)?.control?.value.stringValue
    }

    async getDevicesWithTypes(types: string[]) {
        const allDevices = [];

        for (const type of types) {
            const devicesWithType = await this.getDevicesWithType(type);
            allDevices.push(...devicesWithType);
        }

        return allDevices;
    }
}