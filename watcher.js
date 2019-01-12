// Example code for the book "Node.js the Right Way"
"use strict" ;
const 
    fs = require ('fs'),
    spawn = require('child_process').spawn,
    filename = process.argv[2] ;

if (!filename) {
    throw Error("A file to watch must be specified!") ;
}
fs.watch('target.txt', function( ) {
    let ls = spawn('cmd', ['/c', 'dir', '/B', filename]);
    let output = '';
    ls.stdout.on('data', function(chunk) {
        output += chunk.toString();
    });
    ls.on('close', function() {
        let parts = output.split(/ls+/);
        console.dir([parts[0], parts[4]]);
    })
}) ;
console.log("Now watching target.txt for changes...");
