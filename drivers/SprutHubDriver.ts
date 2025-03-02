import Homey from "homey";
import { SprutHub } from "../app";
import { ServiceMessage } from "../lib/objects";

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
    

    async getDevicesWithType(type: String) {
        const accessories = await this.getAccessories(true);
        const devices: {}[] = [];
        
        accessories.forEach(accessory => {
            accessory.services?.forEach(service => {
                if (service.type === type) {
                    devices.push({ name: service.name, data: { aid: accessory.id, sid: service.sId } });
                }
            });
        })
        return devices
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