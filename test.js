import test from 'ava';
import proxyquire from 'proxyquire';
import clearRequire from 'clear-require';

test.beforeEach(() => {
	clearRequire('.');
});

test('inside WSL', t => {
	process.env.__IS_WSL_TEST__ = true;

	const origPlatform = process.platform;
	Object.defineProperty(process, 'platform', {value: 'linux'});

	const isWsl = proxyquire('.', {
		fs: {
			readFileSync: () => 'Linux version 3.4.0-Microsoft (Microsoft@Microsoft.com) (gcc version 4.7 (GCC) ) #1 SMP PREEMPT Wed Dec 31 14:42:53 PST 2014'
		}
	});

	t.true(isWsl());

	delete process.env.__IS_WSL_TEST__;
	Object.defineProperty(process, 'platform', {value: origPlatform});
});

test('not inside WSL', t => {
	t.false(require('.'));
});
