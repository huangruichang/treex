
import * as Helper from '../../helpers'

const HISTORIES_LIMIT = 50

export const INIT_TAG_HISTORY_PAGE = 'INIT_TAG_HISTORY'
export const INIT_TAG_HISTORY_PAGE_FAIL = 'INIT_TAG_HISTORY_FAIL'

export const initTagHistoryPage = (repo, tag) => {

  tag = ~tag.indexOf('refs/tags') !== -1 ? tag : `refs/tags/${tag}`

  let diffPatches
  let headCommit
  return dispatch => {
    return Helper.getReferenceCommit(repo, tag).then((commit) => {
      headCommit = commit
      return Helper.getDiff(headCommit)
    }).then((arrayDiff) => {
      return arrayDiff[0].patches()
    }).then((arrayConvenientPatch) => {
      return Helper.getDiffLines(arrayConvenientPatch[0])
    }).then((arrayHunk) => {
      diffPatches = arrayHunk
      let commitDiffFilesPromise = Helper.getCommitDiffFiles(repo, headCommit.id())
      let commitInfoPromise = Helper.getCommitInfo(repo, headCommit.id())
      let historiesPromise = Helper.getHistories(headCommit, HISTORIES_LIMIT)
      return Promise.all([commitDiffFilesPromise, commitInfoPromise, historiesPromise])
    }).then((args) => {
      dispatch({
        type: INIT_TAG_HISTORY_PAGE,
        diffPatches: diffPatches,
        commitDiffFiles: args[0],
        commitInfo: args[1],
        histories: args[2],
        tagCommit: headCommit,
      })
    }).catch((e) => {
      dispatch({
        type: INIT_TAG_HISTORY_PAGE_FAIL,
        msg: e,
      })
    })
  }
}
