import Client from "../client";
import { ServiceMessage } from "./service";

export type ListResult = {
    accessories: [AccessoryMessage]
}

export type AccessoryResult = {
    list: ListResult
}

export type HubResult = {
    accessory: AccessoryResult
}

export type AccessoryMessage = {
    /** Идентификатор */
    id: number,
    /** Статус доступно или нет */
    online: boolean,
    /** Эндпоинт */
    endpoint: number,
    /** Название */
    name: string,
    /** Производитель */
    manufacturer: string,
    /** Модель */
    model: string,
    /** id Модели*/
    modelId: string,
    /** Серийный номер */
    serial: string,
    /** Версия прошивки */
    firmware: string,
    /** Идентификатор комнаты */
    roomId: number,
    /** Видимость */
    visible: boolean,
    /** Имеются настройки */
    hasOptions?: boolean,
    /** Последнее обновление */
    lastUpdate: number,
    deviceId?: string,
    /** Индекс контроллера */
    controllerIndex: string,
    /** Сервисы */
    services?: ServiceMessage[]
};

export class Accessory {
    private _accessories!: AccessoryMessage[];
    constructor(private client: Client) {}

    /**
     * Получение списка устройств
     */
    async list(force: boolean = false): Promise<AccessoryMessage[]> {
        if (!this._accessories || force) {
            let params = {'accessory':{'list':{'expand': 'services,characteristics'}}}
            let list: HubResult = await this.client.call(params);
            this._accessories = list.accessory.list.accessories;

            return this._accessories;
        }
        return this._accessories;
        
    }
}