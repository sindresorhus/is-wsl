'use strict';
const os = require('os');
const fs = require('fs');

const isWsl = () => {
	if (process.platform !== 'linux') {
		console.log('NOT LINUX');
		return false;
	}

	if (os.release().toLocaleLowerCase().includes('microsoft')) {
		console.log('RELEASE');
		return true;
	}

	try {
		if (fs.readFileSync('/proc/version', 'utf8').toLocaleLowerCase().includes('microsoft')) {
			console.log('VERSION');
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
