import { SprutHubDevice } from "../SprutHubDevice";
import { SprutHubDriver, CapabilityLinks} from "../SprutHubDriver";
import { getCharacteristicControl } from "../../lib/objects";

class ButtonDevice extends SprutHubDevice {

    async onInit() {
        await super.onInit()

        const data = this.getData()

        const services = await (this.driver as SprutHubDriver).getServices(data.aid);
        const filter = services?.filter(service => service.type === 'StatelessProgrammableSwitch')
        this.linkedServices = filter ?? [];

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
            if (getCharacteristicControl(characteristic).type == 'ProgrammableSwitchEvent') {
                await this.homey.flow.getDeviceTriggerCard('multy_button_clicks').trigger(this, {}, c);

            }
        }
    }

}

module.exports = ButtonDevice;