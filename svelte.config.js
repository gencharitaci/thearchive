// import preprocess from "svelte-preprocess" (@deprecated )
import { sveltePreprocess } from "svelte-preprocess";

const config = {
  preprocess: [
    sveltePreprocess({
      postcss: true, // Enables PostCSS processing
    }),
  ],
};

export default config;