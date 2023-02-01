import { Collection, Message, TextChannel } from "discord.js";
import Command from "../../structures/client/Command";
import HelpPagination from "../../util/functions/helpPagination";
import { Categories } from "../../util/interfaces/cmdCategories";

class Help extends Command {
  name = "help";
  description = "List of commands.";
  category: Categories = "Misc";
  aliases = ["commands"];
  usage = "";

  async execute(message: Message, args: string[], prefix: string) {
    const data: any = [];
    const commandGroups: Collection<Categories, Command[]> = new Collection();
    const { commands } = this.client;
    const embed = this.client.templateEmbed();

    if (!args.length) {
      for (const command of [...commands.values()]) {
        if (command.disabled) continue;
        if (command.stats) continue;
        if (command.devOnly) continue;

        let commands = commandGroups.get(command.category);
        if (!commands) {
          commands = [];
        }
        commands.push(command);
        commandGroups.set(command.category, commands);
      }

      commandGroups.forEach((commands, category) => {
        data.push([
          {
            name: `__**${category}**__`,
            value: `${commands
              .map((cmd) => `**${cmd.name}** - ${cmd.description}`)
              .join("\n")}`,
            inline: false,
          },
        ]);
        embed.addField(
          `__**${category}**__`,
          commands
            .map((cmd) => `**${cmd.name}** - ${cmd.description}`)
            .join("\n")
        );
      });

      const embeds = data.map((category: any) => {
        const embed = this.client
          .templateEmbed()
          .setAuthor({name: "Minestats Help Manual", iconURL: this.client.user?.displayAvatarURL()})
          .addFields(category);
        return embed;
      });

      const pagination = new HelpPagination(
        this.client,
        message.channel as TextChannel,
        embeds
      );
      return pagination.paginate(60000);
    }

    const cmd = args[0].toLowerCase();
    const command =
      commands.get(cmd) ||
      commands.find((c) => c.aliases && c.aliases.includes(cmd));

    if (!command || command.disabled) {
      return message.channel.send({
        embeds: [this.client.errorEmbed("That's not a valid command!")]
      });
    }

    data.push(
      {
        name: "Description",
        value: `\`${command.description}\``,
        inline: false,
      },
      {
        name: "Aliases",
        value: `${
          command.aliases.length > 0
            ? `\`${command.aliases.join(", ")}\``
            : "`None`"
        }`,
        inline: false,
      },
      {
        name: "Usage",
        value: `${
          command.usage !== ""
            ? `\`${prefix}${command.name} ${command.usage}\``
            : `\`${prefix}${command.name}\``
        }`,
        inline: false,
      }
    );

    // if (command.exampleUsage !== "") {
    //   data.push({
    //     name: "Example",
    //     value: `${prefix}${command.name} ${command.exampleUsage}`,
    //     inline: false
    //   });
    // }

    data.push({ name: "Cooldown", value: `\`${command.cooldown} seconds\`` });

    embed
      .setTitle(
        `${command.name.replace(
          command.name.charAt(0),
          command.name.charAt(0).toUpperCase()
        )}'s Help`
      )
      .addFields(data);

    return message.channel.send({embeds: [embed]});
  }
}

export default Help;
