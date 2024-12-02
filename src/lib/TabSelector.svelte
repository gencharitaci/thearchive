<script>
  import { tab } from "../store";
  import TaxMaps from "./TaxMaps.svelte";
  import Historic from "./Historic.svelte";
  import Unrecorded from "./Unrecorded.svelte";
</script>

<nav class="flex flex-row">
  <button
    class:active={$tab === "historic"}
    on:click={() => ($tab = "historic")}
  >
    Historic
  </button>
  <button class:active={$tab === "taxmap"} on:click={() => ($tab = "taxmap")}>
    Tax Map
  </button>
  <button
    class:active={$tab === "unrecorded"}
    on:click={() => ($tab = "unrecorded")}
  >
    Unrecorded
  </button>
</nav>

<div
  class:hidden={$tab !== "historic"}
  class="flex flex-col grow overflow-hidden"
>
  <Historic />
</div>
<div
  class:hidden={$tab !== "taxmap"}
  class="flex flex-col grow overflow-hidden"
>
  <TaxMaps />
</div>
<div
  class:hidden={$tab !== "unrecorded"}
  class="flex flex-col grow overflow-hidden"
>
  <Unrecorded />
</div>

<style>
  button {
    @apply text-white whitespace-nowrap rounded-t-md bg-white/20 py-1 px-2 mr-1 block border-b-4 border-transparent hover:border-primaryTeal hover:bg-white/30 transition-colors duration-300 focus:outline-none;
  }
  .active {
    @apply text-primaryTeal font-bold hover:border-white hover:bg-white  bg-white;
  }
</style>
