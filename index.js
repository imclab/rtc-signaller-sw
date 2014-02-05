'use strict';
var EventEmitter = require('events').EventEmitter;
var inherits = require('inherits');
var path = require('path');

module.exports = function(opts) {
  return new Messenger(opts);
};

function Messenger(opts) {
  var url = 'data:text/javascript,' + require('./worker.js');
  console.log(url);

  this.worker = new SharedWorker(url, 'rtc-signaller-sw');

  var self = this;
  this.worker.port.addEventListener('message', function(ev) {
    self.emit('data', ev.data);
  });

  this.worker.port.start();
  this.emit('open');
}

inherits(Messenger, EventEmitter);

Messenger.prototype.write = function(data) {
  console.log('sending data',data);
  this.worker.port.postMessage(data);
};

Messenger.prototype.close = function() {
  console.log('closing');
  this.worker.port.postMessage(null);
};

