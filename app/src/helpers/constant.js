
import os from 'os'
import fs from 'fs'

/*eslint-disable no-empty*/
try {
  fs.mkdirSync(`${os.homedir()}/.treex`)
} catch (ignore) {}
/*eslint-disable no-empty*/

export const DB_PATH = `${os.homedir()}/.treex/db.json`
