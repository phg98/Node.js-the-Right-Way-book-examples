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
    let ls = spawn('cmd', ['/c', 'dir', filename]);
    ls.stdout.pipe(process.stdout);
}) ;
console.log("Now watching target.txt for changes...");
