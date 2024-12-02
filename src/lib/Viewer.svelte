<script>
  import { image, imgBaseUrl, tab } from "../store";
  // import Historic from "./Historic.svelte"
  import { fade } from "svelte/transition";

  let L; // Declare L globally
  let imgViewer;
  let map;
  let historicInfo;

  $: if ($image && map) {
    loadImg();
  }

  function initMap(node) {
    // Initialize map asynchronously
    const initialize = async () => {
      if (!L) {
        await import("leaflet/dist/leaflet.css");
        L = await import("leaflet");
      }

      map = L.map(node, {
        maxZoom: 4,
        minZoom: 0,
        center: [0, 0],
        zoom: 1,
        preferCanvas: true,
        zoomSnap: 0.1,
        zoomDelta: 0.5,
        wheelPxPerZoomLevel: 120,
        crs: L.CRS.Simple,
        attributionControl: false,
      });
    };

    // Start initialization
    initialize();

    // Return the action object
    return {
      destroy() {
        if (map) {
          map.remove(); // Cleanup when the component is destroyed
        }
      },
    };
  }

  async function loadImg() {
    map.eachLayer((/** @type {any} */ layer) => {
      map.removeLayer(layer);
    });

    // get image dimensions
    const img = new Image();
    img.src = $imgBaseUrl + $image;
    await img.decode();

    // calculate the edges of the image, in coordinate space
    var southWest = map.unproject([0, img.height], map.getMaxZoom());
    var northEast = map.unproject([img.width, 0], map.getMaxZoom());
    var bounds = new L.LatLngBounds(southWest, northEast);
    map.fitBounds(bounds);

    L.imageOverlay($imgBaseUrl + $image, bounds).addTo(map);
  }

  image.subscribe((val) => {
    if ($tab === "historic") {
      console.log("historic");
      fetch(
        `https://maps.mecknc.gov/api/v1/query/scans?filter=file='${$image}'`
      )
        .then((response) => response.json())
        .then((json) => {
          historicInfo = json[0];
          console.log(historicInfo);
        })
        .catch((error) => {
          console.error(
            "There has been a problem with your fetch operation:",
            error
          );
        });
    } else {
      historicInfo = null;
    }
  });
</script>

<!-- info and download button -->
<div
  id="imgtitle"
  class="inline-block absolute top-0 right-0 rounded-bl-md text-neutral-100 z-50 bg-neutral-700 px-2 py-1 text-lg"
>
  <div class="flex justify-center items-center">
    <div class="hidden lg:block mr-2 text-sm">Download</div>
    <div class="mb-1">
      <a
        title="Download Tax Map"
        download={$image}
        class="px-2 pb-1 border border-neutral-500 hover:border-yellow-300 hover:text-yellow-300 duration-300 trasition-colors ease-in-out rounded-md"
        href={$imgBaseUrl + $image}
        target="_blank"
      >
        <svg class="icon icon-folder-download"
          ><use xlink:href="#icon-folder-download"></use></svg
        >
      </a>
    </div>
  </div>
</div>

{#if historicInfo}
  <div
    class="absolute top-24 bottom-3 left-2 w-52 z-50 flex flex-col justify-end"
  >
    <div
      class=" bg-white/90 rounded-md p-3 text-xs text-center overflow-y-auto drop-shadow-lg shadow-lg"
      transition:fade
    >
      {#if historicInfo.title}
        <h3 class="font-bold text-center text-sm">{historicInfo.title}</h3>
      {/if}
      {#if historicInfo.author}
        <p class="text-center">
          {historicInfo.author}
          {#if historicInfo.year}
            , {historicInfo.year}
          {/if}
        </p>
      {/if}
      {#if historicInfo.comments}
        <p class="mt-3">
          {historicInfo.comments}
        </p>
      {/if}
      {#if historicInfo.scale || historicInfo.size || historicInfo.type}
        <p class="mt-3">
          {#if historicInfo.scale}
            {historicInfo.scale} <br />
          {/if}
          {#if historicInfo.size}
            {historicInfo.size} <br />
          {/if}
          {#if historicInfo.type}
            {historicInfo.type}
          {/if}
        </p>
      {/if}
      {#if historicInfo.donated_by}
        <p class="text-center mt-4">
          Donated by {historicInfo.donated_by}
        </p>
      {/if}
      {#if historicInfo.contact}
        <p class="text-center mt-4">
          Contact: {historicInfo.contact}
          {#if historicInfo.contact_title}
            , {historicInfo.contact_title}
          {/if}
          <br />
          {#if historicInfo.phone}
            {historicInfo.phone}
            {#if historicInfo.email}
              , {historicInfo.email}
            {/if}
            <br />
          {/if}
        </p>
      {/if}
    </div>
  </div>
{/if}

<!-- download svg -->
<symbol id="icon-folder-download" viewBox="0 0 32 32">
  <path d="M18 8l-4-4h-14v26h32v-22h-14zM16 27l-7-7h5v-8h4v8h5l-7 7z"></path>
</symbol>

<!-- leaflet map -->
<div class="map w-full h-full z-0" use:initMap bind:this={imgViewer} />

<style>
  .map {
    /* @apply absolute top-0 bottom-0 left-0 right-0; */
    box-shadow: inset 8px 8px 18px rgba(0, 0, 0, 0.5);
    background-color: #e5e5e5;
    background-image: linear-gradient(#404040 1px, transparent 1px),
      linear-gradient(to right, #404040 1px, #e5e5e5 1px);
    background-size: 20px 20px;
  }
  #imgtitle {
    box-shadow: 8px 8px 18px rgba(0, 0, 0, 0.5);
  }
  .icon {
    display: inline-block;
    width: 1em;
    height: 1em;
    stroke-width: 0;
    stroke: currentColor;
    fill: currentColor;
  }
</style>
