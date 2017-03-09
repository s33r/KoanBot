var restify = require('restify');
var builder = require('botbuilder');

var kbase = require('./kbase');


var directLineUrl = 'https://directline.botframework.com';
var tokenEndpoint = '/v3/directline/tokens/generate';

function getToken(client, endpoint, callback, onError) {
    client.post(endpoint,
        function (error, request, response, obj) {
            if (error) {
                onError && onError(error);
            } else {
                callback && callback(obj);
            }
        });
}

module.exports.start = function (connectorConfig, directLineConfig) {
    kbase.initialize();

    var directLineClient = restify.createJsonClient({
        url: directLineUrl,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json; charset=utf-8',
            'Authorization': 'Bearer ' + directLineConfig.secret
        }
    });

    var server = restify.createServer();
    var connector = new builder.ChatConnector(connectorConfig);
    var bot = new builder.UniversalBot(connector);

    server.use(restify.CORS());

    server.post('/api/messages', connector.listen());

    server.get('/api/token', function (request, response, next) {
        console.log('getting token');

        getToken(directLineClient,
            tokenEndpoint,
            function (result) {
                response.send(201, result);
            }, function(error) {
                console.dir(error);
                response.send(500, error);
            });

    });

    server.get(/.*/, restify.serveStatic({
        'directory': '.',
        'default': 'index.html'
    }));

    bot.dialog('/', function (session) {
        session.send(kbase.getKoan(session.message.text));
    });


    server.listen(process.env.port || process.env.PORT || 3978, function () {
        console.log('%s listening to %s', server.name, server.url);
    });
};