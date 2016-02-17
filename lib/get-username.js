"use strict";

var path = require("path"),
    os = require("os");

/* A complete cop-out.  There's no guarantee that the user's home directory
 * will be named after the user.  But whatever.
 */
module.exports = function () {
    return path.basename(os.homedir());
};

