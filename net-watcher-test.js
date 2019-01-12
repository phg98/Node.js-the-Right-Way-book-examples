// Example code for the book "Node.js the Right Way"
"use strict" ;
const 
    fs = require ('fs'),
    net = require('net'),
    server = net.createServer(function  (connection) {
        // reporting
        console.log('subscriber connected.');

        connection.write(
            '{"type":"changed","file":"targ'
        );

        // after 1 second delay, send the other chunk
        let timer = setTimeout(function  ( ) {
            connection.write('et.txt","timestamp":1258175758495}' + "\n");
            connection.end();
        }, 1000);

        // clear timer when the connection ends
        connection.on('end', function  ( ) {
            clearTimeout(timer);
            console.log("Subscriber disconnected");
        });

    });

server.listen(5432, function  ( ) {
    console.log('TEST SERVER*** Listening for subscribers...');
});
