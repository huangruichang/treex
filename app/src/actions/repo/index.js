
import { remote } from 'electron'
import low from 'lowdb'
import { Repository, Diff, Reference } from 'nodegit'
import fileAsync from 'lowdb/lib/file-async'
import { join } from 'path'
import * as Helper from '../../helpers'

const db = low('db.json', {
  storage: fileAsync,
})

const BrowserWindow = remote.BrowserWindow

export const LOAD_REPO = 'LOAD_REPO'
export const LOAD_REPO_FAIL = 'LOAD_REPO_FAIL'

export const loadRepo = (projectName) => {
  const result = db.get('projects').find({ name: projectName }).value()
  const dirPath = result.path
  return dispatch => {
    Repository.open(dirPath).then((repo) => {
      let windows = BrowserWindow.getAllWindows()
      for (let win of windows) {
        win.webContents.send('set.projectName', {
          projectName: projectName,
        })
      }
      dispatch({
        type: LOAD_REPO,
        repo: repo,
        projectName: projectName,
      })
    }).catch((e) => {
      dispatch({
        type: LOAD_REPO_FAIL,
        msg: e,
      })
    })
  }
}

export const openRepo = (projectName) => {
  let win = new BrowserWindow({
    width: 1048,
    height: 604,
  })
  win.on('closed', () => {
    win = null
  })
  win.loadURL(`file:\/\/${join(__dirname, `index.html#\/repo\/${projectName}/history`)}`)
  win.show()
}

export const INIT_SIDEBAR = 'INIT_SIDEBAR'
export const INIT_SIDEBAR_FAILED = 'INIT_SIDEBAR_FAILED'

export const initSideBar = (repo) => {
  let data = {}
  return dispatch => {
    repo.getHeadCommit().then((commit) => {
      return commit.getTree()
    }).then((tree) => {
      return Diff.treeToWorkdirWithIndex(repo, tree, {
        flags:
        Diff.OPTION.SHOW_UNTRACKED_CONTENT |
        Diff.OPTION.RECURSE_UNTRACKED_DIRS,
      })
    }).then((diff) => {
      return diff.patches()
    }).then((arrayConvenientPatch) => {
      data.fileModifiedCount = arrayConvenientPatch.length
      return repo.getReferences(Reference.TYPE.LISTALL)
    }).then((arrayReference) => {
      data.branches = arrayReference
      return Helper.getStashes(repo)
    }).then((stashes) => {
      data.stashes = stashes
      dispatch({
        type: INIT_SIDEBAR,
        ...data,
      })
    }).catch((e) => {
      dispatch({
        type: INIT_SIDEBAR_FAILED,
        msg: e,
      })
    })
  }
}

export const refreshSideBar = (projectName, store) => {
  Helper.openRepo(projectName).then((repo) => {
    store.dispatch(initSideBar(repo))
  })
}

