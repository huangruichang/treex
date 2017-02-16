
import { remote } from 'electron'
import { Reference, Branch } from 'nodegit'
import { join } from 'path'
import * as Helper from '../../helpers'

const BrowserWindow = remote.BrowserWindow

export const INIT_PUSH_PAGE = 'init_push_page'
export const INIT_PUSH_PAGE_FAIL = 'init_push_page_fail'

export const initPushPage = (projectName) => {
  let repository
  let branches
  let currentBranch
  let currentOrigin

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
    }).then((origin) => {
      currentOrigin = origin
      return repository.getRemotes()
    }).then((remoteList) => {
      let remotePromise = []
      remoteList.map((remote) => {
        remotePromise.push(repository.getRemote(remote))
      })
      return Promise.all(remotePromise)
    }).then((remotes) => {
      dispatch({
        type: INIT_PUSH_PAGE,
        repo: repository,
        branches: branches,
        currentBranch: currentBranch,
        currentOrigin: currentOrigin,
        remotes: remotes,
      })
    }).catch((e) => {
      dispatch({
        type: INIT_PUSH_PAGE_FAIL,
        msg: e,
      })
    })
  }
}

export const openPushPage = (project) => {
  return () => {
    let win = new BrowserWindow({
      width: 600,
      height: 300,
    })
    win.loadURL(`file:\/\/${join(__dirname, `index.html#\/push\/${project}`)}`)
  }
}

export const PUSH = 'PUSH'
export const PUSH_FAIL = 'PUSH_FAIL'
export const push = (repo, origin, branches) => {
  return dispatch => {
    Helper.push(repo, origin, branches).then(() => {
      dispatch({
        type: PUSH,
      })
    }).catch((e) => {
      dispatch({
        type: PUSH_FAIL,
        msg: e,
      })
    })
  }
}
