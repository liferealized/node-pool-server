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
	// diff  5 = 0000000000000000000000000000000000000000333333333333333300000000
	// diff 10 = 0000000000000000000000000000000000000000999999999999991900000000
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