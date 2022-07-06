const isProduction = process.env.NODE_ENV === 'production'

module.exports = {
  publicPath: isProduction ? '/mywork/threejs/' : '/',
  chainWebpack: (config) => {
    config.plugin('html').tap((args) => {
      args[0].title = 'Three js 測試'
      return args
    })
    // pug
    const pugRule = config.module.rule('pug')
    pugRule
      .test(/\.pug$/)
      .use('pug-html-loader')
      .loader('pug-html-loader')
      .end()
  },
  configureWebpack: {
    resolve: {
      alias: {
        '@as': '@/assets',
        '@c': '@/components',
        '@v': '@/views',
        '@l': '@/layout',
        '@img': '@/assets/img',
        '@fonts': '@/assets/fonts',
        '@css': '@/assets/css',
        '@mixins': '@/mixins',
        '@js': '@/assets/js',
        '@api': '@/api',
        '@router': '@/router',
        '@mock': '@/mock',
        '@app': '@/app',
      },
    },
  },
  css: {
    extract: false,
    loaderOptions: {
      sass: {
        additionalData: '@import "@css/base/_variable.sass"',
      },
    },
  },
}
