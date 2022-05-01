<!-- MarketOrdersWidget -->
<script lang="ts">
  import { subscriptions } from "../../Stores/DataStore";
  import BubbleList from "../Bubble/BubbleList.svelte";
  import MarketOrdersPairName from "./MarketOrdersPairName.svelte";
  import MarketOrdersStatisticsLine from "./MarketOrdersStatisticsLine.svelte";
  import NumberUtils from "../../Utils/NumberUtils";

  export let index: number;
  export let width: number;
  export let height: number;
</script>

<!-- Card -->
<div class="card">
  <!-- header -->
  <MarketOrdersPairName
    baseCurrency={$subscriptions[index].pair.base_currency}
    quoteCurrency={$subscriptions[index].pair.quote_currency}
  />
  <!-- divider -->
  <hr />
  <!-- content -->

  <MarketOrdersStatisticsLine
    buy={NumberUtils.internationalizeNumber($subscriptions[index].numberOfBuys)}
    label="amount"
    sell={NumberUtils.internationalizeNumber(
      $subscriptions[index].numberOfSells
    )}
  />
  <MarketOrdersStatisticsLine
    variant="big"
    buy={NumberUtils.financializeNumber($subscriptions[index].buyVolume)}
    label="volume"
    sell={NumberUtils.financializeNumber($subscriptions[index].sellVolume)}
  />
  <MarketOrdersStatisticsLine
    buy={NumberUtils.financializeNumber($subscriptions[index].averageBuyVolume)}
    label="average"
    sell={NumberUtils.financializeNumber(
      $subscriptions[index].averageSellVolume
    )}
  />
  <div class="clear" />
  <!-- divider -->
  <hr />
  <!-- bubbles -->
  <BubbleList {width} {height} bubbles={$subscriptions[index].bubbles} />
</div>

<style>
  .card {
    padding: 1rem;
    background-color: #02031b;
    border-radius: 0.5rem;
  }

  hr {
    border: 0;
    border-top: 1px solid #23232f;
  }
</style>
