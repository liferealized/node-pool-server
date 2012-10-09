var   winston = require('winston')
	, config = require('./config');

var loggingLevels = {};

loggingLevels.levels = {
	  debug: 1
	, info: 10
	, notice: 20
	, warn: 30
	, error: 40
	, crit: 50
	, alert: 60
	, emerg: 70
};

loggingLevels.colors = {
	  debug: 'blue'
	, info: 'green'
	, notice: 'cyan'
	, warn: 'yellow'
	, error: 'red'
	, crit: 'red'
	, alert: 'yellow'
	, emerg: 'red'
};

var months = [
	  'Jan'
	, 'Feb'
	, 'Mar'
	, 'Apr'
	, 'May'
	, 'Jun'
	, 'Jul'
	, 'Aug'
	, 'Sep'
	, 'Oct'
	, 'Nov'
	, 'Dec'
];

var pad = function (n) {
	return n < 10 ? '0' + n.toString(10) : n.toString(10);
};

var pad3 = function (n) {
	var num = n.toString(10);
	while (num.length < 3) num = '0' + num;
	return num;
};

var timestamp = function () {
	var   d = new Date()
		, time = [
			  pad(d.getHours())
			, pad(d.getMinutes())
			, pad(d.getSeconds())
		].join(':');
	
	time += '.' + pad3(d.getMilliseconds());

	return [d.getDate(), months[d.getMonth()], time].join(' ');
};

var logger = exports.logger = new winston.Logger({
	  transports: [
		    new winston.transports.Console({
				  colorize: true
				, level: 'debug'
				, timestamp: timestamp
		  })
		  , new winston.transports.File(config.winston)
	]
	, levels: loggingLevels.levels
	, level: 'debug'
});

winston.addColors(loggingLevels.colors);

exports.disable = function () {
  this.logger.remove(winston.transports.Console);
};

logger.extend(exports);


