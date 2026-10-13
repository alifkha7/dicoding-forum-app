import { ActionType } from './action';

function threadsReducer(threads = [], action = {}) {
  switch (action.type) {
    case ActionType.RECEIVE_THREADS:
      return action.payload.threads;
    case ActionType.ADD_THREAD:
      return [action.payload.thread, ...threads];
    case ActionType.TOGGLE_UPVOTE_THREAD:
      return threads.map((thread) => {
        if (thread.id !== action.payload.threadId) {
          return thread;
        }

        const hasUpVoted = (thread.upVotesBy || []).includes(action.payload.userId);

        return {
          ...thread,
          upVotesBy: hasUpVoted
            ? thread.upVotesBy.filter((id) => id !== action.payload.userId)
            : [...(thread.upVotesBy || []), action.payload.userId],
          downVotesBy: (thread.downVotesBy || []).filter((id) => id !== action.payload.userId),
        };
      });
    case ActionType.TOGGLE_DOWNVOTE_THREAD:
      return threads.map((thread) => {
        if (thread.id !== action.payload.threadId) {
          return thread;
        }

        const hasDownVoted = (thread.downVotesBy || []).includes(action.payload.userId);

        return {
          ...thread,
          downVotesBy: hasDownVoted
            ? thread.downVotesBy.filter((id) => id !== action.payload.userId)
            : [...(thread.downVotesBy || []), action.payload.userId],
          upVotesBy: (thread.upVotesBy || []).filter((id) => id !== action.payload.userId),
        };
      });
    case ActionType.RESTORE_THREAD_VOTE:
      return threads.map((thread) => {
        if (thread.id !== action.payload.threadId) {
          return thread;
        }

        return {
          ...thread,
          upVotesBy: action.payload.upVotesBy,
          downVotesBy: action.payload.downVotesBy,
        };
      });
    default:
      return threads;
  }
}

export default threadsReducer;
