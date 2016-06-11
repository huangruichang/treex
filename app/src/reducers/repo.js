
import {
  LOAD_REPO,
  LOAD_HISTORIES,
} from '../actions'

const initalState = {
  histories: [],
  historiesCurrentCommit: undefined,
  historiesHeadCommit: undefined,
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
    default:
      return state
  }
}
