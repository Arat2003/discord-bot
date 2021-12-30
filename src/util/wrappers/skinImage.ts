import { skinImageTypes } from "../interfaces/fetchTypes";

export default function skinImage(uuid: string, type: skinImageTypes) {
  return `https://visage.surgeplay.com/${type}/256/${uuid}`;
}
