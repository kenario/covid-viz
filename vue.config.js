module.exports = {
  transpileDependencies: [
    'vuetify'
  ],
  publicPath: process.env.NODE_ENV === 'production' ? '/covid-viz/' : '',
  css: {
    extract: false
  }
}
