import { describe, it, expect } from 'vitest';
import threadsReducer from './reducer';
import { ActionType } from './action';

/**
 * test scenario for threadsReducer
 *
 * - threadsReducer function
 *  - should return the initial state when given by unknown action
 *  - should return the threads when given by RECEIVE_THREADS action
 *  - should return the threads with the new thread when given by ADD_THREAD action
 *  - should return threads with added upVote when given by TOGGLE_UPVOTE_THREAD action
 *  - should return threads with removed upVote when given by TOGGLE_UPVOTE_THREAD (neutralize)
 *  - should return threads with added downVote when given by TOGGLE_DOWNVOTE_THREAD action
 *  - should return threads with removed downVote when given by TOGGLE_DOWNVOTE_THREAD (neutralize)
 */
describe('threadsReducer function', () => {
  it('should return the initial state when given by unknown action', () => {
    // arrange
    const initialState = [];
    const action = { type: 'UNKNOWN' };

    // act
    const nextState = threadsReducer(initialState, action);

    // assert
    expect(nextState).toEqual(initialState);
  });

  it('should return the threads when given by RECEIVE_THREADS action', () => {
    // arrange
    const initialState = [];
    const fakeThreads = [
      {
        id: 'thread-1',
        title: 'Thread Test 1',
        body: 'Body Test 1',
        category: 'redux',
        createdAt: '2023-05-29T07:55:52.266Z',
        ownerId: 'user-1',
        upVotesBy: ['user-2'],
        downVotesBy: [],
        totalComments: 3,
      },
    ];
    const action = {
      type: ActionType.RECEIVE_THREADS,
      payload: {
        threads: fakeThreads,
      },
    };

    // act
    const nextState = threadsReducer(initialState, action);

    // assert
    expect(nextState).toEqual(fakeThreads);
  });

  it('should return the threads with the new thread when given by ADD_THREAD action', () => {
    // arrange
    const initialState = [
      {
        id: 'thread-1',
        title: 'Thread Test 1',
        body: 'Body Test 1',
        category: 'redux',
        createdAt: '2023-05-29T07:55:52.266Z',
        ownerId: 'user-1',
        upVotesBy: ['user-2'],
        downVotesBy: [],
        totalComments: 3,
      },
    ];
    const newThread = {
      id: 'thread-2',
      title: 'Thread Test 2',
      body: 'Body Test 2',
      category: 'react',
      createdAt: '2023-05-29T08:00:00.000Z',
      ownerId: 'user-2',
      upVotesBy: [],
      downVotesBy: [],
      totalComments: 0,
    };
    const action = {
      type: ActionType.ADD_THREAD,
      payload: {
        thread: newThread,
      },
    };

    // act
    const nextState = threadsReducer(initialState, action);

    // assert
    expect(nextState).toEqual([newThread, ...initialState]);
  });

  it('should return threads with added upVote and removed downVote when given by TOGGLE_UPVOTE_THREAD action', () => {
    // arrange
    const initialState = [
      {
        id: 'thread-1',
        title: 'Thread Test 1',
        upVotesBy: [],
        downVotesBy: ['user-1'],
      },
    ];
    const action = {
      type: ActionType.TOGGLE_UPVOTE_THREAD,
      payload: {
        threadId: 'thread-1',
        userId: 'user-1',
      },
    };

    // act
    const nextState = threadsReducer(initialState, action);

    // assert
    expect(nextState).toEqual([
      {
        id: 'thread-1',
        title: 'Thread Test 1',
        upVotesBy: ['user-1'],
        downVotesBy: [],
      },
    ]);
  });

  it('should return threads with removed upVote when given by TOGGLE_UPVOTE_THREAD action (neutralize)', () => {
    // arrange
    const initialState = [
      {
        id: 'thread-1',
        title: 'Thread Test 1',
        upVotesBy: ['user-1'],
        downVotesBy: [],
      },
    ];
    const action = {
      type: ActionType.TOGGLE_UPVOTE_THREAD,
      payload: {
        threadId: 'thread-1',
        userId: 'user-1',
      },
    };

    // act
    const nextState = threadsReducer(initialState, action);

    // assert
    expect(nextState).toEqual([
      {
        id: 'thread-1',
        title: 'Thread Test 1',
        upVotesBy: [],
        downVotesBy: [],
      },
    ]);
  });

  it('should return threads with added downVote and removed upVote when given by TOGGLE_DOWNVOTE_THREAD action', () => {
    // arrange
    const initialState = [
      {
        id: 'thread-1',
        title: 'Thread Test 1',
        upVotesBy: ['user-1'],
        downVotesBy: [],
      },
    ];
    const action = {
      type: ActionType.TOGGLE_DOWNVOTE_THREAD,
      payload: {
        threadId: 'thread-1',
        userId: 'user-1',
      },
    };

    // act
    const nextState = threadsReducer(initialState, action);

    // assert
    expect(nextState).toEqual([
      {
        id: 'thread-1',
        title: 'Thread Test 1',
        upVotesBy: [],
        downVotesBy: ['user-1'],
      },
    ]);
  });

  it('should return threads with removed downVote when given by TOGGLE_DOWNVOTE_THREAD action (neutralize)', () => {
    // arrange
    const initialState = [
      {
        id: 'thread-1',
        title: 'Thread Test 1',
        upVotesBy: [],
        downVotesBy: ['user-1'],
      },
    ];
    const action = {
      type: ActionType.TOGGLE_DOWNVOTE_THREAD,
      payload: {
        threadId: 'thread-1',
        userId: 'user-1',
      },
    };

    // act
    const nextState = threadsReducer(initialState, action);

    // assert
    expect(nextState).toEqual([
      {
        id: 'thread-1',
        title: 'Thread Test 1',
        upVotesBy: [],
        downVotesBy: [],
      },
    ]);
  });
});
