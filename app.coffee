express = require 'express'
http = require 'http'
handlebars = require 'hbs'

app = express()

app.configure ->
  app.set 'port', '3000'
  app.use express.logger("dev")
  app.set 'views', "#{__dirname}/views"
  app.set 'view engine', 'hbs'
  app.use app.router
  app.use express.static("#{__dirname}/public")
  app.use express.errorHandler()

app.get '/', (request, response) ->
  response.render 'home'

http.createServer(app).listen app.get('port'), ->
  console.log "The environment is #{app.get('env')}"
  console.log "Express server listening on port #{app.get('port')}"