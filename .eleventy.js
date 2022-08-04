module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy('./src/styles');
  eleventyConfig.addPassthroughCopy('./src/images');
  eleventyConfig.addPassthroughCopy('./src/icons');

  eleventyConfig.addPassthroughCopy({
    "node_modules/aos/dist/aos.css": "styles/aos.css" 
  });

  eleventyConfig.addWatchTarget('./src/scripts/');

  eleventyConfig.addFilter('every', function(arr, step, startIndex) {
    let newArr = [];
    for(let i = startIndex; i < arr.length; i+=step) {
      newArr.push(arr[i]);
    }
    return newArr;
  })

  return {
    dir: {
      input: 'src',
      output: 'public'
    },
    templateFormats: ['md', '11ty.js']
  };
};