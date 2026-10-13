import React from 'react';
import {
  describe,
  it,
  expect,
  vi,
  beforeEach,
} from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import RegisterPage from './RegisterPage';
import authUserReducer from '../states/authUser/reducer';
import * as usersAction from '../states/users/action';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

function renderWithStore(ui, { preloadedState = {} } = {}) {
  const store = configureStore({
    reducer: {
      authUser: authUserReducer,
    },
    preloadedState,
  });

  return {
    ...render(
      <Provider store={store}>
        <BrowserRouter>
          {ui}
        </BrowserRouter>
      </Provider>,
    ),
    store,
  };
}

describe('RegisterPage component', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    mockNavigate.mockReset();
  });

  it('should render form elements properly', () => {
    renderWithStore(<RegisterPage />);

    expect(screen.getByRole('heading', { name: /Daftar Akun Baru/i })).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Nama Anda')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('email@example.com')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Minimal 6 karakter')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Daftar' })).toBeInTheDocument();
    expect(screen.getByText('Masuk di sini')).toBeInTheDocument();
  });

  it('should redirect to / if user is already authenticated', () => {
    renderWithStore(<RegisterPage />, {
      preloadedState: {
        authUser: { id: 'user-1', name: 'John Doe' },
      },
    });

    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  it('should dispatch asyncRegisterUser and navigate to /login on successful registration', async () => {
    vi.spyOn(usersAction, 'asyncRegisterUser').mockReturnValue(
      () => Promise.resolve({ success: true }),
    );
    const alertMock = vi.spyOn(window, 'alert').mockImplementation(() => {});

    renderWithStore(<RegisterPage />);

    fireEvent.change(screen.getByPlaceholderText('Nama Anda'), {
      target: { value: 'John Doe' },
    });
    fireEvent.change(screen.getByPlaceholderText('email@example.com'), {
      target: { value: 'john@example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText('Minimal 6 karakter'), {
      target: { value: 'secret123' },
    });

    fireEvent.click(screen.getByRole('button', { name: 'Daftar' }));

    expect(usersAction.asyncRegisterUser).toHaveBeenCalledWith({
      name: 'John Doe',
      email: 'john@example.com',
      password: 'secret123',
    });

    // Wait microtask for async completion
    await Promise.resolve();

    expect(alertMock).toHaveBeenCalledWith('Akun berhasil dibuat! Silakan masuk.');
    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });

  it('should not navigate to /login when registration fails', async () => {
    vi.spyOn(usersAction, 'asyncRegisterUser').mockReturnValue(
      () => Promise.resolve({ success: false, error: 'Registration failed' }),
    );

    renderWithStore(<RegisterPage />);

    fireEvent.change(screen.getByPlaceholderText('Nama Anda'), {
      target: { value: 'Jane Doe' },
    });
    fireEvent.change(screen.getByPlaceholderText('email@example.com'), {
      target: { value: 'jane@example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText('Minimal 6 karakter'), {
      target: { value: 'secret123' },
    });

    fireEvent.click(screen.getByRole('button', { name: 'Daftar' }));

    expect(usersAction.asyncRegisterUser).toHaveBeenCalledWith({
      name: 'Jane Doe',
      email: 'jane@example.com',
      password: 'secret123',
    });

    await Promise.resolve();

    expect(mockNavigate).not.toHaveBeenCalledWith('/login');
  });
});
