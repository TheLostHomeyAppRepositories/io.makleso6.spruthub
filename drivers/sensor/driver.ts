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

    }
}

module.exports = SensorDriver;