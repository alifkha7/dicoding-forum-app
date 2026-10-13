import {
  describe,
  it,
  expect,
  vi,
  afterEach,
} from 'vitest';
import { postedAt } from './index';

describe('postedAt function', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('should return relative time in days when difference is in days', () => {
    vi.useFakeTimers();
    const mockNow = new Date('2023-05-30T10:00:00.000Z');
    vi.setSystemTime(mockNow);

    const pastDate = '2023-05-28T10:00:00.000Z';
    expect(postedAt(pastDate)).toBe('2 hari lalu');
  });

  it('should return relative time in hours when difference is in hours', () => {
    vi.useFakeTimers();
    const mockNow = new Date('2023-05-30T10:00:00.000Z');
    vi.setSystemTime(mockNow);

    const pastDate = '2023-05-30T07:00:00.000Z';
    expect(postedAt(pastDate)).toBe('3 jam lalu');
  });

  it('should return relative time in minutes when difference is in minutes', () => {
    vi.useFakeTimers();
    const mockNow = new Date('2023-05-30T10:00:00.000Z');
    vi.setSystemTime(mockNow);

    const pastDate = '2023-05-30T09:45:00.000Z';
    expect(postedAt(pastDate)).toBe('15 menit lalu');
  });

  it('should return relative time in seconds when difference is in seconds', () => {
    vi.useFakeTimers();
    const mockNow = new Date('2023-05-30T10:00:00.000Z');
    vi.setSystemTime(mockNow);

    const pastDate = '2023-05-30T09:59:50.000Z';
    expect(postedAt(pastDate)).toBe('10 detik lalu');
  });

  it('should return "baru saja" when difference is zero or future', () => {
    vi.useFakeTimers();
    const mockNow = new Date('2023-05-30T10:00:00.000Z');
    vi.setSystemTime(mockNow);

    const pastDate = '2023-05-30T10:00:00.000Z';
    expect(postedAt(pastDate)).toBe('baru saja');
  });
});
