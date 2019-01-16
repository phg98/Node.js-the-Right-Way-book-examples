'use strict';
const
    cluster = require('cluster'),
    fs = require('fs'),
    zmq = require('zmq');

if(cluster.isMaster) {
    let 
        online_worker = 0, ready_count = 0,
        pusher = zmq.socket('push').bind('tcp://127.0.0.1:5433'),
        puller = zmq.socket('pull').bind('tcp://127.0.0.1:5434');

    puller.on('message', function(){
        let frames = Array.prototype.slice.call(arguments);
        if (ready) {
            ready_count++;
            if (ready_count>=3) {
                pusher.send(JSON.stringify({
                    path: "test.txt"
                }));
            }
        } else if (result_message) {
            console.log('result_message : ' + result_message);
        }
    });

    cluster.on('online', function(worker) {
        online_worker++;
        console.log('Worker ' + worker.process.pid + ' is online. total workers ' + online_worker);
    });

    for (let i=0; i<3; i++) {
        cluster.fork();
    }
} else {
    let puller = zmq.socket('pull').connect('tcp://127.0.0.1:5433');
    let pusher = zmq.socket('push').connect('tcp://127.0.0.1:5434');
    puller.on('message', function(data) {
        let request = JSON.parse(data);
        console.log(process.pid + ' Received request to get: ' + request.path);
    
        // read file and reply with content
        fs.readFile(request.path, function(err, data){
            //if (err) Error(err);
            console.log(process.pid + ' Sending response content' + data);
            pusher.send(JSON.stringify({
                type: "result",
                data: data.toString(),
                timestamp: Date.now(),
                pid: process.pid
            }));
        });
    });
    pusher.send(JSON.stringify({
        type: "ready"
    }))
}

