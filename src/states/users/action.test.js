import {
  describe,
  it,
  expect,
  beforeEach,
  afterEach,
  vi,
} from 'vitest';
import { showLoading, hideLoading } from 'react-redux-loading-bar';
import api from '../../utils/api';
import { asyncRegisterUser } from './action';

/**
 * test scenario for users async thunks
 *
 * - asyncRegisterUser thunk
 *  - should dispatch action correctly and return success when registration succeeds
 *  - should dispatch action and call alert correctly when registration fails
 */

const fakeUserPayload = {
  name: 'John Doe',
  email: 'john@example.com',
  password: 'secretpassword',
};

const fakeErrorResponse = new Error('Email is already taken');

describe('users thunk actions', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('asyncRegisterUser thunk', () => {
    it('should dispatch action correctly and return success when registration succeeds', async () => {
      // arrange
      vi.spyOn(api, 'register').mockResolvedValue({});
      const dispatch = vi.fn();

      // act
      const result = await asyncRegisterUser(fakeUserPayload)(dispatch);

      // assert
      expect(dispatch).toHaveBeenCalledWith(showLoading());
      expect(api.register).toHaveBeenCalledWith(fakeUserPayload);
      expect(dispatch).toHaveBeenCalledWith(hideLoading());
      expect(result).toEqual({ success: true });
    });

    it('should dispatch action and call alert correctly when registration fails', async () => {
      // arrange
      vi.spyOn(api, 'register').mockRejectedValue(fakeErrorResponse);
      const alertMock = vi.spyOn(window, 'alert').mockImplementation(() => {});
      const dispatch = vi.fn();

      // act
      const result = await asyncRegisterUser(fakeUserPayload)(dispatch);

      // assert
      expect(dispatch).toHaveBeenCalledWith(showLoading());
      expect(alertMock).toHaveBeenCalledWith(fakeErrorResponse.message);
      expect(dispatch).toHaveBeenCalledWith(hideLoading());
      expect(result).toEqual({ success: false, error: fakeErrorResponse.message });
    });
  });
});
