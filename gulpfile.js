const gulp = require('gulp');
const uglify = require('gulp-uglify');
const del = require('del');

gulp.task('clean', async function (done) {
  await del(['dist']);
  done();
});

gulp.task('ugly', function () {
  return gulp.src('src/**/*.js').pipe(uglify()).pipe(gulp.dest('dist/'));
});
gulp.task('static', function () {
  gulp.src('src/static/**/*').pipe(gulp.dest('dist/static'));
  gulp.src('src/manifest.json').pipe(gulp.dest('dist/'));
  gulp.src('src/options.html').pipe(gulp.dest('dist/'));
  return gulp.src('src/popup.html').pipe(gulp.dest('dist/'));
});

gulp.task(
  'build',
  gulp.series('clean', 'ugly', 'static', function (done) {
    done();
  }),
);
