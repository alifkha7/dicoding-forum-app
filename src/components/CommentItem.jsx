/* eslint-disable react/no-danger */
import React from 'react';
import { ThumbsUp, ThumbsDown } from 'lucide-react';
import { postedAt } from '../utils';

function CommentItem({
  content,
  createdAt,
  owner = {},
  upVotesBy = [],
  downVotesBy = [],
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
        <div className="flex items-center gap-1" title="Up votes" aria-label="Up votes">
          <ThumbsUp className="w-3.5 h-3.5 text-gray-400" />
          <span>{upVotesBy.length}</span>
        </div>
        <div className="flex items-center gap-1" title="Down votes" aria-label="Down votes">
          <ThumbsDown className="w-3.5 h-3.5 text-gray-400" />
          <span>{downVotesBy.length}</span>
        </div>
      </footer>
    </article>
  );
}

export default CommentItem;
