<!-- <script lang="ts">
  import Grid from "svelte-grid";
  import gridHelp from "svelte-grid/build/helper/index.mjs";
  import PairItem from "./PairItem.svelte";
  import { subscriptions } from "../Stores/DataStore";
  import type Subscription from "../Models/Subscription/Subscription";
  import { each } from "svelte/internal";

  let widgets = [];
  let xCounter = 0;
  let xPosition = 0;
  let yPosition = 0;
  const COLS = 15;

  //--- create grid of subscription widgets
  $subscriptions.forEach((subscription, index) => {
    if (xCounter === COLS) {
      xCounter = 0;
      xPosition = 0;
      yPosition += 2;
    }

    widgets.push({
      [COLS]: gridHelp.item({
        x: xPosition,
        y: yPosition,
        w: 10,
        h: 1,
        resizable: false,
        fixed: true,
      }),

      id: index,
      data: {
        pair: subscription.pair,
      },
    });
    xCounter += 10;
    xPosition += 10;
  });

  const cols = [[1200, COLS]];
</script>

<!--- display grid --->
<!-- <div>
  <Grid bind:items={widgets} rowHeight={100} let:item let:dataItem {cols}>
    <PairItem subscription={dataItem.data} />
  </Grid>
</div>
-->
-->
