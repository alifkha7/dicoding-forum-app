import React from 'react';
import CommentItem from './CommentItem';

function CommentList({ comments = [] }) {
  return (
    <section className="space-y-4" aria-label="Daftar Komentar">
      <h3 className="text-base font-bold text-gray-900">
        Komentar (
        {comments.length}
        )
      </h3>

      {comments.length === 0 ? (
        <p className="text-sm text-gray-500 py-4 text-center bg-white rounded-lg border border-dashed border-gray-200">
          Belum ada komentar. Jadilah yang pertama berkomentar!
        </p>
      ) : (
        <div className="space-y-3">
          {comments.map((comment) => (
            <CommentItem
              key={comment.id}
              content={comment.content}
              createdAt={comment.createdAt}
              owner={comment.owner}
              upVotesBy={comment.upVotesBy}
              downVotesBy={comment.downVotesBy}
            />
          ))}
        </div>
      )}
    </section>
  );
}

export default CommentList;
