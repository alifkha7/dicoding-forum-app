import React from 'react';
import {
  describe,
  it,
  expect,
  afterEach,
} from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ThreadItem from './ThreadItem';

/**
 * test scenario for ThreadItem component
 *
 * - ThreadItem component
 *  - should render thread details correctly
 *  - should link to thread detail route
 */
describe('ThreadItem component', () => {
  afterEach(() => {
    cleanup();
  });

  const fakeThread = {
    id: 'thread-1',
    title: 'Pengenalan Redux Toolkit',
    body: 'Redux Toolkit mempermudah penulisan Redux dengan best practice bawaan.',
    category: 'redux',
    createdAt: '2023-05-29T07:55:52.266Z',
    upVotesBy: ['user-1', 'user-2'],
    downVotesBy: ['user-3'],
    totalComments: 5,
    user: {
      id: 'user-author',
      name: 'John Developer',
      avatar: 'https://generated-image-url.jpg',
    },
  };

  it('should render thread details correctly', () => {
    // arrange & act
    render(
      <BrowserRouter>
        <ThreadItem
          id={fakeThread.id}
          title={fakeThread.title}
          body={fakeThread.body}
          category={fakeThread.category}
          createdAt={fakeThread.createdAt}
          upVotesBy={fakeThread.upVotesBy}
          downVotesBy={fakeThread.downVotesBy}
          totalComments={fakeThread.totalComments}
          user={fakeThread.user}
        />
      </BrowserRouter>,
    );

    // assert
    expect(screen.getByText('Pengenalan Redux Toolkit')).toBeInTheDocument();
    expect(screen.getByText('#redux')).toBeInTheDocument();
    expect(screen.getByText(/Redux Toolkit mempermudah penulisan Redux/i)).toBeInTheDocument();
    expect(screen.getByText('John Developer')).toBeInTheDocument();

    const avatarImage = screen.getByAltText('John Developer');
    expect(avatarImage).toBeInTheDocument();
    expect(avatarImage).toHaveAttribute('src', 'https://generated-image-url.jpg');

    expect(screen.getByLabelText('Up votes')).toHaveTextContent('2');
    expect(screen.getByLabelText('Down votes')).toHaveTextContent('1');
    expect(screen.getByLabelText('Total komentar')).toHaveTextContent('5');
  });

  it('should link to thread detail route', () => {
    // arrange & act
    render(
      <BrowserRouter>
        <ThreadItem
          id={fakeThread.id}
          title={fakeThread.title}
          body={fakeThread.body}
          category={fakeThread.category}
          createdAt={fakeThread.createdAt}
          upVotesBy={fakeThread.upVotesBy}
          downVotesBy={fakeThread.downVotesBy}
          totalComments={fakeThread.totalComments}
          user={fakeThread.user}
        />
      </BrowserRouter>,
    );

    // assert
    const titleLink = screen.getByRole('link', { name: 'Pengenalan Redux Toolkit' });
    expect(titleLink).toBeInTheDocument();
    expect(titleLink).toHaveAttribute('href', '/threads/thread-1');
  });
});
