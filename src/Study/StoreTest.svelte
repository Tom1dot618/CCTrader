<script lang="ts">
  import { items } from "./Store";

  $items["BTCUSD"] = [
    { id: 11, amount: 0, names: ["a", "b", "c"] },
    { id: 22, amount: 0, names: ["d", "e", "f"] },
    { id: 33, amount: 0, names: ["g", "h", "i"] },
  ];

  $items["ETHUSD"] = [
    { id: 1, amount: 0, names: ["a", "b", "c"] },
    { id: 2, amount: 0, names: ["d", "e", "f"] },
    { id: 3, amount: 0, names: ["g", "h", "i"] },
  ];

  function updateItem() {
    //$items.find((item) => item.id === 3).amount++;
  }

  function addItem() {
    //$items = [...$items, { id: $items.length + 1, amount: 0, names: [] }];
  }
</script>

<button on:click={addItem}>add</button>
<button on:click={updateItem}>1</button>

<ul>
  {#each $items["BTCUSD"] as item}
    <li>
      {item.id}: {item.amount}

      <ul>
        {#each item.names as name}
          <li>{name}</li>
        {/each}
      </ul>
    </li>
  {/each}
</ul>

<style>
</style>
