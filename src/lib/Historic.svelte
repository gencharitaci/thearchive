<script>
  import Results from './Results.svelte'

  let filterString = ''
  let promise = fetch("https://gis.mecklenburgcountync.gov/dirt/api/v1/query/scans?columns=file&filter=scantype='historic'").then((x) => x.json())

  function filter(data, str) {
    const searchStr = str.trim().toUpperCase()
    if (searchStr.length > 0) {
      data = data.filter(el => el.file.toUpperCase().indexOf(searchStr) !== -1 )
    }

    data.sort((a, b) => {
      return a.file < b.file ? -1 : 1
    })

    return data
  }

</script>

<div class="mr-1 p-4 text-center bg-white">
  <input 
  id="title-search-historic"
  name="addressSearchHistoric"
  placeholder="Title search" 
  class="w-full" 
  type="text" 
  bind:value={filterString}
  >
</div>

{#await promise}
	<div class="text-center">
    <div class="lds-dual-ring"></div>
  </div>
{:then data}
	<!-- promise was fulfilled -->
  <Results data={filter(data, filterString)} />

{:catch error}
	<!-- optionally show something while promise was rejected -->
{/await}