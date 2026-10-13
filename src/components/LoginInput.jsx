import React from 'react';
import useInput from '../hooks/useInput';

function LoginInput({ login, onLogin }) {
  const [email, onEmailChange] = useInput('');
  const [password, onPasswordChange] = useInput('');

  const onSubmit = (event) => {
    event.preventDefault();
    const handleLogin = login || onLogin;
    if (handleLogin) {
      handleLogin({ email, password });
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
          Email
          <input
            id="email"
            type="email"
            placeholder="email@example.com"
            value={email}
            onChange={onEmailChange}
            required
            className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm font-normal"
          />
        </label>
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
          Password
          <input
            id="password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={onPasswordChange}
            required
            className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm font-normal"
          />
        </label>
      </div>

      <button
        type="submit"
        className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg text-sm transition shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        Masuk
      </button>
    </form>
  );
}

export default LoginInput;
