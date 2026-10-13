import React from 'react';
import {
  describe,
  it,
  expect,
  vi,
} from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import store from './states/store';
import api from './utils/api';

describe('App component', () => {
  it('should render the Navbar and Home page content after preload', async () => {
    vi.spyOn(api, 'getOwnProfile').mockRejectedValue(new Error('Unauthorized'));

    render(
      <Provider store={store}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </Provider>,
    );

    await waitFor(() => {
      expect(screen.getByRole('link', { name: /Dicoding Forum/i })).toBeInTheDocument();
      expect(screen.getByText(/Diskusi Terbaru/i)).toBeInTheDocument();
    });
  });
});
