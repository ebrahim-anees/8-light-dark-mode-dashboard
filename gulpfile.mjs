import gulp from "gulp";
import concat from "gulp-concat";
import autoprefixer from "gulp-autoprefixer";
import * as sassModule from "sass"; // The compiler for the sass files
import gulpSass from "gulp-sass"; // make the connection between sass compiler and gulp
import connect from "gulp-connect";
import sourcemaps from "gulp-sourcemaps";
import uglify from "gulp-uglify"; // compress js-file
import zip from "gulp-zip";
import open from "open"; // to auto-open the local-server
import merge from "merge-stream"; // run different paths do their work in the same time in the same task

// sassModule is the functionality core that passed as parameter in gulpSass to get the result of var sass that deal with gulp and compile
var sass = gulpSass(sassModule);

gulp.task("connect", async function () {
  connect.server({
    root: "./dist",
    port: 8000,
    livereload: true,
  });
  console.log("Server started. Watching files...");
  open("http://localhost:8000"); //open the local-server
});

gulp.task("html", function () {
  return gulp
    .src("./index.html")
    .pipe(gulp.dest("./dist/"))
    .pipe(connect.reload());
});

gulp.task("css-compressed", function () {
  return gulp
    .src("./app/css/sass/main.scss")
    .pipe(sourcemaps.init())
    .pipe(sass({ outputStyle: "compressed" }))
    .pipe(autoprefixer("last 2 versions"))
    .pipe(sourcemaps.write("."))
    .pipe(gulp.dest("dist/css"))
    .pipe(connect.reload());
});

gulp.task("js-compressed", function () {
  return gulp
    .src("./app/js/main.js")
    .pipe(uglify())
    .pipe(sourcemaps.init()) // Initialize sourcemaps
    .pipe(gulp.dest("dist/js"))
    .pipe(sourcemaps.write(".")) // Write sourcemaps to the same directory
    .pipe(connect.reload());
});

gulp.task("css-transport", function () {
  var vendorStream = gulp
    .src("./app/css/vendor/**/*.*")
    .pipe(gulp.dest("dist/css/vendor"))
    .pipe(connect.reload());

  var allMinStream = gulp
    .src("./app/css/all.min.css")
    .pipe(gulp.dest("dist/css"))
    .pipe(connect.reload());

  return merge(vendorStream, allMinStream);
});

export const jsTransport = () => {
  var vendorStream = gulp
    .src("./app/js/vendor/**/*")
    .pipe(gulp.dest("dist/js/vendor"))
    .pipe(connect.reload());

  var allMinStream = gulp
    .src("./app/js/all.min.js")
    .pipe(gulp.dest("dist/js"))
    .pipe(connect.reload());

  return merge(vendorStream, allMinStream);
};

export const compression = () => {
  return gulp
    .src("./dist/**/*.*")
    .pipe(zip("compressed.zip"))
    .pipe(gulp.dest("."));
};

export const watch = () => {
  // watch any change occur to any file in these paths and if => run task of html and html-compressed that these two tasks only make change on the file with path in src()
  gulp.watch(["./index.html"], gulp.series("html"));
  gulp.watch(["./app/css/sass/**/*.scss"], gulp.series("css-compressed"));
  gulp.watch(["./app/js/main.js"], gulp.series("js-compressed"));
  gulp.watch(["./dist/**/*/*"], gulp.series(compression));
  gulp.watch(["./app/js/vendor/**/*"], gulp.series(jsTransport));
};

// in cmd, when running (npx gulp) it run the connect and watch tasks
gulp.task(
  "default",
  gulp.series(
    "html",
    "css-compressed",
    "js-compressed",
    "css-transport",
    jsTransport,
    "connect",
    watch
  )
);
