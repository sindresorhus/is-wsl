import process from 'node:process';
import test from 'ava';
import esmock from 'esmock';

const requireFresh = modulePath => import(`${modulePath}?cacheBust=${Date.now()}`);

test('inside WSL 1', async t => {
	process.env.__IS_WSL_TEST__ = true;

	const originalPlatform = process.platform;
	Object.defineProperty(process, 'platform', {value: 'linux'});

	const isWsl = await esmock('./index.js', {
		fs: {
			readFileSync: () => 'Linux version 3.4.0-Microsoft (Microsoft@Microsoft.com) (gcc version 4.7 (GCC) ) #1 SMP PREEMPT Wed Dec 31 14:42:53 PST 2014',
		},
	});

	t.true(isWsl());

	delete process.env.__IS_WSL_TEST__;
	Object.defineProperty(process, 'platform', {value: originalPlatform});
});

test('inside WSL 2', async t => {
	process.env.__IS_WSL_TEST__ = true;

	const originalPlatform = process.platform;
	Object.defineProperty(process, 'platform', {value: 'linux'});

	const isWsl = await esmock('./index.js', {
		fs: {
			readFileSync: () => 'Linux version 4.19.43-microsoft-standard (oe-user@oe-host) (gcc version 7.3.0 (GCC)) #1 SMP Mon May 20 19:35:22 UTC 2019',
		},
	});

	t.true(isWsl());

	delete process.env.__IS_WSL_TEST__;
	Object.defineProperty(process, 'platform', {value: originalPlatform});
});

test('not inside WSL', async t => {
	process.env.__IS_WSL_TEST__ = true;

	const originalPlatform = process.platform;
	Object.defineProperty(process, 'platform', {value: 'darwin'});

	const {default: isWsl} = await requireFresh('./index.js');

	t.false(isWsl());

	delete process.env.__IS_WSL_TEST__;
	Object.defineProperty(process, 'platform', {value: originalPlatform});
});

test('not inside WSL, but inside Linux', async t => {
	process.env.__IS_WSL_TEST__ = true;

	const originalPlatform = process.platform;
	Object.defineProperty(process, 'platform', {value: 'linux'});

	const isWsl = await esmock('./index.js', {
		fs: {
			readFileSync: () => 'Linux version 4.19.43-standard (oe-user@oe-host) (gcc version 7.3.0 (GCC)) #1 SMP Mon May 20 19:35:22 UTC 2019',
		},
		os: {
			release: () => '',
		},
	});

	t.false(isWsl());

	delete process.env.__IS_WSL_TEST__;
	Object.defineProperty(process, 'platform', {value: originalPlatform});
});

test('inside WSL, but inside docker', async t => {
	process.env.__IS_WSL_TEST__ = true;

	const originalPlatform = process.platform;
	Object.defineProperty(process, 'platform', {value: 'linux'});

	const isWsl = await esmock('./index.js', {
		fs: {
			readFileSync: () => 'Linux version 4.19.43-microsoft-standard (oe-user@oe-host) (gcc version 7.3.0 (GCC)) #1 SMP Mon May 20 19:35:22 UTC 2019',
		},
		'is-docker': () => true,
		os: {
			release: () => 'microsoft',
		},
	});

	t.false(isWsl());

	delete process.env.__IS_WSL_TEST__;
	Object.defineProperty(process, 'platform', {value: originalPlatform});
});
