
import { Diff } from 'nodegit'
import * as Helper from '../../helpers'

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

export const loadStageAndUnStage = (dispatch, type, repo) => {
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
