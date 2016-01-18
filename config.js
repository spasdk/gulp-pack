/**
 * Configuration for pack gulp task.
 *
 * @author Stanislav Kalashnik <darkpark.main@gmail.com>
 * @license GNU GENERAL PUBLIC LICENSE Version 3
 */

'use strict';

var path   = require('path'),
    extend = require('extend'),
    config = require('spa-gulp/config');


// base config
// each profile inherits all options from the "default" profile
module.exports = extend(true, {}, config, {
    default: {
        // array of file globs to process
        // see format in https://github.com/isaacs/node-glob
        source: [
            path.join(config.default.target, '**', '*'),
            '!' + path.join(config.default.target, '**', 'develop.*'),
            '!' + path.join(config.default.target, '**', 'readme.md')
        ],

        // intended output file name
        target: '${name}.${version}.release.zip',

        // use compression for output file
        compress: true,

        // info channels
        notifications: {
            popup: {
                info: {
                    icon: path.join(__dirname, 'media', 'info.png')
                },
                warn: {
                    icon: path.join(__dirname, 'media', 'warn.png')
                },
                fail: {
                    icon: path.join(__dirname, 'media', 'fail.png')
                }
            }
        }
    },

    develop: {
        source: [
            path.join(config.default.target, '**', '*'),
            '!' + path.join(config.default.target, 'index.html'),
            '!' + path.join(config.default.target, '**', 'release.*'),
            '!' + path.join(config.default.target, '**', 'readme.md')
        ],

        target: '${name}.${version}.${profile}.zip'
    }
});
