import { describe, it, expect } from 'vitest';
import threadDetailReducer from './reducer';
import { ActionType } from './action';

/**
 * test scenario for threadDetailReducer
 *
 * - threadDetailReducer function
 *  - should return the initial state when given by unknown action
 *  - should return the threadDetail when given by RECEIVE_THREAD_DETAIL action
 *  - should return null when given by CLEAR_THREAD_DETAIL action
 *  - should return the threadDetail with new comment prepended when given by ADD_COMMENT action
 *  - should return threadDetail with added upVote on TOGGLE_UPVOTE_THREAD_DETAIL
 *  - should return threadDetail with removed upVote on TOGGLE_UPVOTE_THREAD_DETAIL
 *  - should return threadDetail with added downVote on TOGGLE_DOWNVOTE_THREAD_DETAIL
 *  - should return threadDetail with removed downVote on TOGGLE_DOWNVOTE_THREAD_DETAIL
 *  - should return threadDetail with added comment upVote on TOGGLE_UPVOTE_COMMENT
 *  - should return threadDetail with removed comment upVote on TOGGLE_UPVOTE_COMMENT
 *  - should return threadDetail with added comment downVote on TOGGLE_DOWNVOTE_COMMENT
 *  - should return threadDetail with removed comment downVote on TOGGLE_DOWNVOTE_COMMENT
 */
