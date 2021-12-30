import { base_stats } from "../constants/misc";
import decryptBase64Items from "./decryptBase64Items";

export default async function wrapProfile(_profile: any, player: any) {
  let stats = Object.assign({}, base_stats);

  // Fairy Souls:
  if (!player.fairy_souls_collected) player.fairy_souls_collected = 0;
  if (!player.fairy_exchanges) player.fairy_exchanges = 0;

  // Inventory Items:
  let inventory: any = player.inv_contents
    ? await decryptBase64Items(player.inv_contents.data)
    : null;

  console.log(inventory?.value.i?.value.value);

  return stats;
}
