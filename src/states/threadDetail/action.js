import { showLoading, hideLoading } from 'react-redux-loading-bar';
import api from '../../utils/api';

const ActionType = {
  RECEIVE_THREAD_DETAIL: 'RECEIVE_THREAD_DETAIL',
  CLEAR_THREAD_DETAIL: 'CLEAR_THREAD_DETAIL',
  ADD_COMMENT: 'ADD_COMMENT',
  TOGGLE_UPVOTE_THREAD_DETAIL: 'TOGGLE_UPVOTE_THREAD_DETAIL',
  TOGGLE_DOWNVOTE_THREAD_DETAIL: 'TOGGLE_DOWNVOTE_THREAD_DETAIL',
  TOGGLE_UPVOTE_COMMENT: 'TOGGLE_UPVOTE_COMMENT',
  TOGGLE_DOWNVOTE_COMMENT: 'TOGGLE_DOWNVOTE_COMMENT',
  RESTORE_THREAD_DETAIL_VOTE: 'RESTORE_THREAD_DETAIL_VOTE',
  RESTORE_COMMENT_VOTE: 'RESTORE_COMMENT_VOTE',
};

function receiveThreadDetailActionCreator(threadDetail) {
  return {
    type: ActionType.RECEIVE_THREAD_DETAIL,
    payload: {
      threadDetail,
    },
  };
}

function clearThreadDetailActionCreator() {
  return {
    type: ActionType.CLEAR_THREAD_DETAIL,
  };
}

function addCommentActionCreator(comment) {
  return {
    type: ActionType.ADD_COMMENT,
    payload: {
      comment,
    },
  };
}

function toggleUpVoteThreadDetailActionCreator(userId) {
  return {
    type: ActionType.TOGGLE_UPVOTE_THREAD_DETAIL,
    payload: {
      userId: typeof userId === 'object' && userId !== null ? userId.userId : userId,
    },
  };
}

function toggleDownVoteThreadDetailActionCreator(userId) {
  return {
    type: ActionType.TOGGLE_DOWNVOTE_THREAD_DETAIL,
    payload: {
      userId: typeof userId === 'object' && userId !== null ? userId.userId : userId,
    },
  };
}

function toggleUpVoteCommentActionCreator({ commentId, userId }) {
  return {
    type: ActionType.TOGGLE_UPVOTE_COMMENT,
    payload: {
      commentId,
      userId,
    },
  };
}

function toggleDownVoteCommentActionCreator({ commentId, userId }) {
  return {
    type: ActionType.TOGGLE_DOWNVOTE_COMMENT,
    payload: {
      commentId,
      userId,
    },
  };
}

function restoreThreadDetailVoteActionCreator({ upVotesBy, downVotesBy }) {
  return {
    type: ActionType.RESTORE_THREAD_DETAIL_VOTE,
    payload: {
      upVotesBy,
      downVotesBy,
    },
  };
}

function restoreCommentVoteActionCreator({ commentId, upVotesBy, downVotesBy }) {
  return {
    type: ActionType.RESTORE_COMMENT_VOTE,
    payload: {
      commentId,
      upVotesBy,
      downVotesBy,
    },
  };
}

function asyncReceiveThreadDetail(threadId) {
  return async (dispatch) => {
    dispatch(showLoading());
    dispatch(clearThreadDetailActionCreator());

    try {
      const threadDetail = await api.getThreadDetail(threadId);
      dispatch(receiveThreadDetailActionCreator(threadDetail));
    } catch (error) {
      alert(error.message);
    } finally {
      dispatch(hideLoading());
    }
  };
}

function asyncAddComment({ threadId, content }) {
  return async (dispatch) => {
    dispatch(showLoading());

    try {
      const comment = await api.createComment({ threadId, content });
      dispatch(addCommentActionCreator(comment));
      return { success: true, comment };
    } catch (error) {
      alert(error.message);
      return { success: false, error: error.message };
    } finally {
      dispatch(hideLoading());
    }
  };
}

function asyncToggleUpVoteThreadDetail(threadId) {
  return async (dispatch, getState) => {
    const { authUser, threadDetail } = getState();

    if (!authUser) {
      alert('Silakan masuk terlebih dahulu untuk memberikan vote!');
      return;
    }

    const targetThreadId = threadId || threadDetail?.id;
    const hasUpVoted = (threadDetail?.upVotesBy || []).includes(authUser.id);
    const previousUpVotesBy = [...(threadDetail?.upVotesBy || [])];
    const previousDownVotesBy = [...(threadDetail?.downVotesBy || [])];

    dispatch(toggleUpVoteThreadDetailActionCreator(authUser.id));

    try {
      if (hasUpVoted) {
        await api.neutralizeThreadVote(targetThreadId);
      } else {
        await api.upVoteThread(targetThreadId);
      }
    } catch (error) {
      alert(error.message);
      dispatch(restoreThreadDetailVoteActionCreator({
        upVotesBy: previousUpVotesBy,
        downVotesBy: previousDownVotesBy,
      }));
    }
  };
}

