
import * as Helper from '../../helpers'

export const INIT_SEARCH_HISTORY_PAGE = 'INIT_SEARCH_HISTORY_PAGE'
export const INIT_SEARCH_HISTORY_PAGE_FAIL = 'INIT_SEARCH_HISTORY_PAGE_FAIL'

export const initSearchHistoryPage = () => {
  return dispatch => {
    dispatch({
      type: INIT_SEARCH_HISTORY_PAGE,
      histories: [],
      commitDiffFiles: [],
      diffPatches: [],
      commitInfo: undefined,
    })
  }
}

export const SEARCH_HISTORIES = 'SEARCH_HISTORIES'
export const SEARCH_HISTORIES_FAIL = 'SEARCH_HISTORIES_FAIL'

export const searchHistories = (repo, historiesLimit, keyword, type) => {
  let histories
  let commitDiffFiles
  let commitInfo
  return dispatch => {
    Helper.getBranchHeadCommit(repo).then((headCommit) => {
      return Helper.searchHistories(headCommit, historiesLimit, keyword, type)
    }).then((_histories) => {
      histories = _histories
      if (!histories || histories.length === 0) {
        dispatch({
          type: SEARCH_HISTORIES,
          commitDiffFiles: [],
          commitInfo: undefined,
          histories: [],
          diffPatches: [],
        })
      } else {
        let headHistory = histories[0]
        let commitDiffFilesPromise = Helper.getCommitDiffFiles(repo, headHistory.commitId)
        let commitInfoPromise = Helper.getCommitInfo(repo, headHistory.commitId)
        return Promise.all([commitDiffFilesPromise, commitInfoPromise]).then((args) => {
          commitDiffFiles = args[0]
          commitInfo = args[1]
          return repo.getCommit(histories[0].commitId)
        }).then((targetCommit) => {
          return Helper.getDiff(targetCommit)
        }).then((arrayDiff) => {
          return arrayDiff[0].patches()
        }).then((arrayConvenientPatch) => {
          return Helper.getDiffLines(arrayConvenientPatch[0])
        }).then((arrayHunk) => {
          dispatch({
            type: SEARCH_HISTORIES,
            commitDiffFiles: commitDiffFiles,
            commitInfo: commitInfo,
            histories: histories,
            diffPatches: arrayHunk,
          })
        })
      }
    }).catch((e) => {
      dispatch({
        type: SEARCH_HISTORIES_FAIL,
        msg: e,
      })
    })
  }
}


export const APPEND_SEARCH_HISTORIES = 'APPEND_SEARCH_HISTORIES'
export const APPEND_SEARCH_HISTORIES_FAIL = 'APPEND_SEARCH_HISTORIES_FAIL'
export const appendSearchHistories = (repo, historiesLimit, keyword, type) => {
  return dispatch => {
    Helper.getBranchHeadCommit(repo).then((commit) => {
      return Helper.searchHistories(commit, historiesLimit, keyword, type)
    }).then((histories) => {
      dispatch({
        type: APPEND_SEARCH_HISTORIES,
        histories: histories,
      })
    }).catch((e) => {
      dispatch({
        type: APPEND_SEARCH_HISTORIES_FAIL,
        msg: e,
      })
    })
  }
}
