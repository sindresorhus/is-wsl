'use strict';
const fs = require('fs');

const isWsl = () => {
	if (process.platform !== 'linux') {
		return false;
	}

	try {
		return fs.readFileSync('/proc/version', 'utf8').includes('Microsoft');
	} catch (err) {
		return false;
	}
};

if (process.env.__AWFUL_WAY_TO_TEST_THIS_BUT_WHATEVER__) {
	module.exports = isWsl;
} else {
	module.exports = isWsl();
}
