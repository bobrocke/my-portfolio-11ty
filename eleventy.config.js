import { VentoPlugin } from "eleventy-plugin-vento";
import exifr from "exifr";
import image from "@11ty/eleventy-img";

import fs from "fs";
import path from "path";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default async function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy("src/assets/css");
  eleventyConfig.addPassthroughCopy("src/assets/images");

  eleventyConfig.addShortcode("getAspectRatio", async function (imagePath) {
    const metadata = image.statsSync(imagePath, {
        widths: [null], // gets original width
        formats: ["jpg"]
    });

    const width = metadata.jpeg[0].width;
    const height = metadata.jpeg[0].height;

    const ratio = (width / height);
    let aspectRatio = ratio.toFixed(2);

    return aspectRatio;
  });

  eleventyConfig.addShortcode("getDescription", async function (imagePath) {
    let description = await exifr.parse(imagePath, ['ImageDescription']);

    return description;
  });

  // Create a collection of all the fauna images
  eleventyConfig.addCollection("fauna", function(collectionApi) {
    // const imageDirectory = path.resolve(__dirname, "assets/images/galleries/fauna");
    const imageDirectory = "/assets/images/galleries/fauna";
    const fileNames = fs.readdirSync(imageDirectory);
    const jpgFiles = fileNames.filter(function(fileName) {
      return fileName.endsWith('.jpg')
    });
    const images = jpgFiles.map(function(image) {
      return path.join(imageDirectory, image)
    });
    console.log(images);
    return images;
  });

  eleventyConfig.addPlugin(VentoPlugin, {
    autotrim: true
  });
}

export const config = {
  dir: {
    input: "src",
    output: "_site",
  },
  templateFormats: ["html", "vto", "md"],

  markdownTemplateEngine: false,
};