import moment from "moment";
import fetch from "node-fetch";
import { ParsedFriends } from "../interfaces/ParsedObjects/ParsedFriends";

export default async function friendsWrapper(uuid: string) {
  const { records } = await fetch(
    `https://api.hypixel.net/friends?key=${process.env.API_KEY}&uuid=${uuid}`
  ).then((r) => r.json());
  if (!records) return null;

  let fl: FriendObj[] = Object.values(records);
  let friends: ParsedFriends[] = [];

  for (let i = 0; i < fl.length; i++) {
    if (fl[i].uuidSender == uuid) {
      friends.push({
        uuid: fl[i].uuidReceiver,
        started: moment(fl[i].started).format("MM/DD/YYYY"),
      });
    } else if (fl[i].uuidSender !== uuid) {
      friends.push({
        uuid: fl[i].uuidSender,
        started: moment(fl[i].started).format("MM/DD/YYYY"),
      });
    }
  }

  return friends;
}

interface FriendObj {
  _id: string;
  uuidSender: string;
  uuidReceiver: string;
  started: number;
}
