const cp = require('child_process')
/* const path = require('path')
const fs = require('fs') */
const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm'

/**
 * @param {string} location
 * @param {*} [opts]
 */
function npmInstall(location, opts) {
	opts = opts || { env: process.env }
	opts.cwd = location
	opts.stdio = 'inherit'

	const raw = process.env['npm_config_argv'] || '{}'
	const argv = JSON.parse(raw)
	const original = argv.original || []
	const args = original.filter(arg => arg === '--ignore-optional' || arg === '--frozen-lockfile')

	console.log(`Installing dependencies in ${location}...`)
	console.log(`$ yarn ${args.join(' ')}`)
	// eslint-disable-next-line no-sync
	const result = cp.spawnSync(npm, args, opts)

	if (result.error || result.status !== 0) {
		process.exit(1)
	}
}

npmInstall('extensions') // node modules shared by all extensions
