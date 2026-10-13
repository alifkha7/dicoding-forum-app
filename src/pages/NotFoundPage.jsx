import React from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle, Home } from 'lucide-react';

function NotFoundPage() {
  return (
    <main className="max-w-md mx-auto px-4 py-16 text-center">
      <div className="inline-flex p-4 bg-blue-50 text-blue-600 rounded-full mb-4">
        <AlertCircle className="w-12 h-12" />
      </div>
      <h1 className="text-6xl font-bold text-blue-600 mb-4">404</h1>
      <h2 className="text-xl font-semibold text-gray-900 mb-2">Halaman Tidak Ditemukan</h2>
      <p className="text-gray-600 mb-6">
        Halaman yang Anda tuju tidak ditemukan atau telah dipindahkan.
      </p>
      <Link
        to="/"
        className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
      >
        <Home className="w-4 h-4" />
        Kembali ke Beranda
      </Link>
    </main>
  );
}

export default NotFoundPage;
