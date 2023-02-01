import fetch from "node-fetch";
import NodeCache from "node-cache";
import chalk from "chalk";
import { HttpStatusCodes } from "../interfaces/responses";
import { insertString } from "./textFunctions";

export const uuidToUserCache = new NodeCache({ stdTTL: 3600 });
export const userToUuidCache = new NodeCache({ stdTTL: 3600 });

// const NICKNAME_REGEX = /^[a-zA-Z0-9_]{3,16}$/;
// const SIMPLIFIED_UUID_REGEX = /^[0-9a-f]{32}$/;
const FULL_UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;

export async function getUserOrUUID(user: string) {
  let res: Res;
  if (FULL_UUID_REGEX.test(user)) user.replace(/-/gm, "");
  if (uuidToUserCache.has(user)) {
    res = { uuid: userToUuidCache.get(uuidToUserCache.get(user)!)! as string, name: uuidToUserCache.get(user) as string};
    return res;
  }
  if (userToUuidCache.has(user)) {
    res = { uuid: userToUuidCache.get(user) as string, name: uuidToUserCache.get(userToUuidCache.get(user)!)! as string};
    return res;
  }

  let profileResponse: any;

  profileResponse = await fetch(
    `https://api.ashcon.app/mojang/v2/user/${user}`
  ).catch((err) =>
    console.log(chalk.red.bold("[UUID Converter] ") + chalk.red(`${err}`))
  );

  if (profileResponse?.status === HttpStatusCodes.SUCCESSFUL_REQUEST) {
    const profileJson: ProfileRes = await profileResponse
      .json()
      .catch((err: any) =>
        console.log(chalk.red.bold("[UUID Converter]") + chalk.red(`${err}`))
      );
    profileJson.uuid = profileJson.uuid.replace(/-/gm, "");

    uuidToUserCache.set(profileJson.uuid, profileJson.username);
    userToUuidCache.set(profileJson.username.toLowerCase(), profileJson.uuid);
    res = { uuid: profileJson.uuid, name: profileJson.username };

    return res;
  } else {
    return null;
  }
}

export const formatTrimmedUuid = (trimmedUuid: string): string => {
  trimmedUuid = insertString(trimmedUuid, 8, "-");
  trimmedUuid = insertString(trimmedUuid, 13, "-");
  trimmedUuid = insertString(trimmedUuid, 18, "-");
  trimmedUuid = insertString(trimmedUuid, 23, "-");
  return trimmedUuid;
};

interface Res {
  uuid: string;
  name: string;
}

export interface ProfileRes {
  uuid: string;
  username: string;
  username_history: Usernames[];
  created_at: string;
  textures: Textures;
}

interface Usernames {
  username: string;
  changed_at?: string;
}

interface Textures {
  custom: boolean;
  slim: boolean;
  skin: Skin;
  raw: RawTextures;
}

interface Skin {
  url: string;
  data: string;
}

interface RawTextures {
  value: string;
  signature: string;
}
