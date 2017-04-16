import path from 'path';
import test from 'ava';
import proxyquire from 'proxyquire';

test('inside WSL', t => {
	const origPlatform = process.platform;
	Object.defineProperty(process, 'platform', {value: 'linux'});

	const isWsl = proxyquire('.', {
		fs: {
			readFileSync: () => 'Linux version 3.4.0-Microsoft (Microsoft@Microsoft.com) (gcc version 4.7 (GCC) ) #1 SMP PREEMPT Wed Dec 31 14:42:53 PST 2014'
		}
	});

	t.true(isWsl());

	delete process.env.__AWFUL_WAY_TO_TEST_THIS_BUT_WHATEVER__;
	Object.defineProperty(process, 'platform', {value: origPlatform});
});

test('not inside WSL', t => {
	delete require.cache[path.join(__dirname, 'index.js')];
	const isWsl = require('.');

	t.false(isWsl);
});
