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
  receiveThreadDetailActionCreator,
  clearThreadDetailActionCreator,
  addCommentActionCreator,
  toggleUpVoteThreadDetailActionCreator,
  toggleDownVoteThreadDetailActionCreator,
  toggleUpVoteCommentActionCreator,
  toggleDownVoteCommentActionCreator,
  asyncReceiveThreadDetail,
  asyncAddComment,
  asyncToggleUpVoteThreadDetail,
  asyncToggleDownVoteThreadDetail,
  asyncToggleUpVoteComment,
  asyncToggleDownVoteComment,
} from './action';

/**
 * test scenario for threadDetail async thunks
 *
 * - asyncReceiveThreadDetail thunk
 *  - should dispatch action correctly when data fetching success
 *  - should dispatch action and call alert correctly when data fetching failed
 * - asyncAddComment thunk
 *  - should dispatch action correctly when comment creation success
 *  - should dispatch action and call alert correctly when comment creation failed
 * - asyncToggleUpVoteThreadDetail thunk
 *  - should alert prompt when guest (authUser is null)
 *  - should dispatch optimistic toggle action and call api.upVoteThread
 *  - should dispatch optimistic toggle action and call api.neutralizeThreadVote
 *  - should rollback toggle action and alert error message when api call fails
 * - asyncToggleDownVoteThreadDetail thunk
 *  - should alert prompt when guest (authUser is null)
 *  - should dispatch optimistic toggle action and call api.downVoteThread
 *  - should dispatch optimistic toggle action and call api.neutralizeThreadVote
 *  - should rollback toggle action and alert error message when api call fails
 * - asyncToggleUpVoteComment thunk
 *  - should alert prompt when guest (authUser is null)
 *  - should dispatch optimistic toggle action and call api.upVoteComment
 *  - should dispatch optimistic toggle action and call api.neutralizeCommentVote
 *  - should rollback toggle action and alert error message when api call fails
 * - asyncToggleDownVoteComment thunk
 *  - should alert prompt when guest (authUser is null)
 *  - should dispatch optimistic toggle action and call api.downVoteComment
 *  - should dispatch optimistic toggle action and call api.neutralizeCommentVote
 *  - should rollback toggle action and alert error message when api call fails
 */

const fakeThreadDetailResponse = {
  id: 'thread-1',
  title: 'Thread Detail Test',
  body: 'Body Detail Test',
  category: 'redux',
  createdAt: '2023-05-29T07:55:52.266Z',
  owner: {
    id: 'user-1',
    name: 'John Doe',
    avatar: 'https://generated-image-url.jpg',
  },
  upVotesBy: ['user-2'],
  downVotesBy: [],
  comments: [],
};

const fakeCommentResponse = {
  id: 'comment-1',
  content: 'Ini adalah komentar tes',
  createdAt: '2023-05-29T08:00:00.000Z',
  upVotesBy: [],
  downVotesBy: [],
  owner: {
    id: 'user-1',
    name: 'John Doe',
  },
};

const fakeErrorResponse = new Error('Ups, something went wrong');

