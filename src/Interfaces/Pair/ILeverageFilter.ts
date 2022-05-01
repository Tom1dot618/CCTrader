import { writable } from "svelte/store";

export interface ILeverageFilter {
  min_Leverage: number;
  max_leverage: number;
  leverage_step: string;
}

export const createLeverageFilter = (
  leverageFilter: ILeverageFilter
): ILeverageFilter => {
  const { subscribe, set, update } = writable(0);
  return {
    ...leverageFilter,
    min_Leverage: leverageFilter.min_Leverage,
    max_leverage: leverageFilter.max_leverage,
    leverage_step: leverageFilter.leverage_step,
  };
};
