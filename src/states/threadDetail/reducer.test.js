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
});
