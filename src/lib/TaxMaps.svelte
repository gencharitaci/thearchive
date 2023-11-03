<script>
  import Results from './Results.svelte'
  import Search from './Search.svelte'
  import { writable } from 'svelte/store'

  const filterString = writable('')
  let data
  let book = writable('001')
  let page = writable('index')
  let books = []
  let pages = []


  book.subscribe((value) => {
    fetch(`https://maps.mecknc.gov/api/v1/query/scans?columns=distinct(page)%20as%20page&filter=scantype='taxmap' and book='${value}'&sort=page&limit=1000`)
      .then((response) => response.json())
      .then((json) => {
        pages = json
        const checkPages = json.map(el => el.page)
        if (!checkPages.includes($page)) $page = pages[0].page
        updateRecords(`https://maps.mecknc.gov/api/v1/query/scans?columns=year,book,page,file&filter=scantype='taxmap' and book='${value}' and page='${$page}'&sort=book%2C%20CASE%20WHEN%20page%20~%20'%5E%5Ba-zA-Z%5D'%20THEN%201%20WHEN%20page%20~%20'%5E%5B0-9%5D'%20THEN%202%20END,year&limit=2000`)
      })
  })

  page.subscribe((value) => {
    updateRecords(`https://maps.mecknc.gov/api/v1/query/scans?columns=year,book,page,file&filter=scantype='taxmap' and book='${$book}' and page='${value}'&sort=book%2C%20CASE%20WHEN%20page%20~%20'%5E%5Ba-zA-Z%5D'%20THEN%201%20WHEN%20page%20~%20'%5E%5B0-9%5D'%20THEN%202%20END,year&limit=2000`)
  })

  function updateRecords(url) {
    fetch(url)
    .then((response) => response.json())
    .then((json) => {
      data = json.map(v => ({...v, label: `${v.year} ${v.book}-${v.page}`}))
    })
  }


  // fetch books
  fetch(
    "https://maps.mecknc.gov/api/v1/query/scans?columns=distinct(book)%20as%20book&filter=scantype='taxmap'&sort=book&limit=1000"
  )
    .then((response) => response.json())
    .then((json) => {
      books = json.map((el) => el.book)
    })
    .catch((error) => {
      console.error(
        "There has been a problem with your fetch operation:",
        error
      )
    })

</script>

<div class="bg-white mr-1 p-4">
<div class=" text-center justify-around flex flex-row">
  <div>
    <label for="book" class="block text-center text-sm font-bold">Book</label>
    <select
      bind:value={$book}
      id="book"
    >
      {#each books as book}
        <option>{book}</option>
      {/each}
    </select>
  </div>
  <div>
    <label for="page" class="block text-center text-sm font-bold">Page</label>
    <select
      bind:value={$page}
      id="page"
    >
      {#each pages as pg}
        <option>{pg.page}</option>
      {/each}
    </select>
  </div>


</div>
<Search bind:book={$book} bind:page={$page} />
</div>



{#if data}
  <Results data={data} />
{/if}
