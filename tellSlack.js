#!/usr/bin/env node

"use strict";

var nconf = require("nconf"),
    util = require("util");
var SlackClient = require("./lib/client/slack")().SlackClient;

function usage () {
    throw new Error(
        util.format(
            "Usage: %s --token=KEY --message='Message\n\n" +
            "Sends the provided message to the indicated channel on Slack\n",
            process.argv[1]
        )
    );
}

function main () {
    nconf
    .env("__")
    .argv()
    ;

    // validate options
    //
    if (!nconf.get("token") || !nconf.get("message")) {
        usage();
    }

    var slack = new SlackClient();

    slack
    .setToken(nconf.get("token"))
    .testConnection()
    .then(() => {
        return slack.sendMessage(nconf.get("message"));
    })
    .catch((e) => {
        throw e;
    });
}

main();

// vim:shiftwidth=4:softtabstop=4:expandtab
