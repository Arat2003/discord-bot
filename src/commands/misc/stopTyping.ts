import { Message } from "discord.js";
import Command from "../../structures/client/Command";
import { Categories } from "../../util/interfaces/cmdCategories";

class StopTyping extends Command {
  name = "stopTyping";
  aliases = ["stoptyping"];
  description = "Stops the bot from typing.";
  category: Categories = "Misc";
  usage = "";

  async execute(message: Message) {
    message.channel.stopTyping();
    return message.react("✅");
  }
}

export default StopTyping;
