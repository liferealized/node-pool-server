var   logger = require('./logger')
	, bitcoin = require('bitcoin')
	, config = require('./config');
	
var GetWorkRPC = function(client) {

	this.bitcoinClient = client;
};

GetWorkRPC.prototype.getwork = function(rpc, workSubmission) {

	var self = this;
	
	if (!workSubmission)
	{
		var miningExtensions = this._extractAllowedMiningExtensions(rpc.HTTPRequest);
		
		// we have a getwork request so make the call without any params
		self.bitcoinClient.getWork(function(err, work) {
			
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
	}
	else
	{
		// we have a getwork request so make the call without any params
		self.bitcoinClient.getWork(workSubmission, function(err, result) {
			
			if (err)
			{ 
				rpc.error('Getwork submission failed.');
				logger.error('work submit failed', { by: rpc.HTTPRequest.ip, submission: workSubmission});
				return; 
			}
			
			if (result)
				logger.info('work submit', { by: rpc.HTTPRequest.ip, submission: workSubmission, winner: result});
			
			rpc.response(true);
		});
	}
};

GetWorkRPC.prototype._extractAllowedMiningExtensions = function(req) {

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
module.exports = GetWorkRPC;



