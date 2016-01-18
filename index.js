/**
 * Pack a specific build into zip archive.
 *
 * @author Stanislav Kalashnik <darkpark.main@gmail.com>
 * @license GNU GENERAL PUBLIC LICENSE Version 3
 */

'use strict';

var path    = require('path'),
    gulp    = require('gulp'),
    plumber = require('gulp-plumber'),
    zip     = require('gulp-zip'),
    del     = require('del'),
    Plugin  = require('spa-gulp/lib/plugin'),
    plugin  = new Plugin({name: 'zip', entry: 'pack', context: module});


// rework profile
plugin.prepare = function ( name ) {
    var data = this.config[name];

    data.targetFile = data.targetFile.replace(/\$\{name}/g,    this.package.name);
    data.targetFile = data.targetFile.replace(/\$\{version}/g, this.package.version);
    data.targetFile = data.targetFile.replace(/\$\{profile}/g, name);
};


// create tasks for profiles
plugin.profiles.forEach(function ( profile ) {
    var targetFile;

    // add vars
    plugin.prepare(profile.name);

    targetFile = path.join(profile.data.targetPath, profile.data.targetFile);

    // pack + watch
    profile.watch(profile.task(plugin.entry, function () {
        return gulp
            .src(profile.data.sourceFile || []/*, {base: process.env.PATH_APP}*/)
            .pipe(plumber())
            .pipe(zip(profile.data.targetFile, {compress: profile.data.compress}))
            .pipe(gulp.dest(profile.data.targetPath))
            .on('end', function () {
                // success
                profile.notify({
                    info: 'write '.green + targetFile,
                    title: plugin.entry,
                    message: targetFile
                });
            })
            .on('error', function ( error ) {
                // failure
                profile.notify({
                    type: 'fail',
                    title: plugin.entry,
                    message: error.toString()
                });
            });
    }));

    // remove the generated file
    profile.task('clean', function () {
        var files = del.sync([targetFile]);

        if ( files.length ) {
            profile.notify({
                info: 'delete '.green + targetFile,
                title: 'clean',
                message: targetFile
            });
        }
    });
});


// public
module.exports = plugin;
