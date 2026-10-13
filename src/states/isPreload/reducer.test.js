import { describe, it, expect } from 'vitest';
import isPreloadReducer from './reducer';
import { ActionType } from './action';

describe('isPreloadReducer function', () => {
  it('should return the initial state when given by unknown action', () => {
    // arrange
    const initialState = true;
    const action = { type: 'UNKNOWN' };

    // act
    const nextState = isPreloadReducer(initialState, action);

    // assert
    expect(nextState).toEqual(initialState);
  });

  it('should return the isPreload status when given by SET_IS_PRELOAD action', () => {
    // arrange
    const initialState = true;
    const action = {
      type: ActionType.SET_IS_PRELOAD,
      payload: {
        isPreload: false,
      },
    };

    // act
    const nextState = isPreloadReducer(initialState, action);

    // assert
    expect(nextState).toBe(false);
  });
});
