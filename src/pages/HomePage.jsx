import React, { useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Plus } from 'lucide-react';
import ThreadList from '../components/ThreadList';
import CategoryChips from '../components/CategoryChips';
import { asyncPopulateUsersAndThreads } from '../states/shared/action';
import {
  asyncToggleUpVoteThread,
  asyncToggleDownVoteThread,
} from '../states/threads/action';
import {
  setCategoryActionCreator,
  clearCategoryActionCreator,
} from '../states/category/action';

function HomePage() {
  const threads = useSelector((state) => state.threads || []);
  const users = useSelector((state) => state.users || []);
  const authUser = useSelector((state) => state.authUser);
  const selectedCategory = useSelector((state) => state.category || '');
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();

  const urlCategory = searchParams.get('category') || '';

  useEffect(() => {
    dispatch(asyncPopulateUsersAndThreads());
  }, [dispatch]);

  useEffect(() => {
    if (urlCategory !== selectedCategory) {
      if (urlCategory) {
        dispatch(setCategoryActionCreator(urlCategory));
      } else {
        dispatch(clearCategoryActionCreator());
      }
    }
  }, [urlCategory, selectedCategory, dispatch]);

  const onSelectCategory = (category) => {
    if (category) {
      setSearchParams({ category });
      dispatch(setCategoryActionCreator(category));
    } else {
      setSearchParams({});
      dispatch(clearCategoryActionCreator());
    }
  };

  const onUpVote = (id) => {
    dispatch(asyncToggleUpVoteThread(id));
  };

  const onDownVote = (id) => {
    dispatch(asyncToggleDownVoteThread(id));
  };

  const categories = Array.from(new Set(threads.map((t) => t.category).filter(Boolean)));
  const displayedThreads = selectedCategory
    ? threads.filter((t) => t.category === selectedCategory)
    : threads;

  const threadList = displayedThreads.map((thread) => ({
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
        <CategoryChips
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={onSelectCategory}
        />
        <ThreadList
          threads={threadList}
          upVote={onUpVote}
          downVote={onDownVote}
          authUser={authUser}
        />
      </section>
    </main>
  );
}

export default HomePage;
