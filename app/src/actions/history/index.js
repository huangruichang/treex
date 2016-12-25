
import * as Helper from '../../helpers'

const HISTORIES_LIMIT = 50

export const LOAD_HISTORIES = 'LOAD_HISTORIES'
export const LOAD_HISTORIES_FAIL = 'LOAD_HISTORIES_FAIL'

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


