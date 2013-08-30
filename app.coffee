express = require 'express'
handlebars = require 'hbs'
app = require('express')()
server = require('http').createServer(app)
io = require('socket.io').listen(server)

data = []

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

app.get '/status', (request, response) ->
  response.send data

app.get '/clear', (request, response) ->
  data = []
  response.send 200

getDataItemForIndex = (index) ->
  data[index] = {count: 0, mood: 0, comments: [], index: index} if not data[index]
  data[index]

updateClientsForIndex = (index) -> io.sockets.emit 'update', data[index]

io.sockets.on 'connection', (socket) ->
  socket.emit 'init', data
  socket.on 'client-mood-update', (updateData) ->
    dataItem = getDataItemForIndex(updateData.index)
    newCount = dataItem.count + 1
    dataItem.mood = ((dataItem.mood * dataItem.count) + updateData.mood) / newCount
    dataItem.count = newCount
    updateClientsForIndex(updateData.index)

  socket.on 'client-comment-update', (updateData) ->
    dataItem = getDataItemForIndex(updateData.index)
    dataItem.comments.push updateData.comment
    updateClientsForIndex(updateData.index)

server.listen app.get('port'), ->
  console.log "Express server listening on port #{app.get('port')}"