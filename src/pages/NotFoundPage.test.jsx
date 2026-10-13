import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import NotFoundPage from './NotFoundPage';

describe('NotFoundPage component', () => {
  it('should render 404 heading and not found message properly', () => {
    render(
      <BrowserRouter>
        <NotFoundPage />
      </BrowserRouter>,
    );

    expect(screen.getByRole('heading', { level: 1, name: '404' })).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { level: 2, name: 'Halaman Tidak Ditemukan' }),
    ).toBeInTheDocument();
    expect(
      screen.getByText('Halaman yang Anda tuju tidak ditemukan atau telah dipindahkan.'),
    ).toBeInTheDocument();
  });

  it('should render a link to navigate back to home (/)', () => {
    render(
      <BrowserRouter>
        <NotFoundPage />
      </BrowserRouter>,
    );

    const backHomeLink = screen.getByRole('link', { name: /Kembali ke Beranda/i });
    expect(backHomeLink).toBeInTheDocument();
    expect(backHomeLink).toHaveAttribute('href', '/');
  });
});
