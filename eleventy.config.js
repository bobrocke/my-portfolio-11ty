import { VentoPlugin } from "eleventy-plugin-vento";
import exifr from "exifr";
import image from "@11ty/eleventy-img";
import { DateTime } from "luxon";

import fs from "fs";
import path from "path";

function getAspectRatio(imagePath) {
  const metadata = image.statsSync(imagePath, {
      widths: [null], // gets original width
      formats: ["jpg"]
  });

  const width = metadata.jpeg[0].width;
  const height = metadata.jpeg[0].height;

  const ratio = (width / height);
  let aspectRatio = ratio.toFixed(2);

  return aspectRatio;
}

async function buildImageCollection(imageDirectory) {
  const fileNames = fs.readdirSync(imageDirectory);
  let jpgFiles = fileNames.filter(function(fileName) {
    return fileName.endsWith('.jpg')
  });

  jpgFiles.sort(() => Math.random() - 0.5);

  const images = await Promise.all(
    jpgFiles.map(async function(image) {
      const imageSource = path.join(".", imageDirectory, image);
      const imagePath = path.join("/", imageDirectory, image);
      const data = await exifr.parse(imageSource);
      const imageDescription = data.ImageDescription;
      // const imageDescription = data.ImageDescription;

      return {
        source: imagePath,
        description: imageDescription,
        aspectRatio: getAspectRatio(imageSource)
      };
    })
  );

  // console.log(images);

  return images;
}

export default async function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy("src/assets/css");
  eleventyConfig.addPassthroughCopy("src/assets/js");
  eleventyConfig.addPassthroughCopy("src/assets/images");
  eleventyConfig.addPassthroughCopy("src/assets/fonts");
  eleventyConfig.addPassthroughCopy("galleries");

  // Create a collection of all the fauna images
  eleventyConfig.addCollection("fauna", function(collectionApi) {
    const images = buildImageCollection("galleries/fauna");

    return images;
  });

  // Create a collection of all the flora images
  eleventyConfig.addCollection("flora", function(collectionApi) {
    const images = buildImageCollection("galleries/flora");

    return images;
  });

  // Create a collection of all the people images
  eleventyConfig.addCollection("people", function(collectionApi) {
    const images = buildImageCollection("galleries/people");

    return images;
  });

  // Create a collection of all the pets images
  eleventyConfig.addCollection("pets", function(collectionApi) {
    const images = buildImageCollection("galleries/pets");

    return images;
  });

  // Create a collection of all the places images
  eleventyConfig.addCollection("places", function(collectionApi) {
    const images = buildImageCollection("galleries/places");

    return images;
  });

  eleventyConfig.addFilter("date", (dateObj) => {
    let thisDateTime = DateTime.fromJSDate(dateObj, { zone: "utc" }).setZone(
      "America/New_York",
      { keepLocalTime: true },
    );
    return thisDateTime.toLocaleString(DateTime.DATE_MED);
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