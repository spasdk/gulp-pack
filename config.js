/**
 * Configuration for pack gulp task.
 *
 * @author Stanislav Kalashnik <darkpark.main@gmail.com>
 * @license GNU GENERAL PUBLIC LICENSE Version 3
 */

'use strict';

// set of named configs for corresponding gulp tasks
// each profile inherits all options from the "default" profile
module.exports = {
    default: {
        // create watch task
        // to automatically rebuild on source files change
        watch: false
    },

    develop: {

    }
};
