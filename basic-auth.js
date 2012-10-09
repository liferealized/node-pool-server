var   config = require('./config')
	, logger = require('./logger')
	, auth = require('http-auth');

// setup our basic auth list and realm
var basicauth = module.exports = auth(config.authentication);

// override the basic ask method to return a jsonrpc response
basicauth.ask = function(response) {
	var header = 'Basic realm="' + this.realm + '"';
	response.setHeader("WWW-Authenticate", header);
	response.json(401, {result: null, error: 'Wrong username or password', id: 1});
};

