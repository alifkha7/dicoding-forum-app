import { describe, it, expect } from 'vitest';
import {
  selectThreads,
  selectUsers,
  selectCategory,
  selectEnrichedThreads,
  selectUniqueCategories,
  selectFilteredThreads,
} from './selectors';

/**
 * test scenario for selectors
 *
 * - selectThreads
 *  - should return threads array from state
 * - selectUsers
 *  - should return users array from state
 * - selectCategory
 *  - should return category string from state
 * - selectEnrichedThreads
 *  - should enrich threads with owner user details
 *  - should return null user when ownerId does not match any user
 *  - should return memoized reference when inputs remain unchanged
 * - selectUniqueCategories
 *  - should return unique non-empty category names from threads
 *  - should return memoized reference when threads remain unchanged
 * - selectFilteredThreads
 *  - should return all enriched threads when category is empty
 *  - should return only threads matching the selected category
 *  - should return memoized reference when inputs remain unchanged
 */

describe('selectors', () => {
  const fakeThreads = [
    {
      id: 'thread-1',
      title: 'Thread 1',
      category: 'react',
      ownerId: 'user-1',
    },
    {
      id: 'thread-2',
      title: 'Thread 2',
      category: 'redux',
      ownerId: 'user-2',
    },
    {
      id: 'thread-3',
      title: 'Thread 3',
      category: 'react',
      ownerId: 'user-999',
    },
    {
      id: 'thread-4',
      title: 'Thread 4',
      category: '',
      ownerId: 'user-1',
    },
  ];

  const fakeUsers = [
    { id: 'user-1', name: 'John Doe', avatar: 'https://avatar.url/1' },
    { id: 'user-2', name: 'Jane Smith', avatar: 'https://avatar.url/2' },
  ];

  it('should return threads, users, and category from basic selector functions', () => {
    const state = {
      threads: fakeThreads,
      users: fakeUsers,
      category: 'react',
    };

    expect(selectThreads(state)).toBe(fakeThreads);
    expect(selectUsers(state)).toBe(fakeUsers);
    expect(selectCategory(state)).toBe('react');
  });

  describe('selectEnrichedThreads', () => {
    it('should map threads to include matching user or null', () => {
      const state = {
        threads: fakeThreads,
        users: fakeUsers,
      };

      const enriched = selectEnrichedThreads(state);

      expect(enriched).toHaveLength(4);
      expect(enriched[0].user).toEqual(fakeUsers[0]);
      expect(enriched[1].user).toEqual(fakeUsers[1]);
      expect(enriched[2].user).toBeNull();
      expect(enriched[3].user).toEqual(fakeUsers[0]);
    });

    it('should be memoized when threads and users references are unchanged', () => {
      const state1 = {
        threads: fakeThreads,
        users: fakeUsers,
        other: 1,
      };
      const state2 = {
        threads: fakeThreads,
        users: fakeUsers,
        other: 2,
      };

      const result1 = selectEnrichedThreads(state1);
      const result2 = selectEnrichedThreads(state2);

      expect(result1).toBe(result2);
    });
  });

  describe('selectUniqueCategories', () => {
    it('should extract unique non-empty category names from threads', () => {
      const state = {
        threads: fakeThreads,
      };

      const categories = selectUniqueCategories(state);

      expect(categories).toEqual(['react', 'redux']);
    });

    it('should be memoized when threads reference is unchanged', () => {
      const state1 = { threads: fakeThreads, other: 1 };
      const state2 = { threads: fakeThreads, other: 2 };

      const result1 = selectUniqueCategories(state1);
      const result2 = selectUniqueCategories(state2);

      expect(result1).toBe(result2);
    });
  });

  describe('selectFilteredThreads', () => {
    it('should return all enriched threads when category is empty', () => {
      const state = {
        threads: fakeThreads,
        users: fakeUsers,
        category: '',
      };

      const filtered = selectFilteredThreads(state);

      expect(filtered).toHaveLength(4);
    });

    it('should return only threads matching the selected category', () => {
      const state = {
        threads: fakeThreads,
        users: fakeUsers,
        category: 'redux',
      };

      const filtered = selectFilteredThreads(state);

      expect(filtered).toHaveLength(1);
      expect(filtered[0].id).toBe('thread-2');
      expect(filtered[0].category).toBe('redux');
    });

    it('should be memoized when enrichedThreads and category remain unchanged', () => {
      const state1 = {
        threads: fakeThreads,
        users: fakeUsers,
        category: 'react',
        extra: 1,
      };
      const state2 = {
        threads: fakeThreads,
        users: fakeUsers,
        category: 'react',
        extra: 2,
      };

      const result1 = selectFilteredThreads(state1);
      const result2 = selectFilteredThreads(state2);

      expect(result1).toBe(result2);
    });
  });
});
