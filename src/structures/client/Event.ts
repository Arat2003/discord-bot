import { ClientEvents } from "discord.js";
import MinestatsClient from "./Client";

abstract class Event {
  client: MinestatsClient;
  disabled: boolean = false;
  abstract name: keyof ClientEvents;

  constructor(client: MinestatsClient) {
    this.client = client;
  }

  abstract run(...args: any[]): Promise<any>;
}

export default Event;
