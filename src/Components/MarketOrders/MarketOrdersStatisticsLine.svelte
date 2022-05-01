<!-- MarketOrdersStatisticsLine -->
<script lang="ts">
  export let variant: string = "";
  export let buy: string;
  export let label: string;
  export let sell: string;

  const addBigClass = variant === "big" ? "big" : "";
</script>

<!-- Card -->
<div class="summary">
  <span class="buy {addBigClass}">{buy}</span>
  <span class="label">{label}</span>
  <span class="sell {addBigClass}">{sell}</span>
</div>

<style>
  .summary {
    font-size: 0.75rem;
    line-height: 1rem;
    font-weight: 400;
    margin-left: 0.5rem;
    margin-right: 0.5rem;
    display: flex;

    justify-content: space-between;
  }

  .big {
    font-size: 1.5rem;
    line-height: 2rem;
    font-weight: 700;
  }
  .buy {
    color: green;
  }

  .label {
    text-transform: uppercase;
    font-size: 0.55rem;
  }

  .sell {
    color: red;
  }
</style>
