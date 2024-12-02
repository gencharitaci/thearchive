import "./app.postcss";
import TabStrip from "./lib/TabSelector.svelte";
import Viewer from "./lib/Viewer.svelte";

// Instantiate the TabStrip component
new TabStrip({
  target: document.getElementById("tabstrip"),
});

// Instantiate the Viewer component
new Viewer({
  target: document.getElementById("viewer"),
});
