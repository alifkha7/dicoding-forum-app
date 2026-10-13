import React from 'react';
import {
  describe,
  it,
  expect,
  vi,
} from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ThreadInput from './ThreadInput';

describe('ThreadInput component', () => {
  it('should handle title, category, and body typing correctly', () => {
    // arrange
    render(<ThreadInput onCreateThread={() => {}} />);
    const titleInput = screen.getByPlaceholderText('Judul diskusi');
    const categoryInput = screen.getByPlaceholderText('Kategori diskusi, misal: react, redux');
    const bodyInput = screen.getByPlaceholderText('Tuliskan isi diskusi Anda di sini...');

    // act
    fireEvent.change(titleInput, { target: { value: 'Belajar Redux Toolkit' } });
    fireEvent.change(categoryInput, { target: { value: 'redux' } });
    fireEvent.change(bodyInput, { target: { value: 'Bagaimana cara setup Redux Toolkit?' } });

    // assert
    expect(titleInput.value).toBe('Belajar Redux Toolkit');
    expect(categoryInput.value).toBe('redux');
    expect(bodyInput.value).toBe('Bagaimana cara setup Redux Toolkit?');
  });

  it('should not call onCreateThread when title or body is empty', () => {
    // arrange
    const mockCreateThread = vi.fn();
    render(<ThreadInput onCreateThread={mockCreateThread} />);
    const submitButton = screen.getByRole('button', { name: 'Buat Diskusi' });

    // act
    fireEvent.click(submitButton);

    // assert
    expect(mockCreateThread).not.toHaveBeenCalled();
  });

  it('should call onCreateThread when form is submitted with valid inputs', () => {
    // arrange
    const mockCreateThread = vi.fn();
    render(<ThreadInput onCreateThread={mockCreateThread} />);
    const titleInput = screen.getByPlaceholderText('Judul diskusi');
    const categoryInput = screen.getByPlaceholderText('Kategori diskusi, misal: react, redux');
    const bodyInput = screen.getByPlaceholderText('Tuliskan isi diskusi Anda di sini...');
    const submitButton = screen.getByRole('button', { name: 'Buat Diskusi' });

    // act
    fireEvent.change(titleInput, { target: { value: 'Thread Baru' } });
    fireEvent.change(categoryInput, { target: { value: 'react' } });
    fireEvent.change(bodyInput, { target: { value: 'Konten diskusi yang valid' } });
    fireEvent.click(submitButton);

    // assert
    expect(mockCreateThread).toHaveBeenCalledWith({
      title: 'Thread Baru',
      category: 'react',
      body: 'Konten diskusi yang valid',
    });
  });
});
