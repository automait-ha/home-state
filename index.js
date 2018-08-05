var bunyan = require('bunyan')
  , logger = bunyan.createLogger({ name: 'home-state' })
  , Primus = require('primus')
  , Emitter = require('primus-emitter')
  , http = require('http')
  , express = require('express')
  , bodyParser = require('body-parser')
  , app = express()
  , config = {}

try {
  config = require(process.argv[2])
} catch (e) {
  logger.warn('No config file provided, using defaults')
}

var server = http.createServer(app).listen(config.port || 4578)
  , primus = new Primus(server, { transformer: 'websockets', parser: 'JSON' })
  , state = config.defaultState || 'Default'

function setState(newState) {
  logger.info('Changing state from "' + state  + '" to "' + newState + '"')
  state = newState
  primus.send('state', state)
}

app.get('/', function (req, res) {
  res.json({ state: state })
})

app.post('/', bodyParser.json(), function (req, res) {
  if (req.body && req.body.state) {
    setState(req.body.state)
  }
  res.json({ state: state })
})

primus.use('emitter', Emitter)

logger.info('Initial state set to: "' + state + '"')

primus.on('connection', function (spark) {
  spark.send('state', state)
  spark.on('changeState', setState)
})
