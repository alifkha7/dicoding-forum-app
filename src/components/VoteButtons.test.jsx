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
} from '@testing-library/react';
import VoteButtons from './VoteButtons';

/**
 * test scenario for VoteButtons component
 *
 * - VoteButtons component
 *  - should render up-vote and down-vote counts correctly
 *  - should alert guest user when clicking vote without authUser
 *  - should call upVote and downVote handler with id when authenticated
 *  - should highlight active up-vote and down-vote styling based on authUser
 */
describe('VoteButtons component', () => {
  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it('should render up-vote and down-vote counts correctly', () => {
    // arrange & act
    render(
      <VoteButtons
        id="item-1"
        upVotesBy={['user-1', 'user-2']}
        downVotesBy={['user-3']}
      />,
    );

    // assert
    expect(screen.getByLabelText('Up votes')).toHaveTextContent('2');
    expect(screen.getByLabelText('Down votes')).toHaveTextContent('1');
  });

  it('should alert guest user when clicking vote without authUser', () => {
    // arrange
    const alertMock = vi.spyOn(window, 'alert').mockImplementation(() => {});
    const upVoteMock = vi.fn();
    const downVoteMock = vi.fn();

    render(
      <VoteButtons
        id="item-1"
        upVotesBy={[]}
        downVotesBy={[]}
        upVote={upVoteMock}
        downVote={downVoteMock}
        authUser={null}
      />,
    );

    // act
    fireEvent.click(screen.getByLabelText('Up votes'));
    fireEvent.click(screen.getByLabelText('Down votes'));

    // assert
    expect(alertMock).toHaveBeenCalledTimes(2);
    expect(alertMock).toHaveBeenCalledWith('Silakan masuk terlebih dahulu untuk memberikan vote!');
    expect(upVoteMock).not.toHaveBeenCalled();
    expect(downVoteMock).not.toHaveBeenCalled();
  });

  it('should call upVote and downVote handler with id when authenticated', () => {
    // arrange
    const upVoteMock = vi.fn();
    const downVoteMock = vi.fn();
    const fakeAuthUser = { id: 'user-1', name: 'John Doe' };

    render(
      <VoteButtons
        id="item-1"
        upVotesBy={[]}
        downVotesBy={[]}
        upVote={upVoteMock}
        downVote={downVoteMock}
        authUser={fakeAuthUser}
      />,
    );

    // act
    fireEvent.click(screen.getByLabelText('Up votes'));
    fireEvent.click(screen.getByLabelText('Down votes'));

    // assert
    expect(upVoteMock).toHaveBeenCalledWith('item-1');
    expect(downVoteMock).toHaveBeenCalledWith('item-1');
  });

  it('should highlight active up-vote and down-vote styling based on authUser', () => {
    // arrange & act
    const fakeAuthUser = { id: 'user-1', name: 'John Doe' };
    const { rerender } = render(
      <VoteButtons
        id="item-1"
        upVotesBy={['user-1']}
        downVotesBy={[]}
        authUser={fakeAuthUser}
      />,
    );

    // assert up-vote active
    const upVoteBtn = screen.getByLabelText('Up votes');
    expect(upVoteBtn.className).toContain('text-blue-600');

    // rerender with down-vote active
    rerender(
      <VoteButtons
        id="item-1"
        upVotesBy={[]}
        downVotesBy={['user-1']}
        authUser={fakeAuthUser}
      />,
    );

    const downVoteBtn = screen.getByLabelText('Down votes');
    expect(downVoteBtn.className).toContain('text-rose-600');
  });
});
