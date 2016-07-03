
import { remote } from 'electron'
import low from 'lowdb'
import { Repository, Diff } from 'nodegit'
import fileAsync from 'lowdb/lib/file-async'
import { join } from 'path'

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

export const LOAD_REPO = 'LOAD_REPO'
export const LOAD_REPO_FAIL = 'LOAD_REPO_FAIL'
export const LOAD_HISTORIES = 'LOAD_HISTORIES'
export const LOAD_HISTORIES_FAIL = 'LOAD_HISTORIES_FAIL'

export const loadRepo = (projectName) => {
  const result = db.get('projects').find({ name: projectName }).value()
  const dirPath = result.path
  return dispatch => {
    Repository.open(dirPath).then((repo) => {
      dispatch({
        type: LOAD_REPO,
        repo: repo,
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
    width: 800,
    height: 600,
  })
  win.on('closed', () => {
    win = null
  })
  win.loadURL(`file:\/\/${join(__dirname, `index.html#\/${projectName}`)}`)
  win.show()
}

const HISTORIES_LIMIT = 100

export const initHistories = (repo) => {
  return dispatch => {
    repo.getHeadCommit().then((commit) => {
      historiesHandler(commit, dispatch, true)
    }).catch((e) => {
      dispatch({
        type: LOAD_HISTORIES_FAIL,
        msg: e,
      })
    })
  }
}

export const INIT_SIDEBAR = 'INIT_SIDEBAR'
export const INIT_SIDEBAR_FAILED = 'INIT_SIDEBAR_FAILED'

export const initSideBar = (repo) => {
  return dispatch => {
    repo.getHeadCommit().then((commit) => {
      return commit.getTree()
    }).then((tree) => {
      return Diff.treeToWorkdirWithIndex(repo, tree, null)
    }).then((diff) => {
      return diff.patches()
    }).then((arrayConvenientPatch) => {
      dispatch({
        type: INIT_SIDEBAR,
        fileModifiedCount: arrayConvenientPatch.length,
      })
    }).catch((e) => {
      dispatch({
        type: INIT_SIDEBAR_FAILED,
        msg: e,
      })
    })
  }
}

export const loadHistories = (commit) => {
  return dispatch => {
    historiesHandler(commit, dispatch)
  }
}

const historiesHandler = (commit ,dispatch, init) => {
  const headCommit = commit
  const eventEmitter = commit.history()
  const histories = []
  let flag = false
  let currentCommit
  eventEmitter.on('commit', (commit) => {
    if (histories.length < HISTORIES_LIMIT || flag) {
      const history = {
        desc: commit.message(),
        author: commit.author().toString(),
        commitId: commit.id().toString(),
        date: commit.date().toString(),
      }
      histories.push(history)
      currentCommit = commit
    } else {
      const action = {
        type: LOAD_HISTORIES,
        histories: histories,
        currentCommit: currentCommit,
      }
      if (init) {
        action.headCommit = headCommit
      }
      dispatch(action)
      flag = true
    }
  })
  eventEmitter.on('end', () => {
    if (histories.length <= HISTORIES_LIMIT) {
      const action = {
        type: LOAD_HISTORIES,
        histories: histories,
        currentCommit: currentCommit,
      }
      if (init) {
        action.headCommit = headCommit
      }
      dispatch(action)
    }
  })
  eventEmitter.on('error', (error) => {
    dispatch({
      type: LOAD_HISTORIES_FAIL,
      msg: error,
    })
  })
  eventEmitter.start()
}

export const LOAD_COMMIT_DIFF_FILES = 'LOAD_COMMIT_DIFF_FILES'
export const LOAD_COMMIT_DIFF_FILES_FAIL = 'LOAD_COMMIT_DIFF_FILES_FAIL'

export const loadCommitDiffFiles = (repo, commitId) => {
  return (dispatch) => {
    repo.getCommit(commitId).then((commit) => {
      return commit.getDiff()
    }).then((arrayDiff) => {
      let promises = []
      for (let diff of arrayDiff) {
        promises.push(diff.patches())
      }
      return Promise.all(promises)
    }).then((args) => {
      let files = []
      for (let arrayConvenientPatch of args) {
        for (let convenientPatch of arrayConvenientPatch) {
          files.push(convenientPatch)
        }
      }
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
    let _commit
    repo.getCommit(commitId).then((commit) => {
      _commit = commit
      return commit.getParents()
    }).then((arrayCommit) => {
      let parents = []
      for (let commit of arrayCommit) {
        parents.push(commit.id().toString().slice(0, 5))
      }
      const commitInfo = {
        desc: _commit.message(),
        author: _commit.author().toString(),
        commitId: _commit.id().toString(),
        date: _commit.date().toString(),
        parents: parents,
      }
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
