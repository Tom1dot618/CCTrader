import { writable } from "svelte/store";

export interface ILotSizeFilter {
  max_trading_qy: number;
  min_trading_qty: number;
  qty_step: number;
}

export const createLotSizeFilter = (
  lotSizeFilter: ILotSizeFilter
): ILotSizeFilter => {
  const { subscribe, set, update } = writable(0);
  return {
    ...lotSizeFilter,
    max_trading_qy: lotSizeFilter.max_trading_qy,
    min_trading_qty: lotSizeFilter.min_trading_qty,
    qty_step: lotSizeFilter.qty_step,
  };
};
