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
	// some optional diff targets while i write the code to calculate these
	// diff  1 = ffffffffffffffffffffffffffffffffffffffffffffffffffffffff00000000
	// diff  2 = 0000000000000000000000000000000000000000000000000000008000000000
	// diff  4 = 0000000000000000000000000000000000000000000000000000004000000000
	// diff  8 = 0000000000000000000000000000000000000000000000000000002000000000
	// diff 16 = 0000000000000000000000000000000000000000000000000000001000000000
	// diff 32 = 0000000000000000000000000000000000000000000000000000000800000000
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