import React from 'react';
import { Medal } from 'lucide-react';

function getRankBadge(rank) {
  if (rank === 1) {
    return (
      <span
        className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-amber-100 text-amber-700 font-bold border border-amber-300 shadow-sm"
        aria-label="Peringkat 1"
      >
        <Medal className="w-4 h-4 text-amber-600" />
      </span>
    );
  }

  if (rank === 2) {
    return (
      <span
        className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-slate-200 text-slate-700 font-bold border border-slate-300 shadow-sm"
        aria-label="Peringkat 2"
      >
        <Medal className="w-4 h-4 text-slate-600" />
      </span>
    );
  }

  if (rank === 3) {
    return (
      <span
        className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-amber-700/10 text-amber-800 font-bold border border-amber-600/30 shadow-sm"
        aria-label="Peringkat 3"
      >
        <Medal className="w-4 h-4 text-amber-800" />
      </span>
    );
  }

  return (
    <span
      className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 text-gray-600 font-semibold text-sm"
      aria-label={`Peringkat ${rank}`}
    >
      {rank}
    </span>
  );
}

function LeaderboardItem({ rank, user, score }) {
  const { name = 'Anonim', avatar = 'https://ui-avatars.com/api/?name=User', email } = user || {};

  return (
    <article className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center gap-4">
        {getRankBadge(rank)}
        <div className="flex items-center gap-3">
          <img
            src={avatar}
            alt={name}
            className="w-10 h-10 rounded-full object-cover border border-gray-200"
          />
          <div>
            <p className="font-semibold text-gray-900 text-sm sm:text-base">{name}</p>
            {email && <p className="text-xs text-gray-500">{email}</p>}
          </div>
        </div>
      </div>

      <div className="text-right">
        <span className="text-base sm:text-lg font-bold text-blue-600">
          {score}
        </span>
      </div>
    </article>
  );
}

export default LeaderboardItem;
