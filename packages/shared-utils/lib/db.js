const Lowdb = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const fs = require('fs-extra')
const path = require('path')
const homedir = require('os').homedir()

fs.ensureDirSync(path.resolve(homedir, '.gckit'))
const db = new Lowdb(new FileSync(path.resolve(homedir, '.gckit', 'db.json')))
// Seed an empty DB
db.defaults({
  projects: [],
  foldersFavorite: [],
  tasks: [],
  upload: {}
}).write()

module.exports = {
  db
}
