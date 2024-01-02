const tailwind = require("tailwindcss");
const postCss = require("postcss");
const autoPrefixer = require("autoprefixer");
const cssNano = require("cssnano");

module.exports = function (eleventyConfig) {
    eleventyConfig.addPassthroughCopy({
        "./public/assets": "assets/",
    });

    eleventyConfig.addWatchTarget("./public/css/");

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
