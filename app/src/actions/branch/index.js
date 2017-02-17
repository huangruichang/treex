
import { remote } from 'electron'
import { Reference, Branch } from 'nodegit'
import { join } from 'path'
import * as Helper from '../../helpers'
import { closeFocuseWindow } from '../../actions'

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
  let repository
  return dispatch => {
    Helper.openRepo(projectName).then((repo) => {
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
    Helper.openRepo(projectName).then((repo) => {
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

export const openModalBranch = (project) => {
  return () => {
    let win = new BrowserWindow({
      width: 600,
      height: 270,
    })
    win.loadURL(`file:\/\/${join(__dirname, `index.html#\/branch\/${project}`)}`)
  }
}

export const INIT_BRANCH_PAGE = 'INIT_BRANCH_PAGE'
export const INIT_BRANCH_PAGE_FAIL = 'INIT_BRANCH_PAGE_FAIL'
export const initBranchPage = (projectName) => {
  return dispatch => {
    let repository
    let data = {}
    Helper.openRepo(projectName).then((repo) => {
      repository = repo
      data.repo = repo
      return Helper.getCurrentBranch(repo)
    }).then((branch) => {
      data.currentBranch = branch.toString()
      return repository.getReferences(Reference.TYPE.LISTALL)
    }).then((arrayReference) => {
      data.branches = arrayReference.filter((reference) => {
        return reference.name().indexOf('refs/heads') !== -1 ||
          reference.name().indexOf('refs/remotes') !== -1
      })
      dispatch({
        type: INIT_BRANCH_PAGE,
        ...data,
      })
    }).catch((e) => {
      dispatch({
        type: INIT_BRANCH_PAGE_FAIL,
        msg: e,
      })
    })
  }
}

export const CREATE_BRANCH = 'CREATE_BRANCH'
export const CREATE_BRANCH_FAIL = 'CREATE_BRANCH_FAIL'
export const createBranch = (repo, branch, checkout = false) => {
  return dispatch => {
    repo.getHeadCommit().then((commit) => {
      return repo.createBranch(branch, commit, false)
    }).then(() => {
      if (checkout) {
        return Helper.checkoutBranch(repo, branch)
      } else {
        return Promise.resolve()
      }
    }).then(() => {
      dispatch({
        type: CREATE_BRANCH,
      })
      dispatch(closeFocuseWindow())
    }).catch((e) => {
      dispatch({
        type: CREATE_BRANCH_FAIL,
        msg: e,
      })
    })
  }
}

export const DELETE_BRANCH = 'DELETE_BRANCH'
export const DELETE_BRANCH_FAIL = 'DELETE_BRANCH_FAIL'
export const deleteBranch = (repo, branches = []) => {
  return dispatch => {
    let promises = []
    branches.map((branch) => {
      promises.push(repo.getBranch(branch))
    })
    Promise.all(promises).then((references) => {
      references.map((reference) => {
        Branch.delete(reference)
      })
      return repo.getReferences(Reference.TYPE.LISTALL)
    }).then((arrayReference) => {
      let branches = arrayReference.filter((reference) => {
        return reference.name().indexOf('refs/heads') !== -1 ||
          reference.name().indexOf('refs/remotes') !== -1
      })
      dispatch({
        type: DELETE_BRANCH,
        branches: branches,
      })
    }).catch((e) => {
      dispatch({
        type: DELETE_BRANCH_FAIL,
        msg: e,
      })
    })
  }
}

