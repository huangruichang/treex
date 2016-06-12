
import {
  LOAD_REPO,
  LOAD_HISTORIES,
  INIT_SIDEBAR,
  INIT_SIDEBAR_FAILED,
} from '../actions'

const initalState = {
  histories: [],
  historiesCurrentCommit: undefined,
  historiesHeadCommit: undefined,
  fileModifiedCount: 0,
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
        historiesHeadCommit: action.headCommit || state.historiesHeadCommit
      }
    case INIT_SIDEBAR:
      return {
        ...state,
        fileModifiedCount: action.fileModifiedCount,
      }

    default:
      return state
  }
}
