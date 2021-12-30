export function secsToTime(secs: string | null) {
  if (!secs) return "0 secs";
  let pad = function (num: number, size: number) {
      return ("000" + num).slice(size * -1);
    },
    time = Number(parseFloat(secs).toFixed(3)),
    hours = Math.floor(time / 60 / 60),
    minutes = Math.floor(time / 60) % 60,
    seconds = Math.floor(time - minutes * 60);

  return pad(hours, 2) + ":" + pad(minutes, 2) + ":" + pad(seconds, 2);
}
