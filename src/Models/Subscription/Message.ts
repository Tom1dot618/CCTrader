import { ByBitStreamTopics } from "../../Exchanges/Bybit/Enums";

class Message {
  topic: string = "";
  pair: string = "";
  type: string = "";
  data: Array<any> = [];

  constructor(event: any) {
    const message = JSON.parse(event.data);

    this.topic = message.topic;
    this.pair = message.topic.split(".")[1];
    this.type = message.topic.split(".")[0];
    this.data = message.data;
  }

  get isTrade() {
    return this.type === ByBitStreamTopics.Trade;
  }

  get isOrderbookLevel2() {
    return this.type === ByBitStreamTopics.OrderbookLevel2;
  }
}

export default Message;
