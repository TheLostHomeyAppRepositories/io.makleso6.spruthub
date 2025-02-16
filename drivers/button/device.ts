import { getCharacteristicControl } from "../../lib/objects";
import { SprutHubDevice } from "../SprutHubDevice";

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
        const data = this.getData()
        for (let c of characteristics) {
            if (c.aId !== data.aid) continue;
            const characteristic = this.linkedServices?.find(serivece => serivece.sId === c.sId && serivece.aId === c.aId)?.characteristics?.find(char => char.cId === c.cId);
            if (!characteristic) return;
            console.log('onButtonClickEvent 2', c);

            if (getCharacteristicControl(characteristic).type == 'ProgrammableSwitchEvent') {
                await this.homey.flow.getDeviceTriggerCard('button_click').trigger(this, {}, {});
                await this.homey.flow.getDeviceTriggerCard('button_clicks').trigger(this, {}, c);

            }
        }
    }

}

module.exports = ButtonDevice;