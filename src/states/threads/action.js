const ActionType = {
  RECEIVE_THREADS: 'RECEIVE_THREADS',
};

function receiveThreadsActionCreator(threads) {
  return {
    type: ActionType.RECEIVE_THREADS,
    payload: {
      threads,
    },
  };
}

export {
  ActionType,
  receiveThreadsActionCreator,
};
