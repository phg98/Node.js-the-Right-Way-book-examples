'use strict';
const
    fs = require('fs'),
    zmq = require('zmq'),
    responder = zmq.socket("rep");

responder.on('message', function(data) {
    let request = JSON.parse(data);
    console.log('Received request to get: ' + request.path);

    // read file and reply with content
    fs.readFile(request.path, function(err, content){
        //if (err) Error(err);
        console.log('Sending response content' + content);
        responder.send(JSON.stringify({
            content: content.toString(),
            timestamp: Date.now(),
            pid: process.pid
        }));
    });
});

// listen on TCP port 5433
responder.bind('tcp://127.0.0.1:5433', function(err) {
    console.log('Listening for zmq requesters...');
});

// close the responder when the Node process ends
process.on('SIGINT', function() {
    console.log('Shutting donw...');
    responder.close();
});