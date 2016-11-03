
import { remote } from 'electron'
import low from 'lowdb'
import { Repository, Diff, Reference, Signature } from 'nodegit'
import fileAsync from 'lowdb/lib/file-async'
import { join } from 'path'
import { exec } from 'child_process'
import * as Helper from '../helpers'

export const REMOVE_PROJECT = 'REMOVE_PROJECT'
export const LIST_PROJECT = 'LIST_PROJECT'
export const LOAD_PROJECT = 'LOAD_PROJECT'
export const LOAD_PROJECT_FAIL = 'LOAD_PROJECT_FAIL'

const BrowserWindow = remote.BrowserWindow

const db = low('db.json', {
  storage: fileAsync,
})

db.defaults({ projects: [] }).value()

export const findProject = () => {
  return dispatch => {
    const dialog = remote.dialog
    dialog.showOpenDialog({
      properties: ['openDirectory'],
    }, (filenames) => {
      if (!filenames) return
      if (filenames.length > 0) {
        const filePath = filenames[0]
        const projectName = filePath.split('\/').reverse()[0]
        Repository.open(filePath).then((repo) => {
          db.get('projects').push({
            name: projectName,
            path: filePath,
          }).value()
          dispatch({
            type: LOAD_PROJECT,
            repo: repo,
          })
          dispatch(listProject())
          let win = new BrowserWindow({
            width: 800,
            height: 600,
          })
          win.loadURL(`file:\/\/${join(__dirname, `index.html#\/${projectName}`)}`)
          win.show()
        }).catch((e) => {
          dispatch({
            type: LOAD_PROJECT_FAIL,
            msg: e,
          })
        })
      } else {
        dispatch({
          type: LOAD_PROJECT_FAIL,
        })
      }
    })
  }
}

export const listProject = () => {
  const projects = db.get('projects').value()
  const newProjects = []
  if (projects && projects.length > 0) {
    for (let value of projects) {
      newProjects.push(value)
    }
  }
  return dispatch => {
    dispatch({
      type: LIST_PROJECT,
      projects: newProjects,
    })
  }
}

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

export const LOAD_REPO = 'LOAD_REPO'
export const LOAD_REPO_FAIL = 'LOAD_REPO_FAIL'
export const LOAD_HISTORIES = 'LOAD_HISTORIES'
export const LOAD_HISTORIES_FAIL = 'LOAD_HISTORIES_FAIL'

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
    height: 543,
  })
  win.on('closed', () => {
    win = null
  })
  win.loadURL(`file:\/\/${join(__dirname, `index.html#\/repo\/${projectName}/history`)}`)
  win.show()
}

const HISTORIES_LIMIT = 50

export const APPEND_HISTORIES = 'APPEND_HISTORIES'
export const appendHistories = ({ repo, historiesLimit, branch }) => {
  return (dispatch) => {
    Promise.resolve().then(() => {
      if (branch) {
        return repo.getBranch(branch).then((reference) => {
          return repo.getReferenceCommit(reference)
        })
      }
      return repo.getHeadCommit()
    }).then((commit) => {
      return Helper.getHistories(commit, historiesLimit)
    }).then((histories) => {
      dispatch({
        type: APPEND_HISTORIES,
        histories: histories,
      })
    }).catch((e) => {
      dispatch({
        type: LOAD_HISTORIES_FAIL,
        msg: e,
      })
    })
  }
}

