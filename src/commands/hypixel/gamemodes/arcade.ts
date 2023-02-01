import { EmbedField, Message, TextChannel } from "discord.js";
import Command from "../../../structures/client/Command";
import UserModel from "../../../util/database/User";
import { getUserOrUUID } from "../../../util/functions/mcUuidFunctions";
import Pagination from "../../../util/functions/pagination";
import { Categories } from "../../../util/interfaces/cmdCategories";
import { ErrorResponses } from "../../../util/interfaces/responses";
import arcadeWrapper from "../../../util/wrappers/gamemodes/arcade";
import playerWrapper from "../../../util/wrappers/player";
import skinImage from "../../../util/wrappers/skinImage";

class Arcade extends Command {
  name = "arcade";
  description = "Player's Arcade stats.";
  category: Categories = "Player";
  usage = "[username]";
  stats = true;

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
        embeds: [
          this.client.errorEmbed(ErrorResponses.USER_NOT_LOGGED_INTO_HYPIXEL)
        ]
      });
    }

    const stats = arcadeWrapper(player.stats.Arcade);

    let p1: EmbedField[] = [
      { name: "Coins", value: `\`${stats.coins}\``, inline: true },
      {
        name: "Dragon Wars Kills",
        value: `\`${stats.dragonWars.kills}\``,
        inline: true,
      },
      {
        name: "Dragon Wars Wins",
        value: `\`${stats.dragonWars.wins}\``,
        inline: true,
      },
      {
        name: "Blocking Dead Kills",
        value: `\`${stats.blockingDead.kills}\``,
        inline: true,
      },
      {
        name: "Blocking Dead Headshots",
        value: `\`${stats.blockingDead.headshots}\``,
        inline: true,
      },
      {
        name: "Blocking Dead Wins",
        value: `\`${stats.blockingDead.wins}\``,
        inline: true,
      },
      {
        name: "Hypixel Says Wins",
        value: `\`${stats.hypixelSays.wins}\``,
        inline: true,
      },
      {
        name: "Hypixel Says Rounds Played",
        value: `\`${stats.hypixelSays.rounds_played}\``,
        inline: true,
      },
      {
        name: "Hypixel Says WLR",
        value: `\`${stats.hypixelSays.wlr}\``,
        inline: true,
      },
    ];

    let p2: EmbedField[] = [
      {
        name: "Hole In The Wall Wins",
        value: `\`${stats.holeInTheWall.wins}\``,
        inline: true,
      },
      {
        name: "HITW Rounds Played",
        value: `\`${stats.holeInTheWall.rounds_played}\``,
        inline: true,
      },
      {
        name: "HITW WLR",
        value: `\`${stats.holeInTheWall.wlr}\``,
        inline: true,
      },
      {
        name: "Scuba Simulator Wins",
        value: `\`${stats.scubaSimulator.wins}\``,
        inline: true,
      },
      {
        name: "Scuba Sim. Items Found",
        value: `\`${stats.scubaSimulator.items_found}\``,
        inline: true,
      },
      {
        name: "Scuba Sim. Points",
        value: `\`${stats.scubaSimulator.points}\``,
        inline: true,
      },
      {
        name: "Ender Spleef Trail",
        value: `\`${stats.enderSpleef.trail}\``,
        inline: true,
      },
      {
        name: "Ender Spleef Wins",
        value: `\`${stats.enderSpleef.wins}\``,
        inline: true,
      },
      {
        name: "Party Games Wins",
        value: `\`${stats.partyGames.wins}\``,
        inline: true,
      },
    ];

    let p3: EmbedField[] = [
      { name: "Kit", value: `\`${stats.miniWalls.kit}\``, inline: true },
      { name: "Wins", value: `\`${stats.miniWalls.wins}\``, inline: true },
      {
        name: "Final Kills",
        value: `\`${stats.miniWalls.finalKills}\``,
        inline: true,
      },
      { name: "Kills", value: `\`${stats.miniWalls.kills}\``, inline: true },
      { name: "Deaths", value: `\`${stats.miniWalls.deaths}\``, inline: true },
      { name: "KDR", value: `\`${stats.miniWalls.kdr}\``, inline: true },
      {
        name: "Arrows Shot",
        value: `\`${stats.miniWalls.arrows_shot}\``,
        inline: true,
      },
      {
        name: "Arrows Hit",
        value: `\`${stats.miniWalls.arrows_hit}\``,
        inline: true,
      },
      {
        name: "Bow Accuracy",
        value: `\`${stats.miniWalls.bow_accuracy}%\``,
        inline: true,
      },
      {
        name: "Wither Damage",
        value: `\`${stats.miniWalls.wither_damage}\``,
        inline: true,
      },
      {
        name: "Wither Kills",
        value: `\`${stats.miniWalls.wither_kills}\``,
        inline: true,
      },
    ];

    let p4: EmbedField[] = [
      {
        name: "Highest Round",
        value: `\`${stats.zombies.highest_round}\``,
        inline: true,
      },
      {
        name: "Doors Opened",
        value: `\`${stats.zombies.doors_opened}\``,
        inline: true,
      },
      {
        name: "Windows Repaired",
        value: `\`${stats.zombies.windows_repaired}\``,
        inline: true,
      },
      { name: "Kills", value: `\`${stats.zombies.kills}\``, inline: true },
      { name: "Deaths", value: `\`${stats.zombies.deaths}\``, inline: true },
      { name: "KDR", value: `\`${stats.zombies.kdr}\``, inline: true },
      { name: "Downs", value: `\`${stats.zombies.downs}\``, inline: true },
      {
        name: "Players Revived",
        value: `\`${stats.zombies.players_revived}\``,
        inline: true,
      },
    ];

    let p5: EmbedField[] = [
      {
        name: "Hider Wins",
        value: `\`${stats.hideAndSeek.hider_wins}\``,
        inline: true,
      },
      {
        name: "Party Pooper Hider Wins",
        value: `\`${stats.hideAndSeek.party_pooper_hider_wins}\``,
        inline: true,
      },
      {
        name: "Seeker Wins",
        value: `\`${stats.hideAndSeek.seeker_wins}\``,
        inline: true,
      },
      {
        name: "Party Pooper Seeker Wins",
        value: `\`${stats.hideAndSeek.party_pooper_seeker_wins}\``,
        inline: true,
      },
    ];

    let p6: EmbedField[] = [
      {
        name: "Kills",
        value: `\`${stats.oneInTheQuiver.kills}\``,
        inline: true,
      },
      {
        name: "Deaths",
        value: `\`${stats.oneInTheQuiver.deaths}\``,
        inline: true,
      },
      { name: "KDR", value: `\`${stats.oneInTheQuiver.kdr}\``, inline: true },
      {
        name: "Bounty Kills",
        value: `\`${stats.oneInTheQuiver.bounty_kills}\``,
        inline: true,
      },
      { name: "Wins", value: `\`${stats.oneInTheQuiver.wins}\``, inline: true },
    ];

    let p7: EmbedField[] = [
      { name: "Kicks", value: `\`${stats.soccer.kicks}\``, inline: true },
      {
        name: "Powered Kicks",
        value: `\`${stats.soccer.powerkicks}\``,
        inline: true,
      },
      { name: "Goals", value: `\`${stats.soccer.goals}\``, inline: true },
      { name: "Wins", value: `\`${stats.soccer.wins}\``, inline: true },
    ];

    let p8: EmbedField[] = [
      { name: "Kills", value: `\`${stats.throwOut.kills}\``, inline: true },
      { name: "Deaths", value: `\`${stats.throwOut.deaths}\``, inline: true },
      { name: "KDR", value: `\`${stats.throwOut.kdr}\``, inline: true },
      { name: "Wins", value: `\`${stats.throwOut.wins}\``, inline: true },
    ];

    let p9: EmbedField[] = [
      { name: "Kills", value: `\`${stats.galaxyWars.kills}\``, inline: true },
      { name: "Deaths", value: `\`${stats.galaxyWars.deaths}\``, inline: true },
      { name: "KDR", value: `\`${stats.galaxyWars.kdr}\``, inline: true },
      {
        name: "Empire Kills",
        value: `\`${stats.galaxyWars.empire_kills}\``,
        inline: true,
      },
      {
        name: "Rebel Kills",
        value: `\`${stats.galaxyWars.rebel_kills}\``,
        inline: true,
      },
      {
        name: "Shots Fired",
        value: `\`${stats.galaxyWars.shots_fired}\``,
        inline: true,
      },
      { name: "Wins", value: `\`${stats.galaxyWars.wins}\``, inline: true },
    ];

    let p10: EmbedField[] = [
      { name: "Wins", value: `\`${stats.farmHunt.wins}\``, inline: true },
      {
        name: "Poop Collected",
        value: `\`${stats.farmHunt.poop_collected}\``,
        inline: true,
      },
    ];

    const skinUrl = skinImage(playerUUID, "face");

    let pages = [
      { arr: p1, desc: "Overall" },
      { arr: p2, desc: "Overall" },
      { arr: p3, desc: "Mini Walls" },
      { arr: p4, desc: "Zombies" },
      { arr: p5, desc: "Hide and Seek" },
      { arr: p6, desc: "One in the Quiver" },
      { arr: p7, desc: "Soccer" },
      { arr: p8, desc: "Throw Out" },
      { arr: p9, desc: "Galaxy Wars" },
      { arr: p10, desc: "Farm Hunt" },
    ];

    const embeds = pages.map((page) => {
      const embed = this.client
        .templateEmbed()
        .addFields(page.arr)
        .setColor(player.parsed.plusColor)
        .setTitle(
          `${player.parsed.rank !== "Non" ? `[${player.parsed.rank}]` : ""} ${
            player.parsed.name
          }`
        )
        .setDescription(`Arcade - **${page.desc}**`)
        .setThumbnail("attachment://img.png");

      return embed;
    });

    const pagination = new Pagination(message.channel as TextChannel, embeds, skinUrl);
    pagination.paginate(60000);
    return;
  }
}

export default Arcade;
