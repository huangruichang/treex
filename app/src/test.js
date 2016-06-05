// cli.js
const low = require('lowdb')
const db = low('db.json')

db.defaults({ posts: [] })
  .value()

const result = db.get('posts')
  .push({ name: process.argv[2] })
  .value()

console.log(result)
