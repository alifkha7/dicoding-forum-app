import { describe, it, expect } from 'vitest';
import threadsReducer from './reducer';
import { ActionType } from './action';

/**
 * test scenario for threadsReducer
 *
 * - threadsReducer function
 *  - should return the initial state when given by unknown action
 *  - should return the threads when given by RECEIVE_THREADS action
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
});
