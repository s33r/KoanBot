var restify = require('restify');
var builder = require('botbuilder');

var debug = require('./debug.conf');
var kbase = require('./koanBot/kbase');

var connectorConfig = {};

if (!!debug) {
    connectorConfig.appId = debug.id;
    connectorConfig.appPassword = debug.password;
} else {
    connectorConfig.appId = process.env.MICROSOFT_APP_ID;
    connectorConfig.appPassword = process.env.MICROSOFT_APP_PASSWORD;
}

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