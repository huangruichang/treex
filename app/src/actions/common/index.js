
import { remote } from 'electron'
import { exec } from 'child_process'

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

export const closeFocuseWindow = () => {
  return () => {
    BrowserWindow.getFocusedWindow().close()
  }
}

