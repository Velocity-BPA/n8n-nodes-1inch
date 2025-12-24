const gulp = require('gulp');
const path = require('path');

gulp.task('build:icons', function () {
  return gulp.src(['nodes/**/*.svg', 'nodes/**/*.png'])
    .pipe(gulp.dest('dist/nodes'));
});

gulp.task('default', gulp.series('build:icons'));
