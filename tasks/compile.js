'use strict'

const gulp = require('gulp')
const del = require('del')

const webpack = require('webpack-stream')

const {merge} = require('webpack-merge')

const {mainConfig} = require('./webpack.common')
const uiConfigDev = require('./webpack.dev')
const uiConfigProd = require('./webpack.prod')

const paths = {
  mainProcessdir: '../src/main-process/*.ts',
  rendederProcessdir: '../src/main/*',
  mainOutDir : mainConfig.output.path,
  rendererOutDir : uiConfigProd.output.path
}

gulp.task('clean-main',async function(){
    await del([paths.mainOutDir])
})

gulp.task('compile-main', gulp.series('clean-main', function() {
    const extraConfig = process.env.NODE_ENV == 'development'?
                        { mode: 'development', devtool:'source-map'}:
                        { mode: 'production'}
    return gulp.src(paths.mainProcessdir)
    .pipe(webpack(merge({}, mainConfig,extraConfig)) )
    .pipe(gulp.dest(mainConfig.output.path))
}))

gulp.task('clean-renderer',async function(){
  await del.sync([paths.rendererOutDir])
})

gulp.task('compile-renderer', gulp.series('clean-renderer',function() {
  let rendererConfig = process.env.NODE_ENV == 'development' ? uiConfigDev : uiConfigProd
  //rendererConfig = merge({}, rendererConfig,{ })
  // console.log(rendererConfig.output.path)
  return  gulp.src(paths.rendederProcessdir)
              .pipe(webpack(rendererConfig))
              .pipe(gulp.dest(rendererConfig.output.path))
}))

gulp.task('compile', gulp.parallel('compile-main', 'compile-renderer'))