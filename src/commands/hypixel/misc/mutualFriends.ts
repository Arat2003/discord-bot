import { EmbedField, Message, TextChannel, Util } from "discord.js";
import _ from "lodash";
import Command from "../../../structures/client/Command";
import UserModel from "../../../util/database/User";
import { getUserOrUUID } from "../../../util/functions/mcUuidFunctions";
import Pagination from "../../../util/functions/pagination";
import { addCommas } from "../../../util/functions/textFunctions";
import { Categories } from "../../../util/interfaces/cmdCategories";
import { ParsedPlayer } from "../../../util/interfaces/ParsedObjects/ParsedPlayer";
import { ErrorResponses } from "../../../util/interfaces/responses";
import friendsWrapper from "../../../util/wrappers/friends";
import playerWrapper from "../../../util/wrappers/player";

class MutualFriends extends Command {
  name = "mutualFriends";
  aliases = ["mfl", "mutualfriends", "mutuals"];
  category: Categories = "Hypixel";
  description = "Get the mutual friends of two users.";
  usage = "[ign] <ign>";
  cooldown = 20;

  async execute(message: Message, args: string[], prefix: string) {
    message.channel.startTyping();
    const user = await UserModel.findOne({ userID: message.author.id });
    let playerUUID1;
    let playerUUID2;

    let waitMessage = await message.channel.send(this.client.waitEmbed());

    if (args.length === 2) {
      let a = await getUserOrUUID(args[0]);
      playerUUID1 = a?.uuid;
      let b = await getUserOrUUID(args[1]);
      playerUUID2 = b?.uuid;
    } else if (user && args.length === 1) {
      playerUUID1 = user?.minecraftUUID;
      let a = await getUserOrUUID(args[0]);
      playerUUID2 = a?.uuid;
    } else if (!user && !args.length) {
      waitMessage.delete();
      message.channel.stopTyping();
      return message.channel.send(
        this.client.errorEmbed(ErrorResponses.NOT_ENOUGH_USERS)
      );
    } else {
      waitMessage.delete();
      message.channel.stopTyping();
      return message.channel.send(
        this.client.usageEmbed(
          `The correct usage for the command is **${prefix}mfl ${this.usage}**.`
        )
      );
    }

    if (!playerUUID1 || !playerUUID2) {
      waitMessage.delete();
      message.channel.stopTyping();
      return message.channel.send(
        this.client.errorEmbed(ErrorResponses.WRONG_OR_MISSING_USER)
      );
    }

    let p1: ParsedPlayer = (await playerWrapper(playerUUID1 as string)).parsed;
    let p2: ParsedPlayer = (await playerWrapper(playerUUID2 as string)).parsed;

    let p1Friends = await friendsWrapper(playerUUID1 as string);
    let p2Friends = await friendsWrapper(playerUUID2 as string);

    if (!p1Friends || !p2Friends) {
      waitMessage.delete();
      message.channel.stopTyping();
      return message.channel.send(
        this.client.errorEmbed("These players don't have any mutual friends.")
      );
    }

    let mfl: mutuals[] = [];

    for (const friend of p1Friends) {
      let mutual = p2Friends.find((f) => f.uuid === friend.uuid);

      if (mutual) {
        mfl.push({
          uuid: friend.uuid,
          started1: friend.started,
          started2: mutual.started,
        });
      }
    }

    let friendsFields: EmbedField[] = [];
    for (const friend of mfl) {
      let name = (await getUserOrUUID(friend.uuid))?.name;
      if (!name) continue;

      friendsFields.push({
        name: Util.escapeMarkdown(name),
        value: `\`-\` Started with \`${Util.escapeMarkdown(p1.name)}\`: ${
          friend.started1
        }\n\`-\` Started with \`${Util.escapeMarkdown(p2.name)}\`: ${
          friend.started2
        }`,
        inline: true,
      });
    }

    let friendsPages = _.chunk(friendsFields, 12);

    const embeds = friendsPages.map((page) => {
      const embed = this.client
        .templateEmbed()
        .addFields(page)
        .setDescription(
          `${
            p1.rank !== "Non" ? `**[${p1.rank}]**` : ""
          } **${Util.escapeMarkdown(p1.name)}'s** & ${
            p2.rank !== "Non" ? `**[${p2.rank}]**` : ""
          } **${Util.escapeMarkdown(p2.name)}'s** mutual friends!`
        )
        .setAuthor(`Total mutual friends: ${addCommas(`${mfl.length}`)}`);

      return embed;
    });

    const pagination = new Pagination(message.channel as TextChannel, embeds);
    waitMessage.delete();
    pagination.paginate(60000);
    message.channel.stopTyping();
    return;
  }
}

export default MutualFriends;

type mutuals = {
  uuid: string;
  started1: string;
  started2: string;
};
