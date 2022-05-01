<!-- BubbleList -->
<script lang="ts">
  import type { IBubble } from "../../Interfaces/Bubble/Bubble";

  import BubbleItem from "./BubbleItem.svelte";
  import BubbleItemText from "./BubbleItemText.svelte";

  //--- parameters for the container
  export let width: number;
  export let height: number;
  export let bubbles: IBubble[];
</script>

<svg width="100%" viewBox="0 0 {width} {height}">
  <defs>
    <!-- Gaussian svg filter -->
    <filter id="goo">
      <feGaussianBlur in="SourceGraphic" stdDeviation="8" />
      <feColorMatrix
        in="blur"
        type="matrix"
        values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 21 -5"
      />
      <feBlend />
    </filter>
  </defs>

  <!-- svg item group -->
  <g filter="url(#goo)">
    <rect x="0" y={height - 10} {width} height="10" opacity="0.5" />
    {#each bubbles as bubble}
      <BubbleItem {bubble} />
    {/each}
    <rect x="0" y="0" {width} height="10" opacity="0.5" />
  </g>
  <!--   {#each bubbles as bubble}
    <BubbleItemText {bubble} />
  {/each} -->
</svg>