describe('threadDetail thunk actions', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('asyncReceiveThreadDetail thunk', () => {
    it('should dispatch action correctly when data fetching success', async () => {
      // arrange
      vi.spyOn(api, 'getThreadDetail').mockResolvedValue(fakeThreadDetailResponse);
      const dispatch = vi.fn();

      // act
      await asyncReceiveThreadDetail('thread-1')(dispatch);

      // assert
      expect(dispatch).toHaveBeenCalledWith(showLoading());
      expect(dispatch).toHaveBeenCalledWith(clearThreadDetailActionCreator());
      expect(dispatch).toHaveBeenCalledWith(
        receiveThreadDetailActionCreator(fakeThreadDetailResponse),
      );
      expect(dispatch).toHaveBeenCalledWith(hideLoading());
    });

    it('should dispatch action and call alert correctly when data fetching failed', async () => {
      // arrange
      vi.spyOn(api, 'getThreadDetail').mockRejectedValue(fakeErrorResponse);
      const alertMock = vi.spyOn(window, 'alert').mockImplementation(() => {});
      const dispatch = vi.fn();

      // act
      await asyncReceiveThreadDetail('thread-1')(dispatch);

      // assert
      expect(dispatch).toHaveBeenCalledWith(showLoading());
      expect(dispatch).toHaveBeenCalledWith(clearThreadDetailActionCreator());
      expect(alertMock).toHaveBeenCalledWith(fakeErrorResponse.message);
      expect(dispatch).toHaveBeenCalledWith(hideLoading());
    });
  });

  describe('asyncAddComment thunk', () => {
    it('should dispatch action correctly when comment creation success', async () => {
      // arrange
      vi.spyOn(api, 'createComment').mockResolvedValue(fakeCommentResponse);
      const dispatch = vi.fn();

      // act
      await asyncAddComment({ threadId: 'thread-1', content: 'Ini adalah komentar tes' })(dispatch);

      // assert
      expect(dispatch).toHaveBeenCalledWith(showLoading());
      expect(dispatch).toHaveBeenCalledWith(addCommentActionCreator(fakeCommentResponse));
      expect(dispatch).toHaveBeenCalledWith(hideLoading());
    });

    it('should dispatch action and call alert correctly when comment creation failed', async () => {
      // arrange
      vi.spyOn(api, 'createComment').mockRejectedValue(fakeErrorResponse);
      const alertMock = vi.spyOn(window, 'alert').mockImplementation(() => {});
      const dispatch = vi.fn();

      // act
      await asyncAddComment({ threadId: 'thread-1', content: 'Ini adalah komentar tes' })(dispatch);

      // assert
      expect(dispatch).toHaveBeenCalledWith(showLoading());
      expect(alertMock).toHaveBeenCalledWith(fakeErrorResponse.message);
      expect(dispatch).toHaveBeenCalledWith(hideLoading());
    });
  });

  describe('asyncToggleUpVoteThreadDetail thunk', () => {
    it('should alert prompt when guest (authUser is null)', async () => {
      // arrange
      const alertMock = vi.spyOn(window, 'alert').mockImplementation(() => {});
      const dispatch = vi.fn();
      const getState = () => ({ authUser: null, threadDetail: null });

      // act
      await asyncToggleUpVoteThreadDetail('thread-1')(dispatch, getState);

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
        threadDetail: { id: 'thread-1', upVotesBy: [], downVotesBy: [] },
      });

      // act
      await asyncToggleUpVoteThreadDetail('thread-1')(dispatch, getState);

      // assert
      expect(dispatch).toHaveBeenCalledWith(
        toggleUpVoteThreadDetailActionCreator('user-1'),
      );
      expect(api.upVoteThread).toHaveBeenCalledWith('thread-1');
    });

    it('should dispatch optimistic toggle action and call api.neutralizeThreadVote when thread already upvoted', async () => {
      // arrange
      vi.spyOn(api, 'neutralizeThreadVote').mockResolvedValue({});
      const dispatch = vi.fn();
      const getState = () => ({
        authUser: { id: 'user-1' },
        threadDetail: { id: 'thread-1', upVotesBy: ['user-1'], downVotesBy: [] },
      });

      // act
      await asyncToggleUpVoteThreadDetail('thread-1')(dispatch, getState);

      // assert
      expect(dispatch).toHaveBeenCalledWith(
        toggleUpVoteThreadDetailActionCreator('user-1'),
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
        threadDetail: { id: 'thread-1', upVotesBy: [], downVotesBy: [] },
      });

      // act
      await asyncToggleUpVoteThreadDetail('thread-1')(dispatch, getState);

      // assert
      expect(dispatch).toHaveBeenNthCalledWith(
        1,
        toggleUpVoteThreadDetailActionCreator('user-1'),
      );
      expect(alertMock).toHaveBeenCalledWith(fakeErrorResponse.message);
      expect(dispatch).toHaveBeenNthCalledWith(
        2,
        toggleUpVoteThreadDetailActionCreator('user-1'),
      );
    });
  });

  describe('asyncToggleDownVoteThreadDetail thunk', () => {
    it('should alert prompt when guest (authUser is null)', async () => {
      // arrange
      const alertMock = vi.spyOn(window, 'alert').mockImplementation(() => {});
      const dispatch = vi.fn();
      const getState = () => ({ authUser: null, threadDetail: null });

      // act
      await asyncToggleDownVoteThreadDetail('thread-1')(dispatch, getState);

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
        threadDetail: { id: 'thread-1', upVotesBy: [], downVotesBy: [] },
      });

      // act
      await asyncToggleDownVoteThreadDetail('thread-1')(dispatch, getState);

      // assert
      expect(dispatch).toHaveBeenCalledWith(
        toggleDownVoteThreadDetailActionCreator('user-1'),
      );
      expect(api.downVoteThread).toHaveBeenCalledWith('thread-1');
    });

    it('should dispatch optimistic toggle action and call api.neutralizeThreadVote when thread already downvoted', async () => {
      // arrange
      vi.spyOn(api, 'neutralizeThreadVote').mockResolvedValue({});
      const dispatch = vi.fn();
      const getState = () => ({
        authUser: { id: 'user-1' },
        threadDetail: { id: 'thread-1', upVotesBy: [], downVotesBy: ['user-1'] },
      });

      // act
      await asyncToggleDownVoteThreadDetail('thread-1')(dispatch, getState);

      // assert
      expect(dispatch).toHaveBeenCalledWith(
        toggleDownVoteThreadDetailActionCreator('user-1'),
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
        threadDetail: { id: 'thread-1', upVotesBy: [], downVotesBy: [] },
      });

      // act
      await asyncToggleDownVoteThreadDetail('thread-1')(dispatch, getState);

      // assert
      expect(dispatch).toHaveBeenNthCalledWith(
        1,
        toggleDownVoteThreadDetailActionCreator('user-1'),
      );
      expect(alertMock).toHaveBeenCalledWith(fakeErrorResponse.message);
      expect(dispatch).toHaveBeenNthCalledWith(
        2,
        toggleDownVoteThreadDetailActionCreator('user-1'),
      );
    });
  });

  describe('asyncToggleUpVoteComment thunk', () => {
    it('should alert prompt when guest (authUser is null)', async () => {
      // arrange
      const alertMock = vi.spyOn(window, 'alert').mockImplementation(() => {});
      const dispatch = vi.fn();
      const getState = () => ({ authUser: null, threadDetail: null });

      // act
      await asyncToggleUpVoteComment({ threadId: 'thread-1', commentId: 'comment-1' })(dispatch, getState);

      // assert
      expect(alertMock).toHaveBeenCalledWith('Silakan masuk terlebih dahulu untuk memberikan vote!');
      expect(dispatch).not.toHaveBeenCalled();
    });

    it('should dispatch optimistic toggle action and call api.upVoteComment when comment not yet upvoted', async () => {
      // arrange
      vi.spyOn(api, 'upVoteComment').mockResolvedValue({});
      const dispatch = vi.fn();
      const getState = () => ({
        authUser: { id: 'user-1' },
        threadDetail: {
          id: 'thread-1',
          comments: [{ id: 'comment-1', upVotesBy: [], downVotesBy: [] }],
        },
      });

      // act
      await asyncToggleUpVoteComment({ threadId: 'thread-1', commentId: 'comment-1' })(dispatch, getState);

      // assert
      expect(dispatch).toHaveBeenCalledWith(
        toggleUpVoteCommentActionCreator({ commentId: 'comment-1', userId: 'user-1' }),
      );
      expect(api.upVoteComment).toHaveBeenCalledWith({ threadId: 'thread-1', commentId: 'comment-1' });
    });

    it('should dispatch optimistic toggle action and call api.neutralizeCommentVote when comment already upvoted', async () => {
      // arrange
      vi.spyOn(api, 'neutralizeCommentVote').mockResolvedValue({});
      const dispatch = vi.fn();
      const getState = () => ({
        authUser: { id: 'user-1' },
        threadDetail: {
          id: 'thread-1',
          comments: [{ id: 'comment-1', upVotesBy: ['user-1'], downVotesBy: [] }],
        },
      });

      // act
      await asyncToggleUpVoteComment({ threadId: 'thread-1', commentId: 'comment-1' })(dispatch, getState);

      // assert
      expect(dispatch).toHaveBeenCalledWith(
        toggleUpVoteCommentActionCreator({ commentId: 'comment-1', userId: 'user-1' }),
      );
      expect(api.neutralizeCommentVote).toHaveBeenCalledWith({ threadId: 'thread-1', commentId: 'comment-1' });
    });

    it('should rollback toggle action and alert error message when api call fails', async () => {
      // arrange
      vi.spyOn(api, 'upVoteComment').mockRejectedValue(fakeErrorResponse);
      const alertMock = vi.spyOn(window, 'alert').mockImplementation(() => {});
      const dispatch = vi.fn();
      const getState = () => ({
        authUser: { id: 'user-1' },
        threadDetail: {
          id: 'thread-1',
          comments: [{ id: 'comment-1', upVotesBy: [], downVotesBy: [] }],
        },
      });

      // act
      await asyncToggleUpVoteComment({ threadId: 'thread-1', commentId: 'comment-1' })(dispatch, getState);

      // assert
      expect(dispatch).toHaveBeenNthCalledWith(
        1,
        toggleUpVoteCommentActionCreator({ commentId: 'comment-1', userId: 'user-1' }),
      );
      expect(alertMock).toHaveBeenCalledWith(fakeErrorResponse.message);
      expect(dispatch).toHaveBeenNthCalledWith(
        2,
        toggleUpVoteCommentActionCreator({ commentId: 'comment-1', userId: 'user-1' }),
      );
    });
  });

  describe('asyncToggleDownVoteComment thunk', () => {
    it('should alert prompt when guest (authUser is null)', async () => {
      // arrange
      const alertMock = vi.spyOn(window, 'alert').mockImplementation(() => {});
      const dispatch = vi.fn();
      const getState = () => ({ authUser: null, threadDetail: null });

      // act
      await asyncToggleDownVoteComment({ threadId: 'thread-1', commentId: 'comment-1' })(dispatch, getState);

      // assert
      expect(alertMock).toHaveBeenCalledWith('Silakan masuk terlebih dahulu untuk memberikan vote!');
      expect(dispatch).not.toHaveBeenCalled();
    });

    it('should dispatch optimistic toggle action and call api.downVoteComment when comment not yet downvoted', async () => {
      // arrange
      vi.spyOn(api, 'downVoteComment').mockResolvedValue({});
      const dispatch = vi.fn();
      const getState = () => ({
        authUser: { id: 'user-1' },
        threadDetail: {
          id: 'thread-1',
          comments: [{ id: 'comment-1', upVotesBy: [], downVotesBy: [] }],
        },
      });

      // act
      await asyncToggleDownVoteComment({ threadId: 'thread-1', commentId: 'comment-1' })(dispatch, getState);

      // assert
      expect(dispatch).toHaveBeenCalledWith(
        toggleDownVoteCommentActionCreator({ commentId: 'comment-1', userId: 'user-1' }),
      );
      expect(api.downVoteComment).toHaveBeenCalledWith({ threadId: 'thread-1', commentId: 'comment-1' });
    });

    it('should dispatch optimistic toggle action and call api.neutralizeCommentVote when comment already downvoted', async () => {
      // arrange
      vi.spyOn(api, 'neutralizeCommentVote').mockResolvedValue({});
      const dispatch = vi.fn();
      const getState = () => ({
        authUser: { id: 'user-1' },
        threadDetail: {
          id: 'thread-1',
          comments: [{ id: 'comment-1', upVotesBy: [], downVotesBy: ['user-1'] }],
        },
      });

      // act
      await asyncToggleDownVoteComment({ threadId: 'thread-1', commentId: 'comment-1' })(dispatch, getState);

      // assert
      expect(dispatch).toHaveBeenCalledWith(
        toggleDownVoteCommentActionCreator({ commentId: 'comment-1', userId: 'user-1' }),
      );
      expect(api.neutralizeCommentVote).toHaveBeenCalledWith({ threadId: 'thread-1', commentId: 'comment-1' });
    });

    it('should rollback toggle action and alert error message when api call fails', async () => {
      // arrange
      vi.spyOn(api, 'downVoteComment').mockRejectedValue(fakeErrorResponse);
      const alertMock = vi.spyOn(window, 'alert').mockImplementation(() => {});
      const dispatch = vi.fn();
      const getState = () => ({
        authUser: { id: 'user-1' },
        threadDetail: {
          id: 'thread-1',
          comments: [{ id: 'comment-1', upVotesBy: [], downVotesBy: [] }],
        },
      });

      // act
      await asyncToggleDownVoteComment({ threadId: 'thread-1', commentId: 'comment-1' })(dispatch, getState);

      // assert
      expect(dispatch).toHaveBeenNthCalledWith(
        1,
        toggleDownVoteCommentActionCreator({ commentId: 'comment-1', userId: 'user-1' }),
      );
      expect(alertMock).toHaveBeenCalledWith(fakeErrorResponse.message);
      expect(dispatch).toHaveBeenNthCalledWith(
        2,
        toggleDownVoteCommentActionCreator({ commentId: 'comment-1', userId: 'user-1' }),
      );
    });
  });
});
