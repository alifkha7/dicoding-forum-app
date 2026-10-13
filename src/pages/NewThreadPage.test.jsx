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
import NewThreadPage from './NewThreadPage';
import threadsReducer from '../states/threads/reducer';
import * as threadsAction from '../states/threads/action';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

function renderWithStore(ui) {
  const store = configureStore({
    reducer: {
      threads: threadsReducer,
    },
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

describe('NewThreadPage component', () => {
  it('should render header and thread input form properly', () => {
    renderWithStore(<NewThreadPage />);

    expect(screen.getByRole('heading', { name: /Buat Diskusi Baru/i })).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Judul diskusi')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Kategori diskusi, misal: react, redux')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Tuliskan isi diskusi Anda di sini...')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Buat Diskusi' })).toBeInTheDocument();
  });

  it('should dispatch asyncCreateThread and navigate to / on successful thread creation', async () => {
    vi.spyOn(threadsAction, 'asyncCreateThread').mockReturnValue(
      () => Promise.resolve({ success: true }),
    );

    renderWithStore(<NewThreadPage />);

    fireEvent.change(screen.getByPlaceholderText('Judul diskusi'), {
      target: { value: 'Diskusi Baru Vitest' },
    });
    fireEvent.change(screen.getByPlaceholderText('Kategori diskusi, misal: react, redux'), {
      target: { value: 'testing' },
    });
    fireEvent.change(screen.getByPlaceholderText('Tuliskan isi diskusi Anda di sini...'), {
      target: { value: 'Isi diskusi pengujian unit' },
    });

    fireEvent.click(screen.getByRole('button', { name: 'Buat Diskusi' }));

    expect(threadsAction.asyncCreateThread).toHaveBeenCalledWith({
      title: 'Diskusi Baru Vitest',
      category: 'testing',
      body: 'Isi diskusi pengujian unit',
    });
  });
});
