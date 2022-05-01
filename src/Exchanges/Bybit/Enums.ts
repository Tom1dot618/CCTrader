export enum BybitEndPointUrl {
  MainnetStreamInversePerpetual = "wss://stream.bybit.com/realtime",
  MainnetStreamSpot = "wss://stream.bybit.com/spot/ws",
  MainnetRestServer1 = "https://api.bybit.com",
  MainnetRestServer2 = "https://api.bytick.com",
}

export enum BybitRestEndPoint {
  QuerySymbols = "/v2/public/symbols",
}

export enum ByBitContractStatus {
  Trading = "Trading",
  Settling = "Settling",
  Closed = "Closed",
}

export enum ByBitStreamTopics {
  Trade = "trade",
  OrderbookLevel2 = "orderBookL2_25",
}
