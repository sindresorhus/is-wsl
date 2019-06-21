'use strict';
const os = require('os');
const fs = require('fs');

const MS_RE = /microsoft/i;

const isWsl = () => {
	if (process.platform !== 'linux') {
		return false;
	}

	if (os.release().match(MS_RE) !== null) {
		return true;
	}

	try {
		if (fs.readFileSync('/proc/version', 'utf8').match(MS_RE) !== null) {
			return true;
		}
	} catch (_) {
		return false;
	}
};

module.exports = isWsl;
