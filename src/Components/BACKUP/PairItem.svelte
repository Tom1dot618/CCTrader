<!-- <script lang="ts">
  import Card, { Content, PrimaryAction } from "@smui/card";
  import type Subscription from "../Models/Subscription/Subscription";
  import {
    trades,
    numberOfBuys,
    numberOfSells,
    buyVolume,
    sellVolume,
    subscriptions,
  } from "../Stores/DataStore";
  export let subscription;
</script>

<div class="card-container">
  <Card
    style="width=100%; height=100%; background-color:#181A1F; margin=1rem;"
    variant="raised"
  >
    <div class="card-header">
      <h2 class="mdc-typography--headline6">
        {subscription.pair.base_currency}
      </h2>
      <h3 class="mdc-typography--subtitle2" style="color: #888;">
        {subscription.pair.quote_currency}
      </h3>
    </div>

    <div class="card-content">
      <Content class="mdc-typography--body2">
        {$numberOfBuys}<br />
        {$numberOfSells}<br />
        {$buyVolume}<br />
        {$sellVolume}<br />
      </Content>
    </div>
  </Card>
</div>

<style>
  .card-header,
  .card-content {
    padding: 1rem;
    padding-left: 2rem;
  }
</style>
 -->
