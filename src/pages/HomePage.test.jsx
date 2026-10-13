import React from 'react';
import {
  describe,
  it,
  expect,
  vi,
  beforeEach,
} from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import HomePage from './HomePage';
import threadsReducer from '../states/threads/reducer';
import usersReducer from '../states/users/reducer';
import authUserReducer from '../states/authUser/reducer';
import categoryReducer from '../states/category/reducer';
import * as sharedAction from '../states/shared/action';
import * as threadsAction from '../states/threads/action';

const fakeThreads = [
  {
    id: 'thread-1',
    title: 'Diskusi React Native',
    body: 'Membahas performa React Native',
    category: 'react',
    createdAt: '2023-01-01T00:00:00.000Z',
    ownerId: 'user-1',
    upVotesBy: [],
    downVotesBy: [],
    totalComments: 2,
  },
  {
    id: 'thread-2',
    title: 'Arsitektur Redux Toolkit',
    body: 'Best practices RTK slice',
    category: 'redux',
    createdAt: '2023-01-02T00:00:00.000Z',
    ownerId: 'user-2',
    upVotesBy: [],
    downVotesBy: [],
    totalComments: 5,
  },
];

const fakeUsers = [
  {
    id: 'user-1',
    name: 'John Doe',
    avatar: 'https://avatar.url/1',
  },
  {
    id: 'user-2',
    name: 'Jane Smith',
    avatar: 'https://avatar.url/2',
  },
];

function renderHomePage({ initialEntries = ['/'], preloadedState = {} } = {}) {
  const store = configureStore({
    reducer: {
      threads: threadsReducer,
      users: usersReducer,
      authUser: authUserReducer,
      category: categoryReducer,
    },
    preloadedState: {
      threads: fakeThreads,
      users: fakeUsers,
      authUser: { id: 'user-1', name: 'John Doe' },
      category: '',
      ...preloadedState,
    },
  });

  const spyDispatch = vi.spyOn(store, 'dispatch');

  const utils = render(
    <Provider store={store}>
      <MemoryRouter initialEntries={initialEntries}>
        <Routes>
          <Route path="/" element={<HomePage />} />
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

describe('HomePage component', () => {
  beforeEach(() => {
    vi.spyOn(sharedAction, 'asyncPopulateUsersAndThreads').mockReturnValue(
      () => Promise.resolve(),
    );
  });

  it('should render header, action button, category chips, and all threads by default', () => {
    renderHomePage();

    expect(screen.getByRole('heading', { name: /Diskusi Terbaru/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Buat Diskusi/i })).toBeInTheDocument();

    expect(screen.getByRole('button', { name: 'Semua' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '#react' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '#redux' })).toBeInTheDocument();

    expect(screen.getByText('Diskusi React Native')).toBeInTheDocument();
    expect(screen.getByText('Arsitektur Redux Toolkit')).toBeInTheDocument();
  });

  it('should filter threads when a category chip is selected and reset when "Semua" is clicked', () => {
    renderHomePage();

    // Select 'react' chip
    fireEvent.click(screen.getByRole('button', { name: '#react' }));

    expect(screen.getByText('Diskusi React Native')).toBeInTheDocument();
    expect(screen.queryByText('Arsitektur Redux Toolkit')).not.toBeInTheDocument();

    // Click 'Semua' to reset
    fireEvent.click(screen.getByRole('button', { name: 'Semua' }));

    expect(screen.getByText('Diskusi React Native')).toBeInTheDocument();
    expect(screen.getByText('Arsitektur Redux Toolkit')).toBeInTheDocument();
  });

  it('should toggle filter off when the active category chip is clicked again', () => {
    renderHomePage();

    // Click 'redux'
    fireEvent.click(screen.getByRole('button', { name: '#redux' }));

    expect(screen.queryByText('Diskusi React Native')).not.toBeInTheDocument();
    expect(screen.getByText('Arsitektur Redux Toolkit')).toBeInTheDocument();

    // Click 'redux' again to toggle off
    fireEvent.click(screen.getByRole('button', { name: '#redux' }));

    expect(screen.getByText('Diskusi React Native')).toBeInTheDocument();
    expect(screen.getByText('Arsitektur Redux Toolkit')).toBeInTheDocument();
  });

  it('should synchronize initial category filter from URL search parameters', () => {
    renderHomePage({ initialEntries: ['/?category=redux'] });

    expect(screen.queryByText('Diskusi React Native')).not.toBeInTheDocument();
    expect(screen.getByText('Arsitektur Redux Toolkit')).toBeInTheDocument();
  });

  it('should dispatch vote actions when vote buttons are clicked', () => {
    vi.spyOn(threadsAction, 'asyncToggleUpVoteThread').mockReturnValue(
      () => Promise.resolve(),
    );
    vi.spyOn(threadsAction, 'asyncToggleDownVoteThread').mockReturnValue(
      () => Promise.resolve(),
    );

    renderHomePage();

    const upVoteButtons = screen.getAllByRole('button', { name: /up vote/i });
    fireEvent.click(upVoteButtons[0]);

    expect(threadsAction.asyncToggleUpVoteThread).toHaveBeenCalledWith('thread-1');
  });
});
