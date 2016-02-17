"use strict";

var Promise = require("bluebird"),
    getUsername = require("../../get-username"),
    os = require("os"),
    util = require("util");
var request = Promise.promisifyAll(require("request"));

// This is a true constant.
const SLACK_API_URL = "https://slack.com/api";

// Just hardcoding this so we're not spewing messages all over the place.
const SLACK_CHANNEL = "#ctt-vimtutor";

// And might as well make this a constant.
const ICON_EMOJI = ":heart:";

function SlackClient() {
    this.SlackClient = SlackClient;
    this.token = undefined;
}

module.exports = function () {
    return new SlackClient();
};

SlackClient.prototype.setToken = function (k) {
    this.token = k;
    return this;
};

SlackClient.prototype.testConnection = function () {
    return request.getAsync({
        url: SLACK_API_URL + "/auth.test",
        json: true,
        qs: {
            token: this.token
        }
    })
    .then((r) => {
        if (!r || !r.body) {
            throw new Error("No response body from Slack!");
        }

        if (!r.body.ok) {
            throw new Error("Could not communicate with Slack: " + r.body.error);
        }
    });
};

SlackClient.prototype.sendMessage = function (text) {
    return request.postAsync({
        url: SLACK_API_URL + "/chat.postMessage",
        json: true,
        qs: {
            token: this.token,
            channel: SLACK_CHANNEL,
            text: text,
            username: getBotUsername(),
            "icon_emoji": ICON_EMOJI
        }
    })
    .then((r) => {
        if (!r || !r.body) {
            throw new Error("No response body from Slack!");
        }

        if (!r.body.ok) {
            console.log(JSON.stringify(r.body, null, 2));
            throw new Error("Could not send a Slack message to channel " + SLACK_CHANNEL + ": " + r.body.error);
        }
    });
};

function getBotUsername() {
    return util.format("%s's bot on %s", getUsername(), os.hostname());
}
