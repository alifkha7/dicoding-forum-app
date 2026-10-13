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
  toggleUpVoteThreadActionCreator,
  toggleDownVoteThreadActionCreator,
  asyncCreateThread,
  asyncToggleUpVoteThread,
  asyncToggleDownVoteThread,
} from './action';

/**
 * test scenario for threads async thunks
 *
 * - asyncCreateThread thunk
 *  - should dispatch action correctly when thread creation success
 *  - should dispatch action and call alert correctly when thread creation failed
 * - asyncToggleUpVoteThread thunk
 *  - should alert prompt when guest (authUser is null)
 *  - should dispatch optimistic toggle action and call api.upVoteThread
 *  - should dispatch optimistic toggle action and call api.neutralizeThreadVote
 *  - should rollback toggle action and alert error message when api call fails
 * - asyncToggleDownVoteThread thunk
 *  - should alert prompt when guest (authUser is null)
 *  - should dispatch optimistic toggle action and call api.downVoteThread
 *  - should dispatch optimistic toggle action and call api.neutralizeThreadVote
 *  - should rollback toggle action and alert error message when api call fails
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

  describe('asyncToggleUpVoteThread thunk', () => {
    it('should alert prompt when guest (authUser is null)', async () => {
      // arrange
      const alertMock = vi.spyOn(window, 'alert').mockImplementation(() => {});
      const dispatch = vi.fn();
      const getState = () => ({ authUser: null, threads: [] });

      // act
      await asyncToggleUpVoteThread('thread-1')(dispatch, getState);

      // assert
      expect(alertMock).toHaveBeenCalledWith('Silakan masuk terlebih dahulu untuk memberikan vote!');
      expect(dispatch).not.toHaveBeenCalled();
    });

    it('should dispatch optimistic toggle action and call api.upVoteThread when thread not yet upvoted', async () => {
      // arrange
      vi.spyOn(api, 'upVoteThread').mockResolvedValue({});
      const dispatch = vi.fn();
      const getState = () => ({
        authUser: { id: 'user-1' },
        threads: [{ id: 'thread-1', upVotesBy: [], downVotesBy: [] }],
      });

      // act
      await asyncToggleUpVoteThread('thread-1')(dispatch, getState);

      // assert
      expect(dispatch).toHaveBeenCalledWith(
        toggleUpVoteThreadActionCreator({ threadId: 'thread-1', userId: 'user-1' }),
      );
      expect(api.upVoteThread).toHaveBeenCalledWith('thread-1');
    });

    it('should dispatch optimistic toggle action and call api.neutralizeThreadVote when thread already upvoted', async () => {
      // arrange
      vi.spyOn(api, 'neutralizeThreadVote').mockResolvedValue({});
      const dispatch = vi.fn();
      const getState = () => ({
        authUser: { id: 'user-1' },
        threads: [{ id: 'thread-1', upVotesBy: ['user-1'], downVotesBy: [] }],
      });

      // act
      await asyncToggleUpVoteThread('thread-1')(dispatch, getState);

      // assert
      expect(dispatch).toHaveBeenCalledWith(
        toggleUpVoteThreadActionCreator({ threadId: 'thread-1', userId: 'user-1' }),
      );
      expect(api.neutralizeThreadVote).toHaveBeenCalledWith('thread-1');
    });

    it('should rollback toggle action and alert error message when api call fails', async () => {
      // arrange
      vi.spyOn(api, 'upVoteThread').mockRejectedValue(fakeErrorResponse);
      const alertMock = vi.spyOn(window, 'alert').mockImplementation(() => {});
      const dispatch = vi.fn();
      const getState = () => ({
        authUser: { id: 'user-1' },
        threads: [{ id: 'thread-1', upVotesBy: [], downVotesBy: [] }],
      });

      // act
      await asyncToggleUpVoteThread('thread-1')(dispatch, getState);

      // assert
      expect(dispatch).toHaveBeenNthCalledWith(
        1,
        toggleUpVoteThreadActionCreator({ threadId: 'thread-1', userId: 'user-1' }),
      );
      expect(alertMock).toHaveBeenCalledWith(fakeErrorResponse.message);
      expect(dispatch).toHaveBeenNthCalledWith(
        2,
        toggleUpVoteThreadActionCreator({ threadId: 'thread-1', userId: 'user-1' }),
      );
    });
  });

  describe('asyncToggleDownVoteThread thunk', () => {
    it('should alert prompt when guest (authUser is null)', async () => {
      // arrange
      const alertMock = vi.spyOn(window, 'alert').mockImplementation(() => {});
      const dispatch = vi.fn();
      const getState = () => ({ authUser: null, threads: [] });

      // act
      await asyncToggleDownVoteThread('thread-1')(dispatch, getState);

      // assert
      expect(alertMock).toHaveBeenCalledWith('Silakan masuk terlebih dahulu untuk memberikan vote!');
      expect(dispatch).not.toHaveBeenCalled();
    });

    it('should dispatch optimistic toggle action and call api.downVoteThread when thread not yet downvoted', async () => {
      // arrange
      vi.spyOn(api, 'downVoteThread').mockResolvedValue({});
      const dispatch = vi.fn();
      const getState = () => ({
        authUser: { id: 'user-1' },
        threads: [{ id: 'thread-1', upVotesBy: [], downVotesBy: [] }],
      });

      // act
      await asyncToggleDownVoteThread('thread-1')(dispatch, getState);

      // assert
      expect(dispatch).toHaveBeenCalledWith(
        toggleDownVoteThreadActionCreator({ threadId: 'thread-1', userId: 'user-1' }),
      );
      expect(api.downVoteThread).toHaveBeenCalledWith('thread-1');
    });

    it('should dispatch optimistic toggle action and call api.neutralizeThreadVote when thread already downvoted', async () => {
      // arrange
      vi.spyOn(api, 'neutralizeThreadVote').mockResolvedValue({});
      const dispatch = vi.fn();
      const getState = () => ({
        authUser: { id: 'user-1' },
        threads: [{ id: 'thread-1', upVotesBy: [], downVotesBy: ['user-1'] }],
      });

      // act
      await asyncToggleDownVoteThread('thread-1')(dispatch, getState);

      // assert
      expect(dispatch).toHaveBeenCalledWith(
        toggleDownVoteThreadActionCreator({ threadId: 'thread-1', userId: 'user-1' }),
      );
      expect(api.neutralizeThreadVote).toHaveBeenCalledWith('thread-1');
    });

    it('should rollback toggle action and alert error message when api call fails', async () => {
      // arrange
      vi.spyOn(api, 'downVoteThread').mockRejectedValue(fakeErrorResponse);
      const alertMock = vi.spyOn(window, 'alert').mockImplementation(() => {});
      const dispatch = vi.fn();
      const getState = () => ({
        authUser: { id: 'user-1' },
        threads: [{ id: 'thread-1', upVotesBy: [], downVotesBy: [] }],
      });

      // act
      await asyncToggleDownVoteThread('thread-1')(dispatch, getState);

      // assert
      expect(dispatch).toHaveBeenNthCalledWith(
        1,
        toggleDownVoteThreadActionCreator({ threadId: 'thread-1', userId: 'user-1' }),
      );
      expect(alertMock).toHaveBeenCalledWith(fakeErrorResponse.message);
      expect(dispatch).toHaveBeenNthCalledWith(
        2,
        toggleDownVoteThreadActionCreator({ threadId: 'thread-1', userId: 'user-1' }),
      );
    });
  });
});
