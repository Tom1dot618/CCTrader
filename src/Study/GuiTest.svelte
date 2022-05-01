<script lang="ts">
  import Card, { Content, PrimaryAction } from "@smui/card";

  let clicked = 0;
</script>

<div class="card-container">
  <Card style="width: 360px; background-color:#181A1F;" variant="raised">
    <div style="padding: 1rem;">
      <h2 class="mdc-typography--headline6">A card with media.</h2>
      <h3 class="mdc-typography--subtitle2" style="color: #888;">
        And a subtitle.
      </h3>
    </div>
    <PrimaryAction on:click={() => clicked++}>
      <Content class="mdc-typography--body2">
        And some info text. And the media and info text are a primary action for
        the card.
      </Content>
    </PrimaryAction>
  </Card>
</div>

<pre>Clicked: {clicked}</pre>

<style>
</style>
