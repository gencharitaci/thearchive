import "./app.postcss"
import TabStrip from "./lib/TabSelector.svelte"
import Viewer from './lib/Viewer.svelte'

new TabStrip({
  target: document.getElementById("tabstrip")
})

new Viewer({
  target: document.getElementById("viewer")
})
