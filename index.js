/**
 * Pack a specific build into zip archive.
 *
 * @author Stanislav Kalashnik <darkpark.main@gmail.com>
 * @license GNU GENERAL PUBLIC LICENSE Version 3
 */

'use strict';

var path    = require('path'),
    util    = require('util'),
    gulp    = require('gulp'),
    log     = require('gulp-util').log,
    plumber = require('gulp-plumber'),
    zip     = require('gulp-zip'),
    del     = require('del'),
    load    = require('require-nocache')(module),
    zipName = '%s.%s.%s.zip',
    title   = 'pack    '.inverse;


// remove all generated zip files
gulp.task('pack:clean', function () {
    return del([path.join(process.env.PATH_ROOT, util.format(zipName, '*', '*', '*'))]);
});


// create archive
gulp.task('pack:develop', function () {
    var pkgInfo = load(process.env.PACKAGE),
        outFile = util.format(zipName, pkgInfo.name, pkgInfo.version, 'develop');

    log(title, 'create archive: ' +  outFile.bold);

    return gulp
        .src([
            path.join(process.env.PATH_APP, '**', '*'),
            '!' + path.join(process.env.PATH_APP, 'index.html'),
            '!' + path.join(process.env.PATH_APP, '**', 'release.*'),
            '!' + path.join(process.env.PATH_APP, '**', 'readme.md')
        ], {base: process.env.PATH_APP})
        .pipe(plumber())
        .pipe(zip(outFile))
        .pipe(gulp.dest(process.env.PATH_ROOT));
});


// create archive
gulp.task('pack:release', function () {
    var pkgInfo = load(process.env.PACKAGE),
        outFile = util.format(zipName, pkgInfo.name, pkgInfo.version, 'release');

    log(title, 'create archive: ' +  outFile.bold);

    return gulp
        .src([
            path.join(process.env.PATH_APP, '**', '*'),
            '!' + path.join(process.env.PATH_APP, '**', 'develop.*'),
            '!' + path.join(process.env.PATH_APP, '**', 'readme.md')
        ], {base: process.env.PATH_APP})
        .pipe(plumber())
        .pipe(zip(outFile))
        .pipe(gulp.dest(process.env.PATH_ROOT));
});


// create all archives
gulp.task('pack', ['pack:develop', 'pack:release']);
