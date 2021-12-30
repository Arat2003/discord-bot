import Canvas from "canvas";

export function setPixelated(context: Canvas.CanvasRenderingContext2D) {
  context["imageSmoothingEnabled"] = false;
}
