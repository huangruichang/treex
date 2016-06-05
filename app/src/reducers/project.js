
import {
  LIST_PROJECT,
  LOAD_PROJECT,
  LOAD_PROJECT_FAIL,
} from '../actions'

const initialState = {
  list: [],
  repo: undefined,
}

export default (state = initialState, action) => {
  switch (action.type) {
    case LIST_PROJECT:
      return {
        ...state,
        list: action.projects,
      }
    case LOAD_PROJECT:
      return {
        ...state,
        repo: action.repo,
      }
    case LOAD_PROJECT_FAIL:
      alert('打开失败')
      return state
    default:
      return state
  }
}
