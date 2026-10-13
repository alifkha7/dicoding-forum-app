import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

function CommentInput({ addComment }) {
  const authUser = useSelector((state) => state.authUser);
  const [content, setContent] = useState('');

  if (!authUser) {
    return (
      <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 text-center">
        <p className="text-sm text-gray-600">
          Silakan
          {' '}
          <Link to="/login" className="font-semibold text-blue-600 hover:underline">
            Masuk
          </Link>
          {' '}
          untuk memberi komentar.
        </p>
      </div>
    );
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    const trimmedContent = content.trim();
    if (!trimmedContent) {
      return;
    }

    const result = await addComment({ content: trimmedContent });
    if (result === undefined || result?.success !== false) {
      setContent('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3" aria-label="Form Komentar">
      <div>
        <label htmlFor="comment-content" className="block text-sm font-semibold text-gray-700 mb-1">
          Beri Komentar
          <textarea
            id="comment-content"
            value={content}
            onChange={(event) => setContent(event.target.value)}
            rows={3}
            placeholder="Tuliskan komentar Anda di sini..."
            required
            className="w-full mt-1 px-3.5 py-2.5 text-sm font-normal text-gray-900 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition resize-y"
          />
        </label>
      </div>
      <div className="flex justify-end">
        <button
          type="submit"
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 transition"
        >
          Kirim Komentar
        </button>
      </div>
    </form>
  );
}

export default CommentInput;
