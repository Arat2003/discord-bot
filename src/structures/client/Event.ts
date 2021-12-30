import { Message } from "discord.js";
import MinestatsClient from "./Client";

abstract class Event {
  client: MinestatsClient;
  disabled: boolean = false;
  abstract name: string;

  constructor(client: MinestatsClient) {
    this.client = client;
  }

  abstract run(...args: any[]): Promise<Message | void>;
}

export default Event;
