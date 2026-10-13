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
import {
  addThreadActionCreator,
  asyncCreateThread,
} from './action';

/**
 * test scenario for threads async thunks
 *
 * - asyncCreateThread thunk
 *  - should dispatch action correctly when thread creation success
 *  - should dispatch action and call alert correctly when thread creation failed
 */

const fakeThreadResponse = {
  id: 'thread-1',
  title: 'Test Thread',
  body: 'Test Body',
  category: 'react',
  createdAt: '2023-05-29T07:55:52.266Z',
  ownerId: 'user-1',
  upVotesBy: [],
  downVotesBy: [],
  totalComments: 0,
};

const fakeErrorResponse = new Error('Ups, something went wrong');

describe('threads thunk actions', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('asyncCreateThread thunk', () => {
    it('should dispatch action correctly when thread creation success', async () => {
      // arrange
      vi.spyOn(api, 'createThread').mockResolvedValue(fakeThreadResponse);
      const dispatch = vi.fn();

      // act
      const result = await asyncCreateThread({
        title: 'Test Thread',
        body: 'Test Body',
        category: 'react',
      })(dispatch);

      // assert
      expect(dispatch).toHaveBeenCalledWith(showLoading());
      expect(dispatch).toHaveBeenCalledWith(addThreadActionCreator(fakeThreadResponse));
      expect(dispatch).toHaveBeenCalledWith(hideLoading());
      expect(result).toEqual({ success: true, thread: fakeThreadResponse });
    });

    it('should dispatch action and call alert correctly when thread creation failed', async () => {
      // arrange
      vi.spyOn(api, 'createThread').mockRejectedValue(fakeErrorResponse);
      const alertMock = vi.spyOn(window, 'alert').mockImplementation(() => {});
      const dispatch = vi.fn();

      // act
      const result = await asyncCreateThread({
        title: 'Test Thread',
        body: 'Test Body',
        category: 'react',
      })(dispatch);

      // assert
      expect(dispatch).toHaveBeenCalledWith(showLoading());
      expect(alertMock).toHaveBeenCalledWith(fakeErrorResponse.message);
      expect(dispatch).toHaveBeenCalledWith(hideLoading());
      expect(result).toEqual({ success: false, error: fakeErrorResponse.message });
    });
  });
});
