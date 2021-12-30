import "dotenv/config";
import Client from "./structures/client/Client";

const client = new Client(process.env.DEV_TOKEN as string);

client.start();
