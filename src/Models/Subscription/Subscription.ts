import type { ByBitStreamTopics } from "../../Exchanges/Bybit/Enums";
import type { IBubble } from "../../Interfaces/Bubble/Bubble";
import type { ITradeMessage } from "../../Interfaces/Messages/ITradeMessage";
import { createPair, IPair } from "../../Interfaces/Pair/IPair";
import { writable, Writable } from "svelte/store";

class Subscription {
  pair: IPair;
  type: ByBitStreamTopics;
  trades: ITradeMessage[];
  bubbles: IBubble[];

  constructor(pair: IPair, type: ByBitStreamTopics) {
    this.pair = createPair(pair);
    this.type = type;
    this.trades = [];
    this.bubbles = [];
  }

  get topic() {
    return `${this.type}.${this.pair.alias}`;
  }

  //--- Trade statistics ---
  get numberOfBuys() {
    return this.trades.filter((trade) => trade.side === "Buy").length;
  }

  get numberOfSells() {
    return this.trades.filter((trade) => trade.side === "Sell").length;
  }

  get buyVolume() {
    return this.trades
      .filter((trade) => trade.side === "Buy")
      .reduce((acc, trade) => acc + trade.size, 0);
  }

  get sellVolume() {
    return this.trades
      .filter((trade) => trade.side === "Sell")
      .reduce((acc, trade) => acc + trade.size, 0);
  }

  get averageBuyVolume() {
    if (this.numberOfBuys === 0) return 0;
    return this.buyVolume / this.numberOfBuys;
  }

  get averageSellVolume() {
    if (this.numberOfSells === 0) return 0;
    return this.sellVolume / this.numberOfSells;
  }
}

export default Subscription;
