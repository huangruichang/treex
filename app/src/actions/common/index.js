
import { remote } from 'electron'
import { exec } from 'child_process'
import { platform } from 'os'
import low from 'lowdb'
import fileAsync from 'lowdb/lib/file-async'

const db = low('db.json', {
  storage: fileAsync,
})

const BrowserWindow = remote.BrowserWindow

export const LOAD_USER = 'LOAD_USER'
export const LOAD_USER_FAIL = 'LOAD_USER_FAIL'
export const loadUser = () => {
  return (dispatch) => {
    function dispatchErr(err) {
      dispatch({
        type: LOAD_USER_FAIL,
        msg: err,
      })
    }
    let user = {}
    exec('git config user.name', (err, stdout, stderr) => {
      if (err || stderr) {
        return dispatchErr(err || stderr)
      }
      user.name = stdout
      exec('git config user.email', (err, stdout, stderr) => {
        if (err || stderr) {
          return dispatchErr(err || stderr)
        }
        user.email = stdout
        dispatch({
          type: LOAD_USER,
          user: user,
        })
      })
    })
  }
}

export const openTerminal = (projectName) => {
  return () => {
    let p = platform()
    const result = db.get('projects').find({ name: projectName }).value()
    const dirPath = result.path
    if (p.indexOf('darwin') != -1) {
      exec('open -a Terminal "`cd `' + dirPath + '"')
    } else if (p.indexOf('win') != -1) {
      exec('start cmd /k cd ' + dirPath)
    }
  }
}

export const closeFocuseWindow = () => {
  return () => {
    BrowserWindow.getFocusedWindow().close()
  }
}

