import WebSocket from 'ws';
import { Accessory, Service, Characteristic } from "./objects";
import { EventEmitter } from 'events';

type Credentials = {
    address: string,
    email: string,
    password: string,
    token?: string
};

type HubInfo = {
    address: string,
    token: string,
    cid: String
}

export default class Client {
    private client!: WebSocketClient;

    accessory: Accessory;
    service: Service;
    characteristic: Characteristic;

    // private listeners: Map<string, EventEmitter> = new Map();
    private emitter = new EventEmitter();   

    constructor() {
        this.accessory = new Accessory(this);
        this.service = new Service(this);
        this.characteristic = new Characteristic(this);
    }
    
    isConnected(): boolean {
        return this.client.isConnected()
     }

    async connect(credentials: HubInfo) {
        this.emitter.setMaxListeners(0);
        this.client = new WebSocketClient(credentials);
        await this.client.connect();
        console.log('*** connect');
        
        this.subscribe();

        this.client.emitter.on('socketReconected', async () => {
            this.subscribe()
            let devices = await this.accessory.list(true);
            this.emitter.emit('socketReconected', devices)
        });

        this.client.emitter.on('close', async () => {
            this.emitter.emit('close');
        });
    }

    private subscribe() {
        this.client.subscribe( (response) => {
            if (response.event !== undefined){
                if (response.event.characteristic !== undefined) {
                    if (response.event.characteristic.event == 'EVENT_UPDATE') {
                        this.eventUpdate(response.event.characteristic.characteristics)
                    }
                } else if (response.event.accessory !== undefined) {
                    if (response.event.accessory.event == 'EVENT_UPDATE') {
                        this.eventStatus(response.event.accessory.accessories)
                    }
                }
            }
        });
    }


    async loadDevices() {
        await this.accessory.list();
    }

    eventUpdate(value: any) {
        this.emitter.emit('characteristicEvent', value)
    }

    eventStatus(value: any) {
        this.emitter.emit('status', value)
    }

    async call(params: any = {}): Promise<any> {
        return await this.client.call(params);
    }

    subscribeCharacteristicsEvent(callback: (response: any) => void) {
        this.emitter.on('characteristicEvent', (characteristics) => {
            const chs = characteristics.map((c: any) => c.control ? c : {
                aId: c.aId,
                sId: c.sId,
                cId: c.cId,
                control: {value: c.value}
            });
            callback(chs);
        });
    }

    unsubscribeCharacteristicsEvent(callback: (response: any) => void) {
        this.emitter.off('characteristicEvent', callback)
    }

    subscribeStatusEvent(callback: (response: any) => void) {
        this.emitter.on('status', callback)
    }

    unsubscribeStatusEvent(callback: (response: any) => void) {
        this.emitter.off('status', callback)
    }

    subscribeSocketReconected(callback: (response: any) => void) {
        this.emitter.on('socketReconected', callback)
    }

    unsubscribeSocketReconected(callback: (response: any) => void) {
        this.emitter.off('socketReconected', callback)
    }

    subscribeSocketClose(callback: (response: any) => void) {
        this.emitter.on('close', callback)
    }

    unsubscribeSocketClose(callback: (response: any) => void) {
        this.emitter.off('close', callback)
    }
}

class WebSocketClient {
    private ws: WebSocket | null = null;
    private currentId: number;
    private credentials: HubInfo;
    emitter = new EventEmitter();   

    constructor(credentials: HubInfo) {
        this.credentials = credentials;

        this.currentId = 1;

        this.startWebsocket();

    }


    private startWebsocket() {
        console.log('startWebsocket');

        this.ws = new WebSocket(`ws://${this.credentials.address}:80/spruthub`);

        this.ws.onclose = () => {
            console.log('WS CLOSE');
            // connection closed, discard old websocket and create a new one in 5s
            this.emitter.emit('close');
            this.ws = null;
            setTimeout(() => this.startWebsocket(), 5000);
        };

        this.ws.onerror = (error) => {
            console.log('WS ERROR', error);
        };

        this.ws.on('open', () => {
            console.log('WS OPEN');
            this.emitter.emit('socketReconected');
            this.emitter.emit('open');
        });
    }
    

    isConnected(): boolean {
       return this.ws?.readyState === WebSocket.OPEN
    }

    async connect(): Promise<void> {
        return new Promise<void>((resolve) => {
            this.emitter.on('open', () => {
                resolve();
            });
        });
    }

    async call(params: any = {}): Promise<any> {
        const message = {
            params: params,
            id: this.currentId,
            cid: this.credentials.cid,
            token: this.credentials.token 
        };
        this.ws?.send(JSON.stringify(message));

        this.currentId++;
        if (this.currentId > 100) {
            this.currentId = 1
        }
        return new Promise((resolve) => {
            const handleResponse = (event: WebSocket.MessageEvent) => {
                const data = JSON.parse(event.data.toString());
                if (data.id === message.id) {
                    this.ws?.removeEventListener("message", handleResponse);
                    resolve(data.result);
                }
            };
            this.ws?.addEventListener("message", handleResponse);
        });
    }

    subscribe(callback: (response: any) => void) {
        this.ws?.addEventListener("message", (event: WebSocket.MessageEvent) => {
            const data = JSON.parse(event.data.toString());
            callback(data);
        });
    }
}
