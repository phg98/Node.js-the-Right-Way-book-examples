'use strict';
const
    zmq = require('zmq'),       
    subscriber = zmq.socket('sub');


// subscribe to all message
subscriber.subscribe("");

// handle message from publisher
subscriber.on("message", function  (data) {
    let 
        message = JSON.parse(data),
        date = new Date(message.timestamp);
    console.log("File '" + message.file + "' changed at " + date);
});

// connect to publisher
subscriber.connect("tcp://localhost:5432");