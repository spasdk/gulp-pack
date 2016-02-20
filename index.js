/**
 * @author Stanislav Kalashnik <darkpark.main@gmail.com>
 * @license GNU GENERAL PUBLIC LICENSE Version 3
 */

'use strict';

var fs      = require('fs'),
    path    = require('path'),
    gulp    = require('gulp'),
    plumber = require('gulp-plumber'),
    zip     = require('gulp-zip'),
    Plugin  = require('spasdk/lib/plugin'),
    plugin  = new Plugin({name: 'zip', entry: 'pack', config: require('./config')});


// rework profile
//plugin.prepare = function ( name ) {
//    var profile = this.config[name];
//
//    profile.target = profile.target.replace(/\$\{name}/g,    this.package.name);
//    profile.target = profile.target.replace(/\$\{version}/g, this.package.version);
//    profile.target = profile.target.replace(/\$\{profile}/g, name);
//};


// create tasks for profiles
plugin.profiles.forEach(function ( profile ) {
    // add vars
    //plugin.prepare(profile.name);

    profile.watch('', profile.data.watch,
        // main entry task
        profile.task(plugin.entry, function () {
            return gulp
                .src(profile.data.source)
                .pipe(plumber())
                .pipe(zip(path.basename(profile.data.target), {compress: profile.data.compress}))
                .pipe(gulp.dest(path.dirname(profile.data.target)))
                .on('end', function () {
                    // success
                    profile.notify({
                        title: plugin.entry,
                        message: 'write ' + profile.data.target
                    });
                })
                .on('error', function ( error ) {
                    // failure
                    profile.notify({
                        type: 'fail',
                        title: plugin.entry,
                        message: error
                    });
                });
        })
    );

    // remove the generated file
    profile.task('clean', function ( done ) {
        fs.unlink(profile.data.target, function ( error ) {
            profile.notify({
                type: error ? 'warn' : 'info',
                title: 'clean',
                message: error || ('delete ' + profile.data.target)
            });

            done();
        });

        //if ( del.sync([profile.data.target]).length ) {
        //    // something was removed
        //    profile.notify({
        //        info: 'delete '.green + profile.data.target.bold,
        //        title: 'clean',
        //        message: profile.data.target
        //    });
        //}
    });
});


// public
module.exports = plugin;
