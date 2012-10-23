// rename this file to bitcoin-rpc.js so that we can include getBlockTemplate
// TODO: create a new method to handle getBlockTemplate() requests
// TODO: create the method _submitBlockTemplate(submission)
// change file to use a self invoking annon func like coffeescript writes them out

var   logger = require('./logger')
	, bitcoin = require('bitcoin')
	, config = require('./config');
	
var BitcoinRPC = function(client) {

	this.rpcClient = client;
};

BitcoinRPC.prototype.getblocktemplate = function(rpc, capabilities) {

	this.rpcClient.getBlockTemplate(capabilities, function(err, work) {

		rpc.response(work);
	});
};

BitcoinRPC.prototype.getwork = function(rpc, workSubmission) {

	if (workSubmission)
	{
		this._submitgetwork(rpc, workSubmission);
		return;
	}

	var   self = this
		, miningExtensions = this._extractAllowedMiningExtensions(rpc.HTTPRequest);
	
	// we have a getwork request so make the call without any params
	self.rpcClient.getWork(function(err, work) {
		
		if (err)
		{ 
			rpc.error('Getwork request failed.');
			logger.error('work request failed', { by: rpc.HTTPRequest.ip });
			return; 
		}
		
		if (miningExtensions.longpoll)
			rpc.HTTPResponse.set('X-Long-Polling', '/lp');
		
		if (miningExtensions.rollntime && config.getwork.rollntime.enabled)
			rpc.HTTPResponse.set('X-Roll-NTime', 'expire=' + config.getwork.rollntime.expire.toString());
		
		// set a new target for the work to be submitted
		work.target = config.getwork.target;
		
		// if the client can calculate the midstate, remove it from the message
		if (miningExtensions.midstate)
			delete work['midstate'];
		
		// tell the miners to submit old work
		if (miningExtensions.submitold)
			work.submitold = config.getwork.submitold;
		
		rpc.response(work);
	});
};

BitcoinRPC.prototype._submitgetwork = function(rpc, workSubmission) {

	var   self = this;

	// we have a getwork request so make the call without any params
	self.rpcClient.getWork(workSubmission, function(err, result) {
		
		if (err)
		{ 
			rpc.error('Getwork submission failed.');
			logger.error('work submit failed', { by: rpc.HTTPRequest.ip, submission: workSubmission});
			return; 
		}
		
		if (result)
			logger.notice('work submit', { by: rpc.HTTPRequest.ip, submission: workSubmission, winner: result});
		
		rpc.response(true);
	});	
};

BitcoinRPC.prototype._extractAllowedMiningExtensions = function(req) {

	var   miningExtensions = { hostlist: false, longpoll: false, midstate: false, rollntime: false, submitold: false, switchto: false }
		, headers = req.headers;
	
	for (var key in headers)
		if (key.match(/x-mining-extensions/i))
			for (var ext in miningExtensions)
				if (headers[key].match(new RegExp(ext), 'i'))
					miningExtensions[ext] = true;
	
	return miningExtensions;
};

// export our rpc handler and rpc methods
module.exports = BitcoinRPC;



