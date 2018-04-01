
const initialState = [];
import * as types from '@/constants/users/ActionTypes';
export default function todos(state = initialState, action) {
  switch (action.type) {
  case types.SHOW_ACTIVE_USERS:
    return [{}, ...state];
  default:
    return state;
  }
}
