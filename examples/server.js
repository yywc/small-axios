const express = require('express')
const bodyParser = require('body-parser')
const webpack = require('webpack')
const cookieParser = require('cookie-parser')
const webpackDevMiddleware = require('webpack-dev-middleware')
const webpackHotMiddleware = require('webpack-hot-middleware')
const WebpackConfig = require('./webpack.config')
const router = require('./router')

require('./server2')

const app = express()
const compiler = webpack(WebpackConfig)

app.use(webpackDevMiddleware(compiler, {
  publicPath: '/__build__/',
  stats: {
    colors: true,
    chunks: false
  }
}))

app.use(express.static(__dirname, {
  setHeaders(res) {
    res.cookie('XSRF-TOKEN-D', '1234abc')
  }
}))

app.use(webpackHotMiddleware(compiler))

app.use(express.static(__dirname))

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cookieParser())

app.use(router)

const port = process.env.PORT || 8079
module.exports = app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}, Ctrl+C to stop`)
})
