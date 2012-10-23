var   express = require('express')
	, bitcoin = require('bitcoin')
	, logger = require('./logger')
	, config = require('./config')
	, basicauth = require('./basic-auth')
	, RPCHandler = require('jsonrpc').RPCHandler
	, BitcoinRPC = require('./bitcoin-rpc')
	, LongPoll = require('./longpoll');

// get express and the bitcoin rpc client
var   app = express()
	, client = new bitcoin.Client(config.bitcoin)
	, longpoll = new LongPoll(client).startInterval(config.longpoll.checkBlockCountInterval)
	, bitcoinRpc = new BitcoinRPC(client);

// run our basic authentication for all requests on our server
app.use(function(req, res, next) {
	basicauth.apply(req, res, function(username) {
		req.username = username;
		next();
	});
});

// accept posts to the root for getwork and getblocktemplate work request/submisssion
app.post('/', function(req, res) {
	
	new RPCHandler(req, res, bitcoinRpc, true);
}); 

// accept posts to /lp to keep miners up to date on a bock change
app.post('/lp', function(req, res) {
	
	logger.info('lp received', { by:req.ip});
	req.connection.setTimeout(config.longpoll.timeout);
	longpoll.pushRequest(res, req.ip, new Date().getTime(), req.username);
	res.on('close', function() { logger.info('lp closed'); });
});

// listen on the config port
app.listen(config.app.port);
logger.info('Listening on port ' + config.app.port.toString());








