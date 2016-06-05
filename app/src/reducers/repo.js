
import {
  LOAD_REPO,
  LOAD_HISTORIES,
} from '../actions'

const initalState = {
  histories: [],
}

export default (state = initalState, action) => {
  switch (action.type) {
    case LOAD_REPO:
      return {
        ...state,
        repo: action.repo,
      }
    case LOAD_HISTORIES:
      console.log(action.histories)
      return {
        ...state,
        histories: action.histories,
      }
    default:
      return state
  }
}
