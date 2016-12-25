
import { remote } from 'electron'
import low from 'lowdb'
import { Repository, Reference } from 'nodegit'
import fileAsync from 'lowdb/lib/file-async'
import { join } from 'path'
import * as Helper from '../../helpers'

const db = low('db.json', {
  storage: fileAsync,
})

const BrowserWindow = remote.BrowserWindow

export const CHECKOUT_BRANCH = 'CHECKOUT_BRANCH'
export const CHECKOUT_BRANCH_FAIL = 'CHECKOUT_BRANCH_FAIL'
export const checkoutBranch = (repo, branchName) => {
  return (dispatch) => {
    Helper.checkoutBranch(repo, branchName).then(() => {
      return repo.getReferences(Reference.TYPE.LISTALL)
    }).then((arrayReference) => {
      dispatch({
        type: CHECKOUT_BRANCH,
        branches: arrayReference,
      })
    }).catch((e) => {
      dispatch({
        type: CHECKOUT_BRANCH_FAIL,
        msg: e,
      })
    })
  }
}

export const openCheckoutRemoteBranch = (project, branch) => {
  return () => {
    let win = new BrowserWindow({
      width: 600,
      height: 160,
    })
    win.loadURL(`file:\/\/${join(__dirname, `index.html#\/checkout\/remote\/${project}\/${branch}`)}`)
    win.show()
  }
}

export const INIT_CHECKOUT_REMOTE_BRANCH_PAGE = 'INIT_CHECKOUT_REMOTE_BRANCH_PAGE'
export const INIT_CHECKOUT_REMOTE_BRANCH_PAGE_FAIl = 'INIT_CHECKOUT_REMOTE_BRANCH_PAGE_FAIl'
export const initCheckoutRemoteBranchPage = (projectName) => {
  const result = db.get('projects').find({ name: projectName }).value()
  const dirPath = result.path
  let repository
  return dispatch => {
    Repository.open(dirPath).then((repo) => {
      repository = repo
      return repo.getReferences(Reference.TYPE.LISTALL)
    }).then((arrayReference) => {
      dispatch({
        type: INIT_CHECKOUT_REMOTE_BRANCH_PAGE,
        repo: repository,
        branches: arrayReference,
      })
    }).catch((e) => {
      dispatch({
        type: INIT_CHECKOUT_REMOTE_BRANCH_PAGE_FAIl,
        msg: e,
      })
    })
  }
}

export const checkoutRemoteBranch = (repo, branchName, branchFullName) => {
  return () => {
    Helper.checkoutRemoteBranch(repo, branchName, branchFullName).then(() => {
      let windows = BrowserWindow.getAllWindows()
      for (let win of windows) {
        win.webContents.send('refresh.sidebar')
      }
      BrowserWindow.getFocusedWindow().close()
    }).catch((e) => {
      alert(e)
    })
  }
}

export const REFRESH_BRANCHES = 'REFRESH_BRANCHES'
export const REFRESH_BRANCHES_FAIL = 'REFRESH_BRANCHES_FAIL'
export const refreshBranches = (projectName) => {
  return dispatch => {
    const result = db.get('projects').find({ name: projectName }).value()
    const dirPath = result.path
    Repository.open(dirPath).then((repo) => {
      return repo.getReferences(Reference.TYPE.LISTALL)
    }).then((arrayReference) => {
      dispatch({
        type: REFRESH_BRANCHES,
        branches: arrayReference,
      })
    }).catch((e) => {
      dispatch({
        type: REFRESH_BRANCHES_FAIL,
        msg: e,
      })
    })
  }
}
