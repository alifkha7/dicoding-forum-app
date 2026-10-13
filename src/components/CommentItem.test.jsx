import React from 'react';
import {
  describe,
  it,
  expect,
  afterEach,
} from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import CommentItem from './CommentItem';

/**
 * test scenario for CommentItem component
 *
 * - CommentItem component
 *  - should render author name, comment content, and vote counts correctly
 */
describe('CommentItem component', () => {
  afterEach(() => {
    cleanup();
  });

  const fakeComment = {
    id: 'comment-1',
    content: 'Ini adalah komentar pengujian',
    createdAt: '2023-05-29T07:55:52.266Z',
    owner: {
      id: 'user-1',
      name: 'Jane Doe',
      avatar: 'https://generated-image-url.jpg',
    },
    upVotesBy: ['user-2'],
    downVotesBy: ['user-3', 'user-4'],
  };

  it('should render author name, comment content, and vote counts correctly', () => {
    // arrange & act
    render(
      <CommentItem
        content={fakeComment.content}
        createdAt={fakeComment.createdAt}
        owner={fakeComment.owner}
        upVotesBy={fakeComment.upVotesBy}
        downVotesBy={fakeComment.downVotesBy}
      />,
    );

    // assert
    expect(screen.getByText('Jane Doe')).toBeInTheDocument();
    expect(screen.getByText('Ini adalah komentar pengujian')).toBeInTheDocument();

    const avatarImage = screen.getByAltText('Jane Doe');
    expect(avatarImage).toBeInTheDocument();
    expect(avatarImage).toHaveAttribute('src', 'https://generated-image-url.jpg');

    expect(screen.getByLabelText('Up votes')).toHaveTextContent('1');
    expect(screen.getByLabelText('Down votes')).toHaveTextContent('2');
  });
});
