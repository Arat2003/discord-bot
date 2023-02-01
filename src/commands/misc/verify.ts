import { Message } from "discord.js";
import Command from "../../structures/client/Command";
import UserModel from "../../util/database/User";
import { getUserOrUUID } from "../../util/functions/mcUuidFunctions";
import { Categories } from "../../util/interfaces/cmdCategories";
import { DbUser } from "../../util/interfaces/database";
import { ErrorResponses } from "../../util/interfaces/responses";
import playerWrapper from "../../util/wrappers/player";

class Verify extends Command {
  name = "verify";
  aliases = ["link"];
  description = "Link your Hypixel account to this bot.";
  category: Categories = "Hypixel";
  usage = "<username>";

  async execute(message: Message, args: string[], prefix: string) {
    if (!args.length)
      return message.channel.send({
        embeds: [this.client.usageEmbed(`${prefix}${this.name} ${this.usage}`)]
      });

    const user = await UserModel.findOne({ userID: message.author.id });
    if (!user) {
      const playerUUID = await getUserOrUUID(args[0]);
      if (!playerUUID)
        return message.channel.send({
          embeds: [this.client.errorEmbed(ErrorResponses.WRONG_OR_MISSING_USER)]
        });

      const player = await playerWrapper(playerUUID.uuid);

      if (player.socialMedia?.links) {
        const playerDiscordTag = player.socialMedia.links.DISCORD
          ? player.socialMedia.links.DISCORD
          : null;

        if (playerDiscordTag) {
          const playerDiscordUser = this.client.users.cache.find(
            (user) => user.tag === playerDiscordTag
          );
          if (playerDiscordUser) {
            if (playerDiscordUser.tag === message.author.tag) {
              const newUser = new UserModel({
                isLinked: true,
                minecraftUUID: playerUUID.uuid,
                userID: message.author.id,
              } as DbUser);
              await newUser.save();

              return message.channel.send({
                embeds: [
                  this.client
                    .templateEmbed()
                    .setDescription(
                      `You've been verified as \`${playerUUID.name}\``
                    )
                ]
              });
            } else
              return message.channel.send({
                embeds: [
                  this.client.errorEmbed(
                    `${ErrorResponses.FAILED_TO_VERIFY} \`${message.author.tag}\`.`
                  )
                ]
              });
          } else
            return message.channel.send({
              embeds: [
                this.client.errorEmbed(
                  `${ErrorResponses.FAILED_TO_VERIFY} \`${message.author.tag}\`.`
                )
              ]
            });
        } else
          return message.channel.send({
            embeds: [
              this.client.errorEmbed(
                "That user doesn't have a Discord account linked to his Hypixel account."
              )
            ]
          });
      } else
        return message.channel.send({
          embeds: [
            this.client.errorEmbed(
              "That user doesn't have a Discord account linked to his Hypixel account."
            )
          ]
        });
    } else {
      return message.channel.send({
        embeds: [
          this.client.errorEmbed(
            `You have already linked your account to the bot! To unlink it, type: \`${prefix}unverify\`.`
          )
        ]
      });
    }
  }
}

export default Verify;
