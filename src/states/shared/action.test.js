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
import { receiveUsersActionCreator } from '../users/action';
import { receiveThreadsActionCreator } from '../threads/action';
import { asyncPopulateUsersAndThreads } from './action';

/**
 * test scenario for asyncPopulateUsersAndThreads thunk
 *
 * - asyncPopulateUsersAndThreads thunk
 *  - should dispatch action correctly when data fetching success
 *  - should dispatch action and call alert correctly when data fetching failed
 */

const fakeThreadsResponse = [
  {
    id: 'thread-1',
    title: 'Thread Test 1',
    body: 'Body Test 1',
    category: 'redux',
    createdAt: '2023-05-29T07:55:52.266Z',
    ownerId: 'user-1',
    upVotesBy: ['user-2'],
    downVotesBy: [],
    totalComments: 3,
  },
];

const fakeUsersResponse = [
  {
    id: 'user-1',
    name: 'John Doe',
    email: 'john@example.com',
    avatar: 'https://generated-image-url.jpg',
  },
];

const fakeErrorResponse = new Error('Ups, something went wrong');

describe('asyncPopulateUsersAndThreads thunk', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should dispatch action correctly when data fetching success', async () => {
    // arrange
    vi.spyOn(api, 'getAllUsers').mockResolvedValue(fakeUsersResponse);
    vi.spyOn(api, 'getAllThreads').mockResolvedValue(fakeThreadsResponse);
    const dispatch = vi.fn();

    // act
    await asyncPopulateUsersAndThreads()(dispatch);

    // assert
    expect(dispatch).toHaveBeenCalledWith(showLoading());
    expect(dispatch).toHaveBeenCalledWith(receiveUsersActionCreator(fakeUsersResponse));
    expect(dispatch).toHaveBeenCalledWith(receiveThreadsActionCreator(fakeThreadsResponse));
    expect(dispatch).toHaveBeenCalledWith(hideLoading());
  });

  it('should dispatch action and call alert correctly when data fetching failed', async () => {
    // arrange
    vi.spyOn(api, 'getAllUsers').mockRejectedValue(fakeErrorResponse);
    vi.spyOn(api, 'getAllThreads').mockRejectedValue(fakeErrorResponse);
    const alertMock = vi.spyOn(window, 'alert').mockImplementation(() => {});
    const dispatch = vi.fn();

    // act
    await asyncPopulateUsersAndThreads()(dispatch);

    // assert
    expect(dispatch).toHaveBeenCalledWith(showLoading());
    expect(alertMock).toHaveBeenCalledWith(fakeErrorResponse.message);
    expect(dispatch).toHaveBeenCalledWith(hideLoading());
  });
});
