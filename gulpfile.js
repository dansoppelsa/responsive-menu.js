var     gulp = require('gulp'),
        gutil = require('gulp-util'),
        notify = require('gulp-notify'),
        less = require('gulp-less'),
        autoprefix = require('gulp-autoprefixer'),
        minifyCss = require('gulp-minify-css'),
        concat = require('gulp-concat'),
        uglify = require('gulp-uglify'),
        EXPRESS_PORT = 4000,
        EXPRESS_ROOT = __dirname,
        LIVERELOAD_PORT = 35729;


gulp.task( 'default' ,  [ 'less', 'watch' ] );


// Compile LESS
gulp.task( 'less' , function()
{
    return gulp.src('css/responsive-menu.less')
        .pipe(less())
        .pipe(autoprefix('last 10 version'))
        .pipe(gulp.dest('css'))
        .pipe(notify('LESS Compiled'));
});


gulp.task( 'minify-js' , function()
{
    gulp.src([
        'js/responsive-menu.js'
    ])
    .pipe(uglify())
    .pipe(gulp.dest('js'))
    .pipe(notify('JS Uglified'));
});


// Setup watchers for LESS and JS changes
gulp.task('watch', function()
{
    startExpress();

    startLivereload();

    gulp.watch( 'css/responsive-menu.less' , [ 'less' ] );

    gulp.watch( 'css/responsive-menu.css' , notifyLivereload );

    gulp.watch( '**/*.html' , notifyLivereload );
});





// Let's make things more readable by
// encapsulating each part's setup
// in its own method
function startExpress() {
    var express = require('express');
    var app = express();
    app.use(require('gulp-livereload'));
    app.use(express.static(EXPRESS_ROOT));
    app.listen(EXPRESS_PORT);
}


// We'll need a reference to the tinylr
// object to send notifications of file changes
// further down
var lr;
function startLivereload() {
    lr = require('tiny-lr')();
    lr.listen(LIVERELOAD_PORT);
}



// Notifies livereload of changes detected
// by `gulp.watch()`
function notifyLivereload(event) {
    gulp.src(event.path, {read: false})
        .pipe(require('gulp-livereload')(lr));
}
