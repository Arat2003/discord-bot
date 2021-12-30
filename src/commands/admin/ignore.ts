import { Message } from "discord.js";
import Command from "../../structures/client/Command";
import GuildModel from "../../util/database/Guild";
import { Categories } from "../../util/interfaces/cmdCategories";

class Ignore extends Command {
  name = "ignore";
  description = "Enable or disable the use of commands in a specific channel.";
  category: Categories = "Admin";
  adminOnly = true;
  usage = "<#channel>";

  async execute(message: Message, _args: string[], _prefix: string) {
    const guild = await GuildModel.findOne({
      guildID: message.guild!.id,
    });

    if (message.mentions.channels.size === 0) {
      if (guild!.ignoredChannels!.length > 0) {
        let embed = this.client
          .templateEmbed()
          .setDescription(
            `These are the currently ignored channels: \n${guild!
              .ignoredChannels!.map((r) => `<#${r}>`)
              .join(`\n`)}`
          )
          .setAuthor("Make sure you # a channel if you want to toggle it.");

        return message.channel.send(embed);
      } else {
        let embed = this.client
          .templateEmbed()
          .setAuthor("There aren't any ignored channels yet.")
          .setDescription(
            `<@${message.author.id}>, make sure you # a channel if you want to toggle it.`
          );

        return message.channel.send(embed);
      }
    } else if (message.mentions.channels.size > 1) {
      return message.channel.send(
        this.client.errorEmbed(
          `<@${message.author.id}, you can only whitelist one role at a time.`
        )
      );
    } else {
      let channel = message.mentions.channels.first()!.id;
      if (guild!.ignoredChannels?.includes(channel)) {
        guild!.ignoredChannels = guild!.ignoredChannels.filter(
          (x) => x !== channel
        );
        await guild!.save();

        let embed = this.client
          .templateEmbed()
          .setDescription(
            `You've successfully enabled this bot's messages in <#${channel}>!`
          );

        return message.channel.send(embed);
      } else {
        guild?.ignoredChannels?.push(channel);
        await guild?.save();

        let embed = this.client
          .templateEmbed()
          .setDescription(
            `You've successfully disabled this bot's messages in <#${channel}>!`
          );

        return message.channel.send(embed);
      }
    }
  }
}

export default Ignore;
