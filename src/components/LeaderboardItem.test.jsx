import React from 'react';
import {
  describe,
  it,
  expect,
  afterEach,
} from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import LeaderboardItem from './LeaderboardItem';

/**
 * test scenario for LeaderboardItem component
 *
 * - LeaderboardItem component
 *  - should render user details, rank badge, and score correctly for top rank
 *  - should render numerical rank badge correctly for rank greater than 3
 */
describe('LeaderboardItem component', () => {
  afterEach(() => {
    cleanup();
  });

  const fakeUser = {
    id: 'user-1',
    name: 'Dicoding Master',
    email: 'master@dicoding.com',
    avatar: 'https://ui-avatars.com/api/?name=Dicoding+Master',
  };

  it('should render user details, rank badge, and score correctly for top rank', () => {
    // arrange & act
    render(
      <LeaderboardItem
        rank={1}
        user={fakeUser}
        score={150}
      />,
    );

    // assert
    expect(screen.getByText('Dicoding Master')).toBeInTheDocument();
    expect(screen.getByText('master@dicoding.com')).toBeInTheDocument();
    expect(screen.getByText('150')).toBeInTheDocument();

    const avatar = screen.getByAltText('Dicoding Master');
    expect(avatar).toBeInTheDocument();
    expect(avatar).toHaveAttribute('src', fakeUser.avatar);

    expect(screen.getByLabelText('Peringkat 1')).toBeInTheDocument();
  });

  it('should render numerical rank badge correctly for rank greater than 3', () => {
    // arrange & act
    render(
      <LeaderboardItem
        rank={5}
        user={fakeUser}
        score={42}
      />,
    );

    // assert
    expect(screen.getByLabelText('Peringkat 5')).toHaveTextContent('5');
    expect(screen.getByText('42')).toBeInTheDocument();
  });
});
