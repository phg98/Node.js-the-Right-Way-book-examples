// Example code for the book "Node.js the Right Way"
"use strict" ;
const 
    fs = require ('fs'),
    spawn = require('child_process').spawn,
    filename = process.argv[2],
    net = require('net'),
    server = net.createServer(function  (connection) {
        // reporting
        console.log('subscriber connected.');
        connection.write("Now watching '" + filename + "' for changes...\n");

        // watcher setup
        let watcher = fs.watch(filename, function  ( ) {
            connection.write("File '" + filename + "' changed! " + Date.now() + "\n");
        });

        // clean up
        connection.on('close', function  ( ) {
            console.log('Subscriber disconnected.');
            watcher.close();
        });
    });

if (!filename) {
    throw Error("A file to watch must be specified!") ;
}
server.listen(5432, function  ( ) {
    console.log('Listening for subscribers...');
});
