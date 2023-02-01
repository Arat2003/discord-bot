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
import skinImage from "../../../util/wrappers/skinImage";

class Friends extends Command {
  name = "friends";
  aliases = ["friendlist", "fl"];
  category: Categories = "Hypixel";
  description = "Get someone's friend list.";
  usage = "[username]";
  cooldown = 20;

  async execute(message: Message, args: string[]) {    
    message.channel.sendTyping();
    const user = await UserModel.findOne({ userID: message.author.id });
    let playerUUID;
    let waitMessage = await message.channel.send({
      embeds: [this.client.waitEmbed()]
    });

    if (args.length >= 1) {
      let a = await getUserOrUUID(args[0]);
      playerUUID = a?.uuid;
    } else if (!user && !args.length) {
      return (
        message.channel.send({
          embeds: [
            this.client.errorEmbed(ErrorResponses.USER_NOT_SPECIFIED)
          ]
        })
      );
    } else {
      playerUUID = user?.minecraftUUID;
    }

    if (!playerUUID) {
      return (
        message.channel.send({
          embeds: [
            this.client.errorEmbed(ErrorResponses.WRONG_OR_MISSING_USER)
          ]
        })
      );
    }

    const player = await playerWrapper(playerUUID as string);

    if (!player) {
      waitMessage.delete();
      return message.channel.send({
        embeds: [this.client.errorEmbed(ErrorResponses.USER_NOT_LOGGED_INTO_HYPIXEL)]
      });
    }

    const friends = await friendsWrapper(playerUUID as string);

    const parsed: ParsedPlayer = player.parsed;

    if (!friends) {
      waitMessage.delete();
      return message.channel.send({
        embeds: [this.client.errorEmbed(ErrorResponses.NO_FRIENDS_HYPIXEL)]
      });
    }

    let friendsFields: EmbedField[] = [];
    for (const friend of friends) {
      let friendName = await getUserOrUUID(friend.uuid);

      if (!friendName) continue;

      friendsFields.push({
        name: `${Util.escapeMarkdown(friendName.name)}`,
        value: `\`-\` Started: **${friend.started}**`,
        inline: true,
      });
    }

    let friendsPages = _.chunk(friendsFields, 15);
    let iconUrl = skinImage(playerUUID as string, "face");

    const embeds = friendsPages.map((page) => {
      const embed = this.client
        .templateEmbed()
        .addFields(page)
        .setColor(`#${parsed.plusColor}`)
        .setTitle(
          `${parsed.rank !== "Non" ? `[${parsed.rank}]` : ""} ${parsed.name}`
        )
        .setAuthor({name: `Total friends: ${addCommas(`${friends.length}`)}`, iconURL: iconUrl});

      return embed;
    });
    const pagination = new Pagination(message.channel as TextChannel, embeds);
    waitMessage.delete();
    pagination.paginate(60000);
    return;
  }
}

export default Friends;
