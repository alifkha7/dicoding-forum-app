/* eslint-disable react/no-danger */
import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import DOMPurify from 'dompurify';
import {
  MessageSquare,
  ArrowLeft,
} from 'lucide-react';
import CommentInput from '../components/CommentInput';
import CommentList from '../components/CommentList';
import VoteButtons from '../components/VoteButtons';
import {
  asyncReceiveThreadDetail,
  asyncAddComment,
  asyncToggleUpVoteThreadDetail,
  asyncToggleDownVoteThreadDetail,
  asyncToggleUpVoteComment,
  asyncToggleDownVoteComment,
} from '../states/threadDetail/action';
import { postedAt } from '../utils';

function DetailPage() {
  const { id } = useParams();
  const threadDetail = useSelector((state) => state.threadDetail);
  const authUser = useSelector((state) => state.authUser);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(asyncReceiveThreadDetail(id));
  }, [id, dispatch]);

  const onAddComment = ({ content }) => dispatch(asyncAddComment({ threadId: id, content }));

  const onUpVoteThreadDetail = () => dispatch(asyncToggleUpVoteThreadDetail(id));
  const onDownVoteThreadDetail = () => dispatch(asyncToggleDownVoteThreadDetail(id));

  const onUpVoteComment = (commentId) => dispatch(asyncToggleUpVoteComment({
    threadId: id,
    commentId,
  }));

  const onDownVoteComment = (commentId) => dispatch(asyncToggleDownVoteComment({
    threadId: id,
    commentId,
  }));

  if (!threadDetail) {
    return (
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        <div className="flex flex-col items-center justify-center gap-3 py-16" aria-label="Memuat detail thread">
          <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
          <p className="text-sm text-gray-500 font-medium">Memuat detail thread...</p>
        </div>
      </main>
    );
  }

  const {
    title,
    body,
    category,
    createdAt,
    owner = {},
    upVotesBy = [],
    downVotesBy = [],
    comments = [],
  } = threadDetail;

  const authorName = owner?.name || 'Anonim';
  const authorAvatar = owner?.avatar || 'https://ui-avatars.com/api/?name=User';

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      <Link
        to="/"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-blue-600 transition"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Kembali ke Beranda</span>
      </Link>

      <article className="p-6 bg-white rounded-xl border border-gray-200 shadow-sm space-y-6">
        <header className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            {category ? (
              <span className="inline-block px-3 py-1 text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-200 rounded-full">
                {`#${category}`}
              </span>
            ) : <span />}
            <span className="text-xs text-gray-500 font-medium">
              {postedAt(createdAt)}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-tight">
            {title}
          </h1>

          <div className="flex items-center gap-3 pt-2">
            <img
              src={authorAvatar}
              alt={authorName}
              className="w-9 h-9 rounded-full object-cover border border-gray-200"
            />
            <div>
              <p className="text-sm font-semibold text-gray-800">
                {authorName}
              </p>
              <p className="text-xs text-gray-400">
                {`Dibuat ${postedAt(createdAt)}`}
              </p>
            </div>
          </div>
        </header>

        <div
          className="text-gray-800 leading-relaxed text-base prose max-w-none border-t border-b border-gray-100 py-6"
          dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(body) }}
        />

        <footer className="flex items-center gap-6 text-sm text-gray-600">
          <VoteButtons
            id={id}
            upVotesBy={upVotesBy}
            downVotesBy={downVotesBy}
            upVote={onUpVoteThreadDetail}
            downVote={onDownVoteThreadDetail}
            authUser={authUser}
          />
          <div className="flex items-center gap-1.5" title="Total komentar" aria-label="Total komentar">
            <MessageSquare className="w-4 h-4 text-gray-400" />
            <span>{comments.length}</span>
          </div>
        </footer>
      </article>

      <section className="space-y-6" aria-label="Komentar">
        <div className="p-6 bg-white rounded-xl border border-gray-200 shadow-sm">
          <CommentInput addComment={onAddComment} />
        </div>

        <CommentList
          comments={comments}
          upVote={onUpVoteComment}
          downVote={onDownVoteComment}
          authUser={authUser}
        />
      </section>
    </main>
  );
}

export default DetailPage;
