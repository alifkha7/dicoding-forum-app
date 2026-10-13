import React from 'react';
import {
  describe,
  it,
  expect,
  vi,
} from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import Navbar from './Navbar';
import authUserReducer from '../states/authUser/reducer';

function renderWithStore(ui, { initialState } = {}) {
  const store = configureStore({
    reducer: {
      authUser: authUserReducer,
    },
    preloadedState: initialState,
  });
  const spyDispatch = vi.spyOn(store, 'dispatch');

  return {
    ...render(
      <Provider store={store}>
        <BrowserRouter>
          {ui}
        </BrowserRouter>
      </Provider>,
    ),
    store,
    spyDispatch,
  };
}

describe('Navbar component', () => {
  it('should render the forum brand logo properly', () => {
    renderWithStore(<Navbar />);

    const logoLink = screen.getByRole('link', { name: /Dicoding Forum/i });
    expect(logoLink).toBeInTheDocument();
    expect(logoLink).toHaveAttribute('href', '/');
  });

  it('should render navigation links for Threads and Leaderboards', () => {
    renderWithStore(<Navbar />);

    const threadsLink = screen.getByRole('link', { name: /Threads/i });
    expect(threadsLink).toBeInTheDocument();
    expect(threadsLink).toHaveAttribute('href', '/');

    const leaderboardsLink = screen.getByRole('link', { name: /Leaderboards/i });
    expect(leaderboardsLink).toBeInTheDocument();
    expect(leaderboardsLink).toHaveAttribute('href', '/leaderboards');
  });

  it('should render authentication links for Masuk and Daftar when not authenticated', () => {
    renderWithStore(<Navbar />);

    const loginLink = screen.getByRole('link', { name: /Masuk/i });
    expect(loginLink).toBeInTheDocument();
    expect(loginLink).toHaveAttribute('href', '/login');

    const registerLink = screen.getByRole('link', { name: /Daftar/i });
    expect(registerLink).toBeInTheDocument();
    expect(registerLink).toHaveAttribute('href', '/register');
  });

  it('should render user avatar, name, and logout button when authenticated', () => {
    const fakeUser = {
      id: 'user-1',
      name: 'John Doe',
      email: 'john@example.com',
      avatar: 'https://generated-image-url.jpg',
    };

    const { spyDispatch } = renderWithStore(<Navbar />, {
      initialState: { authUser: fakeUser },
    });

    const userAvatar = screen.getByAltText('John Doe');
    expect(userAvatar).toBeInTheDocument();
    expect(userAvatar).toHaveAttribute('src', 'https://generated-image-url.jpg');

    expect(screen.getByText('John Doe')).toBeInTheDocument();

    const createThreadLink = screen.getByRole('link', { name: /Buat Diskusi/i });
    expect(createThreadLink).toBeInTheDocument();
    expect(createThreadLink).toHaveAttribute('href', '/new');

    const logoutButton = screen.getByRole('button', { name: /Logout/i });
    expect(logoutButton).toBeInTheDocument();

    fireEvent.click(logoutButton);
    expect(spyDispatch).toHaveBeenCalled();
  });
});
