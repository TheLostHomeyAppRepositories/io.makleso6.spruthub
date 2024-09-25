import Homey from 'homey';
import Client from "./lib/client";
import { v4 as uuid } from 'uuid';
import { Converter } from "./converter";

export class SprutHub extends Homey.App {

  client!: Client
  converter!: Converter;


  async onInit() {
    this.log('MyApp has been initialized');

    this.converter = new Converter(this.homey.app.manifest.capabilities);
    this.client = new Client()

    let address = this.homey.settings.get('address');
    let token = this.homey.settings.get('token');

    if (address && token) {
      const hubInfo = {
        address: address,
        token: token,
        cid: uuid()
      }

      await this.client.connect(hubInfo);
      await this.client.loadDevices();
    }
  }

  async testConnection() {
    if (this.client.isConnected()) {
      return true;
    }
    let address = this.homey.settings.get('address');
    let token = this.homey.settings.get('token');

    if (address && token) {
      const hubInfo = {
        address: address,
        token: token,
        cid: uuid()
      }
      await this.client.connect(hubInfo);
      await this.client.loadDevices();
      return true;
    } else {
      return false;
    }

  }

  async connect(address: string, token: string) {

    this.homey.settings.set('address', address)
    this.homey.settings.set('token', token)

    const hubInfo = {
      address: address,
      token: token,
      cid: uuid()
    }
    try {
      await this.client.connect(hubInfo);
      await this.client.loadDevices();
      return true;
    } catch {
      return false;
    }
  }

}

module.exports = SprutHub;
