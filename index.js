import process from 'node:process';
import os from 'node:os';
import fs from 'node:fs';
import isDocker from 'is-docker';

const isWsl = () => {
	if (process.platform !== 'linux') {
		return false;
	}

	if (os.release().toLowerCase().includes('microsoft')) {
		if (isDocker()) {
			return false;
		}

		return true;
	}

	try {
		return fs.readFileSync('/proc/version', 'utf8').toLowerCase().includes('microsoft')
			? !isDocker() : false;
	} catch {
		return false;
	}
};

export default process.env.__IS_WSL_TEST__ ? isWsl : isWsl();
