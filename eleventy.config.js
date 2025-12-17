import { VentoPlugin } from "eleventy-plugin-vento";

export default async function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy("src/assets/css");
  eleventyConfig.addPassthroughCopy("src/assets/images");


  eleventyConfig.addPlugin(VentoPlugin);
}

export const config = {
  dir: {
    input: "src",
    output: "_site",
  },
  templateFormats: ["html", "vto", "md"],

  markdownTemplateEngine: false,
};
