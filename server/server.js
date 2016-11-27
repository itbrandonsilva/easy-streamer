"use strict";

var express = require("express");
var bodyParser = require("body-parser");

var child_process = require('child_process');
var spawn = child_process.spawn;
var spawnSync = child_process.spawnSync;

var psTree = require('ps-tree');
var async = require('async');

var PORT = 6324;
var CMD = "/usr/local/bin/streamlink";

var app = express();
var server = require('http').Server(app);
//var socketio = require('socket.io')(server);

app.use(bodyParser.json());

app.get("/estream/discover", function (req, res) {
        res.send('estream-ready');
});

app.get("/eastream/stream/stop", function (req, res) {
    res.send('shutdown');
    killPs(function (err) {
        if (err) return console.error;
    });
});

app.get("/estream/stream/watch", function (req, res) {
    watchChannel(req.query.name, parseInt(req.query.quality), (err) => {
        if ( ! err ) return res.send('ok');
        if (err.message === 'not-found') return res.send('not-found');
        return res.send('error');
    });
});

server.listen(PORT, function () {
    log('');
    log(new Date());
    log('Listening on port ' + PORT)
})

function log(data) {
    console.log(data);
    //socketio.emit('log', data);
}

var ps = null;
function killPs(cb) {
    if ( !ps ) return cb();
    psTree(ps.pid, function (err, children) {
        if (err) return cb(err);
        spawnSync('kill', ['-9'].concat(children.map(function (p) {return p.PID})));
        log('Killed.');
        return cb();
    });
}

function watchChannel(channelName, quality, cb) {
     log("watchChannel()");
     async.series([killPs],
        function (err) {
            if (err) return cb(err);

            let result = spawnSync(CMD, ['twitch.tv/' + channelName]);
            let stdout = result.stdout.toString();
            console.log(stdout);

            if (stdout.indexOf('No streams found') > -1) return cb(new Error('not-found'));
            if (stdout.indexOf('Available streams: ') === -1) return cb (new Error('error'));

            let qualities = stdout.split('Available streams: ')[1];
            qualities = qualities.split(' ').join('').split('(worst)').join('').split('(best)').join('').split('\n').join('').split(',');
            let qualitySelection = qualities[qualities.length-1 - quality];

            var cmdString = CMD + ' twitch.tv/' + channelName + ' ' + qualitySelection + ' -np "omxplayer -o hdmi"'
            ps = spawn('/bin/sh', ['-c', cmdString]);

            ps.stdout.on('data', function (data) {
                data = data.slice(0, data.length-1);
                log("PSOUT: " + data.toString());
            });
            ps.stderr.on('data', function (data) {
                data = data.slice(0, data.length-1);
                log("PSERR: " + data.toString());
            });
            ps.on('exit', function (code, signal) {
                log('PS EXIT: ' + signal + '/' + signal);
            });
            ps.on('close', function (code, signal) {
                log('PS CLOSE: ' + signal + '/' + signal);
            });

            return cb();
        }
    );
}

