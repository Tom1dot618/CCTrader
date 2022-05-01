export interface IBybitSymbol {
  name: string;
  alias: string;
  status: string;
  base_currency: string;
  quote_currency: string;
  price_scale: number;
  taker_fee: string;
  maker_fee: string;
  min_leverage: number;
  max_leverage: number;
  leverage_step: string;
  min_price: string;
  max_price: string;
  tick_size: string;
  max_trading_qty: number;
  min_trading_qty: number;
  qty_step: number;
  funding_interval: number;
}
