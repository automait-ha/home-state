var bunyan = require('bunyan')
  , logger = bunyan.createLogger({ name: 'home-state' })
  , Primus = require('primus')
  , Emitter = require('primus-emitter')
  , config = {}

try {
  config = require(process.argv[2])
} catch (e) {
  logger.warn('No config file provided, using defaults')
}

var server = Primus.createServer(
      { port: config.port || 4578
      , transformer: 'websockets'
      , iknowhttpsisbetter: true
      , parser: 'JSON'
      })
  , state = config.defaultState || 'Default'

server.use('emitter', Emitter)

logger.info('Initial state set to: "' + state + '"')

server.on('connection', function (spark) {
  spark.send('state', state)

  spark.on('changeState', function (newState) {
    logger.info('Changing state from "' + state  + '" to "' + newState + '"')
    state = newState
    server.send('state', state)
  })
})
