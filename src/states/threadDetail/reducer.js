import { ActionType } from './action';

function threadDetailReducer(threadDetail = null, action = {}) {
  switch (action.type) {
    case ActionType.RECEIVE_THREAD_DETAIL:
      return action.payload.threadDetail;
    case ActionType.CLEAR_THREAD_DETAIL:
      return null;
    case ActionType.ADD_COMMENT:
      if (!threadDetail) {
        return threadDetail;
      }
      return {
        ...threadDetail,
        comments: [action.payload.comment, ...(threadDetail.comments || [])],
      };
    case ActionType.TOGGLE_UPVOTE_THREAD_DETAIL: {
      if (!threadDetail) {
        return threadDetail;
      }
      const { userId } = action.payload;
      const hasUpVoted = (threadDetail.upVotesBy || []).includes(userId);
      return {
        ...threadDetail,
        upVotesBy: hasUpVoted
          ? threadDetail.upVotesBy.filter((id) => id !== userId)
          : [...(threadDetail.upVotesBy || []), userId],
        downVotesBy: (threadDetail.downVotesBy || []).filter((id) => id !== userId),
      };
    }
    case ActionType.TOGGLE_DOWNVOTE_THREAD_DETAIL: {
      if (!threadDetail) {
        return threadDetail;
      }
      const { userId } = action.payload;
      const hasDownVoted = (threadDetail.downVotesBy || []).includes(userId);
      return {
        ...threadDetail,
        downVotesBy: hasDownVoted
          ? threadDetail.downVotesBy.filter((id) => id !== userId)
          : [...(threadDetail.downVotesBy || []), userId],
        upVotesBy: (threadDetail.upVotesBy || []).filter((id) => id !== userId),
      };
    }
    case ActionType.TOGGLE_UPVOTE_COMMENT: {
      if (!threadDetail) {
        return threadDetail;
      }
      const { commentId, userId } = action.payload;
      return {
        ...threadDetail,
        comments: (threadDetail.comments || []).map((comment) => {
          if (comment.id !== commentId) {
            return comment;
          }
          const hasUpVoted = (comment.upVotesBy || []).includes(userId);
          return {
            ...comment,
            upVotesBy: hasUpVoted
              ? comment.upVotesBy.filter((id) => id !== userId)
              : [...(comment.upVotesBy || []), userId],
            downVotesBy: (comment.downVotesBy || []).filter((id) => id !== userId),
          };
        }),
      };
    }
    case ActionType.TOGGLE_DOWNVOTE_COMMENT: {
      if (!threadDetail) {
        return threadDetail;
      }
      const { commentId, userId } = action.payload;
      return {
        ...threadDetail,
        comments: (threadDetail.comments || []).map((comment) => {
          if (comment.id !== commentId) {
            return comment;
          }
          const hasDownVoted = (comment.downVotesBy || []).includes(userId);
          return {
            ...comment,
            downVotesBy: hasDownVoted
              ? comment.downVotesBy.filter((id) => id !== userId)
              : [...(comment.downVotesBy || []), userId],
            upVotesBy: (comment.upVotesBy || []).filter((id) => id !== userId),
          };
        }),
      };
    }
    case ActionType.RESTORE_THREAD_DETAIL_VOTE: {
      if (!threadDetail) {
        return threadDetail;
      }
      return {
        ...threadDetail,
        upVotesBy: action.payload.upVotesBy,
        downVotesBy: action.payload.downVotesBy,
      };
    }
    case ActionType.RESTORE_COMMENT_VOTE: {
      if (!threadDetail) {
        return threadDetail;
      }
      const { commentId, upVotesBy, downVotesBy } = action.payload;
      return {
        ...threadDetail,
        comments: (threadDetail.comments || []).map((comment) => {
          if (comment.id !== commentId) {
            return comment;
          }
          return {
            ...comment,
            upVotesBy,
            downVotesBy,
          };
        }),
      };
    }
    default:
      return threadDetail;
  }
}

export default threadDetailReducer;
