
import { remote } from 'electron'
import low from 'lowdb'
import { Repository, Clone, Cred } from 'nodegit'
import fileAsync from 'lowdb/lib/file-async'
import { join } from 'path'
import { VALIDATING } from '../common'

const db = low('db.json', {
  storage: fileAsync,
})

const BrowserWindow = remote.BrowserWindow

export const openClonePage = () => {
  return () => {
    let win = new BrowserWindow({
      width: 600,
      height: 200,
    })
    win.loadURL(`file:\/\/${join(__dirname, 'index.html#/clone')}`)
  }
}

export const CLONE = 'CLONE'
export const CLONE_SUCCESS = 'CLONE_SUCCESS'
export const CLONE_FAIL = 'CLONE_FAIL'
export const clone = (repoUrl, path, userName, password) => {
  return dispatch => {
    const opts = {
      fetchOpts: {
        throttle: 100,
        callbacks: {
          transferProgress: (progressObj) => {
            let progress = progressObj.receivedObjects() * 100 /progressObj.totalObjects()
            dispatch({
              type: CLONE,
              progress: progress,
            })
          },
          credentials: () => {
            if (userName && password) {
              return Cred.userpassPlaintextNew(userName, password)
            } else {
              return Cred.defaultNew()
            }
          },
        },
      },
    }

    Clone(repoUrl, path, opts).catch((e) => {
      if (e.toString().indexOf('invalid cred') != -1) {
        dispatch({
          type: VALIDATING,
        })
      } else {
        dispatch({
          type: CLONE_FAIL,
          msg: e,
        })
      }
    }).done((repo) => {
      if (repo instanceof Repository) {
        db.get('projects').push({
          name: path.split('\/').reverse()[0],
          path: path,
        }).value()
        dispatch({
          type: CLONE_SUCCESS,
        })
      }
    })
  }
}
