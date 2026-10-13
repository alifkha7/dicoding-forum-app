const ActionType = {
  SET_CATEGORY: 'SET_CATEGORY',
  CLEAR_CATEGORY: 'CLEAR_CATEGORY',
};

function setCategoryActionCreator(category) {
  return {
    type: ActionType.SET_CATEGORY,
    payload: {
      category,
    },
  };
}

function clearCategoryActionCreator() {
  return {
    type: ActionType.CLEAR_CATEGORY,
  };
}

export {
  ActionType,
  setCategoryActionCreator,
  clearCategoryActionCreator,
};
