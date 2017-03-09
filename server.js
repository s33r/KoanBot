var restify = require('restify');



var bot = require('./koanBot/bot');
var directLine = require('./koanBot/directLine');

var debug = (function () {
    try {
        var result = require('./debug.conf');

        console.warn('In local debug mode.');

        return result;
    } catch (error) {
        return null;
    }
})();

var connectorConfig = (function() {
    if (!!debug) {
        return {
            appId: debug.id,
            appPassword: debug.password
        };
    } else {
        if (!process.env.MICROSOFT_APP_ID) {
            console.warn('No App ID found.');
        }

        if (!process.env.MICROSOFT_APP_PASSWORD) {
            console.warn('No App Password found.');
        }

        return {
            appId: process.env.MICROSOFT_APP_ID,
            appPassword: process.env.MICROSOFT_APP_PASSWORD
        };
    }
})();

var directLineConfig = (function () {
    if (!!debug) {
        return {
            secret: debug.directLineSecret
        };
    } else {
        if (!process.env.AARON_DIRECT_LINE_SECRET) {
            console.warn('No Direct Line Secret found.');
        }
        return {
            secret: process.env.AARON_DIRECT_LINE_SECRET,
        };
    }
})();


bot.start(connectorConfig, directLineConfig);
directLine.start();