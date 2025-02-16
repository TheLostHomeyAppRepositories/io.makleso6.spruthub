import { SprutHubDevice } from "../SprutHubDevice";

class CurtainDevice extends SprutHubDevice {
    async onInit() {
        await super.onInit();
        const characteristics = this.links.map( link => { return link.characteristic })

        for (const characteristic of characteristics) {
            if (characteristic.control?.type === "C_TargetPositionState") {
                const characteristicOptions = this.app.converter.getCharacteristicOptions(characteristic);
                if (characteristicOptions.values) {
                    if (!this.hasCapability("windowcoverings_state")) {
                        this.addCapability("windowcoverings_state")
                    }
                    this.links.push({ capability: "windowcoverings_state", characteristic: characteristic })

                    this.registerCapabilityListener("windowcoverings_state", async value => {
                        const { aId, sId, cId } = characteristic;

                        switch (value) {
                            case "up":
                                const openVaue = characteristic.control?.validValues?.find(v => v.key === "OPEN").value
                                if (openVaue) {
                                    this.app.client.characteristic.value(aId, sId, cId, openVaue, characteristic)
                                }
                                break;
                            case "down":
                                const closeVaue = characteristic.control?.validValues?.find(v => v.key === "CLOSE").value
                                if (closeVaue) {
                                    this.app.client.characteristic.value(aId, sId, cId, closeVaue, characteristic)
                                }
                                break;
                            case "idle":
                                const stopVaue = characteristic.control?.validValues?.find(v => v.key === "STOP").value
                                if (stopVaue) {
                                    this.app.client.characteristic.value(aId, sId, cId, stopVaue, characteristic)
                                }
                                break;
                        }
                    });
                }
            }
        }

    }
}

module.exports = CurtainDevice;

