import { writable } from "svelte/store";

export interface IPriceFilter {
  min_price: string;
  max_price: string;
  tick_size: string;
}

export const createPriceFilter = (priceFilter: IPriceFilter): IPriceFilter => {
  const { subscribe, set, update } = writable(0);
  return {
    ...priceFilter,
    min_price: priceFilter.min_price,
    max_price: priceFilter.max_price,
    tick_size: priceFilter.tick_size,
  };
};
