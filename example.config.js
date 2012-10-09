var config = {
	
	// bitcoin-qt or bitcoind settings
	  bitcoin: {
		  host: 'localhost'
		, port: 8332
		, user: '<yourRPCusername>'
		, pass: '<yourRPCpassword>'
	}
	// application settings
	, app: { 
		  port: 3000 
	}
	// node logger settings
	, winston: {
		  filename: "pool-log.txt"
		, timestamp: true
		, maxsize: 10485760
	}
	// getwork settings
	, getwork: {
		  target: 'ffffffffffffffffffffffffffffffffffffffffffffffffffffffff00000000'
		, submitold: true
		, rollntime: { enabled: true, expire: 120 }
	}
	// longpoll settings
	, longpoll: {
		  timeout: 7200000
		, checkBlockCountInterval: 500
	}
	, authentication: {
		  authRealm: 'jsonrpc'
		, authList: [ 'worker:pass', 'worker2:pass2' ]
	}
};

// export!
module.exports = config;