import { ActionType } from './action';

function categoryReducer(category = '', action = {}) {
  switch (action.type) {
    case ActionType.SET_CATEGORY:
      return action.payload.category;
    case ActionType.CLEAR_CATEGORY:
      return '';
    default:
      return category;
  }
}

export default categoryReducer;
