import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import store from './states/store';

describe('App component', () => {
  it('should render the Navbar and Home page content by default', () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </Provider>,
    );

    expect(screen.getByRole('link', { name: /Dicoding Forum/i })).toBeInTheDocument();
    expect(screen.getByText(/Diskusi Terbaru/i)).toBeInTheDocument();
  });
});