function asyncToggleDownVoteThreadDetail(threadId) {
  return async (dispatch, getState) => {
    const { authUser, threadDetail } = getState();

    if (!authUser) {
      alert('Silakan masuk terlebih dahulu untuk memberikan vote!');
      return;
    }

    const targetThreadId = threadId || threadDetail?.id;
    const hasDownVoted = (threadDetail?.downVotesBy || []).includes(authUser.id);
    const previousUpVotesBy = [...(threadDetail?.upVotesBy || [])];
    const previousDownVotesBy = [...(threadDetail?.downVotesBy || [])];

    dispatch(toggleDownVoteThreadDetailActionCreator(authUser.id));

    try {
      if (hasDownVoted) {
        await api.neutralizeThreadVote(targetThreadId);
      } else {
        await api.downVoteThread(targetThreadId);
      }
    } catch (error) {
      alert(error.message);
      dispatch(restoreThreadDetailVoteActionCreator({
        upVotesBy: previousUpVotesBy,
        downVotesBy: previousDownVotesBy,
      }));
    }
  };
}

function asyncToggleUpVoteComment({ threadId, commentId }) {
  return async (dispatch, getState) => {
    const { authUser, threadDetail } = getState();

    if (!authUser) {
      alert('Silakan masuk terlebih dahulu untuk memberikan vote!');
      return;
    }

    const targetComment = (threadDetail?.comments || []).find(
      (comment) => comment.id === commentId,
    );
    const hasUpVoted = (targetComment?.upVotesBy || []).includes(authUser.id);
    const previousUpVotesBy = [...(targetComment?.upVotesBy || [])];
    const previousDownVotesBy = [...(targetComment?.downVotesBy || [])];

    dispatch(toggleUpVoteCommentActionCreator({ commentId, userId: authUser.id }));

    try {
      if (hasUpVoted) {
        await api.neutralizeCommentVote({ threadId, commentId });
      } else {
        await api.upVoteComment({ threadId, commentId });
      }
    } catch (error) {
      alert(error.message);
      dispatch(restoreCommentVoteActionCreator({
        commentId,
        upVotesBy: previousUpVotesBy,
        downVotesBy: previousDownVotesBy,
      }));
    }
  };
}

function asyncToggleDownVoteComment({ threadId, commentId }) {
  return async (dispatch, getState) => {
    const { authUser, threadDetail } = getState();

    if (!authUser) {
      alert('Silakan masuk terlebih dahulu untuk memberikan vote!');
      return;
    }

    const targetComment = (threadDetail?.comments || []).find(
      (comment) => comment.id === commentId,
    );
    const hasDownVoted = (targetComment?.downVotesBy || []).includes(authUser.id);
    const previousUpVotesBy = [...(targetComment?.upVotesBy || [])];
    const previousDownVotesBy = [...(targetComment?.downVotesBy || [])];

    dispatch(toggleDownVoteCommentActionCreator({ commentId, userId: authUser.id }));

    try {
      if (hasDownVoted) {
        await api.neutralizeCommentVote({ threadId, commentId });
      } else {
        await api.downVoteComment({ threadId, commentId });
      }
    } catch (error) {
      alert(error.message);
      dispatch(restoreCommentVoteActionCreator({
        commentId,
        upVotesBy: previousUpVotesBy,
        downVotesBy: previousDownVotesBy,
      }));
    }
  };
}

export {
  ActionType,
  receiveThreadDetailActionCreator,
  clearThreadDetailActionCreator,
  addCommentActionCreator,
  toggleUpVoteThreadDetailActionCreator,
  toggleDownVoteThreadDetailActionCreator,
  toggleUpVoteCommentActionCreator,
  toggleDownVoteCommentActionCreator,
  restoreThreadDetailVoteActionCreator,
  restoreCommentVoteActionCreator,
  asyncReceiveThreadDetail,
  asyncAddComment,
  asyncToggleUpVoteThreadDetail,
  asyncToggleDownVoteThreadDetail,
  asyncToggleUpVoteComment,
  asyncToggleDownVoteComment,
};
