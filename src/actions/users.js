
import * as types from '@/constants/users/ActionTypes';
export function getActiveUsers(payload) {
  return { type: types.SHOW_ACTIVE_USERS, payload };
}
