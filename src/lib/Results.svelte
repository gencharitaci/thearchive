<script>
  import { image } from '../store'
  export let data
</script>

{#if data}
  <section class="hidden bg-white mr-1 p-2 grow md:block rounded-b-md overflow-auto overflow-y-scroll " >

    {#each data as el}
      <button
        class="text-sm p-1 rounded mb-2 w-full block border-2 drop-shadow border-transparent text-center hover:shadow cursor-pointer transition-all ease-in-out duration-300 {el.file ===
        $image
          ? 'bg-pink-600 text-white'
          : 'bg-neutral-100'} hover:border-pink-500"
        on:click={() => ($image = el.file)}
        data-file={el.file}
      >
        {el.label || el.file.replaceAll('_', ' ').replaceAll('.jpg', '').replaceAll('.webp', '')}
        </button>
    {/each}
  </section>

   <!-- show drop down for small screens -->
    <div class="md:hidden bg-white rounded-b-md mr-1 p-2">
      <label for="mapselector" class="block text-center text-sm font-bold">Maps</label>
      <select
        bind:value={$image}
        id="mapselector"
        class="w-full"
      >
        {#each data as el}
          <option value={el.file}>{el.label || el.file.replaceAll('_', ' ').replaceAll('.jpg', '').replaceAll('.webp', '')}</option>
        {/each}
      </select>
    </div>
{/if}