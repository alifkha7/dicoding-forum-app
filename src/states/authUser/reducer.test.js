import { describe, it, expect } from 'vitest';
import authUserReducer from './reducer';
import { ActionType } from './action';

describe('authUserReducer function', () => {
  it('should return the initial state when given by unknown action', () => {
    // arrange
    const initialState = null;
    const action = { type: 'UNKNOWN' };

    // act
    const nextState = authUserReducer(initialState, action);

    // assert
    expect(nextState).toEqual(initialState);
  });

  it('should return the authUser when given by SET_AUTH_USER action', () => {
    // arrange
    const initialState = null;
    const fakeAuthUser = {
      id: 'john_doe',
      name: 'John Doe',
      email: 'john@example.com',
      avatar: 'https://generated-image-url.jpg',
    };
    const action = {
      type: ActionType.SET_AUTH_USER,
      payload: {
        authUser: fakeAuthUser,
      },
    };

    // act
    const nextState = authUserReducer(initialState, action);

    // assert
    expect(nextState).toEqual(fakeAuthUser);
  });

  it('should return null when given by UNSET_AUTH_USER action', () => {
    // arrange
    const initialState = {
      id: 'john_doe',
      name: 'John Doe',
      email: 'john@example.com',
      avatar: 'https://generated-image-url.jpg',
    };
    const action = {
      type: ActionType.UNSET_AUTH_USER,
      payload: {
        authUser: null,
      },
    };

    // act
    const nextState = authUserReducer(initialState, action);

    // assert
    expect(nextState).toBeNull();
  });
});
