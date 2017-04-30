var events = require('events')
var through = require('through2')
var pumpify = require('pumpify')
var inherits = require('inherits')

function ReadFileProgress (file, opts) {
  if (!(this instanceof ReadFileProgress)) return new ReadFileProgress(file, opts)
  events.EventEmitter.call(this)

  fs = opts.fs || require('fs')

  var self = this

  self.total = -1
  self.done = 0
  self.progress = 0

  fs.stat(file, function (err, stat) {
    if (err) return error('error reading file: ' + file, err)
    self.total = stat.size
  })

  self.stream = pumpify(fs.createReadStream(file), through(update))

  self.stream.on('end', () => self.emit('end'))

  function update (data, enc, done) {
    self.done += data.length
    self.progress = self.done / self.total
    self.emit('progress', {
      done: self.done,
      total: self.total,
      progress: self.progress
    })
    done(null, data)
  }

  function error (msg, err) {
    if (err) err.message = msg
    else err = new Error(msg)
    self.emit('error', err)
  }
}

// drains the readfile stream
ReadFileProgress.prototype.drain = function () {
  this.stream.on('data', noop)
}

inherits(ReadFileProgress, events.EventEmitter)

function noop () {}

module.exports = ReadFileProgress
