
import {
  LIST_PROJECT,
  LOAD_PROJECT,
  LOAD_PROJECT_FAIL,
  LOAD_USER,
  LOAD_USER_FAIL,
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
    case LOAD_USER:
      return {
        ...state,
        user: action.user,
      }
    case LOAD_PROJECT_FAIL:
      alert('打开失败')
      return state
    case LOAD_USER_FAIL:
      alert(action.msg)
      return state
    default:
      return state
  }
}
