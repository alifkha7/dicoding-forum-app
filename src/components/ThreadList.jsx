import React from 'react';
import ThreadItem from './ThreadItem';

function ThreadList({
  threads = [],
  upVote = null,
  downVote = null,
  authUser = null,
}) {
  if (!threads.length) {
    return (
      <div className="py-12 text-center bg-white rounded-xl border border-gray-200 shadow-sm">
        <p className="text-gray-500 text-sm font-medium">Tidak ada diskusi yang ditemukan.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {threads.map((thread) => (
        <ThreadItem
          key={thread.id}
          id={thread.id}
          title={thread.title}
          body={thread.body}
          category={thread.category}
          createdAt={thread.createdAt}
          upVotesBy={thread.upVotesBy}
          downVotesBy={thread.downVotesBy}
          totalComments={thread.totalComments}
          user={thread.user}
          upVote={upVote}
          downVote={downVote}
          authUser={authUser}
        />
      ))}
    </div>
  );
}

export default ThreadList;
