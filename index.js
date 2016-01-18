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

    data.target = data.target.replace(/\$\{name}/g,    this.package.name);
    data.target = data.target.replace(/\$\{version}/g, this.package.version);
    data.target = data.target.replace(/\$\{profile}/g, name);
};


// create tasks for profiles
plugin.profiles.forEach(function ( profile ) {
    // add vars
    plugin.prepare(profile.name);

    // pack + watch
    profile.watch(profile.task(plugin.entry, function () {
        return gulp
            .src(profile.data.source)
            .pipe(plumber())
            .pipe(zip(path.basename(profile.data.target), {compress: profile.data.compress}))
            .pipe(gulp.dest(path.dirname(profile.data.target)))
            .on('end', function () {
                // success
                profile.notify({
                    info: 'write '.green + profile.data.target,
                    title: plugin.entry,
                    message: profile.data.target
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
        if ( del.sync([profile.data.target]).length ) {
            // something was removed
            profile.notify({
                info: 'delete '.green + profile.data.target,
                title: 'clean',
                message: profile.data.target
            });
        }
    });
});


// public
module.exports = plugin;
