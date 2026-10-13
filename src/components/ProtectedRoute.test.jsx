import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import ProtectedRoute from './ProtectedRoute';
import authUserReducer from '../states/authUser/reducer';

function renderWithStoreAndRouter(
  ui,
  { initialState = {}, initialEntries = ['/protected'] } = {},
) {
  const store = configureStore({
    reducer: {
      authUser: authUserReducer,
    },
    preloadedState: initialState,
  });

  return render(
    <Provider store={store}>
      <MemoryRouter initialEntries={initialEntries}>
        <Routes>
          <Route path="/login" element={<div>Login Page</div>} />
          <Route path="/protected" element={ui} />
        </Routes>
      </MemoryRouter>
    </Provider>,
  );
}

describe('ProtectedRoute component', () => {
  it('should redirect to /login when authUser is null', () => {
    renderWithStoreAndRouter(
      <ProtectedRoute>
        <div>Protected Content</div>
      </ProtectedRoute>,
      { initialState: { authUser: null } },
    );

    expect(screen.getByText('Login Page')).toBeInTheDocument();
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
  });

  it('should render children when authUser is present', () => {
    const fakeAuthUser = {
      id: 'user-1',
      name: 'John Doe',
      email: 'john@example.com',
    };

    renderWithStoreAndRouter(
      <ProtectedRoute>
        <div>Protected Content</div>
      </ProtectedRoute>,
      { initialState: { authUser: fakeAuthUser } },
    );

    expect(screen.getByText('Protected Content')).toBeInTheDocument();
    expect(screen.queryByText('Login Page')).not.toBeInTheDocument();
  });
});
