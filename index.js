var restify = require('restify');
var builder = require('botbuilder');
var kbase = require('./koanBot/kbase');

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



kbase.initialize();

// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
    console.log('%s listening to %s', server.name, server.url);
});

// Create chat bot
var connector = new builder.ChatConnector(connectorConfig);
var bot = new builder.UniversalBot(connector);
server.post('/api/messages', connector.listen());

//=========================================================
// Bots Dialogs
//=========================================================

bot.dialog('/', function (session) {
    session.send(kbase.getKoan(session.message.text));
});