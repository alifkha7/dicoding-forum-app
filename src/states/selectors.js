import { createSelector } from '@reduxjs/toolkit';

const selectThreads = (state) => state.threads;
const selectUsers = (state) => state.users;
const selectCategory = (state) => state.category;

const selectEnrichedThreads = createSelector(
  [selectThreads, selectUsers],
  (threads, users) => threads.map((thread) => ({
    ...thread,
    user: users.find((u) => u.id === thread.ownerId) || null,
  })),
);

const selectUniqueCategories = createSelector(
  [selectThreads],
  (threads) => Array.from(new Set(threads.map((t) => t.category).filter(Boolean))),
);

const selectFilteredThreads = createSelector(
  [selectEnrichedThreads, selectCategory],
  (enrichedThreads, category) => (
    category
      ? enrichedThreads.filter((t) => t.category === category)
      : enrichedThreads
  ),
);

export {
  selectThreads,
  selectUsers,
  selectCategory,
  selectEnrichedThreads,
  selectUniqueCategories,
  selectFilteredThreads,
};
