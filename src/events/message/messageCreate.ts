import Event from "../../structures/client/Event";
import { ClientEvents, Message, User } from "discord.js";
import chalk from "chalk";
import GuildModel from "../../util/database/Guild";
import { DbGuild } from "../../util/interfaces/database";
import { ErrorResponses } from "../../util/interfaces/responses";

class MessageEvent extends Event {
  name: keyof ClientEvents = "messageCreate";

  async run(message: Message): Promise<Message | void> {
    if (!message.guild) return;

    let prefix;

    let guild = await GuildModel.findOne({
      guildID: message.guild.id,
    });

    if (!guild) {
      const newGuild = new GuildModel({
        guildID: `${message.guild.id}`,
        prefix: "h!",
        language: "en",
        guildOwnerID: `${message.guild.ownerId}`,
        prefixChangeAllowedRoles: [],
        ignoredChannels: [],
      } as DbGuild);

      guild = await newGuild.save();
      prefix = guild.prefix;
    } else {
      prefix = guild.prefix;
    }

    if (message.mentions.has(this.client.user as User)) {
      const embed = this.client
        .templateEmbed()
        .setDescription(
          `The prefix for this server is \`${prefix}\` and the help command (which has a list of available commands) is \`${prefix}help\`.\nIf you need more help, or have something you want to report, you can join the [support server](https://discord.gg/HjXB4HW).`
        );

      return message.channel.send({embeds: [embed]});
    }

    if (!message.content.toLowerCase().startsWith(prefix) || message.author.bot)
      return;
    if (guild.ignoredChannels?.includes(message.channel.id)) return;

    const args = message.content.slice(prefix.length).split(/ +/);
    const commandName = args.shift()?.toLowerCase();

    const command =
      this.client.commands.get(commandName as string) ||
      this.client.commands.find(
        (cmd) => cmd.aliases && cmd.aliases.includes(commandName as string)
      );

    if (!command) return;

    if (command.devOnly && message.author.id != "475828500650131456") return;

    if (
      command.adminOnly && 
      !(
        message.member?.permissions.has("ADMINISTRATOR") ||
        message.member?.roles.cache.some((r) => guild!.prefixChangeAllowedRoles!.includes(r.id)))
      ) {
      return message.channel.send({
        embeds: [
          this.client.errorEmbed(ErrorResponses.USER_UNAUTHORIZED)
        ]
      });
    }

    try {
      command.execute(message, args, prefix);
    } catch (err) {
      console.log(chalk.red.bold("[Message Event] ") + chalk.red(`${err}`));
      return message.channel.send({
        embeds: [
          this.client.errorEmbed(
            `**An error occurred while processing your request.**\nThe error has been reported to the support team. If the issue persists, please report it on our [support server](https://discord.gg/HjXB4HW)`
          )
        ]
      });
    }
  }
}

export default MessageEvent;
