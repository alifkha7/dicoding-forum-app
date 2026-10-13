import { describe, it, expect } from 'vitest';
import categoryReducer from './reducer';
import { ActionType } from './action';

describe('categoryReducer function', () => {
  it('should return the initial state when given by unknown action', () => {
    // arrange
    const initialState = '';
    const action = { type: 'UNKNOWN' };

    // act
    const nextState = categoryReducer(initialState, action);

    // assert
    expect(nextState).toEqual(initialState);
  });

  it('should return the category string when given by SET_CATEGORY action', () => {
    // arrange
    const initialState = '';
    const action = {
      type: ActionType.SET_CATEGORY,
      payload: {
        category: 'react',
      },
    };

    // act
    const nextState = categoryReducer(initialState, action);

    // assert
    expect(nextState).toEqual('react');
  });

  it('should return empty string when given by CLEAR_CATEGORY action', () => {
    // arrange
    const initialState = 'redux';
    const action = {
      type: ActionType.CLEAR_CATEGORY,
    };

    // act
    const nextState = categoryReducer(initialState, action);

    // assert
    expect(nextState).toEqual('');
  });
});
