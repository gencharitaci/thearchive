<script>
  import Results from './Results.svelte'
  import { writable } from 'svelte/store'

  const filterString = writable('')
  let data

  filterString.subscribe((value) => {
    runFilter(value)
  })

  async function runFilter(value) {
    let url = "https://maps.mecknc.gov/api/v1/query/scans?columns=file&filter=scantype='unrecorded'&limit=100&sort=file"
    if (value.trim().length > 0) {
      url = `https://maps.mecknc.gov/api/v1/query/scans?columns=file&filter=scantype%3D'unrecorded'%20and%20file%20ilike%20'%25${value}%25'&limit=100&sort=file`
    }

    const response = await fetch(url)
    data = await response.json()
  }

</script>

<div class="mr-1 p-4 text-center bg-white">
  <input placeholder="Title search" class="w-full" type="text" bind:value={$filterString}>
</div>

{#if data}
  <Results data={data} />
{/if}
