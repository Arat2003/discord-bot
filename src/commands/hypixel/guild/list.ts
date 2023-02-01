import { Message } from "discord.js";
import Command from "../../../structures/client/Command";
import UserModel from "../../../util/database/User";
import { getUserOrUUID } from "../../../util/functions/mcUuidFunctions";
import { Categories } from "../../../util/interfaces/cmdCategories";
import { HypixelGuild } from "../../../util/interfaces/ParsedObjects/ParsedGuild";
import { ErrorResponses } from "../../../util/interfaces/responses";
import guildWrapper from "../../../util/wrappers/guild";

class List extends Command {
  name = "list";
  aliases = ["guildlist"];
  category: Categories = "Guild";
  description = "Guild's member list.";
  usage = "<guildName | -p username>";
  stats = true;

  async execute(message: Message, args: string[], prefix: string) {
    const user = await UserModel.findOne({ userID: message.author.id });
    let playerUUID;
    let guild: HypixelGuild | null;

    let waitMessage = await message.channel.send({embeds: [this.client.waitEmbed()]});

    if (args.includes("-p")) {
      if (args.length >= 2) {
        playerUUID = (await getUserOrUUID(args[1]))!.uuid;
      } else if (user && args.length === 1) {
        playerUUID = user.minecraftUUID;
      } else if (!user && args.length === 1) {
          message.channel.send({
            embeds: [this.client.errorEmbed(ErrorResponses.USER_NOT_SPECIFIED)]
          });
          waitMessage.delete();
          return;
      }

      if (!playerUUID) {
          message.channel.send({
            embeds: [this.client.errorEmbed(ErrorResponses.WRONG_OR_MISSING_USER)]
          });
          waitMessage.delete();
          return;
      }

      guild = await guildWrapper(playerUUID, "player");
      if (!guild) {
        waitMessage.delete();
        return message.channel.send({
          embeds: [this.client.errorEmbed(ErrorResponses.USER_NOT_IN_A_HYPIXEL_GUILD)]
        });
      }
    } else if (args.length > 0) {
      let joinedArgs = args.join("+");
      guild = await guildWrapper(joinedArgs, "name");
      if (!guild) {
        waitMessage.delete();
        return message.channel.send({
          embeds: [this.client.errorEmbed(ErrorResponses.WRONG_GUILD)]
        });
      }
    } else {
      waitMessage.delete();
      return message.channel.send({
        embeds: [
          this.client.usageEmbed(
            `The correct usage for the command is **${prefix}${this.name} ${this.usage}**.`
          )
        ]
      });
    }

    guild.ranks.sort((a, b) => b.priority - a.priority);

    await Promise.all(
      guild.ranks.map(async (rank) => {
        if (rank.members) {
          for (const key of Object.keys(rank.members)) {
            if (Object.prototype.hasOwnProperty.call(rank.members, key)) {
              const member = rank.members[key as any];
              member.uuid = (await getUserOrUUID(member.uuid))!.name;
            }
          }
        }
      })
    );

    let fields = guild.ranks.map((rank) => {
      return {
        name: `${rank.name} [${
          rank.members ? Object.keys(rank.members).length : 0
        }]`,
        value: `${
          rank.members
            ? Object.values(rank.members)
                .map((m) => m.uuid)
                .join(" · ")
            : "N/A"
        }`,
      };
    });

    const embed = this.client
      .templateEmbed()
      .setTitle(`${guild.name} [${guild.tag}]'s members`)
      .setDescription(`Member count: ${guild.memberCount}`)
      .setColor(`#${guild!.hexColor}`)
      .addFields(fields);

    waitMessage.delete();
    message.channel.send({embeds: [embed]});
    return;
  }
}

export default List;
