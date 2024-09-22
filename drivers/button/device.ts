import { getCharacteristicControl } from "../../lib/objects";
import { SprutHubDevice } from "../SprutHubDevice";
import { SprutHubDriver } from "../SprutHubDriver";

class ButtonDevice extends SprutHubDevice {
    
    async onInit() {
        await super.onInit()
        this.app.client.subscribeCharacteristicsEvent(this.onButtonClickEvent);
    }

    async onDeleted() {
        super.onDeleted();
        this.app.client.unsubscribeCharacteristicsEvent(this.onButtonClickEvent);
    }

    onButtonClickEvent = async (characteristics: any) => {
        for (let c of characteristics) {
            if (c.aId !== this.service.aId) return;
            const characteristic = this.service.characteristics?.find(v => v.sId === c.sId && v.cId === c.cId && v.aId === c.aId);
            if (!characteristic) return;
            
            if (getCharacteristicControl(characteristic).type == 'ProgrammableSwitchEvent') {
                if (!this.service) return;
                const name = this.service.name;
                await this.homey.flow.getDeviceTriggerCard('button_click').trigger(this, {}, {});
                console.log(c);
                await this.homey.flow.getDeviceTriggerCard('button_clicks').trigger(this, {}, c);

            }
        }
    }

}

module.exports = ButtonDevice;