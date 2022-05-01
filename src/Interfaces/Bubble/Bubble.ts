import type { ITradeMessage } from "../Messages/ITradeMessage";
import NumberUtils from "../../Utils/NumberUtils";

//--- interfaces
export interface IBubble {
  id: string;
  x: number;
  y: number;
  radius: number;
  velocity: number;
  fillColor: string;
  text: IBubbleText;
}

export interface IBubbleText {
  x: number;
  y: number;
  value: string;
  style: string;
  anchor: string;
}

//--- create bubble
export function createBubble(
  trade: ITradeMessage,
  width: number,
  height: number
): IBubble {
  //-- initial values
  const radius = trade.size < 1000 ? 7 : (trade.size / 10000) * 10;
  let velocity = 5;
  let x = Math.random() * width;
  let y = height;
  let color = trade.side === "Buy" ? "darkgreen" : "darkred";

  //--- keep space on both sides for the text
  const spacing = 100;
  if (x - radius < 0) {
    x += x - radius + spacing;
  } else if (x + radius > width) {
    x -= width - (x + radius) - spacing;
  }

  //--- text
  let sizeDescription: string = trade.size.toString();
  let fontSize: string = "0.5";

  //--- font and velocity based on trade size
  if (trade.size >= 1000 * 1000) {
    sizeDescription =
      NumberUtils.removeZeroDecimal((trade.size / 1000) * 1000) + "M";
    fontSize = "1.5";
    velocity = 1;
  } else if (trade.size >= 100 * 1000) {
    sizeDescription = NumberUtils.removeZeroDecimal(trade.size / 1000) + "K";
    fontSize = "1";
    velocity = 1.5;
  } else if (trade.size >= 10 * 1000) {
    sizeDescription = NumberUtils.removeZeroDecimal(trade.size / 1000) + "K";
    fontSize = "0.9";
    velocity = 2;
  } else if (trade.size >= 1000) {
    sizeDescription = NumberUtils.removeZeroDecimal(trade.size / 1000) + "K";
    fontSize = ".7";
    velocity = 2.5;
  }

  //--- contruct the text object
  const text: IBubbleText = {
    x: trade.side === "Buy" ? 0 : width - 30,
    y: height + radius,
    value: sizeDescription,
    style: `font-size: ${fontSize}em;`,
    anchor: trade.side === "Buy" ? "start" : "end",
  };

  //--- construct the bubble object
  return {
    id: trade.trade_id,
    x: x,
    y: y,
    radius: radius,
    velocity: velocity,
    fillColor: color,
    text: text,
  };
}

/* "#27ae60" : "#c0392b", */
