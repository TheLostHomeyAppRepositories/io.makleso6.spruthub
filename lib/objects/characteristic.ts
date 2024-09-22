import Client from "../client";

export type CharacteristicMessageControl = {
    minValue?: number,
    /** Максимальное значение */
    maxValue?: number,
    /** Шаг значения */
    minStep?: number,
    /** Максимальная длина значения */
    maxLen?: number,
    /** Тип */
    type: string,
    /** Значение */
    value: any,
    /** допустимые значения */
    validValues?: any[],
    /** Чтение */
    read: boolean,
    /** Запись */
    write: boolean,
}
export type CharacteristicMessage = {
    /** Идентификатор аксессуара */
    aId: number,
    /** Идентификатор сервиса */
    sId: number,
    /** Идентификатор характеристики */
    cId: number,
    /** Обработка связей */
    linkProcessing: number,
    control?: CharacteristicMessageControl,

    minValue?: number,
    /** Максимальное значение */
    maxValue?: number,
    /** Шаг значения */
    minStep?: number,
    /** Максимальная длина значения */
    maxLen?: number,
    /** Тип */
    type: string,
    /** Значение */
    value: any,
    /** допустимые значения */
    validValues?: any[],
    /** Видимость */
    hidden: boolean,
    /** Чтение */
    read: boolean,
    /** Запись */
    write: boolean,
    /** Ивенты */
    events: boolean
};

export function getCharacteristicControl(c: CharacteristicMessage): CharacteristicMessageControl {

    if (c.control) {
        return c.control
    } else {
        return {
            minValue: c.minValue,
            /** Максимальное значение */
            maxValue: c.maxValue,
            /** Шаг значения */
            minStep: c.minStep,
            /** Максимальная длина значения */
            maxLen: c.maxLen,
            /** Тип */
            type: c.type,
            /** Значение */
            value: c.value,
            /** допустимые значения */
            validValues: c.validValues,
            /** Чтение */
            read: c.read,
            /** Запись */
            write: c.write,
        }
    }
}

export class Characteristic {
    constructor(private _client: Client) { }

    /**
     * Установка значения свойства устройства
     * @param aId Идентификатор устройства
     * @param sId Идентификатор сервиса
     * @param cId Идентификатор свойства
     * @param value Значение
     */
    async value(aId: number, sId: number, cId: number, value: any, characteristic: CharacteristicMessage) {
        if (characteristic.control) {
            let params = {
                "characteristic": {
                    "update": {
                        "aId": aId,
                        "sId": sId,
                        "cId": cId,
                        "control": {
                            "value": value
                        }
                    }
                }
            }
            // console.log(JSON.stringify(params));
            return await this._client.call(params);
        } else {
            let params = {
                "characteristic": {
                    "update": {
                        "aId": aId,
                        "sId": sId,
                        "cId": cId,
                        "value": value
                    }
                }
            }
            // console.log(JSON.stringify(params));
            return await this._client.call(params);
        }

    }
}