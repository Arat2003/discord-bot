import fetch from "node-fetch";
import wrapProfile from "../skyblock/functions/wrapProfile";

export default async function skyblockWrapper(uuid: string) {
  const skyblock = await fetch(
    `https://api.hypixel.net/skyblock/profiles?key=${process.env.API_KEY}&uuid=${uuid}`
  ).then((res) => res.json());

  const userProfiles = [];
  for (const profile of skyblock.profiles) {
    userProfiles.push(wrapProfile(profile, profile.members[uuid]));
  }

  return userProfiles;
}
