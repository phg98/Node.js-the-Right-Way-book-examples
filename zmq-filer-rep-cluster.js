'use strict';
const
    cluster = require('cluster'),
    fs = require('fs'),
    zmq = require('zmq');

if(cluster.isMaster) {
    let 
        router = zmq.socket('router').bind('tcp://127.0.0.1:5433'),
        dealer = zmq.socket('dealer').bind('tcp://127.0.0.1:5434');

    router.on('message', function(){
        let frames = Array.prototype.slice.call(arguments);
        dealer.send(frames);
    });

    dealer.on('message', function(){
        let frames = Array.prototype.slice.call(arguments);
        router.send(frames);
    });

    cluster.on('online', function(worker) {
        console.log('Worker ' + worker.process.pid + ' is online.');
    });

    for (let i=0; i<3; i++) {
        cluster.fork();
    }
} else {
    let responder = zmq.socket('rep').connect('tcp://127.0.0.1:5434');
    responder.on('message', function(data) {
        let request = JSON.parse(data);
        console.log(process.pid + ' Received request to get: ' + request.path);
    
        // read file and reply with content
        fs.readFile(request.path, function(err, data){
            //if (err) Error(err);
            console.log(process.pid + ' Sending response content' + data);
            responder.send(JSON.stringify({
                data: data.toString(),
                timestamp: Date.now(),
                pid: process.pid
            }));
        });
    });
}

