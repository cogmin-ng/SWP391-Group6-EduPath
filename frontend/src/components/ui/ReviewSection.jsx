import { useState, useEffect } from 'react';
import { Star, StarHalf, User, MoreVertical, Edit2, Trash2, Reply, X } from 'lucide-react';
import toast from 'react-hot-toast';
import Button from './Button';
import { useAuth } from '../../hooks/useAuth';
import * as reviewService from '../../services/reviewService';

export default function ReviewSection({ learningPathId, mentorId, isEnrolled }) {
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [total, setTotal] = useState(0);
  const [myReview, setMyReview] = useState(null);
  const [loading, setLoading] = useState(true);

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalReviews, setModalReviews] = useState([]);
  const [modalLoading, setModalLoading] = useState(false);

  // Review form state
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isEditingMyReview, setIsEditingMyReview] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Reply form state
  const [replyingTo, setReplyingTo] = useState(null); // review id
  const [replyText, setReplyText] = useState('');
  const [submittingReply, setSubmittingReply] = useState(false);

  const isMentor = user?.id === mentorId;

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const data = await reviewService.getReviews(learningPathId, 0, 2);
      setReviews(data.reviews || []);
      setTotal(data.total || 0);

      if (isEnrolled) {
        const myRev = await reviewService.getMyReview(learningPathId);
        setMyReview(myRev);
        if (myRev) {
          setRating(myRev.rating);
          setComment(myRev.comment || '');
        }
      }
    } catch (error) {
      console.error('Failed to load reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (learningPathId) {
      fetchReviews();
    }
  }, [learningPathId, isEnrolled]);

  const loadAllReviews = async () => {
    try {
      setModalLoading(true);
      const data = await reviewService.getReviews(learningPathId, 0, 100); // 100 as max for now
      setModalReviews(data.reviews || []);
    } catch (error) {
      toast.error('Không thể tải đánh giá');
    } finally {
      setModalLoading(false);
    }
  };

  useEffect(() => {
    if (isModalOpen) {
      loadAllReviews();
    }
  }, [isModalOpen]);

  const handleSubmitReview = async () => {
    if (!rating) return toast.error('Vui lòng chọn số sao');
    try {
      setSubmitting(true);
      if (myReview) {
        await reviewService.updateReview(myReview.id, { rating, comment });
        toast.success('Đã cập nhật đánh giá');
      } else {
        await reviewService.createReview(learningPathId, { rating, comment });
        toast.success('Đã gửi đánh giá thành công');
      }
      setIsEditingMyReview(false);
      await fetchReviews();
      if (isModalOpen) loadAllReviews();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteReview = async () => {
    if (!myReview) return;
    if (!window.confirm('Bạn có chắc muốn xóa đánh giá này?')) return;
    try {
      await reviewService.deleteReview(myReview.id);
      toast.success('Đã xóa đánh giá');
      setMyReview(null);
      setRating(0);
      setComment('');
      setIsEditingMyReview(false);
      await fetchReviews();
      if (isModalOpen) loadAllReviews();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra');
    }
  };

  const handleSubmitReply = async (reviewId) => {
    if (!replyText.trim()) return toast.error('Vui lòng nhập câu trả lời');
    try {
      setSubmittingReply(true);
      const existingReview = (isModalOpen ? modalReviews : reviews).find(r => r.id === reviewId);
      if (existingReview?.mentorReply) {
        await reviewService.updateMentorReply(reviewId, { mentorReply: replyText });
        toast.success('Đã cập nhật câu trả lời');
      } else {
        await reviewService.createMentorReply(reviewId, { mentorReply: replyText });
        toast.success('Đã gửi câu trả lời');
      }
      setReplyingTo(null);
      setReplyText('');
      await fetchReviews();
      if (isModalOpen) loadAllReviews();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra');
    } finally {
      setSubmittingReply(false);
    }
  };

  const handleDeleteReply = async (reviewId) => {
    if (!window.confirm('Bạn có chắc muốn xóa câu trả lời này?')) return;
    try {
      await reviewService.deleteMentorReply(reviewId);
      toast.success('Đã xóa câu trả lời');
      await fetchReviews();
      if (isModalOpen) loadAllReviews();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra');
    }
  };

  const renderStars = (score) => {
    return (
      <div className="flex items-center text-amber-400">
        {[1, 2, 3, 4, 5].map((star) => (
          <span key={star}>
            {star <= Math.floor(score) ? (
              <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
            ) : star - 0.5 === score ? (
              <StarHalf className="h-4 w-4 fill-amber-400 text-amber-400" />
            ) : (
              <Star className="h-4 w-4 text-slate-300" />
            )}
          </span>
        ))}
      </div>
    );
  };

  const renderReviewCard = (review) => {
    const isReplyMode = replyingTo === review.id;
    return (
      <div key={review.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm mb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3 mb-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 text-indigo-600 overflow-hidden">
              {review.user?.avatar ? (
                <img src={review.user.avatar} alt="avatar" className="w-full h-full object-cover" />
              ) : (
                <User className="h-5 w-5" />
              )}
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900">{review.user?.name || 'User'}</p>
              <div className="flex items-center gap-2">
                {renderStars(review.rating)}
                <span className="text-xs text-slate-500">{new Date(review.createdAt).toLocaleDateString('vi-VN')}</span>
              </div>
            </div>
          </div>
          {review.userId === user?.id && !isModalOpen && (
            <div className="flex gap-2">
              <button onClick={() => setIsEditingMyReview(true)} className="text-slate-400 hover:text-indigo-600">
                <Edit2 className="h-4 w-4" />
              </button>
              <button onClick={handleDeleteReview} className="text-slate-400 hover:text-rose-600">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
        <p className="text-sm leading-relaxed text-slate-600 mt-2">{review.comment}</p>

        {/* Mentor Reply Display */}
        {review.mentorReply && !isReplyMode && (
          <div className="mt-4 rounded-xl bg-slate-50 p-4 border border-slate-100 ml-4 relative">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-indigo-100 text-indigo-700">Author</span>
                <span className="text-xs text-slate-500">{new Date(review.mentorReplyAt).toLocaleDateString('vi-VN')}</span>
              </div>
              {isMentor && (
                <div className="flex gap-2">
                  <button onClick={() => { setReplyingTo(review.id); setReplyText(review.mentorReply); }} className="text-slate-400 hover:text-indigo-600">
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button onClick={() => handleDeleteReply(review.id)} className="text-slate-400 hover:text-rose-600">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>
            <p className="text-sm text-slate-700">{review.mentorReply}</p>
          </div>
        )}

        {/* Mentor Reply Action */}
        {isMentor && !review.mentorReply && !isReplyMode && (
          <button onClick={() => { setReplyingTo(review.id); setReplyText(''); }} className="mt-3 flex items-center gap-1 text-sm text-indigo-600 font-medium hover:text-indigo-700">
            <Reply className="h-4 w-4" /> Trả lời
          </button>
        )}

        {/* Mentor Reply Form */}
        {isMentor && isReplyMode && (
          <div className="mt-4 ml-4">
            <textarea
              rows={3}
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Nhập câu trả lời của bạn..."
              className="w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none"
            />
            <div className="mt-2 flex gap-2">
              <Button size="sm" onClick={() => handleSubmitReply(review.id)} isLoading={submittingReply}>Gửi</Button>
              <Button size="sm" variant="ghost" onClick={() => setReplyingTo(null)}>Hủy</Button>
            </div>
          </div>
        )}
      </div>
    );
  };

  if (loading) return <div className="text-center py-4"><span className="text-sm text-slate-500">Đang tải đánh giá...</span></div>;

  return (
    <section className="mx-auto mt-16 w-full max-w-4xl">
      <div className="mb-6 border-b border-slate-200 pb-3 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">Feedback &amp; Cộng đồng</h2>
          <p className="mt-1 text-sm text-slate-500">Đánh giá từ người học ({total})</p>
        </div>
        {total > 2 && (
          <Button variant="outline" size="sm" onClick={() => setIsModalOpen(true)}>
            View all reviews
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Reviews List */}
        <div className="space-y-4">
          {reviews.length === 0 ? (
            <p className="text-sm text-slate-500">Chưa có đánh giá nào.</p>
          ) : (
            reviews.map(renderReviewCard)
          )}
        </div>

        {/* Review Form (Only for Enrolled Mentee) */}
        {isEnrolled && (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm h-fit">
            <h3 className="text-lg font-semibold text-slate-900">Chia sẻ cảm nhận</h3>
            <p className="mt-1 text-sm text-slate-500">Đánh giá của bạn giúp cộng đồng chọn lộ trình phù hợp.</p>

            {myReview && !isEditingMyReview ? (
              <div className="mt-6 p-4 rounded-xl bg-indigo-50 border border-indigo-100 flex flex-col items-center justify-center text-center">
                <div className="text-indigo-600 mb-2">Bạn đã đánh giá lộ trình này</div>
                {renderStars(myReview.rating)}
                <div className="mt-4 flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => setIsEditingMyReview(true)}>Sửa đánh giá</Button>
                  <Button size="sm" variant="ghost" className="text-rose-600 hover:bg-rose-50 hover:text-rose-700" onClick={handleDeleteReview}>Xóa đánh giá</Button>
                </div>
              </div>
            ) : (
              <div className="mt-5">
                <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">Đánh giá</label>
                <div className="mt-2 flex items-center gap-1 text-2xl">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="transition-colors hover:text-amber-400"
                    >
                      <Star
                        className={`h-7 w-7 ${
                          star <= (hoverRating || rating)
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-slate-300'
                        }`}
                      />
                    </button>
                  ))}
                </div>
                <div className="mt-4">
                  <label className="text-xs font-semibold uppercase tracking-wide text-slate-500" htmlFor="review-text">Nhận xét</label>
                  <textarea
                    id="review-text"
                    rows={4}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Bạn nghĩ gì về lộ trình này?"
                    className="mt-2 w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 transition-all focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>
                <div className="mt-4 flex gap-2">
                  <Button disabled={!rating} onClick={handleSubmitReview} isLoading={submitting}>
                    {myReview ? 'Cập nhật' : 'Gửi đánh giá'}
                  </Button>
                  {isEditingMyReview && (
                    <Button variant="ghost" onClick={() => {
                      setIsEditingMyReview(false);
                      setRating(myReview.rating);
                      setComment(myReview.comment || '');
                    }}>Hủy</Button>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* View All Reviews Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <h3 className="text-xl font-bold text-slate-900">Tất cả đánh giá ({total})</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto">
              {modalLoading ? (
                <div className="text-center py-8 text-slate-500">Đang tải...</div>
              ) : (
                modalReviews.map(renderReviewCard)
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
