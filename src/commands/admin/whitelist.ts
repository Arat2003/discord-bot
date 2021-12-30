import { Message } from "discord.js";
import Command from "../../structures/client/Command";
import GuildModel from "../../util/database/Guild";
import { Categories } from "../../util/interfaces/cmdCategories";

class Whitelist extends Command {
  name = "whitelist";
  aliases = ["wl"];
  description =
    "Add/remove roles that are allowed to use the commands in the Admin category (Only users with ADMINISTRATOR permission are allowed to execute this command).";
  category: Categories = "Admin";
  usage = "<@role>";

  async execute(message: Message): Promise<Message> {
    if (message.member?.hasPermission("ADMINISTRATOR")) {
      let guild = await GuildModel.findOne({ guildID: message.guild!.id });
      if (message.mentions?.roles.size === 0) {
        if (guild!.prefixChangeAllowedRoles!.length > 0) {
          let embed = this.client
            .templateEmbed()
            .setDescription(
              `These are the currently whitelisted roles:\n${guild!.prefixChangeAllowedRoles
                ?.map((r) => `<@&${r}>`)
                .join(`\n`)}`
            )
            .setAuthor("Make sure you @ the role you want to whitelist.");

          return message.channel.send(embed);
        } else {
          let embed = this.client
            .templateEmbed()
            .setDescription(
              "There are not any roles allowed to use the Admin commands yet."
            )
            .setAuthor("Make sure you @ the role you want to whitelist.");

          return message.channel.send(embed);
        }
      } else if (message.mentions.roles.size > 1) {
        return message.channel.send(
          this.client.errorEmbed(
            `<@${message.author.id}, you can only whitelist one role at a time.`
          )
        );
      } else {
        const role = message.mentions.roles.first()!.id;
        if (guild?.prefixChangeAllowedRoles!.includes(role)) {
          guild.prefixChangeAllowedRoles = guild.prefixChangeAllowedRoles?.filter(
            (x) => x !== role
          );

          await guild.save();

          let embed = this.client
            .templateEmbed()
            .setDescription(
              `You've successfully removed <@&${role}> from the whitelist! They are not allowed to execute any command in the Admin category anymore.`
            );

          return message.channel.send(embed);
        } else {
          guild?.prefixChangeAllowedRoles?.push(role);
          await guild?.save();

          let embed = this.client
            .templateEmbed()
            .setDescription(`You've successfully whitelisted <@&${role}>!`);

          return message.channel.send(embed);
        }
      }
    } else {
      return message.channel.send(
        this.client.errorEmbed(
          `<@${message.author.id}>, you don't have access to this command. Users with the Administrator permission are the only ones allowed to add a role to the "whitelist".`
        )
      );
    }
  }
}

export default Whitelist;
