<script>
import AutoComplete from './Autocomplete.svelte'
import { image } from '../store'

export let book
export let page

let items = []
let nomatch = false
let spinner = false
let address = ''

function jsonToURL(obj) {
  return Object.keys(obj)
    .map(i => i + '=' + encodeURIComponent(obj[i]))
    .join('&')
}

// set store to selected value
function handleHit(event) {
  fetch(`https://maps.mecknc.gov/api/v1/query/scans?columns=year,book,page,file&filter=scantype='taxmap' and book='${event.detail.groundpid.substring(0,3)}' and page='${event.detail.groundpid.substring(3,5)}'&limit=1`)
  .then(response => response.json())
  .then(json => {
    if (json.length === 1) {
      $image = json[0].file
      book = json[0].book
      page = json[0].page
    }
  })
  .catch(error => {
    console.error('There has been a problem with your fetch operation:', error);
  })

}

// fetch suggestions
async function handleQuery(event) {
  const queryString = event.detail.trim()
  const urls = []

  // address
  const addressArg = {
    columns: "groundpid, full_address as value",
    limit: 8,
    filter: `ts @@ to_tsquery('addressing_en', '${queryString.toUpperCase().replace(/ /g, '&') + ':*'}') and cde_status='A' and the_geom is not null`
  }
  urls.push(`https://maps.mecknc.gov/api/v1/query/master_address_table?${jsonToURL(addressArg)}`)



  // Fetch all the things
  spinner = true
  Promise.all(urls.map(url =>
    fetch(url)
      .then(resp => resp.json())
  )).then(jsons => {
    spinner = false
    nomatch = false
    items = [].concat(...jsons)
    if (items.length === 0) nomatch = true
  })

}
</script>


<AutoComplete placeholder="Address search" minChar={4} nomatch={nomatch} {items} on:hit={handleHit} on:query={handleQuery} value={address} spinner={spinner} />
