import test from 'ava';
import proxyquire from 'proxyquire';
import clearModule from 'clear-module';

test.beforeEach(() => {
	clearModule('.');
});

test('inside WSL 1', t => {
	process.env.__IS_WSL_TEST__ = true;

	const originalPlatform = process.platform;
	Object.defineProperty(process, 'platform', {value: 'linux'});

	const isWsl = proxyquire('.', {
		fs: {
			readFileSync: () => 'Linux version 3.4.0-Microsoft (Microsoft@Microsoft.com) (gcc version 4.7 (GCC) ) #1 SMP PREEMPT Wed Dec 31 14:42:53 PST 2014'
		}
	});

	t.true(isWsl());

	delete process.env.__IS_WSL_TEST__;
	Object.defineProperty(process, 'platform', {value: originalPlatform});
});

test('inside WSL 2', t => {
	process.env.__IS_WSL_TEST__ = true;

	const originalPlatform = process.platform;
	Object.defineProperty(process, 'platform', {value: 'linux'});

	const isWsl = proxyquire('.', {
		fs: {
			readFileSync: () => 'Linux version 4.19.43-microsoft-standard (oe-user@oe-host) (gcc version 7.3.0 (GCC)) #1 SMP Mon May 20 19:35:22 UTC 2019'
		}
	});

	t.true(isWsl());

	delete process.env.__IS_WSL_TEST__;
	Object.defineProperty(process, 'platform', {value: originalPlatform});
});

test('not inside WSL', t => {
	process.env.__IS_WSL_TEST__ = true;

	const originalPlatform = process.platform;
	Object.defineProperty(process, 'platform', {value: 'darwin'});

	const isWsl = require('.');
	t.false(isWsl());

	delete process.env.__IS_WSL_TEST__;
	Object.defineProperty(process, 'platform', {value: originalPlatform});
});

test('not inside WSL, but inside Linux', t => {
	process.env.__IS_WSL_TEST__ = true;

	const originalPlatform = process.platform;
	Object.defineProperty(process, 'platform', {value: 'linux'});

	const isWsl = proxyquire('.', {
		fs: {
			readFileSync: () => 'Linux version 4.19.43-standard (oe-user@oe-host) (gcc version 7.3.0 (GCC)) #1 SMP Mon May 20 19:35:22 UTC 2019'
		},
		os: {
			release: () => ''
		}
	});

	t.false(isWsl());

	delete process.env.__IS_WSL_TEST__;
	Object.defineProperty(process, 'platform', {value: originalPlatform});
});
