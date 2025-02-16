import { SprutHubDriver } from "../SprutHubDriver";

class SensorDriver extends SprutHubDriver {
    async onInit() {
        await super.onInit();
        this.log('SensorDriver has been initialized');
    }

    async onPairListDevices() {
        const types = [
            'HumiditySensor',
            'MotionSensor',
            'SmokeSensor',
            'ContactSensor',
            'AirQualitySensor',
            'LightSensor',
            'OccupancySensor',
            'LeakSensor',
            'TemperatureSensor',
            'CarbonMonoxideSensor',
            'CarbonDioxideSensor'
        ]
        return this.getDevicesWithTypes(types);
    }
}

module.exports = SensorDriver;