
import { remote } from 'electron'
import { join } from 'path'
import * as Helper from '../../helpers'

const BrowserWindow = remote.BrowserWindow

export const REFRESH_STASHES = 'REFRESH_STASHES'
export const REFRESH_STASHES_FAIL = 'REFRESH_STASHES_FAIL'
export const refershStashes = (projectName) => {
  return dispatch => {
    Helper.openRepo(projectName).then((repo) => {
      return Helper.getStashes(repo)
    }).then((stashes) => {
      dispatch({
        type: REFRESH_STASHES,
        stashes: stashes,
      })
    }).catch((e) => {
      dispatch({
        type: REFRESH_STASHES_FAIL,
        msg: e,
      })
    })
  }
}

export const openModalStash = (project, index, action) => {
  return () => {
    let win = new BrowserWindow({
      width: 600,
      height: 160,
    })
    win.loadURL(`file:\/\/${join(__dirname, `index.html#\/stash\/${action}\/${project}\/${index}`)}`)
  }
}


export const INIT_STASH_DETAIL_PAGE = 'INIT_STASH_DETAIL_PAGE'
export const INIT_STASH_DETAIL_PAGE_FAIL = 'INIT_STASH_DETAIL_PAGE_FAIL'
export const initStashDetailPage = (repo, stash) => {
  return dispatch => {
    Helper.getStashPatches(repo, stash.index).then((patches) => {
      dispatch({
        type: INIT_STASH_DETAIL_PAGE,
        stashPatches: patches,
      })
    }).catch((e) => {
      dispatch({
        type: INIT_STASH_DETAIL_PAGE_FAIL,
        msg: e,
      })
    })
  }
}

export const INIT_MODAL_STASH_PAGE = 'INIT_MODAL_STASH_PAGE'
export const INIT_MODAL_STASH_PAGE_FAIL = 'INIT_MODAL_STASH_PAGE_FAIL'
export const initModalStashPage = (projectName) => {
  let repository
  return dispatch => {
    Helper.openRepo(projectName).then((repo) => {
      repository = repo
      return Helper.getStashes(repo)
    }).then((stashes) => {
      dispatch({
        type: INIT_MODAL_STASH_PAGE,
        repo: repository,
        stashes: stashes,
      })
    }).catch((e) => {
      dispatch({
        type: INIT_MODAL_STASH_PAGE_FAIL,
        msg: e,
      })
    })
  }
}

export const DROP_STASH = 'DROP_STASH'
export const DROP_STASH_FAIL = 'DROP_STASH_FAIL'
export const dropStash = (repo, index) => {
  return dispatch => {
    Helper.dropStash(repo, index).then(() => {
      let windows = BrowserWindow.getAllWindows()
      for (let win of windows) {
        win.webContents.send('goto.main')
      }
      BrowserWindow.getFocusedWindow().close()
    }).catch((e) => {
      dispatch({
        type: DROP_STASH_FAIL,
        msg: e,
      })
    })
  }
}

export const APPLY_STASH = 'APPLY_STASH'
export const APPLY_STASH_FAIL = 'APPLY_STASH_FAIL'
export const applyStash = (repo, index) => {
  return dispatch => {
    Helper.applyStash(repo, index).then(() => {
      let windows = BrowserWindow.getAllWindows()
      for (let win of windows) {
        win.webContents.send('refresh.sidebar')
      }
      BrowserWindow.getFocusedWindow().close()
    }).catch((e) => {
      dispatch({
        type: APPLY_STASH_FAIL,
        msg: e,
      })
    })
  }
}

export const POP_STASH = 'POP_STASH'
export const POP_STASH_FAIL = 'POP_STASH_FAIL'
export const popStash = (repo, index) => {
  return dispatch => {
    Helper.popStash(repo, index).then(() => {
      let windows = BrowserWindow.getAllWindows()
      for (let win of windows) {
        win.webContents.send('goto.main')
      }
      BrowserWindow.getFocusedWindow().close()
    }).catch((e) => {
      dispatch({
        type: POP_STASH_FAIL,
        msg: e,
      })
    })
  }
}

export const SAVE_STASH = 'SAVE_STASH'
export const SAVE_STASH_FAIL = 'SAVE_STASH_FAIL'
export const saveStash = (repo, stashMessage = '', apply = false) => {
  return dispatch => {
    Helper.saveStash(repo, stashMessage).then(() => {
      dispatch({
        type: SAVE_STASH,
      })
      let windows = BrowserWindow.getAllWindows()
      for (let win of windows) {
        win.webContents.send('refresh.sidebar')
      }
      BrowserWindow.getFocusedWindow().close()
      if (apply) {
        return Helper.applyStash(repo, 0)
      }
    }).catch((e) => {
      dispatch({
        type: SAVE_STASH_FAIL,
        msg: e,
      })
    })
  }
}
