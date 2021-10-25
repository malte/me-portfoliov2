const { DateTime } = require("luxon");
const eleventyNavigationPlugin = require("@11ty/eleventy-navigation");
const markdownIt = require('markdown-it');
const markdownitlinkatt = require('markdown-it-link-attributes');
const markdownItAnchor = require('markdown-it-anchor')

const embedVimeo = require("eleventy-plugin-vimeo-embed");


module.exports = function(eleventyConfig) {
    
    eleventyConfig.addPassthroughCopy('./src/styles.css');
    eleventyConfig.addPassthroughCopy('./src/assets');
    eleventyConfig.addPassthroughCopy('./src/admin');

    eleventyConfig.addPlugin(eleventyNavigationPlugin);
    eleventyConfig.addPlugin(embedVimeo);
   	eleventyConfig.setDataDeepMerge(true)


    eleventyConfig.addFilter("postDate", (dateObj) => {
        return DateTime.fromJSDate(dateObj).toLocaleString(DateTime.DATE_MED);
    });

	eleventyConfig.addFilter('unique', (array) => {
		let newArray = [...new Set(array)]
		return newArray;
	})
    
eleventyConfig.addShortcode('respimg', (path, alt, style) => {
		const fetchBase = `https://res.cloudinary.com/${eleventyConfig.cloudinaryCloudName}/image/upload/`
		const src = `${fetchBase}q_auto,f_auto,w_400/${path}.${eleventyConfig.format}`
		const srcset = eleventyConfig.srcsetWidths
			.map(({ w, v }) => {
				return `${fetchBase}dpr_auto,q_auto,w_${w}/kailoon.com/${path}.${eleventyConfig.format} ${v}w`
			})
			.join(', ')

		return `<img class="${
			style ? style : ''
		}" loading="lazy" src="${src}" srcset="${srcset}" alt="${
			alt ? alt : ''
		}" width="400" height="300" sizes="100vw">`
	})

	eleventyConfig.addShortcode('figure', (path, alt, caption) => {
		const fetchBase = `https://res.cloudinary.com/${eleventyConfig.cloudinaryCloudName}/image/upload/`
		const src = `${fetchBase}q_auto,f_auto,w_400/${path}.${eleventyConfig.format}`
		const srcset = eleventyConfig.srcsetWidths
			.map(({ w, v }) => {
				return `${fetchBase}dpr_auto,q_auto,w_${w}/kailoon.com/${path}.${eleventyConfig.format} ${v}w`
			})
			.join(', ')

		return `<figure class="mb-10"><img loading="lazy" src="${src}" srcset="${srcset}" alt="${
			alt ? alt : ''
		}" width="400" height="300"><figcaption class="text-center text-sm mt-3 text-gray-600 dark:text-gray-200">${
			caption ? caption : ''
		}</figcaption></figure>`
	})

	eleventyConfig.addShortcode('simplFigure', (path, alt, caption, style) => {
		const basepath = '../../assets/media/';
		return `<figure class="grid justify-items-center"><img class="${style}" loading="lazy" src="${basepath}${path}" alt="${
			alt ? alt : ''
		}"><figcaption class="text-center text-sm mt-3 text-gray-600 dark:text-gray-200">${
			caption ? caption : ''
		}</figcaption></figure>`
	})

	// https://github.com/eeeps/eleventy-respimg
	eleventyConfig.cloudinaryCloudName = 'dcfqybotp'
	eleventyConfig.srcsetWidths = [
		{ w: 400, v: 400 },
		{ w: 600, v: 600 },
		{ w: 768, v: 768 },
		{ w: 820, v: 820 },
		{ w: 1240, v: 1240 }
	]
	eleventyConfig.format = 'webp'
	eleventyConfig.fallbackWidth = 800

		/* Markdown Overrides */
	let markdownLibrary = markdownIt({
		html: true,
		breaks: true
	})
		.use(markdownitlinkatt, {
			pattern: /^(?!(https:\/\/malteeuler\.com|#)).*$/gm,
			attrs: {
				target: '_blank',
				rel: 'noreferrer'
			}
		})
		.use(markdownItAnchor, {
			level: [5, 6],
			permalink: true,
			permalinkClass: 'direct-link text-gray-400 dark:text-gray-600',
			permalinkSymbol: '#',
			permalinkAttrs: (slug, state) => ({
				'aria-label': `permalink to ${slug}`,
				title: 'Anchor link for easy sharing.'
			})
		})
	eleventyConfig.setLibrary('md', markdownLibrary)

    return {
        dir: {
			input: 'src',
			output: 'public',
			data: '_data',
			includes: '_components',
			layouts: '_layouts'
        }
    };
}