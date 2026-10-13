import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { UserPlus } from 'lucide-react';
import RegisterInput from '../components/RegisterInput';
import api from '../utils/api';

function RegisterPage() {
  const authUser = useSelector((state) => state.authUser);
  const navigate = useNavigate();

  useEffect(() => {
    if (authUser) {
      navigate('/');
    }
  }, [authUser, navigate]);

  const onRegister = async ({ name, email, password }) => {
    try {
      await api.register({ name, email, password });
      alert('Akun berhasil dibuat! Silakan masuk.');
      navigate('/login');
    } catch (error) {
      alert(error.message);
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
            <UserPlus className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Daftar Akun Baru</h1>
          <p className="text-sm text-gray-600 mt-1">
            Bergabunglah dengan komunitas developer Dicoding
          </p>
        </div>

        <RegisterInput register={onRegister} />

        <p className="mt-6 text-center text-sm text-gray-600">
          Sudah punya akun?
          {' '}
          <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
            Masuk di sini
          </Link>
        </p>
      </div>
    </main>
  );
}

export default RegisterPage;
