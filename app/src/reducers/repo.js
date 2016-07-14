
import {
  LOAD_REPO,
  LOAD_REPO_FAIL,
  LOAD_HISTORIES,
  APPEND_HISTORIES,
  INIT_SIDEBAR,
  INIT_SIDEBAR_FAILED,
  LOAD_COMMIT_DIFF_FILES,
  LOAD_COMMIT_INFO,
  LOAD_COMMIT_INFO_FAIL,
  LOAD_DIFF_LINES,
  LOAD_DIFF_LINES_FAIL,
} from '../actions'

const initalState = {
  histories: [],
  historiesCurrentCommit: undefined,
  historiesHeadCommit: undefined,
  fileModifiedCount: 0,
  commitDiffFiles: [],
  commitInfo: undefined,
  diffPatches: [],
}

export default (state = initalState, action) => {
  switch (action.type) {
    case LOAD_REPO:
      return {
        ...state,
        repo: action.repo,
      }
    case LOAD_HISTORIES:
      return {
        ...state,
        histories: state.histories.concat(action.histories),
        historiesCurrentCommit: action.currentCommit,
        historiesHeadCommit: action.headCommit || state.historiesHeadCommit,
      }
    case INIT_SIDEBAR:
      return {
        ...state,
        fileModifiedCount: action.fileModifiedCount,
      }
    case LOAD_COMMIT_DIFF_FILES:
      return {
        ...state,
        commitDiffFiles: action.commitDiffFiles,
      }
    case LOAD_COMMIT_INFO:
      return {
        ...state,
        commitInfo: action.commitInfo,
      }
    case LOAD_DIFF_LINES:
      return {
        ...state,
        diffPatches: action.diffPatches,
      }
    case APPEND_HISTORIES:
      return {
        ...state,
        histories: action.histories,
      }
    case LOAD_REPO_FAIL:
      alert(action.msg)
      return state
    case INIT_SIDEBAR_FAILED:
      alert(action.msg)
      return state
    case LOAD_COMMIT_INFO_FAIL:
      alert(action.msg)
      return state
    case LOAD_DIFF_LINES_FAIL:
      alert(action.msg)
      return state
    default:
      return state
  }
}
