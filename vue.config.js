module.exports = {
  transpileDependencies: [
    'vuetify'
  ],

  pluginOptions: {
    autoRouting: {
      chunkNamePrefix: 'page-'
    }
  },

  devServer: {
    proxy: {
      '^/api': {
        target: process.env.VUE_APP_API_URL,
        pathRewrite: {
          '^/api': ''
        },
        changeOrigin: true
      }
    }
  }
}
