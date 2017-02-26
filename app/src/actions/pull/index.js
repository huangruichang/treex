
import { remote } from 'electron'
import { Reference, Branch, Checkout } from 'nodegit'
import { join } from 'path'
import * as Helper from '../../helpers'
import { stageOnePatch } from '../stage'
import { VALIDATING } from '../common'

const BrowserWindow = remote.BrowserWindow

export const INIT_PULL_PAGE = 'init_pull_page'
export const INIT_PULL_PAGE_FAIL = 'init_pull_page_fail'

export const initPullPage = (projectName) => {
  let repository
  let branches
  let currentBranch
  return dispatch => {
    Helper.openRepo(projectName).then((repo) => {
      repository = repo
      return repo.getReferences(Reference.TYPE.LISTALL)
    }).then((arrayReference) => {
      branches = arrayReference
      return repository.getCurrentBranch()
    }).then((branch) => {
      currentBranch = branch
      return Branch.upstream(currentBranch)
    }).then((currentOrigin) => {
      dispatch({
        type: INIT_PULL_PAGE,
        repo: repository,
        branches: branches,
        currentBranch: currentBranch,
        currentOrigin: currentOrigin,
      })
    }).catch((e) => {
      dispatch({
        type: INIT_PULL_PAGE_FAIL,
        msg: e,
      })
    })
  }
}

export const openPullPage = (project) => {
  return () => {
    let win = new BrowserWindow({
      width: 600,
      height: 180,
    })
    win.loadURL(`file:\/\/${join(__dirname, `index.html#\/pull\/${project}`)}`)
    win.show()
  }
}

export const PULL = 'PULL'
export const PULL_FAIL = 'PULL_FAIL'
export const pull = (repo, origin, branch, userName, password) => {
  return (dispatch) => {
    Helper.pull(repo, origin, branch, userName, password).then(() => {
      return Helper.getStagedPatches(repo)
    }).then((patches) => {
      // clear all staged files;
      // after merging branches, the diff of index to from-branch will be staged on merged index
      // don't know why
      // so reset index manually
      let promises = []
      for (let patch of patches) {
        promises.push(stageOnePatch(repo, patch, true))
      }
      return Promise.all(promises)
    }).then(() => {
      let opts = {
        checkoutStrategy: Checkout.STRATEGY.FORCE,
      }
      return Checkout.head(repo, opts)
    }).then(() => {
      dispatch({
        type: PULL,
      })
    }).catch((e) => {
      if (e.toString().indexOf('invalid cred') != -1) {
        dispatch({
          type: VALIDATING,
        })
      } else {
        dispatch({
          type: PULL_FAIL,
          msg: e,
        })
      }
    })
  }
}
