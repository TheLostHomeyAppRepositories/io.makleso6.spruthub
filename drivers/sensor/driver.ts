import { SprutHubDriver, Device } from "../SprutHubDriver";
import { SprutHubDevice } from "../SprutHubDevice";

class SensorDriver extends SprutHubDriver {
    async onInit() {
        await super.onInit();
        this.log('SensorDriver has been initialized');

        this.homey.flow.getDeviceTriggerCard('contact_sensor_open')
            .registerArgumentAutocompleteListener('contact_sensor', (query, args) => {
                const device = args.device as SprutHubDevice;
                return device.linkedServices
                .filter(service => service.type === 'ContactSensor')
                .map(service => ({
                    name: service.name,
                    aid: service.aId,
                    sid: service.sId
                }));
            })
            .registerRunListener(async (args, state) => {
                return args.contact_sensor.aid === state.aId && args.contact_sensor.sid === state.sId;
            });

            this.homey.flow.getDeviceTriggerCard('contact_sensor_close')
            .registerArgumentAutocompleteListener('contact_sensor', (query, args) => {
                const device = args.device as SprutHubDevice;
                return device.linkedServices
                .filter(service => service.type === 'ContactSensor')
                .map(service => ({
                    name: service.name,
                    aid: service.aId,
                    sid: service.sId
                }));
            })
            .registerRunListener(async (args, state) => {
                return args.contact_sensor.aid === state.aId && args.contact_sensor.sid === state.sId;
            });
    }

    
    async onPairListDevices(): Promise<Device[]> {
        const types = [
            'HumiditySensor',
            'TemperatureSensor',
            'CarbonMonoxideSensor',
            'CarbonDioxideSensor',
            'AirQualitySensor',
            'SmokeSensor',
            'ContactSensor',
            'LightSensor',
            'OccupancySensor',
            'MotionSensor',
            'LeakSensor'
        ];
        
        return this.getAccessoryDevices(types);

        // const devices: Device[] = [];
        // const uniqueDeviceIds = new Set<number>(); // или Set<string>, если accessory.id — строка
    
    
        // // Используем for...of для корректной работы с await
        // for (const accessory of allAccessories) {
        //     for (const service of accessory.services || []) {
        //         if (types.includes(service.type)) {
        //             // Проверяем, существует ли устройство в uniqueDeviceIds
        //             if (!uniqueDeviceIds.has(accessory.id)) {
        //                 uniqueDeviceIds.add(accessory.id); // Добавляем ID в Set
    
        //                 // Получаем информацию об устройстве
        //                 const accessoryInfo = await this.getServiceWithType(accessory.id, 'AccessoryInformation');
        //                 const model = this.getStringValue(accessoryInfo, "Model");
        //                 const manufacturer = this.getStringValue(accessoryInfo, "Manufacturer");
        //                 const icon = this.app.converter.deviceIcon(model);
    
        //                 console.log(manufacturer, model, accessory.name);
        //                 const device: Device = {
        //                     name: accessory.name,
        //                     data: { aid: accessory.id },
        //                 };
    
        //                 if (icon) {
        //                     device.icon = icon;
        //                 }
    
        //                 devices.push(device);
        //             }
        //             break; // Прерываем цикл по сервисам, так как устройство уже добавлено
        //         }
        //     }
        // }
    
        // return devices;
    }
}

module.exports = SensorDriver;