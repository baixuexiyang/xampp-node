/**
 * xampp for node.js
 * @type {[type]}
 */
var express = require('express'),
    path = require('path'),
    bodyParser = require('body-parser'),
    compress = require('compression'),
    ejs = require('ejs'),
    routes = require('./routes'),
    http = require('http'),
    app = express(),
    config = require('./config'),
    server;

app.set('views', config.location);
app.set('view engine', 'ejs');
app.engine('.ejs', ejs.__express);
app.engine('.jade', ejs.__express);
app.engine('.php', ejs.__express);
app.engine('.html', ejs.__express);
app.engine('.htm', ejs.__express);
app.engine('.shtml', ejs.__express);
app.use(compress());
app.use(bodyParser());
app.use(express.static(config.location));
routes(app);
server = http.createServer(app);
server.listen(config.port, config.address || "127.0.0.1", function () {
    'use strict';
    console.log('Server listening on: '+config.port);
});
module.exports = app;
