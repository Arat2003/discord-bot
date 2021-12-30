import { Message } from "discord.js";
import moment from "moment";
import Command from "../../../structures/client/Command";
import UserModel from "../../../util/database/User";
import { getUserOrUUID } from "../../../util/functions/mcUuidFunctions";
import { Categories } from "../../../util/interfaces/cmdCategories";
import { ParsedPlayer } from "../../../util/interfaces/ParsedObjects/ParsedPlayer";
import { ErrorResponses } from "../../../util/interfaces/responses";
import guildWrapper from "../../../util/wrappers/guild";
import guildMemberWrapper from "../../../util/wrappers/guildMember";
import playerWrapper from "../../../util/wrappers/player";
import skinImage from "../../../util/wrappers/skinImage";

class Member extends Command {
  name = "member";
  category: Categories = "Guild";
  aliases = ["m"];
  description = "General Member information.";
  usage = "[username]";
  stats = true;

  async execute(message: Message, args: string[]) {
    message.channel.startTyping();
    const user = await UserModel.findOne({ userID: message.author.id });
    let playerUUID: string | undefined;

    if (args.length >= 1) {
      let a = await getUserOrUUID(args[0]);
      playerUUID = a?.uuid;
    } else if (!user && !args.length) {
      return (
        message.channel.send(
          this.client.errorEmbed(ErrorResponses.USER_NOT_SPECIFIED)
        ) && message.channel.stopTyping()
      );
    } else {
      playerUUID = user?.minecraftUUID;
    }

    if (!playerUUID) {
      return (
        message.channel.send(
          this.client.errorEmbed(ErrorResponses.WRONG_OR_MISSING_USER)
        ) && message.channel.stopTyping()
      );
    }

    const wrapped = await playerWrapper(playerUUID);
    const player: ParsedPlayer = wrapped.parsed;
    const playerGuild = await guildWrapper(playerUUID, "player");

    if (!playerGuild) {
      return (
        message.channel.send(
          this.client.errorEmbed(ErrorResponses.USER_NOT_IN_A_HYPIXEL_GUILD)
        ) && message.channel.stopTyping()
      );
    }

    let m = playerGuild.guildMembers.find((m) => m.uuid === playerUUID);

    const member = guildMemberWrapper(m!, playerGuild.guildMembers, playerUUID);
    const skinUrl = skinImage(playerUUID as string, "face");

    const keys = [];
    for (const key of Object.keys(m!.expHistory)) {
      keys.push(moment(key).format("MM/DD/YYYY"));
    }

    const totalMembers = playerGuild.guildMembers.length;

    const embed = this.client
      .templateEmbed()
      .setTitle(
        `${player.rank !== "Non" ? `[${player.rank}]` : ""} ${player.name} ${
          playerGuild ? `[${playerGuild.tag}]` : ""
        }`
      )
      .setColor(player.plusColor)
      .addField("Join Date", `\`${member.joined}\``, true)
      .addField("Guild", `\`${playerGuild.name}\``, true)
      .addField("Guild Rank", `\`${member.rank}\``, true)
      .addField(
        "Daily GXP",
        `\`-\` ${keys[0]}: **${member.day1XP}** \`[#${member.day1Rank}/${totalMembers}]\`
        \`-\` ${keys[1]}: **${member.day2XP}** \`[#${member.day2Rank}/${totalMembers}]\`
        \`-\` ${keys[2]}: **${member.day3XP}** \`[#${member.day3Rank}/${totalMembers}]\`
        \`-\` ${keys[3]}: **${member.day4XP}** \`[#${member.day4Rank}/${totalMembers}]\`
        \`-\` ${keys[4]}: **${member.day5XP}** \`[#${member.day5Rank}/${totalMembers}]\`
        \`-\` ${keys[5]}: **${member.day6XP}** \`[#${member.day6Rank}/${totalMembers}]\`
        \`-\` ${keys[6]}: **${member.day7XP}** \`[#${member.day7Rank}/${totalMembers}]\``,
        true
      )
      .addField(
        "Weekly GXP",
        `\`-\` **${member.weeklyXP}** \`[#${member.weeklyRank}/${totalMembers}]\``,
        true
      )
      .attachFiles([{ name: "skin.png", attachment: skinUrl }])
      .setThumbnail("attachment://skin.png");

    message.channel.stopTyping();
    message.channel.send(embed);
  }
}

export default Member;
