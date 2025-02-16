import { SprutHubDevice } from "../SprutHubDevice";
import { SprutHubDriver } from "../SprutHubDriver";

class OutletDevice extends SprutHubDevice {
    
    async onInit() {
        await super.onInit();

        const data = this.getData()
        const wattMeter = await (this.driver as SprutHubDriver).getServiceWithType(data.aid, 'C_WattMeter');
        if (wattMeter){
            this.linkedServices.push(wattMeter);
            await this.makeCapabilities(wattMeter);
        }

        const voltMeter = await (this.driver as SprutHubDriver).getServiceWithType(data.aid, 'C_VoltMeter');
        if (voltMeter){
            this.linkedServices.push(voltMeter);
            await this.makeCapabilities(voltMeter);
        }

        const ampereMeter = await (this.driver as SprutHubDriver).getServiceWithType(data.aid, 'C_AmpereMeter');
        if (ampereMeter){
            this.linkedServices.push(ampereMeter);
            await this.makeCapabilities(ampereMeter);
        }

        const kiloWattHourMeter = await (this.driver as SprutHubDriver).getServiceWithType(data.aid, 'C_KiloWattHourMeter');
        if (kiloWattHourMeter){
            this.linkedServices.push(kiloWattHourMeter);
            await this.makeCapabilities(kiloWattHourMeter);
        }
    }
   
}

module.exports = OutletDevice;