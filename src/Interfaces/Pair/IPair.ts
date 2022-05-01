import { writable } from "svelte/store";
import { ILeverageFilter, createLeverageFilter } from "./ILeverageFilter";
import { ILotSizeFilter, createLotSizeFilter } from "./ILotSizeFilter";
import { IPriceFilter, createPriceFilter } from "./IPriceFilter";

export interface IPair {
  name: string;
  alias: string;
  status: string;
  base_currency: string;
  quote_currency: string;
  price_scale: number;
  taker_fee: string;
  maker_fee: string;
  funding_interval: number;
  leverage_filter: ILeverageFilter;
  price_filter: IPriceFilter;
  lot_size_filter: ILotSizeFilter;
}

export const createPair = (pair: IPair): IPair => {
  const { subscribe, set, update } = writable(0);
  return {
    ...pair,
    leverage_filter: createLeverageFilter(pair.leverage_filter),
    price_filter: createPriceFilter(pair.price_filter),
    lot_size_filter: createLotSizeFilter(pair.lot_size_filter),
  };
};
