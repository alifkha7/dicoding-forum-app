import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Navbar from './Navbar';

describe('Navbar component', () => {
  it('should render the forum brand logo properly', () => {
    render(
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>,
    );

    const logoLink = screen.getByRole('link', { name: /Dicoding Forum/i });
    expect(logoLink).toBeInTheDocument();
    expect(logoLink).toHaveAttribute('href', '/');
  });

  it('should render navigation links for Threads and Leaderboards', () => {
    render(
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>,
    );

    const threadsLink = screen.getByRole('link', { name: /Threads/i });
    expect(threadsLink).toBeInTheDocument();
    expect(threadsLink).toHaveAttribute('href', '/');

    const leaderboardsLink = screen.getByRole('link', { name: /Leaderboards/i });
    expect(leaderboardsLink).toBeInTheDocument();
    expect(leaderboardsLink).toHaveAttribute('href', '/leaderboards');
  });

  it('should render authentication links for Masuk and Daftar', () => {
    render(
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>,
    );

    const loginLink = screen.getByRole('link', { name: /Masuk/i });
    expect(loginLink).toBeInTheDocument();
    expect(loginLink).toHaveAttribute('href', '/login');

    const registerLink = screen.getByRole('link', { name: /Daftar/i });
    expect(registerLink).toBeInTheDocument();
    expect(registerLink).toHaveAttribute('href', '/register');
  });
});
