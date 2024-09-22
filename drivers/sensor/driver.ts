import { SprutHubDriver } from "../SprutHubDriver";

class SensorDriver extends SprutHubDriver {
    async onInit() {
        await super.onInit();
        this.log('ButtonDriver has been initialized');

        // let trigger = this.homey.flow.getDeviceTriggerCard('button_click');

        // trigger.registerRunListener((args, state) => {
        //     return true;
        // });
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