const gulp = require("gulp");
const webpack = require("webpack-stream");
const sass = require("gulp-sass")(require('sass'));
const autoprefixer = require("autoprefixer");
const cleanCSS = require("gulp-clean-css");
const postcss = require("gulp-postcss");
const browsersync = require("browser-sync");
const fileinclude = require('gulp-file-include');

const build = "./build";

gulp.task("copy-html", () => {
  return gulp.src("./src/*.html")
                 .pipe(fileinclude({
                   prefix: '@@',
                   basepath: '@file'
                 }))
                .pipe(gulp.dest(build))
                .pipe(browsersync.stream());
});

gulp.task("build-js", () => {
    return gulp.src("./src/assets/js/main.js")
                .pipe(webpack({
                    mode: 'development',
                    output: {
                        filename: 'script.js'
                    },
                    watch: false,
                    devtool: "source-map",
                    module: {
                        rules: [
                          {
                            test: /\.m?js$/,
                            exclude: /(node_modules|bower_components)/,
                            use: {
                              loader: 'babel-loader',
                              options: {
                                presets: [['@babel/preset-env', {
                                    debug: true,
                                    corejs: 3,
                                    useBuiltIns: "usage"
                                }]]
                              }
                            }
                          }
                        ]
                      }
                }))
                .pipe(gulp.dest(build + '/assets/js'))
                .pipe(browsersync.stream());
});

gulp.task("build-sass", () => {
    return gulp.src("./src/assets/style/**/*.scss")
                .pipe(sass().on('error', sass.logError))
                .pipe(gulp.dest(build + '/assets/css'))
                .pipe(browsersync.stream());
});

gulp.task("copy-assets", () => {
    gulp.src("./src/assets/icons/**/*.*")
        .pipe(gulp.dest(build + "/assets/icons"));

    return gulp.src("./src/assets/img/**/*.*")
                .pipe(gulp.dest(build + "/assets/img"))
                .pipe(browsersync.stream());
});
gulp.task("copy-font", () => {
    return gulp.src("./src/assets/fonts/**/*.*")
            .pipe(gulp.dest(build + "/assets/fonts"))
            .pipe(browsersync.stream());
});

gulp.task("watch", () => {
    browsersync.init({
		server: "./build/",
		port: 4000,
		notify: true
    });

    gulp.watch("./src/**/*.html", gulp.parallel("copy-html"));
    gulp.watch("./src/assets/icons/**/*.*", gulp.parallel("copy-assets"));
    gulp.watch("./src/assets/img/**/*.*", gulp.parallel("copy-assets"));
    gulp.watch("./src/assets/style/**/*.scss", gulp.parallel("build-sass"));
    gulp.watch("./src/assets/js/**/*.js", gulp.parallel("build-js"));
    gulp.watch("./src/assets/fonts/**/*.*", gulp.parallel("copy-font"));
});

gulp.task("build", gulp.parallel("copy-html", "copy-assets", "build-sass", "build-js", "copy-font"));

gulp.task("prod", () => {
    gulp.src("./src/*.html")
        .pipe(gulp.dest(build));
    gulp.src("./src/assets/img/**/*.*")
        .pipe(gulp.dest(build + "/assets/img"));
    gulp.src("./src/assets/icons/**/*.*")
        .pipe(gulp.dest(build + "/assets/icons"));

    gulp.src("./src/assets/js/*.js")
        .pipe(webpack({
            mode: 'production',
            output: {
                filename: 'script.js'
            },
            module: {
                rules: [
                  {
                    test: /\.m?js$/,
                    exclude: /(node_modules|bower_components)/,
                    use: {
                      loader: 'babel-loader',
                      options: {
                        presets: [['@babel/preset-env', {
                            debug: false,
                            corejs: 3,
                            useBuiltIns: "usage"
                        }]]
                      }
                    }
                  }
                ]
              }
        }))
        .pipe(gulp.dest(build + '/assets/js'));
    
    return gulp.src("./src/assets/style/style.scss")
        .pipe(sass().on('error', sass.logError))
        .pipe(postcss([autoprefixer()]))
        .pipe(cleanCSS())
        .pipe(gulp.dest(build + '/assets/css'));
});

gulp.task("default", gulp.parallel("watch", "build"));