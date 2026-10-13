import React from 'react';
import { Link } from 'react-router-dom';

function NotFoundPage() {
  return (
    <main className="max-w-md mx-auto px-4 py-16 text-center">
      <h1 className="text-6xl font-bold text-blue-600 mb-4">404</h1>
      <h2 className="text-xl font-semibold text-gray-900 mb-2">Halaman Tidak Ditemukan</h2>
      <p className="text-gray-600 mb-6">
        Halaman yang Anda tuju tidak ditemukan atau telah dipindahkan.
      </p>
      <Link
        to="/"
        className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
      >
        Kembali ke Beranda
      </Link>
    </main>
  );
}

export default NotFoundPage;
