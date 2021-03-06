'use strict'

const path = require('path')
const gulp = require('gulp')
const del = require('del')

const electronBuilder = require('electron-builder')
const platform = electronBuilder.Platform


gulp.task('copy-resource', function(){
	return gulp.src([	path.resolve(__dirname, '../temp/main/*'),
										path.resolve(__dirname, '../temp/renderer/*')])
    .pipe(gulp.dest(path.resolve(__dirname, '../build')))
})

gulp.task('clean-directory',async function(){
	await del([path.resolve(__dirname, '../dist')])
})


gulp.task('build', gulp.series('copy-resource','clean-directory', function() {
	const config = {
		productName: 'templateApp',
		buildVersion: '1.0.0',
		copyright: 'Copyright (C) 2020 Rahul. All rights reserved',
		directories: {
			/* buildResources: path.resolve(__dirname,'../out'), */
			output:path.resolve(__dirname,'../dist'),
			app:path.resolve(__dirname,'../build')
		},
		win:{
			appId:'havyjaby',
			compression:"maximum",
			target:'nsis',
			icon:path.resolve(__dirname,'../build/resources/win32/icon.ico'),
			legalTrademarks:'Kahe kabir Suno bhai shadu',
			requestedExecutionLevel : "asInvoker" ,
		},
		forceCodeSigning: false,
		buildDependenciesFromSource: true 
	}
	return electronBuilder.build({
		targets: platform.WINDOWS.createTarget(),
		config: config
	}).then(()=> {
		console.log('build Sucessful')
	}) .catch((error)=> {
		console.error('build Sucessful')
		console.error(error)
	})	
}))