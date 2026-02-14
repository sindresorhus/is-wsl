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

test('inside WSL 2 with custom kernel', async t => {
	process.env.__IS_WSL_TEST__ = true;

	const originalPlatform = process.platform;
	Object.defineProperty(process, 'platform', {value: 'linux'});

	const isWsl = await esmock('./index.js', {
		fs: {
			readFileSync: () => 'Linux version 6.1.0-custom (user@host) (gcc version 12.2.0) #1 SMP PREEMPT_DYNAMIC Mon Jan 1 00:00:00 UTC 2024',
			existsSync: path => path === '/proc/sys/fs/binfmt_misc/WSLInterop',
		},
		os: {
			release: () => '6.1.0-custom',
		},
	});

	t.true(isWsl());

	delete process.env.__IS_WSL_TEST__;
	Object.defineProperty(process, 'platform', {value: originalPlatform});
});

test('inside WSL 2 with custom kernel detected via /run/WSL', async t => {
	process.env.__IS_WSL_TEST__ = true;

	const originalPlatform = process.platform;
	Object.defineProperty(process, 'platform', {value: 'linux'});

	const isWsl = await esmock('./index.js', {
		fs: {
			readFileSync: () => 'Linux version 6.1.0-custom (user@host) (gcc version 12.2.0) #1 SMP PREEMPT_DYNAMIC Mon Jan 1 00:00:00 UTC 2024',
			existsSync: path => path === '/run/WSL',
		},
		os: {
			release: () => '6.1.0-custom',
		},
	});

	t.true(isWsl());

	delete process.env.__IS_WSL_TEST__;
	Object.defineProperty(process, 'platform', {value: originalPlatform});
});

test('inside WSL, but inside container', async t => {
	process.env.__IS_WSL_TEST__ = true;

	const originalPlatform = process.platform;
	Object.defineProperty(process, 'platform', {value: 'linux'});

	const isWsl = await esmock('./index.js', {
		fs: {
			readFileSync: () => 'Linux version 4.19.43-microsoft-standard (oe-user@oe-host) (gcc version 7.3.0 (GCC)) #1 SMP Mon May 20 19:35:22 UTC 2019',
		},
		'is-inside-container': () => true,
		os: {
			release: () => 'microsoft',
		},
	});

	t.false(isWsl());

	delete process.env.__IS_WSL_TEST__;
	Object.defineProperty(process, 'platform', {value: originalPlatform});
});