describe('threadDetailReducer function', () => {
  it('should return the initial state when given by unknown action', () => {
    // arrange
    const initialState = null;
    const action = { type: 'UNKNOWN' };

    // act
    const nextState = threadDetailReducer(initialState, action);

    // assert
    expect(nextState).toEqual(initialState);
  });

  it('should return the threadDetail when given by RECEIVE_THREAD_DETAIL action', () => {
    // arrange
    const initialState = null;
    const fakeThreadDetail = {
      id: 'thread-1',
      title: 'Detail Thread Test',
      body: 'Body detail thread test',
      createdAt: '2023-05-29T07:55:52.266Z',
      category: 'redux',
      owner: {
        id: 'user-1',
        name: 'John Doe',
        avatar: 'https://generated-image-url.jpg',
      },
      upVotesBy: [],
      downVotesBy: [],
      comments: [],
    };
    const action = {
      type: ActionType.RECEIVE_THREAD_DETAIL,
      payload: {
        threadDetail: fakeThreadDetail,
      },
    };

    // act
    const nextState = threadDetailReducer(initialState, action);

    // assert
    expect(nextState).toEqual(fakeThreadDetail);
  });

  it('should return null when given by CLEAR_THREAD_DETAIL action', () => {
    // arrange
    const initialState = {
      id: 'thread-1',
      title: 'Detail Thread Test',
      body: 'Body detail thread test',
      comments: [],
    };
    const action = {
      type: ActionType.CLEAR_THREAD_DETAIL,
    };

    // act
    const nextState = threadDetailReducer(initialState, action);

    // assert
    expect(nextState).toBeNull();
  });

  it('should return the threadDetail with new comment prepended when given by ADD_COMMENT action', () => {
    // arrange
    const initialState = {
      id: 'thread-1',
      title: 'Detail Thread Test',
      body: 'Body detail thread test',
      comments: [
        {
          id: 'comment-1',
          content: 'Komentar pertama',
          createdAt: '2023-05-29T08:00:00.000Z',
          owner: {
            id: 'user-2',
            name: 'Jane Doe',
          },
          upVotesBy: [],
          downVotesBy: [],
        },
      ],
    };
    const newComment = {
      id: 'comment-2',
      content: 'Komentar kedua',
      createdAt: '2023-05-29T08:05:00.000Z',
      owner: {
        id: 'user-1',
        name: 'John Doe',
      },
      upVotesBy: [],
      downVotesBy: [],
    };
    const action = {
      type: ActionType.ADD_COMMENT,
      payload: {
        comment: newComment,
      },
    };

    // act
    const nextState = threadDetailReducer(initialState, action);

    // assert
    expect(nextState).toEqual({
      ...initialState,
      comments: [newComment, ...initialState.comments],
    });
  });

  it('should return threadDetail with added upVote and removed downVote when given by TOGGLE_UPVOTE_THREAD_DETAIL action', () => {
    // arrange
    const initialState = {
      id: 'thread-1',
      upVotesBy: [],
      downVotesBy: ['user-1'],
      comments: [],
    };
    const action = {
      type: ActionType.TOGGLE_UPVOTE_THREAD_DETAIL,
      payload: {
        userId: 'user-1',
      },
    };

    // act
    const nextState = threadDetailReducer(initialState, action);

    // assert
    expect(nextState).toEqual({
      ...initialState,
      upVotesBy: ['user-1'],
      downVotesBy: [],
    });
  });

  it('should return threadDetail with removed upVote when given by TOGGLE_UPVOTE_THREAD_DETAIL action (neutralize)', () => {
    // arrange
    const initialState = {
      id: 'thread-1',
      upVotesBy: ['user-1'],
      downVotesBy: [],
      comments: [],
    };
    const action = {
      type: ActionType.TOGGLE_UPVOTE_THREAD_DETAIL,
      payload: {
        userId: 'user-1',
      },
    };

    // act
    const nextState = threadDetailReducer(initialState, action);

    // assert
    expect(nextState).toEqual({
      ...initialState,
      upVotesBy: [],
      downVotesBy: [],
    });
  });

  it('should return threadDetail with added downVote and removed upVote when given by TOGGLE_DOWNVOTE_THREAD_DETAIL action', () => {
    // arrange
    const initialState = {
      id: 'thread-1',
      upVotesBy: ['user-1'],
      downVotesBy: [],
      comments: [],
    };
    const action = {
      type: ActionType.TOGGLE_DOWNVOTE_THREAD_DETAIL,
      payload: {
        userId: 'user-1',
      },
    };

    // act
    const nextState = threadDetailReducer(initialState, action);

    // assert
    expect(nextState).toEqual({
      ...initialState,
      upVotesBy: [],
      downVotesBy: ['user-1'],
    });
  });

  it('should return threadDetail with removed downVote when given by TOGGLE_DOWNVOTE_THREAD_DETAIL action (neutralize)', () => {
    // arrange
    const initialState = {
      id: 'thread-1',
      upVotesBy: [],
      downVotesBy: ['user-1'],
      comments: [],
    };
    const action = {
      type: ActionType.TOGGLE_DOWNVOTE_THREAD_DETAIL,
      payload: {
        userId: 'user-1',
      },
    };

    // act
    const nextState = threadDetailReducer(initialState, action);

    // assert
    expect(nextState).toEqual({
      ...initialState,
      upVotesBy: [],
      downVotesBy: [],
    });
  });

  it('should return threadDetail with added comment upVote when given by TOGGLE_UPVOTE_COMMENT action', () => {
    // arrange
    const initialState = {
      id: 'thread-1',
      comments: [
        {
          id: 'comment-1',
          upVotesBy: [],
          downVotesBy: ['user-1'],
        },
      ],
    };
    const action = {
      type: ActionType.TOGGLE_UPVOTE_COMMENT,
      payload: {
        commentId: 'comment-1',
        userId: 'user-1',
      },
    };

    // act
    const nextState = threadDetailReducer(initialState, action);

    // assert
    expect(nextState.comments[0]).toEqual({
      id: 'comment-1',
      upVotesBy: ['user-1'],
      downVotesBy: [],
    });
  });

  it('should return threadDetail with removed comment upVote when given by TOGGLE_UPVOTE_COMMENT action (neutralize)', () => {
    // arrange
    const initialState = {
      id: 'thread-1',
      comments: [
        {
          id: 'comment-1',
          upVotesBy: ['user-1'],
          downVotesBy: [],
        },
      ],
    };
    const action = {
      type: ActionType.TOGGLE_UPVOTE_COMMENT,
      payload: {
        commentId: 'comment-1',
        userId: 'user-1',
      },
    };

    // act
    const nextState = threadDetailReducer(initialState, action);

    // assert
    expect(nextState.comments[0]).toEqual({
      id: 'comment-1',
      upVotesBy: [],
      downVotesBy: [],
    });
  });

  it('should return threadDetail with added comment downVote when given by TOGGLE_DOWNVOTE_COMMENT action', () => {
    // arrange
    const initialState = {
      id: 'thread-1',
      comments: [
        {
          id: 'comment-1',
          upVotesBy: ['user-1'],
          downVotesBy: [],
        },
      ],
    };
    const action = {
      type: ActionType.TOGGLE_DOWNVOTE_COMMENT,
      payload: {
        commentId: 'comment-1',
        userId: 'user-1',
      },
    };

    // act
    const nextState = threadDetailReducer(initialState, action);

    // assert
    expect(nextState.comments[0]).toEqual({
      id: 'comment-1',
      upVotesBy: [],
      downVotesBy: ['user-1'],
    });
  });

  it('should return threadDetail with removed comment downVote when given by TOGGLE_DOWNVOTE_COMMENT action (neutralize)', () => {
    // arrange
    const initialState = {
      id: 'thread-1',
      comments: [
        {
          id: 'comment-1',
          upVotesBy: [],
          downVotesBy: ['user-1'],
        },
      ],
    };
    const action = {
      type: ActionType.TOGGLE_DOWNVOTE_COMMENT,
      payload: {
        commentId: 'comment-1',
        userId: 'user-1',
      },
    };

    // act
    const nextState = threadDetailReducer(initialState, action);

    // assert
    expect(nextState.comments[0]).toEqual({
      id: 'comment-1',
      upVotesBy: [],
      downVotesBy: [],
    });
  });

  it('should restore upVotesBy and downVotesBy when given by RESTORE_THREAD_DETAIL_VOTE action', () => {
    // arrange
    const initialState = {
      id: 'thread-1',
      upVotesBy: ['user-1'],
      downVotesBy: [],
      comments: [],
    };
    const action = {
      type: ActionType.RESTORE_THREAD_DETAIL_VOTE,
      payload: {
        upVotesBy: [],
        downVotesBy: ['user-1'],
      },
    };

    // act
    const nextState = threadDetailReducer(initialState, action);

    // assert
    expect(nextState).toEqual({
      ...initialState,
      upVotesBy: [],
      downVotesBy: ['user-1'],
    });
  });

  it('should restore upVotesBy and downVotesBy when given by RESTORE_COMMENT_VOTE action', () => {
    // arrange
    const initialState = {
      id: 'thread-1',
      comments: [
        {
          id: 'comment-1',
          upVotesBy: ['user-1'],
          downVotesBy: [],
        },
      ],
    };
    const action = {
      type: ActionType.RESTORE_COMMENT_VOTE,
      payload: {
        commentId: 'comment-1',
        upVotesBy: [],
        downVotesBy: ['user-1'],
      },
    };

    // act
    const nextState = threadDetailReducer(initialState, action);

    // assert
    expect(nextState.comments[0]).toEqual({
      id: 'comment-1',
      upVotesBy: [],
      downVotesBy: ['user-1'],
    });
  });
});
