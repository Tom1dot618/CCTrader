export interface ITradeMessage {
  trade_time_ms: number;
  timestamp: Date;
  symbol: string;
  side: string;
  size: number;
  price: number;
  tick_direction: string;
  trade_id: string;
  cross_seq: number;
}
