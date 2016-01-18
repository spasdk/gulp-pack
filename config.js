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
        sourceFile: [
            path.join(config.default.targetPath, '**', '*'),
            '!' + path.join(config.default.targetPath, '**', 'develop.*'),
            '!' + path.join(config.default.targetPath, '**', 'readme.md')
        ],

        // use compression for output file
        compress: true
    },

    develop: {
        // array of file globs to process
        // see format in https://github.com/isaacs/node-glob
        sourceFile: [
            path.join(config.default.targetPath, '**', '*'),
            '!' + path.join(config.default.targetPath, 'index.html'),
            '!' + path.join(config.default.targetPath, '**', 'release.*'),
            '!' + path.join(config.default.targetPath, '**', 'readme.md')
        ]
    }
});
