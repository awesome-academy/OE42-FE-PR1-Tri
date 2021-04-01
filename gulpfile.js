const { src, dest, parallel, watch, series } = require('gulp'), concat = require('gulp-concat'),
sass = require('gulp-sass'), pug = require('gulp-pug'), browserSync =
require('browser-sync').create();

const FilesPath = { sassFiles: 'sass/*.scss', jsFiles: 'js/*.js', htmlFiles: 'pages/*.pug' }

function sassTask() {
     return src(FilesPath.sassFiles).pipe(sass()).pipe(concat('style.css'))
            .pipe(dest('dist/css')).pipe(browserSync.stream()); 
}

function htmlTask() {
    return src(FilesPath.htmlFiles).pipe(pug({ pretty: true }))
           .pipe(dest('dist')).pipe(browserSync.stream()); 
}

function jsTask() {
    return src(FilesPath.jsFiles).pipe(concat('all.js'))
    .pipe(dest('dist/js')) 
}

function assetsTask() { 
    return src('assets/**/*').pipe(dest('dist/assets')); 
}

function serve() { 
    browserSync.init({ 
        server: { 
            baseDir: './dist' 
        } 
    });
    watch(FilesPath.sassFiles, sassTask);
    watch(FilesPath.jsFiles, jsTask);
    watch(FilesPath.htmlFiles, htmlTask); 
}
exports.js = jsTask;
exports.sass = sassTask; 
exports.html = htmlTask; 
exports.assets = assetsTask; 
exports.default = series(parallel(htmlTask, sassTask, assetsTask));
exports.serve = series(serve, parallel(htmlTask, sassTask, assetsTask));
