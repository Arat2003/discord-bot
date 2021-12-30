import { EmbedField } from "discord.js";
import MinestatsClient from "../../structures/client/Client";
import { ParsedPlayer } from "../interfaces/ParsedObjects/ParsedPlayer";

export function gamemodeEmbedMaker(
  client: MinestatsClient,
  player: ParsedPlayer,
  skinUrl: string,
  embedFields: EmbedField[],
  desc: string
) {
  const embed = client
    .templateEmbed()
    .setColor(player.plusColor)
    .setTitle(
      `${player.rank !== "Non" ? `[${player.rank}]` : ""} ${player.name}`
    )
    .attachFiles([{ name: "skin.png", attachment: skinUrl }])
    .setThumbnail("attachment://skin.png")
    .addFields(embedFields)
    .setDescription(desc);

  return embed;
}
