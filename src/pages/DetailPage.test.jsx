import React from 'react';
import {
  describe,
  it,
  expect,
  vi,
  beforeEach,
} from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import DetailPage from './DetailPage';
import threadDetailReducer from '../states/threadDetail/reducer';
import authUserReducer from '../states/authUser/reducer';
import * as threadDetailAction from '../states/threadDetail/action';

const fakeThreadDetail = {
  id: 'thread-1',
  title: 'Judul Pengujian Sanitasi',
  body: '<p>Konten aman<script>alert("xss")</script><img src="x" onerror="alert(1)" alt="xss-img" /></p>',
  category: 'security',
  createdAt: '2023-05-29T07:55:52.266Z',
  owner: {
    id: 'user-1',
    name: 'John Doe',
    avatar: 'https://avatar.url/1',
  },
  upVotesBy: ['user-2'],
  downVotesBy: [],
  comments: [
    {
      id: 'comment-1',
      content: '<p>Komentar aman<script>alert("comment-xss")</script><img src="y" onerror="alert(2)" alt="comment-img" /></p>',
      createdAt: '2023-05-29T08:00:00.000Z',
      owner: {
        id: 'user-2',
        name: 'Jane Smith',
        avatar: 'https://avatar.url/2',
      },
      upVotesBy: [],
      downVotesBy: [],
    },
  ],
};

function renderDetailPage({
  initialEntries = ['/threads/thread-1'],
  preloadedState = {},
} = {}) {
  const store = configureStore({
    reducer: {
      threadDetail: threadDetailReducer,
      authUser: authUserReducer,
    },
    preloadedState: {
      threadDetail: fakeThreadDetail,
      authUser: { id: 'user-1', name: 'John Doe' },
      ...preloadedState,
    },
  });

  const spyDispatch = vi.spyOn(store, 'dispatch');

  const utils = render(
    <Provider store={store}>
      <MemoryRouter initialEntries={initialEntries}>
        <Routes>
          <Route path="/threads/:id" element={<DetailPage />} />
        </Routes>
      </MemoryRouter>
    </Provider>,
  );

  return {
    ...utils,
    store,
    spyDispatch,
  };
}

/**
 * test scenario for DetailPage component
 *
 * - DetailPage component
 *  - should render loading indicator when threadDetail is null
 *  - should dispatch asyncReceiveThreadDetail on mount
 *  - should render thread details and sanitize HTML body with DOMPurify
 *  - should sanitize malicious comment content in comment list
 */
describe('DetailPage component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(threadDetailAction, 'asyncReceiveThreadDetail').mockReturnValue(
      () => Promise.resolve(),
    );
  });

  it('should render loading indicator when threadDetail is null', () => {
    renderDetailPage({
      preloadedState: {
        threadDetail: null,
      },
    });

    expect(screen.getByText('Memuat detail thread...')).toBeInTheDocument();
  });

  it('should dispatch asyncReceiveThreadDetail on mount', () => {
    const { spyDispatch } = renderDetailPage();

    expect(spyDispatch).toHaveBeenCalled();
    expect(threadDetailAction.asyncReceiveThreadDetail).toHaveBeenCalledWith('thread-1');
  });

  it('should render thread details and sanitize HTML body with DOMPurify', () => {
    renderDetailPage();

    expect(screen.getByRole('heading', { name: 'Judul Pengujian Sanitasi' })).toBeInTheDocument();
    expect(screen.getByText('Konten aman')).toBeInTheDocument();
    expect(document.querySelector('script')).toBeNull();

    const imgElement = screen.getByAltText('xss-img');
    expect(imgElement).toBeInTheDocument();
    expect(imgElement).not.toHaveAttribute('onerror');
  });

  it('should sanitize malicious comment content in comment list', () => {
    renderDetailPage();

    expect(screen.getByText('Komentar aman')).toBeInTheDocument();
    const commentImg = screen.getByAltText('comment-img');
    expect(commentImg).toBeInTheDocument();
    expect(commentImg).not.toHaveAttribute('onerror');
  });
});
