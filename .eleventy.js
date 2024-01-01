module.exports = function (eleventyConfig) {
    eleventyConfig.addPassthroughCopy({
        "./public/": "/",
    });

    eleventyConfig.addWatchTarget("./public/css/");

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