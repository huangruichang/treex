'use strict'

if (process.env.NODE_ENV === 'production') {
  module.exports = require('./webpack.production')
} else {
  module.exports = require('./webpack.dev')
}

