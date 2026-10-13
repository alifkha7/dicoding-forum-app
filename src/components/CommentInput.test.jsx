import React from 'react';
import {
  describe,
  it,
  expect,
  afterEach,
  vi,
} from 'vitest';
import {
  cleanup,
  render,
  screen,
  fireEvent,
  act,
} from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import CommentInput from './CommentInput';
import authUserReducer from '../states/authUser/reducer';

/**
 * test scenario for CommentInput component
 *
 * - CommentInput component
 *  - should render login prompt when guest (authUser is null)
 *  - should render comment textarea and submit button when user is logged in
 *  - should handle comment typing and call addComment function on submit
 */

function renderWithStore(ui, { initialState } = {}) {
  const store = configureStore({
    reducer: {
      authUser: authUserReducer,
    },
    preloadedState: initialState,
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

describe('CommentInput component', () => {
  afterEach(() => {
    cleanup();
  });

  it('should render login prompt when guest (authUser is null)', () => {
    // arrange & act
    renderWithStore(<CommentInput addComment={() => {}} />, {
      initialState: { authUser: null },
    });

    // assert
    expect(screen.getByText(/Silakan/i)).toBeInTheDocument();
    const loginLink = screen.getByRole('link', { name: 'Masuk' });
    expect(loginLink).toBeInTheDocument();
    expect(loginLink).toHaveAttribute('href', '/login');
  });

  it('should render comment textarea and submit button when user is logged in', () => {
    // arrange & act
    renderWithStore(<CommentInput addComment={() => {}} />, {
      initialState: {
        authUser: { id: 'user-1', name: 'John Doe' },
      },
    });

    // assert
    expect(screen.getByLabelText(/Beri Komentar/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Kirim Komentar' })).toBeInTheDocument();
  });

  it('should handle comment typing and call addComment function on submit', async () => {
    // arrange
    const mockAddComment = vi.fn().mockResolvedValue({ success: true });
    renderWithStore(<CommentInput addComment={mockAddComment} />, {
      initialState: {
        authUser: { id: 'user-1', name: 'John Doe' },
      },
    });

    const textarea = screen.getByPlaceholderText('Tuliskan komentar Anda di sini...');
    const submitButton = screen.getByRole('button', { name: 'Kirim Komentar' });

    // act
    fireEvent.change(textarea, { target: { value: 'Komentar baru yang menarik' } });
    expect(textarea.value).toBe('Komentar baru yang menarik');

    await act(async () => {
      fireEvent.click(submitButton);
    });

    // assert
    expect(mockAddComment).toHaveBeenCalledWith({
      content: 'Komentar baru yang menarik',
    });
    expect(textarea.value).toBe('');
  });
});
