import React from 'react';
import {
  describe,
  it,
  expect,
  vi,
} from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import LoginInput from './LoginInput';

describe('LoginInput component', () => {
  it('should handle email typing correctly', () => {
    // arrange
    render(<LoginInput login={() => {}} />);
    const emailInput = screen.getByPlaceholderText('email@example.com');

    // act
    fireEvent.change(emailInput, { target: { value: 'user@example.com' } });

    // assert
    expect(emailInput.value).toBe('user@example.com');
  });

  it('should handle password typing correctly', () => {
    // arrange
    render(<LoginInput login={() => {}} />);
    const passwordInput = screen.getByPlaceholderText('••••••••');

    // act
    fireEvent.change(passwordInput, { target: { value: 'secret123' } });

    // assert
    expect(passwordInput.value).toBe('secret123');
  });

  it('should call login function when login button is clicked', () => {
    // arrange
    const mockLogin = vi.fn();
    render(<LoginInput login={mockLogin} />);
    const emailInput = screen.getByPlaceholderText('email@example.com');
    const passwordInput = screen.getByPlaceholderText('••••••••');
    const loginButton = screen.getByRole('button', { name: 'Masuk' });

    // act
    fireEvent.change(emailInput, { target: { value: 'user@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'secret123' } });
    fireEvent.click(loginButton);

    // assert
    expect(mockLogin).toHaveBeenCalledWith({
      email: 'user@example.com',
      password: 'secret123',
    });
  });
});
