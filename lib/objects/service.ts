import Client from "../client";
import { CharacteristicMessage } from "./characteristic";

export type ServiceMessage = {
    /** Идентификатор устройства */
    aId: number,
    /** Идентификатор сервиса */
    sId: number,
    /** Название */
    name: string,
    /** Исходное название */
    rawName: string,
    /** Тип */
    type: string,
    /** Название типа */
    typeName: string,
    /** Видимость */
    visible: boolean,
    /** Свойства */
    characteristics?: CharacteristicMessage[]
};

export class Service {
    constructor(private _client: Client) {}
}