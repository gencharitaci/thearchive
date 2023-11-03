import { writable, readable } from "svelte/store"

// Handle nav events
let browserNav = false

export const imgBaseUrl = readable('https://maps.mecknc.gov/scans/')
export let tab = writable('')
export let image = writable('')

function readHash() {
  const arg = window.location.hash.replace("#", "")
  if (arg.length > 1) {
    fetch(
      `https://maps.mecknc.gov/api/v1/query/scans?columns=scantype,file&filter=file='${arg}'`
    )
      .then((response) => response.json())
      .then((json) => {
        if (json.length > 0) {
          image.set(json[0].file)
          tab.set(json[0].scantype)
        }
      })
      .catch((error) => {
        console.error(
          "There has been a problem with your fetch operation:",
          error
        )
      })
  } else {
    image.set('Charlotte_Elmwood_Cemetery_Plan_For_Entrance_Gate_0000.jpg')
    tab.set('historic')
  }
}
readHash()


image.subscribe((val) => {
  if (!browserNav) history.pushState({}, "", `#${val}`)
  browserNav = false
})
window.addEventListener("popstate", (event) => {
  browserNav = true
  readHash()
})