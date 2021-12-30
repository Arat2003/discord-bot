import { Collection, Message } from "discord.js";
import Command from "../../structures/client/Command";
import { Categories } from "../../util/interfaces/cmdCategories";

class Gamemodes extends Command {
  name = "gamemodes";
  description = "List of all game mode and guild stats available.";
  usage = "";
  category: Categories = "Hypixel";

  async execute(message: Message, _args: string[], prefix: string) {
    const commandGroups: Collection<Categories, Command[]> = new Collection();
    const { commands } = this.client;
    const embed = this.client.templateEmbed();

    for (const command of commands.array()) {
      if (command.disabled) continue;
      if (!command.stats) continue;

      let commands = commandGroups.get(command.category);
      if (!commands) {
        commands = [];
      }

      commands.push(command);
      commandGroups.set(command.category, commands);
    }

    commandGroups.forEach((commands, category) => {
      embed.addField(
        `__**${category}**__`,
        commands.map((x) => `**${x.name}** - ${x.description}`).join("\n")
      );
    });

    embed.setDescription(`
    Usage: \`${prefix}<gamemode> [username]\`
    Tip: Replace \`<guildName>\` with \`-p <username>\` to look up guilds by a player's name.`);

    return message.channel.send(embed);
  }
}

export default Gamemodes;
