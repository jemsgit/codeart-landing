var through = require('through2');
var path = require('path');
var File = require('vinyl')

module.exports = function(opt) {
  opt = opt || {};
  /**
   * @this {Transform}
   */

  let images = opt.template || [];
  images.forEach(item => item.images = []);
  var transform = function(file, encoding, callback) {
    let src_l = path.relative(opt.root, path.relative(file.cwd, file.path));
    let src_sm = path.relative(opt.root, path.relative(file.cwd, file.path)).replace(file.basename, 'sm/') +  file.basename;
    let type = path.relative(opt.base, path.relative(file.cwd, file.dirname)).trim();
    let category = images.find(function(item) {
      return item.id === type;
    });

    if(!category) {
      category = {
        id: type,
        images:[]
      }
      images.push(category);
    }
    category.images.push({
      sm: src_sm,
      l: src_l
    })
    callback();
  };

  function endGrub(callback) {
    console.log(images)
    let file = new File({
      cwd: '/',
      base: '/',
      path: '/' + opt.resultName,
      contents: Buffer.from(JSON.stringify(images))
    });
    this.push(file);
    callback(null, file);
  }

  return through.obj(transform, endGrub);
};