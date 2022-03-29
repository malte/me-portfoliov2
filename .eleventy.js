const { DateTime } = require("luxon");
const eleventyNavigationPlugin = require("@11ty/eleventy-navigation");
const markdownIt = require('markdown-it');
const markdownitlinkatt = require('markdown-it-link-attributes');
const markdownItAnchor = require('markdown-it-anchor')
const embedVimeo = require("eleventy-plugin-vimeo-embed");



module.exports = function(eleventyConfig) {
  eleventyConfig.addPassthroughCopy("./src/styles.css");
  eleventyConfig.addPassthroughCopy("./src/assets/");
  eleventyConfig.addPassthroughCopy("./src/admin");

  eleventyConfig.addPlugin(eleventyNavigationPlugin);
  eleventyConfig.addPlugin(embedVimeo);
  eleventyConfig.setDataDeepMerge(true);

  eleventyConfig.addFilter("postDate", (dateObj) => {
    return DateTime.fromJSDate(dateObj).toLocaleString(DateTime.DATE_MED);
  });

  eleventyConfig.addFilter("unique", (array) => {
    let newArray = [...new Set(array)];
    return newArray;
  });

  eleventyConfig.addShortcode("respimg", (path, alt, style) => {
    const fetchBase = `https://res.cloudinary.com/${eleventyConfig.cloudinaryCloudName}/image/upload/`;
    const src = `${fetchBase}q_auto,f_auto,w_400/${path}.${eleventyConfig.format}`;
    const srcset = eleventyConfig.srcsetWidths
      .map(({ w, v }) => {
        return `${fetchBase}dpr_auto,q_auto,w_${w}/kailoon.com/${path}.${eleventyConfig.format} ${v}w`;
      })
      .join(", ");

    return `<img class="${
      style ? style : ""
    }" loading="lazy" src="${src}" srcset="${srcset}" alt="${
      alt ? alt : ""
    }" width="400" height="300" sizes="100vw">`;
  });


  function filterTagList(tags) {
    return (tags || []).filter(
      (tag) => ["all", "nav", "post", "posts", "work"].indexOf(tag) === -1
    );
  }

  eleventyConfig.addFilter("filterTagList", filterTagList);

  // Create an array of all tags
  eleventyConfig.addCollection("tagList", function (collection) {
    let tagSet = new Set();
    collection.getAll().forEach((item) => {
      (item.data.tags || []).forEach((tag) => tagSet.add(tag));
    });

    return filterTagList([...tagSet]);
  });


  eleventyConfig.addShortcode("figure", (path, alt, caption) => {
    const fetchBase = `https://res.cloudinary.com/${eleventyConfig.cloudinaryCloudName}/image/upload/`;
    const src = `${fetchBase}q_auto,f_auto,w_400/${path}.${eleventyConfig.format}`;
    const srcset = eleventyConfig.srcsetWidths
      .map(({ w, v }) => {
        return `${fetchBase}dpr_auto,q_auto,w_${w}/kailoon.com/${path}.${eleventyConfig.format} ${v}w`;
      })
      .join(", ");

    return `<figure class="mb-10"><img loading="lazy" src="${src}" srcset="${srcset}" alt="${
      alt ? alt : ""
    }" width="400" height="300"><figcaption class="text-center text-sm mt-3 ">${
      caption ? caption : ""
    }</figcaption></figure>`;
  });

  eleventyConfig.addShortcode("year", () => `${new Date().getFullYear()}`);

  eleventyConfig.addShortcode("simplFigure", (path, alt, caption, style) => {
    const basepath = "../../assets/media/";
    return `<figure class="flex flex-col ${style}"><img class="object-contain" loading="lazy" src="${basepath}${path}" alt="${
      alt ? alt : ""
    }"><figcaption class="text-sm mt-2 text-slate-600 tracking-wide">${
      caption ? caption : ""
    }</figcaption></figure>`;
  });
  const fs = require("fs");
  eleventyConfig.addShortcode("inlineSvg", (file) => {
    let relativeFilePath = `./src/assets/${file}`;
    let data = fs.readFileSync(relativeFilePath, function (err, contents) {
      if (err) return err;
      return contents;
    });
    return data.toString("utf8");
  });

  // https://github.com/eeeps/eleventy-respimg
  eleventyConfig.cloudinaryCloudName = "dcfqybotp";
  eleventyConfig.srcsetWidths = [
    { w: 400, v: 400 },
    { w: 600, v: 600 },
    { w: 768, v: 768 },
    { w: 820, v: 820 },
    { w: 1240, v: 1240 },
  ];
  eleventyConfig.format = "webp";
  eleventyConfig.fallbackWidth = 800;

  /* Markdown Overrides */
  let markdownLibrary = markdownIt({
    html: true,
    breaks: true,
  })
    .use(markdownitlinkatt, {
      pattern: /^(?!(https:\/\/malteeuler\.com|#)).*$/gm,
      attrs: {
        target: "_blank",
        rel: "noreferrer",
      },
    })
    .use(markdownItAnchor, {
      level: [5, 6],
      permalink: true,
      permalinkClass: "direct-link",
      permalinkSymbol: "#",
      permalinkAttrs: (slug, state) => ({
        "aria-label": `permalink to ${slug}`,
        title: "Anchor link for easy sharing.",
      }),
    });
  eleventyConfig.setLibrary("md", markdownLibrary);

  return {
    dir: {
      input: "src",
      output: "public",
      data: "_data",
      includes: "_includes",
      layouts: "_layouts",
    },
  };
}