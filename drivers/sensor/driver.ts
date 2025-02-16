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
        const devices: {}[] = [];

        const allAccessories = await this.getAccessories(false);

        allAccessories.forEach(accessory => {
            accessory.services?.forEach(service => {
                if (service.type === 'AccessoryInformation') {
                    const room = service?.characteristics?.find(c => c.control?.type === "C_Room")?.control?.value.stringValue;
                    console.log(room);
                }
                if (types.includes(service.type)) {
                    // const accessoryInformation = await (this.driver as SprutHubDriver).getServiceWithType(data.aid, 'AccessoryInformation')
                   
            
                    devices.push({ name: accessory.name, data: { aid: accessory.id, sid: service.sId } });
                }
            });
        })
        
        console.log(devices);

        return [];
        return devices;
        /// devices.push({ name: service.name, data: { aid: accessory.id, sid: service.sId } });

    }
}

module.exports = SensorDriver;