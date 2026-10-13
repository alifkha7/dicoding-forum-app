import React from 'react';
import {
  describe,
  it,
  expect,
  vi,
} from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import CategoryChips from './CategoryChips';

describe('CategoryChips component', () => {
  const categories = ['react', 'redux', 'javascript'];

  it('should render "Semua" and all category chips properly', () => {
    render(
      <CategoryChips
        categories={categories}
        selectedCategory=""
        onSelectCategory={() => {}}
      />,
    );

    expect(screen.getByRole('button', { name: 'Semua' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '#react' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '#redux' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '#javascript' })).toBeInTheDocument();
  });

  it('should highlight "Semua" chip when selectedCategory is empty', () => {
    render(
      <CategoryChips
        categories={categories}
        selectedCategory=""
        onSelectCategory={() => {}}
      />,
    );

    const allButton = screen.getByRole('button', { name: 'Semua' });
    expect(allButton.className).toContain('bg-blue-600');
    expect(allButton.className).toContain('text-white');

    const reactButton = screen.getByRole('button', { name: '#react' });
    expect(reactButton.className).not.toContain('bg-blue-600');
  });

  it('should highlight active category chip when selectedCategory is matched', () => {
    render(
      <CategoryChips
        categories={categories}
        selectedCategory="react"
        onSelectCategory={() => {}}
      />,
    );

    const allButton = screen.getByRole('button', { name: 'Semua' });
    expect(allButton.className).not.toContain('bg-blue-600');

    const reactButton = screen.getByRole('button', { name: '#react' });
    expect(reactButton.className).toContain('bg-blue-600');
    expect(reactButton.className).toContain('text-white');
  });

  it('should call onSelectCategory with empty string when "Semua" is clicked', () => {
    const handleSelectCategory = vi.fn();
    render(
      <CategoryChips
        categories={categories}
        selectedCategory="react"
        onSelectCategory={handleSelectCategory}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Semua' }));
    expect(handleSelectCategory).toHaveBeenCalledWith('');
  });

  it('should call onSelectCategory with the category when an inactive chip is clicked', () => {
    const handleSelectCategory = vi.fn();
    render(
      <CategoryChips
        categories={categories}
        selectedCategory=""
        onSelectCategory={handleSelectCategory}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: '#redux' }));
    expect(handleSelectCategory).toHaveBeenCalledWith('redux');
  });

  it('should call onSelectCategory with empty string when active chip is clicked (toggle off)', () => {
    const handleSelectCategory = vi.fn();
    render(
      <CategoryChips
        categories={categories}
        selectedCategory="redux"
        onSelectCategory={handleSelectCategory}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: '#redux' }));
    expect(handleSelectCategory).toHaveBeenCalledWith('');
  });
});
