import React from 'react';
import VoteButtons from '../components/VoteButtons';

export default {
  title: 'Components/VoteButtons',
  component: VoteButtons,
  parameters: {
    layout: 'centered',
  },
};

export function Default() {
  return (
    <VoteButtons
      id="thread-1"
      upVotesBy={['user-2', 'user-3']}
      downVotesBy={[]}
      authUser={{ id: 'user-1', name: 'John Doe' }}
      upVote={() => {}}
      downVote={() => {}}
    />
  );
}

export function Upvoted() {
  return (
    <VoteButtons
      id="thread-1"
      upVotesBy={['user-1', 'user-2']}
      downVotesBy={[]}
      authUser={{ id: 'user-1', name: 'John Doe' }}
      upVote={() => {}}
      downVote={() => {}}
    />
  );
}

export function Downvoted() {
  return (
    <VoteButtons
      id="thread-1"
      upVotesBy={['user-2']}
      downVotesBy={['user-1']}
      authUser={{ id: 'user-1', name: 'John Doe' }}
      upVote={() => {}}
      downVote={() => {}}
    />
  );
}

export function Guest() {
  return (
    <VoteButtons
      id="thread-1"
      upVotesBy={['user-2', 'user-3']}
      downVotesBy={['user-4']}
      authUser={null}
      upVote={() => {}}
      downVote={() => {}}
    />
  );
}
