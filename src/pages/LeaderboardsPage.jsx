import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Trophy } from 'lucide-react';
import { asyncReceiveLeaderboards } from '../states/leaderboards/action';
import LeaderboardItem from '../components/LeaderboardItem';

function LeaderboardsPage() {
  const leaderboards = useSelector((state) => state.leaderboards || []);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(asyncReceiveLeaderboards());
  }, [dispatch]);

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <header className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-xl text-amber-600 shadow-sm">
            <Trophy className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Klasemen Pengguna Aktif</h1>
            <p className="text-sm text-gray-500">Peringkat kontributor terbaik dan paling aktif di Dicoding Forum.</p>
          </div>
        </div>
      </header>

      <section className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-6 py-3.5 bg-gray-50 border-b border-gray-200 text-xs font-semibold uppercase tracking-wider text-gray-500">
          <span>Pengguna</span>
          <span>Skor</span>
        </div>

        {leaderboards.length === 0 ? (
          <div className="p-8 text-center text-gray-500 text-sm">
            Belum ada data klasemen yang tersedia.
          </div>
        ) : (
          <div className="divide-y divide-gray-100 p-2 sm:p-4 space-y-2">
            {leaderboards.map((leaderboard, index) => (
              <LeaderboardItem
                key={leaderboard.user.id}
                rank={index + 1}
                user={leaderboard.user}
                score={leaderboard.score}
              />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

export default LeaderboardsPage;
