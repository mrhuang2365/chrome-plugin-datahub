const gulp = require('gulp');
const uglify = require('gulp-uglify');

/**
 * cpFiles
 * @description
 * 拷贝源代码文件
 */
function cpFiles() {
  gulp.src('src/**/*').pipe(gulp.dest('dist'));
}

/**
 *uglifyJsTask
 * @param {*} src 源文件路径
 * @param {*} dist 目标路径
 */
function uglifyJsTask(src, dist) {
  // gulp.src(src).pipe(uglify()).pipe(gulp.dest(dist));
}

gulp.task('build', function (done) {
  cpFiles();
  uglifyJsTask('src/popup/popup.js', 'dist/popup/popup.js');
  uglifyJsTask('src/options/options.js', 'dist/options/options.js');
  uglifyJsTask('src/content/main.js', 'dist/content/main.js');
  done();
});

// gulp.series([
//   cpFiles(),
//   uglifyJsTask('src/popup/popup.js', 'dist/popup/popup.js'),
//   uglifyJsTask('src/options/options.js', 'dist/options/options.js'),
//   uglifyJsTask('src/content/main.js', 'dist/content/main.js'),
// ]);
