import { Message } from "discord.js";
import { Categories } from "../../util/interfaces/cmdCategories";
import MinestatsClient from "./Client";

abstract class Command {
  client: MinestatsClient;
  aliases: string[] = [];
  devOnly: boolean = false;
  adminOnly: boolean = false;
  thumbnail: string | null = null;
  cooldown: number = 5;
  disabled: boolean = false;
  stats: boolean = false;
  abstract name: string;
  abstract description: string;
  abstract category: Categories;
  abstract usage: string;

  constructor(client: MinestatsClient) {
    this.client = client;
  }

  abstract execute(
    message: Message,
    args: string[],
    prefix: string
  ): Promise<unknown>;
}

export default Command;
