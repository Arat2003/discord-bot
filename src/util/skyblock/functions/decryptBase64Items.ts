import { promisify } from "node:util";
import nbt from "prismarine-nbt";

export default async function decryptBase64Items(content: any) {
  const decrypt = promisify(nbt.parse);

  let decrypted = content
    ? await decrypt(Buffer.from(content, "base64"))
    : null;

  return decrypted;
}
