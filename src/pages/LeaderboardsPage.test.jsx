import React from 'react';
import {
  describe,
  it,
  expect,
  vi,
  beforeEach,
  afterEach,
} from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import LeaderboardsPage from './LeaderboardsPage';
import leaderboardsReducer from '../states/leaderboards/reducer';
import * as leaderboardsAction from '../states/leaderboards/action';

/**
 * test scenario for LeaderboardsPage component
 *
 * - LeaderboardsPage component
 *  - should dispatch asyncReceiveLeaderboards on mount
 *  - should render header, column labels, and leaderboard items
 *  - should render empty state message when leaderboards list is empty
 */

const fakeLeaderboards = [
  {
    user: {
      id: 'user-1',
      name: 'Alpha Tester',
      email: 'alpha@example.com',
      avatar: 'https://avatar.url/1',
    },
    score: 120,
  },
  {
    user: {
      id: 'user-2',
      name: 'Beta Tester',
      email: 'beta@example.com',
      avatar: 'https://avatar.url/2',
    },
    score: 95,
  },
];

function renderLeaderboardsPage({ preloadedState = {} } = {}) {
  const store = configureStore({
    reducer: {
      leaderboards: leaderboardsReducer,
    },
    preloadedState: {
      leaderboards: fakeLeaderboards,
      ...preloadedState,
    },
  });

  const spyDispatch = vi.spyOn(store, 'dispatch');

  const utils = render(
    <Provider store={store}>
      <MemoryRouter>
        <Routes>
          <Route path="/" element={<LeaderboardsPage />} />
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

describe('LeaderboardsPage component', () => {
  beforeEach(() => {
    vi.spyOn(leaderboardsAction, 'asyncReceiveLeaderboards').mockReturnValue(
      () => Promise.resolve(),
    );
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it('should dispatch asyncReceiveLeaderboards on mount', () => {
    // arrange & act
    renderLeaderboardsPage();

    // assert
    expect(leaderboardsAction.asyncReceiveLeaderboards).toHaveBeenCalled();
  });

  it('should render header, column labels, and leaderboard items', () => {
    // arrange & act
    renderLeaderboardsPage();

    // assert
    expect(
      screen.getByRole('heading', { name: /Klasemen Pengguna Aktif/i }),
    ).toBeInTheDocument();
    expect(screen.getByText('Pengguna')).toBeInTheDocument();
    expect(screen.getByText('Skor')).toBeInTheDocument();
    expect(screen.getByText('Alpha Tester')).toBeInTheDocument();
    expect(screen.getByText('Beta Tester')).toBeInTheDocument();
    expect(screen.getByText('120')).toBeInTheDocument();
    expect(screen.getByText('95')).toBeInTheDocument();
  });

  it('should render empty state message when leaderboards list is empty', () => {
    // arrange & act
    renderLeaderboardsPage({ preloadedState: { leaderboards: [] } });

    // assert
    expect(
      screen.getByText('Belum ada data klasemen yang tersedia.'),
    ).toBeInTheDocument();
  });
});
