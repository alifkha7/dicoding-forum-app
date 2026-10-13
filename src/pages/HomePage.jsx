import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Plus } from 'lucide-react';
import ThreadList from '../components/ThreadList';
import { asyncPopulateUsersAndThreads } from '../states/shared/action';

function HomePage() {
  const threads = useSelector((state) => state.threads || []);
  const users = useSelector((state) => state.users || []);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(asyncPopulateUsersAndThreads());
  }, [dispatch]);

  const threadList = threads.map((thread) => ({
    ...thread,
    user: users.find((user) => user.id === thread.ownerId),
  }));

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Diskusi Terbaru</h1>
          <p className="text-sm text-gray-600 mt-1">
            Temukan dan diskusikan topik pemrograman menarik di Dicoding Forum.
          </p>
        </div>
        <Link
          to="/new"
          className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 transition"
        >
          <Plus className="w-4 h-4" />
          <span>Buat Diskusi</span>
        </Link>
      </div>

      <section aria-label="Daftar Diskusi">
        <ThreadList threads={threadList} />
      </section>
    </main>
  );
}

export default HomePage;
