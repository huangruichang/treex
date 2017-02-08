
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
  CHECKOUT_BRANCH,
  CHECKOUT_BRANCH_FAIL,
  INIT_CHECKOUT_REMOTE_BRANCH_PAGE,
  INIT_CHECKOUT_REMOTE_BRANCH_PAGE_FAIl,
  REFRESH_BRANCHES,
  REFRESH_BRANCHES_FAIL,
  INIT_STASH_DETAIL_PAGE,
  INIT_STASH_DETAIL_PAGE_FAIL,
  INIT_MODAL_STASH_PAGE,
  INIT_MODAL_STASH_PAGE_FAIL,
  REFRESH_STASHES,
  REFRESH_STASHES_FAIL,
  SAVE_STASH,
  SAVE_STASH_FAIL,
  INIT_PULL_PAGE,
  INIT_PULL_PAGE_FAIL,
  PULL,
  PULL_FAIL,
  INIT_PUSH_PAGE,
  INIT_PUSH_PAGE_FAIL,
  PUSH,
  PUSH_FAIL,
  FIND_CLONE_PATH,
  CLONE,
  CLONE_SUCCESS,
  CLONE_FAIL,
  INIT_TAG_HISTORY_PAGE,
  INIT_TAG_HISTORY_PAGE_FAIL,
  LOAD_ALL_COMMITS,
  LOAD_ALL_COMMITS_FAIL,
  INIT_SEARCH_HISTORY_PAGE,
  SEARCH_HISTORIES,
  SEARCH_HISTORIES_FAIL,
  APPEND_SEARCH_HISTORIES,
  APPEND_SEARCH_HISTORIES_FAIL,
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
  stashes: [],
  stashPatches: [],
  currentBranch: undefined,
  currentOrigin: undefined,
  remotes: [],
  cloneFilePath: undefined,
  cloneProjectName: undefined,
  progress: 0,
  tags: [],
  tagCommit: undefined,
}

export default (state = initalState, action) => {
  switch (action.type) {
    case LOAD_REPO:
      return {
        ...state,
        repo: action.repo,
        projectName: action.projectName,
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
        stashes: action.stashes,
        tags: action.tags,
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
    case CHECKOUT_BRANCH:
      return {
        ...state,
        branches: action.branches,
      }
    case INIT_CHECKOUT_REMOTE_BRANCH_PAGE:
      return {
        ...state,
        repo: action.repo,
        branches: action.branches,
      }
    case REFRESH_BRANCHES:
      return {
        ...state,
        branches: action.branches,
      }
    case INIT_STASH_DETAIL_PAGE:
      return {
        ...state,
        stashPatches: action.stashPatches,
      }
    case INIT_MODAL_STASH_PAGE:
      return {
        ...state,
        repo: action.repo,
        stashes: action.stashes,
      }
    case REFRESH_STASHES:
      return {
        ...state,
        stashes: action.stashes,
      }
    case INIT_PULL_PAGE:
      return {
        ...state,
        repo: action.repo,
        branches: action.branches,
        currentBranch: action.currentBranch,
        currentOrigin: action.currentOrigin,
      }
    case INIT_PUSH_PAGE:
      return {
        ...state,
        repo: action.repo,
        branches: action.branches,
        currentBranch: action.currentBranch,
        remotes: action.remotes,
      }
    case FIND_CLONE_PATH:
      return {
        ...state,
        cloneFilePath: action.cloneFilePath,
        cloneProjectName: action.cloneProjectName,
      }
    case CLONE:
      return {
        ...state,
        progress: action.progress,
      }
    case CLONE_SUCCESS:
      alert('克隆完成!')
      return {
        ...state,
        progress: 100,
      }
    case INIT_TAG_HISTORY_PAGE:
      return {
        ...state,
        histories: action.histories,
        commitDiffFiles: action.commitDiffFiles,
        diffPatches: action.diffPatches,
        commitInfo: action.commitInfo,
        tagCommit: action.tagCommit,
      }
    case LOAD_ALL_COMMITS:
      return {
        ...state,
        histories: action.histories,
      }
    case INIT_SEARCH_HISTORY_PAGE:
      return {
        ...state,
        histories: action.histories,
        commitDiffFiles: action.commitDiffFiles,
        diffPatches: action.diffPatches,
        commitInfo: action.commitInfo,
      }
    case SEARCH_HISTORIES:
      return {
        ...state,
        histories: action.histories,
        commitDiffFiles: action.commitDiffFiles,
        diffPatches: action.diffPatches,
        commitInfo: action.commitInfo,
      }
    case APPEND_SEARCH_HISTORIES:
      return {
        ...state,
        histories: action.histories,
      }
    case SAVE_STASH:
      alert('贮藏成功!')
      return state
    case PULL:
      alert('拉取成功!')
      return state
    case PUSH:
      alert('推送成功!')
      return state
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
    case CHECKOUT_BRANCH_FAIL:
      alert(action.msg)
      return state
    case INIT_CHECKOUT_REMOTE_BRANCH_PAGE_FAIl:
      alert(action.msg)
      return state
    case REFRESH_BRANCHES_FAIL:
      alert(action.msg)
      return state
    case INIT_STASH_DETAIL_PAGE_FAIL:
      alert(action.msg)
      return state
    case INIT_MODAL_STASH_PAGE_FAIL:
      alert(action.msg)
      return state
    case REFRESH_STASHES_FAIL:
      alert(action.msg)
      return state
    case INIT_PULL_PAGE_FAIL:
      alert(action.msg)
      return state
    case PULL_FAIL:
      alert(action.msg)
      return state
    case INIT_PUSH_PAGE_FAIL:
      alert(action.msg)
      return state
    case PUSH_FAIL:
      alert(action.msg)
      return state
    case CLONE_FAIL:
      alert(action.msg)
      return state
    case INIT_TAG_HISTORY_PAGE_FAIL:
      alert(action.msg)
      return state
    case LOAD_ALL_COMMITS_FAIL:
      alert(action.msg)
      return state
    case SAVE_STASH_FAIL:
      alert(action.msg)
      return state
    case SEARCH_HISTORIES_FAIL:
      alert(action.msg)
      return state
    case APPEND_SEARCH_HISTORIES_FAIL:
      alert(action.msg)
      return state
    default:
      return state
  }
}
