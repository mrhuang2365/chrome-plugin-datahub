const gulp = require('gulp');
const uglify = require('gulp-uglify');

/**
 * cpFiles
 * @description
 * 拷贝源代码文件
 */
function cpFiles() {
  gulp.src('src/static/**/*').pipe(gulp.dest('dist/static'));
  gulp.src('src/manifest.json').pipe(gulp.dest('dist/'));
  gulp.src('src/options.html').pipe(gulp.dest('dist/'));
  gulp.src('src/popup.html').pipe(gulp.dest('dist/'));
}

/**
 *uglifyJsTask
 * @param {*} src 源文件路径
 * @param {*} dist 目标路径
 */
function uglifyJsTask(src, dist) {
  gulp.src(src).pipe(uglify()).pipe(gulp.dest(dist));
}

gulp.task('build', function (done) {
  uglifyJsTask('src/popup/*.js', 'dist/popup/');
  uglifyJsTask('src/background/*.js', 'dist/background/');
  uglifyJsTask('src/options/*.js', 'dist/options/');
  uglifyJsTask('src/content/*.js', 'dist/content/');
  cpFiles();
  done();
});
