const fs = require('fs');
const path = require('path');
const gulp = require('gulp');
const shell = require('gulp-shell');

const imageList = require('./plugins/images-list');
const baseDirPath = 'src/images/gallery';

function getFolders(dir) {
  return fs.readdirSync(dir)
    .filter(function(file) {
      return fs.statSync(path.join(dir, file)).isDirectory();
    });
}

function createDirectory(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, {
      recursive: true
    });
  }
}

gulp.task('image-list', (cb) => {
  gulp
    .src(baseDirPath + '/**!(sm)/*.*')
    .pipe(imageList({
      root: 'src',
      base: 'src/images/gallery',
      resultName: 'images.json'
    }))
    .pipe(gulp.dest('./'))
    
    cb();
})

gulp.task('minify-img', (cb) => {
  let folders = getFolders(baseDirPath);
  folders.forEach(folder => {
    const dir = path.join(baseDirPath, folder, 'sm')
    createDirectory(dir)
  });

  folders.forEach((folder, index) => {
    gulp
    .src(path.join(baseDirPath, folder) + '/*.*')
    .pipe(shell(["convert <%= file.path %> -resize 200x " + path.join(baseDirPath, folder, 'sm') + "/<%= file.basename %>"]))
    .on('finish', function () {
      if(index === folders.length - 1) {
        cb();
      }
    })
  })

});

gulp.task('prepare-img', gulp.series('minify-img', 'image-list'));