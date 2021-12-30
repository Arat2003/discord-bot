import fetch from "node-fetch";
import { capitalize } from "../functions/textFunctions";
import { ParsedStatus } from "../interfaces/ParsedObjects/ParsedStatus";

export default async function statusWrapper(uuid: string) {
  const { session }: statusRes = await fetch(
    `https://api.hypixel.net/status?key=${process.env.API_KEY}&uuid=${uuid}`
  ).then((res) => res.json());

  let parsed: ParsedStatus;

  if (!session.online) {
    parsed = { online: false };
    return parsed;
  }

  let type = capitalize(session.gameType.toLowerCase());
  let mode = session.mode ? session.mode.replace("_", " ") : undefined;
  let map = session.map;

  parsed = {
    online: true,
    gameType: type,
    mode,
    map,
  };

  return parsed;
}

interface statusRes {
  success: boolean;
  uuid: string;
  session: Session;
}

interface Session {
  online: true;
  gameType: string;
  mode: string;
  map: string;
}
