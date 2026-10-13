/* eslint-disable react/no-danger */
import React from 'react';
import VoteButtons from './VoteButtons';
import { postedAt } from '../utils';

function CommentItem({
  id,
  content,
  createdAt,
  owner = {},
  upVotesBy = [],
  downVotesBy = [],
  upVote = null,
  downVote = null,
  authUser = null,
}) {
  const authorName = owner?.name || 'Anonim';
  const authorAvatar = owner?.avatar || 'https://ui-avatars.com/api/?name=User';

  return (
    <article className="p-4 bg-white rounded-lg border border-gray-100 shadow-sm space-y-3">
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <img
            src={authorAvatar}
            alt={authorName}
            className="w-7 h-7 rounded-full object-cover border border-gray-200"
          />
          <span className="text-sm font-semibold text-gray-800">
            {authorName}
          </span>
        </div>
        <span className="text-xs text-gray-400 font-medium">
          {postedAt(createdAt)}
        </span>
      </header>

      <div
        className="text-sm text-gray-700 leading-relaxed break-words"
        dangerouslySetInnerHTML={{ __html: content }}
      />

      <footer className="flex items-center gap-4 pt-1 text-xs text-gray-500">
        <VoteButtons
          id={id}
          upVotesBy={upVotesBy}
          downVotesBy={downVotesBy}
          upVote={upVote}
          downVote={downVote}
          authUser={authUser}
        />
      </footer>
    </article>
  );
}

export default CommentItem;
