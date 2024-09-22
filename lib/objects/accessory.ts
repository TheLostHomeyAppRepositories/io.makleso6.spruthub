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
    status: number,
    /** Эндпоинт */
    endpoint: number,
    /** Название */
    name: string,
    /** Производитель */
    manufacturer: string,
    /** Модель */
    model: string,
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

            // for (const acc of list.accessory.list.accessories) {
            //     if (!acc.services) continue;
            //     for (const service of acc.services) {
            //         if (!service.characteristics) continue;
            //         for (const ch of service.characteristics) {
            //             const newch = ch as any
                        
            //             ch.control 
            //         }
            //     }
            // }

            return this._accessories;
        }
        return this._accessories;
        
    }
}