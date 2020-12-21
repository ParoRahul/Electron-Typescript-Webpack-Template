'use strict'

import * as fs from 'fs'
import * as path from 'path'

const electronBuilder = require('electron-builder')
const platform = electronBuilder.Platform

const root = path.dirname(path.dirname(__dirname))
const product = JSON.parse(fs.readFileSync(path.join(root, 'product.json'), 'utf8'))
const commit = util.getVersion(root)

const config = {
	appID:'github/ParoRahul/template',
	artifactName:'',
	productName: '',
	buildVersion: '',
	copyright: 'Copyright (C) 2019 Microsoft. All rights reserved',
	directories: {
		buildResources:'',
		output:'',
		app:''
	},
	mac: {
		category:'',
		target:'',
		identity:'',

	},
	win:{
		target:'',
		icon:'',
		legalTrademarks:'',
		signingHashAlgorithms:'',
		publisherName:'',
		requestedExecutionLevel : "asInvoker" | "highestAvailable" | "requireAdministrator",
	},
	linux:{
		target:'',
		icon:'',
		maintainer:'',
		vendor:'',
		executableName:'',
		packageCategory : '',
	},
	forceCodeSigning: false,
	publish:'',


	productAppName: product.nameLong,
	companyName: 'Microsoft Corporation',
	
	
}

function getElectron(arch: string): () => NodeJS.ReadWriteStream {
	return () => {
		const electronOpts = _.extend({}, config, {
			platform: process.platform,
			arch,
			ffmpegChromium: true,
			keepDefaultApp: true
		})

		return vfs.src('package.json')
			.pipe(json({ name: product.nameShort }))
			.pipe(electron(electronOpts))
			.pipe(filter(['**', '!**/app/package.json']))
			.pipe(vfs.dest('.build/electron'))
	};
}

async function main(arch = process.arch): Promise<void> {
	const version = util.getElectronVersion()
	const electronPath = path.join(root, '.build', 'electron')
	const versionFile = path.join(electronPath, 'version')
	const isUpToDate = fs.existsSync(versionFile) && fs.readFileSync(versionFile, 'utf8') === `${version}`

	if (!isUpToDate) {
		await util.rimraf(electronPath)()
		await util.streamToPromise(getElectron(arch)())
	}
}

if (require.main === module) {
	main(process.argv[2]).catch(err => {
		console.error(err)
		process.exit(1)
	})
}
