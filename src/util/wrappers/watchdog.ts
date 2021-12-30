import fetch from "node-fetch";

export default async function watchdogWrapper() {
  const watchdog = await fetch(
    `https://api.hypixel.net/watchdogstats?key=${process.env.API_KEY}`
  ).then((res) => res.json());

  return watchdog;
}
