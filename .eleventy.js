const fs = require('fs');
const dotenv = require('dotenv')
const { DateTime } = require("luxon");

const postCss = require("postcss");
const tailwind = require("tailwindcss");
const autoPrefixer = require("autoprefixer");
const cssNano = require("cssnano");
const htmlmin = require("html-minifier");

const pluginBundle = require("@11ty/eleventy-plugin-bundle");
const pluginRss = require("@11ty/eleventy-plugin-rss");
const pluginNavigation = require("@11ty/eleventy-navigation");
const pluginSyntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const { EleventyHtmlBasePlugin } = require("@11ty/eleventy");

module.exports = function (eleventyConfig) {
    const result = dotenv.config();

    if (result.error) {
        throw result.error;
    }

    const isDev = process.env.ELEVENTY_ENV === 'dev';
    const eleventyPort = process.env.ELEVENTY_PORT;
    const prodBaseURL = process.env.ELEVENTY_PROD_BASEURL;
    const baseUrl = isDev ? `http://localhost:${eleventyPort}` : prodBaseURL;

    eleventyConfig.addGlobalData("baseUrl", baseUrl);

    eleventyConfig.setServerOptions({
        // The starting port number
        // Will increment up to (configurable) 10 times if a port is already in use.
        port: eleventyPort,
    });

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

    // file published & modified date
    eleventyConfig.addShortcode("published", function () {
        return this.page?.inputPath ? fs.statSync(this.page.inputPath).birthtime : undefined;
    });
    eleventyConfig.addShortcode("modified", function () {
        return this.page?.inputPath ? fs.statSync(this.page.inputPath).mtime : undefined;
    });

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

    eleventyConfig.addFilter("fullUrl", function (url = '', base = eleventyConfig.globalData.baseUrl) {
        try {
          return new URL(url, base).href;
        } catch (e) {
          console.error(e);
        }

        return false;
    });

    eleventyConfig.addFilter("randomItem", (arr) => {
        arr.sort(() => {
            return 0.5 - Math.random();
        });
        return arr.slice(0, 1);
    });

    eleventyConfig.addTransform("htmlmin", function(content) {
        if( this.page.outputPath && this.page.outputPath.endsWith(".html") ) {
            let minified = htmlmin.minify(content, {
            useShortDoctype: true,
            removeComments: true,
            collapseWhitespace: true
            });
            return minified;
        }

        return content;
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
