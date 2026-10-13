import React from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare, ThumbsUp, ThumbsDown } from 'lucide-react';
import { postedAt } from '../utils';

function stripHtml(html = '') {
  return html.replace(/<[^>]*>?/gm, '');
}

function ThreadItem({
  id,
  title,
  body,
  category,
  createdAt,
  upVotesBy = [],
  downVotesBy = [],
  totalComments = 0,
  user = {},
}) {
  const authorName = user?.name || 'Anonim';
  const authorAvatar = user?.avatar || 'https://ui-avatars.com/api/?name=User';
  const bodySnippet = stripHtml(body);

  return (
    <article className="p-5 bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
      <header className="flex flex-wrap items-center justify-between gap-2 mb-2">
        {category ? (
          <span className="inline-block px-2.5 py-0.5 text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-200 rounded-full">
            {`#${category}`}
          </span>
        ) : <span />}
        <span className="text-xs text-gray-500 font-medium">
          {postedAt(createdAt)}
        </span>
      </header>

      <h2 className="text-lg font-bold text-gray-900 mb-2 hover:text-blue-600 transition-colors">
        <Link to={`/threads/${id}`} className="hover:underline">
          {title}
        </Link>
      </h2>

      <p className="text-sm text-gray-600 mb-4 line-clamp-3">
        {bodySnippet}
      </p>

      <footer className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-gray-100">
        <div className="flex items-center gap-2">
          <img
            src={authorAvatar}
            alt={authorName}
            className="w-7 h-7 rounded-full object-cover border border-gray-200"
          />
          <span className="text-sm font-medium text-gray-700">
            {authorName}
          </span>
        </div>

        <div className="flex items-center gap-4 text-xs font-medium text-gray-500">
          <div className="flex items-center gap-1" title="Up votes" aria-label="Up votes">
            <ThumbsUp className="w-4 h-4 text-gray-400" />
            <span>{upVotesBy.length}</span>
          </div>
          <div className="flex items-center gap-1" title="Down votes" aria-label="Down votes">
            <ThumbsDown className="w-4 h-4 text-gray-400" />
            <span>{downVotesBy.length}</span>
          </div>
          <div className="flex items-center gap-1" title="Komentar" aria-label="Total komentar">
            <MessageSquare className="w-4 h-4 text-gray-400" />
            <span>{totalComments}</span>
          </div>
        </div>
      </footer>
    </article>
  );
}

export default ThreadItem;
