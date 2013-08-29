express = require 'express'
handlebars = require 'hbs'
app = require('express')()
server = require('http').createServer(app)
io = require('socket.io').listen(server)

app.configure ->
  app.set 'port', process.env.PORT || '3000'
  app.use express.logger("dev")
  app.set 'views', "#{__dirname}/views"
  app.set 'view engine', 'hbs'
  app.use app.router
  app.use express.static("#{__dirname}/public")
  app.use express.errorHandler()

app.get '/', (request, response) ->
  response.render 'home'

data = []

io.sockets.on 'connection', (socket) ->
  console.log data
  socket.emit 'init', data
  socket.on 'client-update', (updateData) ->
    existing = data[updateData.index]
    if existing
      newCount = existing.count + 1
      existing.mood = ((existing.mood * existing.count) + updateData.mood) / newCount
      existing.count = newCount
    else
      data[updateData.index] = {count: 1, mood: updateData.mood}

    existing = data[updateData.index]
    io.sockets.emit 'update', { count: existing.count, mood: existing.mood, index: updateData.index }

server.listen app.get('port'), ->
  console.log "Express server listening on port #{app.get('port')}"