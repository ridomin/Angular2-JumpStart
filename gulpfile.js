var gulp = require("gulp");
var ts = require("gulp-typescript");

var proj = ts.createProject("tsconfig.json");

gulp.task("default", ["typescript"]);

gulp.task("typescript", function (callback) {
    var result = gulp.src("src/app/main.ts").pipe(ts(proj));

    return result.js.pipe(gulp.dest("www/scripts"));
});
