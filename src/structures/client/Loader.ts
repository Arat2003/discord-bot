import MinestatsClient from "./Client";
import { promises as fs } from "fs";
import path from "path";
import Command from "./Command";
import Event from "./Event";

class Loader {
  client: MinestatsClient;

  constructor(client: MinestatsClient) {
    this.client = client;
  }

  async loadCommands(dir: string = "../../commands"): Promise<void> {
    let files = await fs.readdir(path.join(__dirname, dir));

    for (const file of files) {
      let stat = await fs.lstat(path.join(__dirname, dir, file));

      if (stat.isDirectory()) {
        this.loadCommands(path.join(dir, file));
      } else {
        const commandFile = await import(path.join(__dirname, dir, file));

        const command: Command = new commandFile.default(this.client);

        this.client.commands.set(command.name, command);
      }
    }
  }

  async loadEvents(dir: string = "../../events"): Promise<void> {
    let files = await fs.readdir(path.join(__dirname, dir));

    for (const file of files) {
      let stat = await fs.lstat(path.join(__dirname, dir, file));

      if (stat.isDirectory()) {
        this.loadEvents(path.join(dir, file));
      } else {
        const eventFile = await import(path.join(__dirname, dir, file));

        const event: Event = new eventFile.default(this.client);

        this.client.events.set(event.name, event);
        this.client.on(event.name, async (...args) => event.run(...args));
      }
    }
  }
}

export default Loader;
