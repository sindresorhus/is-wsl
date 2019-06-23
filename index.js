'use strict';
const os = require('os');
const fs = require('fs');

const isWsl = () => {
	if (process.platform !== 'linux') {
		return false;
	}

	if (os.release().toLowerCase().includes('microsoft')) {
		return true;
	}

	try {
		if (fs.readFileSync('/proc/version', 'utf8').toLowerCase().includes('microsoft')) {
			return true;
		}
	} catch (_) {
		return false;
	}
};

if (process.env.__IS_WSL_TEST__) {
	module.exports = isWsl;
} else {
	module.exports = isWsl();
}