export const INIT_HISTORY_PAGE = 'INIT_HISTORY_PAGE'
export const INIT_HISTORY_PAGE_FAIL = 'INIT_HISTORY_PAGE_FAIL'
export const initHistoryPage = (repo, branch) => {
  let unstagedPatches
  let stagedPatches
  let diffPatches
  let headCommit
  return (dispatch) => {
    let unstagedPromise = Helper.getUnstagedPatches(repo)
    let stagedPromise = Helper.getStagedPatches(repo)
    let headCommitPromise = Helper.getBranchHeadCommit(repo, branch)
    return Promise.all([unstagedPromise, stagedPromise, headCommitPromise]).then({
    }).then((args) => {
      unstagedPatches = args[0] || []
      stagedPatches = args[1] || []
      headCommit = args[2]
      if (unstagedPatches.length > 0 || stagedPatches.length > 0) {
        let patch
        if (unstagedPatches.length > 0) {
          patch = unstagedPatches[0]
        } else {
          patch = stagedPatches[0]
        }
        return Promise.resolve(patch)
      } else {
        return Helper.getDiff(headCommit).then((arrayDiff) => {
          return arrayDiff[0].patches()
        }).then((arrayConvenientPatch) => {
          return Promise.resolve(arrayConvenientPatch[0])
        })
      }
    }).then((patch) => {
      return Helper.getDiffLines(patch)
    }).then((arrayHunk) => {
      diffPatches = arrayHunk
      let commitDiffFilesPromise = Helper.getCommitDiffFiles(repo, headCommit.id())
      let commitInfoPromise = Helper.getCommitInfo(repo, headCommit.id())
      let historiesPromise = Helper.getHistories(headCommit, HISTORIES_LIMIT)
      return Promise.all([commitDiffFilesPromise, commitInfoPromise, historiesPromise])
    }).then((args) => {
      dispatch({
        type: INIT_HISTORY_PAGE,
        stagedPatches: stagedPatches,
        unstagedPatches: unstagedPatches,
        diffPatches: diffPatches,
        commitDiffFiles: args[0],
        commitInfo: args[1],
        histories: args[2],
      })
    }).catch((e) => {
      dispatch({
        type: INIT_HISTORY_PAGE_FAIL,
        msg: e,
      })
    })
  }
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

export const LOAD_COMMIT_DIFF_FILES = 'LOAD_COMMIT_DIFF_FILES'
export const LOAD_COMMIT_DIFF_FILES_FAIL = 'LOAD_COMMIT_DIFF_FILES_FAIL'
export const loadCommitDiffFiles = (repo, commitId) => {
  return (dispatch) => {
    Helper.getCommitDiffFiles(repo, commitId).then((files) => {
      dispatch({
        type: LOAD_COMMIT_DIFF_FILES,
        commitDiffFiles: files,
      })
    }).catch((e) => {
      dispatch({
        type: LOAD_COMMIT_DIFF_FILES_FAIL,
        msg: e,
      })
    })
  }
}

export const LOAD_COMMIT_INFO = 'LOAD_COMMIT_INFO'
export const LOAD_COMMIT_INFO_FAIL = 'LOAD_COMMIT_INFO_FAIL'
export const loadCommitInfo = (repo, commitId) => {
  return (dispatch) => {
    Helper.getCommitInfo(repo, commitId).then((commitInfo) => {
      dispatch({
        type: LOAD_COMMIT_INFO,
        commitInfo: commitInfo,
      })
    }).catch((e) => {
      dispatch({
        type: LOAD_COMMIT_INFO_FAIL,
        msg: e,
      })
    })
  }
}

export const LOAD_DIFF_LINES = 'LOAD_DIFF_LINES'
export const LOAD_DIFF_LINES_FAIL = 'LOAD_DIFF_LINES_FAIL'
export const RESET_DIFF_LINES = 'RESET_DIFF_LINES'
export const loadDiffLines = (convenientPatch) => {
  return (dispatch) => {
    convenientPatch.hunks().then((arrayConvenientHunk) => {
      let promises = []
      for (let hunk of arrayConvenientHunk) {
        promises.push(hunk.lines())
      }
      return Promise.all(promises)
    }).then((args) => {
      let arrayHunk = []
      for (let lines of args) {
        let arrayLine = []
        for (let line of lines) {
          arrayLine.push(line)
        }
        arrayHunk.push(arrayLine)
      }
      dispatch({
        type: LOAD_DIFF_LINES,
        diffPatches: arrayHunk,
      })
    }).catch((e) => {
      dispatch({
        type: LOAD_DIFF_LINES_FAIL,
        msg: e,
      })
    })
  }
}

export const LOAD_STAGED_FILES = 'LOAD_STAGED_FILES'
export const LOAD_STAGED_FILES_FAIL = 'LOAD_STAGED_FILES_FAIL'
export const loadStagedFiles = (repo) => {
  return ((dispatch) => {
    Helper.getStagedPatches(repo).then((patches) => {
      dispatch({
        type: LOAD_STAGED_FILES,
        stagedPatches: patches,
      })
    }).catch((e) => {
      dispatch({
        type: LOAD_STAGED_FILES_FAIL,
        msg: e,
      })
    })
  })
}

export const LOAD_UNSTAGED_FILES = 'LOAD_UNSTAGED_FILES'
export const LOAD_UNSTAGED_FILES_FAIL = 'LOAD_UNSTAGED_FILES_FAIL'
export const loadUnstagedFiles = (repo) => {
  return (dispatch) => {
    Helper.getUnstagedPatches(repo).then((patches) => {
      dispatch({
        type: LOAD_UNSTAGED_FILES,
        unstagedPatches: patches,
      })
    }).catch((e) => {
      dispatch({
        type: LOAD_UNSTAGED_FILES_FAIL,
        msg: e,
      })
    })
  }
}

const loadStageAndUnStage = (dispatch, type, repo) => {
  let stagePromise = Helper.getUnstagedPatches(repo)
  let unstagePromise = Helper.getStagedPatches(repo)
  return Promise.all([stagePromise, unstagePromise]).then((args) => {
    dispatch({
      type: type,
      unstagedPatches: args[0],
      stagedPatches: args[1],
    })
  })
}

const stageOneHunk = (repo, patch, isStaged) => {
  return patch.hunks().then((arrayConvenientHunk) => {
    let promises = []
    for (let hunk of arrayConvenientHunk) {
      promises.push(hunk.lines())
    }
    return Promise.all(promises)
  }).then((args) => {
    let arrayLines = []
    for (let lines of args) {
      for (let line of lines) {
        arrayLines.push(line)
      }
    }
    return repo.stageLines(patch.newFile().path(), arrayLines, isStaged)
  })
}

const stageOnePatch = (repo, patch, isStaged) => {
  const filePath = patch.newFile().path()
  let index
  return stageOneHunk(repo, patch, isStaged).then(() => {
    repo.refreshIndex()
  }).then((idx) => {
    index = idx
    if (!isStaged) {
      return Diff.indexToWorkdir(repo, index, null)
    } else {
      return repo.getHeadCommit().then((commit) => {
        return commit.getTree()
      }).then((tree) => {
        return Diff.treeToIndex(repo, tree, index, null)
      })
    }
  }).then((diff) => {
    return diff.patches()
  }).then((arrayConvenientPatch) => {
    for (let patch of arrayConvenientPatch) {
      if (patch.newFile().path() === filePath || patch.oldFile().path() === filePath) {
        return stageOnePatch(repo, patch, isStaged)
      }
    }
    return Promise.resolve()
  })
}

export const STAGE_FILE_LINES = 'STAGE_FILE_LINES'
export const STAGE_FILE_LINES_FAIL = 'STAGE_FILE_LINES_FAIL'
export const stageFileLines = (repo, patch, isStaged, lineNum = -1) => {
  return (dispatch) => {
    let promise
    if (lineNum === -1) {
      if (patch.isUntracked()) {
        promise = Helper.addFileToIndex(repo, patch.newFile().path())
      } else if (!patch.isModified()) {
        promise = Helper.removeFileFromIndex(repo, patch.oldFile().path())
      } else {
        promise = stageOnePatch(repo, patch, isStaged)
      }
      return promise.then(() => {
        return loadStageAndUnStage(dispatch, STAGE_FILE_LINES, repo)
      })
    }
    promise.catch((e) => {
      dispatch({
        type: STAGE_FILE_LINES_FAIL,
        msg: e,
      })
    })
  }
}

export const STAGE_ALL_FILE_LINES = 'STAGE_ALL_FILE_LINES'
export const STAGE_ALL_FILE_LINES_FAIL = 'STAGE_ALL_FILE_LINES_FAIL'
export const stageAllFileLines = (repo, patches, isStaged) => {
  return (dispatch) => {
    // cause of concurrent in nodegit, must use promise chain
    let head = Promise.resolve()
    for (let patch of patches) {
      head = head.then(() => {
        if (patch.isUntracked()) {
          return Helper.addFileToIndex(repo, patch.newFile().path())
        } else if (!patch.isModified()) {
          return Helper.removeFileFromIndex(repo, patch.oldFile().path())
        } else {
          return stageOnePatch(repo, patch, isStaged)
        }
      })
    }
    head.then(() => {
      return loadStageAndUnStage(dispatch, STAGE_ALL_FILE_LINES, repo)
    }).catch((e) => {
      dispatch({
        type: STAGE_ALL_FILE_LINES_FAIL,
        msg: e,
      })
    })
  }
}

export const CREATE_COMMIT_ON_HEAD = 'CREATE_COMMIT_ON_HEAD'
export const CREATE_COMMIT_ON_HEAD_FAIL = 'CREATE_COMMIT_ON_HEAD_FAIL'
export const createCommitOnHead = ({ repo, commitMessage, author, callback }) => {
  return (dispatch) => {
    let index, oid
    repo.refreshIndex().then((idx) => {
      index = idx
      return index.write()
    }).then(() => {
      return index.writeTree()
    }).then((oidResult) => {
      oid = oidResult
      return Reference.nameToId(repo, 'HEAD')
    }).then((head) => {
      return repo.getCommit(head)
    }).then((parent) => {
      const authorSignature = Signature.now(author.name, author.email)
      const committerSignature = Signature.now(author.name, author.email)
      return repo.createCommit('HEAD', authorSignature, committerSignature, commitMessage, oid, [parent])
    }).then(() => {
      callback && callback()
      return loadStageAndUnStage(dispatch, CREATE_COMMIT_ON_HEAD, repo)
    }).catch((e) => {
      dispatch({
        type: CREATE_COMMIT_ON_HEAD_FAIL,
        msg: e,
      })
    })
  }
}

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

export const closeFocuseWindow = () => {
  return () => {
    BrowserWindow.getFocusedWindow().close()
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
        win.webContents.send('refresh.branches')
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

