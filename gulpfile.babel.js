import autoprefixer from "gulp-autoprefixer";
import babelify from "babelify";
import browserify from "browserify";
import browserSync from "browser-sync";
import buffer from "vinyl-buffer";
import cleanCSS from "gulp-clean-css";
import del from "del";
import gulp from "gulp";
import rename from "gulp-rename";
import sass from "gulp-sass";
import sourcemaps from "gulp-sourcemaps";
import source from "vinyl-source-stream";
import uglify from "gulp-uglify";

/**
 * Paths object
 */
const paths = {
    styles: {
        main: "static/scss/style.scss",
        src: "static/scss/**/*.scss",
        dest: "static/dist/",
    },
    scripts: {
        main: "static/js/index.js",
        src: "static/js/**/*.js",
        dest: "static/dist/",
    },
    markup: {
        src: "**/*.{html,php}",
    },
    includes: {
        node_modules: ["./node_modules"],
    },
};

/**
 * browserSync create
 */
const server = browserSync.create();

/**
 * Clean dist task
 */
export const clean = () => del(["static/dist"]);

/**
 * Watch SCSS task
 */
export function watchStyles() {
    return gulp.src(paths.styles.src)
        .pipe(sourcemaps.init())
        .pipe(sass({includePaths: paths.includes.node_modules}))
        .pipe(sass().on("error", sass.logError))
        .pipe(autoprefixer())
        .pipe(sourcemaps.write("./"))
        .pipe(gulp.dest(paths.styles.dest))
        .pipe(server.stream());
}

/**
 * Build SCSS task
 */
export function buildStyles() {
    return gulp.src(paths.styles.src)
        .pipe(sass({includePaths: paths.includes.node_modules}))
        .pipe(sass().on("error", sass.logError))
        .pipe(autoprefixer())
        .pipe(cleanCSS())
        .pipe(rename({
            basename: "style",
        }))
        .pipe(gulp.dest(paths.styles.dest));
}

/**
 * Watch JS task
 */
export function watchScripts() {
    return browserify(paths.scripts.main)
        .transform("babelify")
        .bundle()
        .pipe(source("bundle.js"))
        .pipe(buffer())
        .pipe(sourcemaps.init({"loadMaps": true}))
        .pipe(sourcemaps.write("."))
        .pipe(gulp.dest(paths.scripts.dest))
        .pipe(server.stream());
}

/**
 * Build JS task
 */
export function buildScripts() {
    return browserify(paths.scripts.main)
        .transform("babelify", {
            global: true,
            presets: ["@babel/preset-env"],
        })
        .bundle()
        .pipe(source("bundle.js"))
        .pipe(buffer())
        .pipe(uglify({
            compress: {
                drop_console: true,
            },
        }))
        .pipe(gulp.dest(paths.scripts.dest));
}

/**
 * Reload task
 */
export function reload(done) {
    server.reload();
    done();
}

/**
 * Server init task
 */
export function serve(done) {
    server.init({
        proxy: "www.private.loc/pixi.js-playground",
        port: 3000,
        host: "localhost",
    });
    done();
}

/**
 * File watcher
 */
export function watchFiles() {
    gulp.watch(paths.styles.src, gulp.series(watchStyles));
    gulp.watch(paths.scripts.src, gulp.series(watchScripts, reload));
    gulp.watch(paths.markup.src, reload);
}

/**
 * Watch task
 */
const watch = gulp.series(clean, gulp.parallel(watchStyles, watchScripts), serve, watchFiles);

/**
 * Build task
 */
export const build = gulp.series(clean, gulp.parallel(buildStyles, buildScripts));

/**
 * Default task
 */
export default watch;
