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
  asyncReceiveThreadDetail,
  asyncAddComment,
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
});
