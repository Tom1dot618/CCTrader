import { writable, derived, readable } from "svelte/store";

import type { IPair } from "../Interfaces/Pair/IPair";
import type Subscription from "../Models/Subscription/Subscription";

//--- Stores
export const DEBUG = readable(true);
export const pairs = writable<IPair[]>([]);
export const subscriptions = writable<Subscription[]>([]);
