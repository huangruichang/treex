
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
  LOAD_UNSTAGED_FILES,
  LOAD_UNSTAGED_FILES_FAIL,
  LOAD_STAGED_FILES,
  LOAD_STAGED_FILES_FAIL,
  RESET_DIFF_LINES,
  STAGE_FILE_LINES,
  STAGE_FILE_LINES_FAIL,
  STAGE_ALL_FILE_LINES,
  STAGE_ALL_FILE_LINES_FAIL,
  CREATE_COMMIT_ON_HEAD,
  CREATE_COMMIT_ON_HEAD_FAIL,
  INIT_HISTORY_PAGE,
  INIT_HISTORY_PAGE_FAIL,
} from '../actions'

const initalState = {
  histories: [],
  historiesCurrentCommit: undefined,
  historiesHeadCommit: undefined,
  fileModifiedCount: 0,
  commitDiffFiles: [],
  commitInfo: undefined,
  diffPatches: [],
  unstagedPatches: [],
  stagedPatches: [],
  branches: [],
}

export default (state = initalState, action) => {
  switch (action.type) {
    case LOAD_REPO:
      return {
        ...state,
        repo: action.repo,
      }
    case INIT_HISTORY_PAGE:
      return {
        ...state,
        stagedPatches: action.stagedPatches,
        unstagedPatches: action.unstagedPatches,
        diffPatches: action.diffPatches,
        commitDiffFiles: action.commitDiffFiles,
        commitInfo: action.commitInfo,
        histories: action.histories,
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
        branches: action.branches,
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
    case LOAD_UNSTAGED_FILES:
      return {
        ...state,
        unstagedPatches: action.unstagedPatches,
      }
    case LOAD_STAGED_FILES:
      return {
        ...state,
        stagedPatches: action.stagedPatches,
      }
    case RESET_DIFF_LINES:
      return {
        ...state,
        diffPatches: action.diffPatches,
      }
    case STAGE_FILE_LINES:
      return {
        ...state,
        unstagedPatches: action.unstagedPatches,
        stagedPatches: action.stagedPatches,
      }
    case STAGE_ALL_FILE_LINES:
      return {
        ...state,
        unstagedPatches: action.unstagedPatches,
        stagedPatches: action.stagedPatches,
      }
    case CREATE_COMMIT_ON_HEAD:
      return {
        ...state,
        unstagedPatches: action.unstagedPatches,
        stagedPatches: action.stagedPatches,
        fileModifiedCount: action.unstagedPatches.length + action.stagedPatches.length,
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
    case LOAD_UNSTAGED_FILES_FAIL:
      alert(action.msg)
      return state
    case LOAD_STAGED_FILES_FAIL:
      alert(action.msg)
      return state
    case STAGE_FILE_LINES_FAIL:
      alert(action.msg)
      return state
    case STAGE_ALL_FILE_LINES_FAIL:
      alert(action.msg)
      return state
    case CREATE_COMMIT_ON_HEAD_FAIL:
      alert(action.msg)
      return state
    case INIT_HISTORY_PAGE_FAIL:
      alert(action.msg)
      return state
    default:
      return state
  }
}
