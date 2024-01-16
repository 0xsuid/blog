const { DateTime } = require("luxon");

const postCss = require("postcss");
const tailwind = require("tailwindcss");
const autoPrefixer = require("autoprefixer");
const cssNano = require("cssnano");

const pluginBundle = require("@11ty/eleventy-plugin-bundle");
const pluginRss = require("@11ty/eleventy-plugin-rss");
const pluginNavigation = require("@11ty/eleventy-navigation");
const pluginSyntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const { EleventyHtmlBasePlugin } = require("@11ty/eleventy");


module.exports = function (eleventyConfig) {
    eleventyConfig.addPassthroughCopy({
        "./public/assets": "assets/",
    });

    eleventyConfig.addWatchTarget("./public/css/");

    // Official plugins
	eleventyConfig.addPlugin(pluginRss);
	eleventyConfig.addPlugin(pluginSyntaxHighlight, {
		preAttributes: { tabindex: 0 }
	});
	eleventyConfig.addPlugin(pluginNavigation);
	eleventyConfig.addPlugin(EleventyHtmlBasePlugin);
	eleventyConfig.addPlugin(pluginBundle);

    eleventyConfig.addNunjucksAsyncFilter("postcss", (code, done) => {
        postCss([
            tailwind(require("./tailwind.config")),
            autoPrefixer(),
            cssNano({ preset: "default" }),
        ])
            .process(code, {
                from: "./public/css/style.css",
            })
            .then(
                (r) => done(null, r.css),
                (e) => done(e, null)
            );
    });

    eleventyConfig.addFilter('htmlDateString', (dateObj) => {
		// dateObj input: https://html.spec.whatwg.org/multipage/common-microsyntaxes.html#valid-date-string
		return DateTime.fromJSDate(dateObj, {zone: 'utc'}).toFormat('yyyy-LL-dd');
	});

    eleventyConfig.addFilter("randomItem", (arr) => {
        arr.sort(() => {
            return 0.5 - Math.random();
        });
        return arr.slice(0, 1);
    });

    return {
        dir: {
            input: "src",
            includes: "../_includes",
            data: "../_data",
            output: "_site",
        },
    };
};
