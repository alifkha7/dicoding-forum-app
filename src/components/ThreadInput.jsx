import React from 'react';
import useInput from '../hooks/useInput';

function ThreadInput({ onCreateThread, createThread }) {
  const [title, onTitleChange] = useInput('');
  const [category, onCategoryChange] = useInput('');
  const [body, onBodyChange] = useInput('');

  const onSubmit = (event) => {
    event.preventDefault();
    const trimmedTitle = title.trim();
    const trimmedBody = body.trim();

    if (!trimmedTitle || !trimmedBody) {
      return;
    }

    const handleCreateThread = onCreateThread || createThread;
    if (handleCreateThread) {
      handleCreateThread({
        title: trimmedTitle,
        category: category.trim(),
        body: trimmedBody,
      });
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-5" aria-label="Form Buat Diskusi">
      <div>
        <label htmlFor="title" className="block text-sm font-semibold text-gray-700 mb-1">
          Judul Diskusi
          <input
            id="title"
            type="text"
            placeholder="Judul diskusi"
            value={title}
            onChange={onTitleChange}
            required
            className="w-full mt-1 px-3.5 py-2.5 text-sm font-normal text-gray-900 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
          />
        </label>
      </div>

      <div>
        <label htmlFor="category" className="block text-sm font-semibold text-gray-700 mb-1">
          Kategori (opsional)
          <input
            id="category"
            type="text"
            placeholder="Kategori diskusi, misal: react, redux"
            value={category}
            onChange={onCategoryChange}
            className="w-full mt-1 px-3.5 py-2.5 text-sm font-normal text-gray-900 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
          />
        </label>
      </div>

      <div>
        <label htmlFor="body" className="block text-sm font-semibold text-gray-700 mb-1">
          Isi Diskusi
          <textarea
            id="body"
            rows={6}
            placeholder="Tuliskan isi diskusi Anda di sini..."
            value={body}
            onChange={onBodyChange}
            required
            className="w-full mt-1 px-3.5 py-2.5 text-sm font-normal text-gray-900 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition resize-y"
          />
        </label>
      </div>

      <div className="flex justify-end pt-2">
        <button
          type="submit"
          className="w-full sm:w-auto px-6 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition shadow-sm"
        >
          Buat Diskusi
        </button>
      </div>
    </form>
  );
}

export default ThreadInput;
