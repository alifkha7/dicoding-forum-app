import React from 'react';
import { ThumbsUp, ThumbsDown } from 'lucide-react';

function VoteButtons({
  id,
  upVotesBy = [],
  downVotesBy = [],
  upVote = null,
  downVote = null,
  authUser = null,
}) {
  const isUpVoted = Boolean(authUser && upVotesBy.includes(authUser.id));
  const isDownVoted = Boolean(authUser && downVotesBy.includes(authUser.id));

  const handleUpVote = (event) => {
    event?.preventDefault?.();
    event?.stopPropagation?.();

    if (!authUser) {
      alert('Silakan masuk terlebih dahulu untuk memberikan vote!');
      return;
    }

    if (upVote) {
      upVote(id);
    }
  };

  const handleDownVote = (event) => {
    event?.preventDefault?.();
    event?.stopPropagation?.();

    if (!authUser) {
      alert('Silakan masuk terlebih dahulu untuk memberikan vote!');
      return;
    }

    if (downVote) {
      downVote(id);
    }
  };

  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        onClick={handleUpVote}
        aria-label="Up votes"
        title="Up votes"
        className={`flex items-center gap-1 text-xs font-medium transition-colors ${
          isUpVoted
            ? 'text-blue-600 font-semibold'
            : 'text-gray-500 hover:text-blue-600'
        }`}
      >
        <ThumbsUp
          className={`w-4 h-4 transition-colors ${
            isUpVoted ? 'fill-current text-blue-600' : 'text-gray-400'
          }`}
        />
        <span>{upVotesBy.length}</span>
      </button>

      <button
        type="button"
        onClick={handleDownVote}
        aria-label="Down votes"
        title="Down votes"
        className={`flex items-center gap-1 text-xs font-medium transition-colors ${
          isDownVoted
            ? 'text-rose-600 font-semibold'
            : 'text-gray-500 hover:text-rose-600'
        }`}
      >
        <ThumbsDown
          className={`w-4 h-4 transition-colors ${
            isDownVoted ? 'fill-current text-rose-600' : 'text-gray-400'
          }`}
        />
        <span>{downVotesBy.length}</span>
      </button>
    </div>
  );
}

export default VoteButtons;
