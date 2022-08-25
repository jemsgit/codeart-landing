const fs = require('fs');
const path = require('path');
const gulp = require('gulp');
const shell = require('gulp-shell');
const del = require('del');
const imagemin = require('gulp-imagemin');

const pageSetting = require('./src/_data/settings') 

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
  let template = pageSetting.styles;
  gulp
    .src(baseDirPath + '/**!(sm)/*.*')
    .pipe(imageList({
      root: 'src',
      base: 'src/images/gallery',
      resultName: 'images.json',
      template: template
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

gulp.task('compile:11ty', () => {
  return gulp
     .src('./public/**/*')
     .pipe(gulp.dest('./dist/public'))
})

gulp.task('compile:11ty-scripts', () => {
  return gulp
     .src('./public/scripts/*')
     .pipe(gulp.dest('./dist/public/scripts'))
})

gulp.task('compile:11ty-styles', () => {
  return gulp
     .src('./public/styles/*')
     .pipe(gulp.dest('./dist/public/styles'))
})

gulp.task('compile:11ty-html', () => {
  return gulp
     .src('./public/index.html')
     .pipe(gulp.dest('./dist/public'))
})

gulp.task('compile:server', (cb) => {
  return gulp
    .src('./server/**')
    .pipe(gulp.dest('./dist/server'))

})

gulp.task('clean:images', function(cb){
  return del('./dist/public/images', {force:true});
});

gulp.task('compile:images', (cb) => {
  return gulp
    .src('./src/images/**/*')
    .pipe(imagemin())
    .pipe(gulp.dest('./dist/public/images/'))

})

gulp.task('clean', function(cb){
  return del('./dist', {force:true});
});

gulp.task('copy-rest', (cb) => {
  gulp
    .src('*.json')
    .pipe(gulp.dest('./dist'));

  gulp
    .src('.env')
    .pipe(gulp.dest('./dist'));

  cb()
})

gulp.task('build', gulp.series('clean', 'compile:11ty', 'clean:images', 'compile:server', 'compile:images', 'copy-rest'));
gulp.task('update-build', gulp.series('compile:11ty-html', 'compile:11ty-scripts', 'compile:11ty-styles', 'compile:server', 'copy-rest'));