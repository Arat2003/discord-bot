import { Message } from "discord.js";
import Command from "../../../structures/client/Command";
import UserModel from "../../../util/database/User";
import { getUserOrUUID } from "../../../util/functions/mcUuidFunctions";
import { Categories } from "../../../util/interfaces/cmdCategories";
import { ErrorResponses } from "../../../util/interfaces/responses";
import playerWrapper from "../../../util/wrappers/player";
import skyblockWrapper from "../../../util/wrappers/skyblock";
// import skinImage from "../../../util/wrappers/skinImage";

class Skyblock extends Command {
  name = "test";
  description = "Player's Skyblock profile stats";
  stats = true;
  category: Categories = "Player Skyblock";
  usage = "[username]";

  async execute(message: Message, args: string[]) {
    message.channel.sendTyping();
    const user = await UserModel.findOne({ userID: message.author.id });
    let playerUUID;

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
      return message.channel.send({
        embeds: [this.client.errorEmbed(ErrorResponses.USER_NOT_LOGGED_INTO_HYPIXEL)]
      });
    }

    // const skinUrl = skinImage(playerUUID, "face");
    const skyblock = await skyblockWrapper(playerUUID);
    console.log(skyblock[10]);
    return;
  }
}

export default Skyblock;
