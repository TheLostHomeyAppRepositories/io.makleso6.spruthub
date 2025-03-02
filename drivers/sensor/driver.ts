import { SprutHubDriver } from "../SprutHubDriver";
import { SprutHubDevice} from "../SprutHubDevice";

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

    async onPairListDevices() {
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
        ]

        // return await this.getDevicesWithTypes(types);

        const devices: any[] = [];

        const allAccessories = await this.getAccessories(false);

        allAccessories.forEach(accessory => {
            accessory.services?.forEach(service => {
                if (types.includes(service.type)) {
                    // const accessoryInformation = await (this.driver as SprutHubDriver).getServiceWithType(data.aid, 'AccessoryInformation')
                    const exists = devices.some(device => device.data.aid === accessory.id)

                    if (!exists) {
                        devices.push({ name: accessory.name, data: { aid: accessory.id } });
                    }
                }
            });
        })

        console.log(devices);

        // return [];
        return devices;
        /// devices.push({ name: service.name, data: { aid: accessory.id, sid: service.sId } });

    }
}

module.exports = SensorDriver;