import { showLoading, hideLoading } from 'react-redux-loading-bar';
import api from '../../utils/api';

const ActionType = {
  RECEIVE_THREADS: 'RECEIVE_THREADS',
  ADD_THREAD: 'ADD_THREAD',
  TOGGLE_UPVOTE_THREAD: 'TOGGLE_UPVOTE_THREAD',
  TOGGLE_DOWNVOTE_THREAD: 'TOGGLE_DOWNVOTE_THREAD',
  RESTORE_THREAD_VOTE: 'RESTORE_THREAD_VOTE',
};

function receiveThreadsActionCreator(threads) {
  return {
    type: ActionType.RECEIVE_THREADS,
    payload: {
      threads,
    },
  };
}

function addThreadActionCreator(thread) {
  return {
    type: ActionType.ADD_THREAD,
    payload: {
      thread,
    },
  };
}

function toggleUpVoteThreadActionCreator({ threadId, userId }) {
  return {
    type: ActionType.TOGGLE_UPVOTE_THREAD,
    payload: {
      threadId,
      userId,
    },
  };
}

function toggleDownVoteThreadActionCreator({ threadId, userId }) {
  return {
    type: ActionType.TOGGLE_DOWNVOTE_THREAD,
    payload: {
      threadId,
      userId,
    },
  };
}

function restoreThreadVoteActionCreator({ threadId, upVotesBy, downVotesBy }) {
  return {
    type: ActionType.RESTORE_THREAD_VOTE,
    payload: {
      threadId,
      upVotesBy,
      downVotesBy,
    },
  };
}

function asyncCreateThread({ title, body, category = '' }) {
  return async (dispatch) => {
    dispatch(showLoading());

    try {
      const thread = await api.createThread({ title, body, category });
      dispatch(addThreadActionCreator(thread));
      return { success: true, thread };
    } catch (error) {
      alert(error.message);
      return { success: false, error: error.message };
    } finally {
      dispatch(hideLoading());
    }
  };
}

function asyncToggleUpVoteThread(threadId) {
  return async (dispatch, getState) => {
    const { authUser, threads = [] } = getState();

    if (!authUser) {
      alert('Silakan masuk terlebih dahulu untuk memberikan vote!');
      return;
    }

    const targetThread = threads.find((thread) => thread.id === threadId);
    const hasUpVoted = targetThread?.upVotesBy?.includes(authUser.id);
    const previousUpVotesBy = [...(targetThread?.upVotesBy || [])];
    const previousDownVotesBy = [...(targetThread?.downVotesBy || [])];

    dispatch(toggleUpVoteThreadActionCreator({ threadId, userId: authUser.id }));

    try {
      if (hasUpVoted) {
        await api.neutralizeThreadVote(threadId);
      } else {
        await api.upVoteThread(threadId);
      }
    } catch (error) {
      alert(error.message);
      dispatch(restoreThreadVoteActionCreator({
        threadId,
        upVotesBy: previousUpVotesBy,
        downVotesBy: previousDownVotesBy,
      }));
    }
  };
}

function asyncToggleDownVoteThread(threadId) {
  return async (dispatch, getState) => {
    const { authUser, threads = [] } = getState();

    if (!authUser) {
      alert('Silakan masuk terlebih dahulu untuk memberikan vote!');
      return;
    }

    const targetThread = threads.find((thread) => thread.id === threadId);
    const hasDownVoted = targetThread?.downVotesBy?.includes(authUser.id);
    const previousUpVotesBy = [...(targetThread?.upVotesBy || [])];
    const previousDownVotesBy = [...(targetThread?.downVotesBy || [])];

    dispatch(toggleDownVoteThreadActionCreator({ threadId, userId: authUser.id }));

    try {
      if (hasDownVoted) {
        await api.neutralizeThreadVote(threadId);
      } else {
        await api.downVoteThread(threadId);
      }
    } catch (error) {
      alert(error.message);
      dispatch(restoreThreadVoteActionCreator({
        threadId,
        upVotesBy: previousUpVotesBy,
        downVotesBy: previousDownVotesBy,
      }));
    }
  };
}

export {
  ActionType,
  receiveThreadsActionCreator,
  addThreadActionCreator,
  toggleUpVoteThreadActionCreator,
  toggleDownVoteThreadActionCreator,
  restoreThreadVoteActionCreator,
  asyncCreateThread,
  asyncToggleUpVoteThread,
  asyncToggleDownVoteThread,
};
