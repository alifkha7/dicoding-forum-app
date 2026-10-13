import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { MessageSquarePlus } from 'lucide-react';
import ThreadInput from '../components/ThreadInput';
import { asyncCreateThread } from '../states/threads/action';

function NewThreadPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onCreateThread = async ({ title, body, category }) => {
    const result = await dispatch(asyncCreateThread({ title, body, category }));
    if (result && result.success) {
      navigate('/');
    }
  };

  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white p-6 sm:p-8 rounded-xl shadow-sm border border-gray-100">
        <div className="mb-6 flex items-center gap-3 border-b border-gray-100 pb-4">
          <div className="p-2.5 bg-blue-50 text-blue-600 rounded-lg">
            <MessageSquarePlus className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Buat Diskusi Baru</h1>
            <p className="text-sm text-gray-500 mt-0.5">
              Bagikan pertanyaan atau ide Anda kepada komunitas
            </p>
          </div>
        </div>

        <ThreadInput onCreateThread={onCreateThread} />
      </div>
    </main>
  );
}

export default NewThreadPage;
