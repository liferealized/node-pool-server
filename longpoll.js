var   logger = require('./logger')
	, config = require('./config');

function LongPoll(client) {
	
	// stacked long poll requests
	this.requests = [];
	this.blockcount = -1;
	this.bitcoinClient = client;
	this.bitcoinPollingStarted = false;
};

LongPoll.prototype.pushRequest = function(response, ip, username, timestamp) {

	this.requests.push({
		  ip: ip
		, response: response
		, username: username
		, timestamp: timestamp
	});
};

LongPoll.prototype.popRequest = function() {
	return this.requests.pop();
};

LongPoll.prototype.requestLength = function() {
	return this.requests.length;
};

LongPoll.prototype.startInterval = function(interval) {
	
	var self = this;
	
	if (this.bitcoinPollingStarted)
		return;
	
	this.bitcoinPollingStarted = true;

	setInterval(function() {
	
		self.bitcoinClient.getBlockCount(function(err, newBlockCount) {
			
			if (err)
			{
				logger.error('getBlockCount failed');
				return; 
			}
			
			if (self.blockcount == -1)
			{
				logger.info('setting blockcount', {blockcount: newBlockCount.toString()});
				self.blockcount = newBlockCount;
				return;
			}
			
			// if we have a new block, send everyone a new work request via longpoll
			if (self.blockcount != newBlockCount)
			{
				logger.info('block change!!!', {blockcount: newBlockCount.toString()});
				self.blockcount = newBlockCount;
				
				for (var i = self.requestLength() - 1; i >= 0; i--)
				{
					var longpoll = self.popRequest();
					
					// check to see if we still have a connection, otherwise go to the next iteration
					if (!longpoll.response.socket.writable)
						continue;
					
					// only log a long poll if we are actually responding to the thread
					logger.info('sending out longpoll', {blockcount: newBlockCount});
					
					// we have a getwork request so make the call without any params
					self.bitcoinClient.getWork(function(err, work) {
						
						if (!err)
						{
							// set a new target for the work to be submitted
							work.target = config.getwork.target;
							
							// tell the miners to submit old work
							work.submitold = config.getwork.submitold;
						}
						
						try
						{
							logger.info('lp response successful');
							longpoll.response.json({result: err?null:work, err: err?err:null, id: 1});
						}
						catch (e)
						{
							logger.error('lp response failed');
							longpoll.response.end();
						}
					});
				}
			}
		});
	}, interval);
	
	return this;
};

module.exports = LongPoll;
