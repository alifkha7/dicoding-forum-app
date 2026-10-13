import { describe, it, expect } from 'vitest';
import usersReducer from './reducer';
import { ActionType } from './action';

/**
 * test scenario for usersReducer
 *
 * - usersReducer function
 *  - should return the initial state when given by unknown action
 *  - should return the users when given by RECEIVE_USERS action
 */
describe('usersReducer function', () => {
  it('should return the initial state when given by unknown action', () => {
    // arrange
    const initialState = [];
    const action = { type: 'UNKNOWN' };

    // act
    const nextState = usersReducer(initialState, action);

    // assert
    expect(nextState).toEqual(initialState);
  });

  it('should return the users when given by RECEIVE_USERS action', () => {
    // arrange
    const initialState = [];
    const fakeUsers = [
      {
        id: 'user-1',
        name: 'John Doe',
        email: 'john@example.com',
        avatar: 'https://generated-image-url.jpg',
      },
      {
        id: 'user-2',
        name: 'Jane Doe',
        email: 'jane@example.com',
        avatar: 'https://generated-image-url-2.jpg',
      },
    ];
    const action = {
      type: ActionType.RECEIVE_USERS,
      payload: {
        users: fakeUsers,
      },
    };

    // act
    const nextState = usersReducer(initialState, action);

    // assert
    expect(nextState).toEqual(fakeUsers);
  });
});
