import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { LogIn } from 'lucide-react';
import LoginInput from '../components/LoginInput';
import { asyncSetAuthUser } from '../states/authUser/action';

function LoginPage() {
  const authUser = useSelector((state) => state.authUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (authUser) {
      navigate('/');
    }
  }, [authUser, navigate]);

  const onLogin = async ({ email, password }) => {
    const result = await dispatch(asyncSetAuthUser({ email, password }));
    if (result && result.success) {
      navigate('/');
    }
  };

  if (authUser) {
    return null;
  }

  return (
    <main className="max-w-md mx-auto px-4 py-12">
      <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
        <div className="text-center mb-6">
          <div className="inline-flex p-3 bg-blue-50 text-blue-600 rounded-full mb-3">
            <LogIn className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Masuk ke Akun</h1>
          <p className="text-sm text-gray-600 mt-1">
            Silakan masuk untuk berdiskusi di Dicoding Forum
          </p>
        </div>

        <LoginInput login={onLogin} />

        <p className="mt-6 text-center text-sm text-gray-600">
          Belum punya akun?
          {' '}
          <Link to="/register" className="font-medium text-blue-600 hover:text-blue-500">
            Daftar di sini
          </Link>
        </p>
      </div>
    </main>
  );
}

export default LoginPage;
