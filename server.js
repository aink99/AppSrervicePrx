// By Tom Chantler - https://tomssl.com/2016/07/15/azure-web-apps-as-a-reverse-proxy-for-hapi-js-and-other-multiple-node-js-servers/
'use strict';

const Hapi = require('hapi');
const numberOfServers = 10;

for (var i=0; i<numberOfServers; i++) {
    createServer(3001 + i);
};

function createServer(port){
    const serverN = new Hapi.Server();
    serverN.connection({host: 'localhost', port: port });

    serverN.route({
        method: 'get',
        path: '/',
        handler: function (request, reply) {
            reply('Hello from <b>' + serverN.info.uri + '</b> - ' + new Date().toString());
        }
    });

    serverN.start(() => {
        console.log('server running at:', serverN.info.uri);
    });
};