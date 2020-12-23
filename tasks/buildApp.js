'use strict'

const path = require('path')

const electronBuilder = require('electron-builder')
const platform = electronBuilder.Platform

const config = {
	productName: 'templateApp',
	buildVersion: '1.0.0',
	copyright: 'Copyright (C) 2020 Rahul. All rights reserved',
	directories: {
		/* buildResources: path.resolve(__dirname,'../out'), */
		output:path.resolve(__dirname,'../dist'),
		app:path.resolve(__dirname,'../out')
	},
	win:{
		appId:'havyjaby',
		compression:"maximum",
		target:'portable',
		icon:path.resolve(__dirname,'../out/icon.ico'),
		legalTrademarks:'Kahe kabir Suno bhai shadu',
		requestedExecutionLevel : "asInvoker" ,
	},
	forceCodeSigning: false,
	buildDependenciesFromSource: true 
}

electronBuilder.build({
	targets: platform.WINDOWS.createTarget(),
	config: config
}).then(()=> {
	console.log('build Sucessful')
}) .catch((error)=> {
	console.error('build Sucessful')
	console.error(error)
})
