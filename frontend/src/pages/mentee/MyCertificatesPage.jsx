import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Award, ArrowRight, CheckCircle, FileText } from 'lucide-react';
import MenteeHeader from '../../components/mentee/MenteeHeader';
import { getMyCertificates } from '../../services/certificateService';
import toast from 'react-hot-toast';

export default function MyCertificatesPage() {
  const navigate = useNavigate();
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCertificates = async () => {
      try {
        setLoading(true);
        const data = await getMyCertificates();
        setCertificates(data || []);
      } catch (err) {
        console.error('Failed to fetch certificates:', err);
        toast.error('Không thể tải danh sách chứng chỉ');
      } finally {
        setLoading(false);
      }
    };
    fetchCertificates();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <MenteeHeader />
        <main className="mx-auto max-w-7xl px-4 pb-16 pt-24 text-center">
          <div className="inline-block">
            <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
          </div>
          <p className="mt-4 text-slate-500 animate-pulse">Đang tải chứng chỉ...</p>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <MenteeHeader />

      <main className="mx-auto max-w-7xl px-4 pb-16 pt-24 md:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Chứng chỉ của tôi</h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-500">
              Xem và quản lý tất cả các chứng chỉ bạn đã đạt được.
            </p>
          </div>
          <div className="hidden sm:block">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 to-amber-500 shadow-lg shadow-amber-200/50">
              <Award className="h-8 w-8 text-white" />
            </div>
          </div>
        </div>

        {/* Tab */}
        <div className="mb-8 flex items-center space-x-8 border-b border-slate-200">
          <button
            className="pb-4 text-sm font-bold border-b-2 border-indigo-600 text-indigo-600"
          >
            Tất cả chứng chỉ
            {certificates.length > 0 && (
              <span className="ml-2 rounded-full bg-indigo-100 px-2 py-0.5 text-[10px] text-indigo-700">
                {certificates.length}
              </span>
            )}
          </button>
        </div>

        {/* Empty State */}
        {certificates.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-slate-100">
              <FileText className="h-12 w-12 text-slate-400" />
            </div>
            <h3 className="mb-2 text-xl font-semibold text-slate-900">
              Bạn chưa có chứng chỉ nào
            </h3>
            <p className="max-w-sm text-sm text-slate-500">
              Hãy hoàn thành các lộ trình học tập để nhận chứng chỉ đầu tiên của bạn.
            </p>
          </div>
        )}

        {/* Certificate List */}
        {certificates.length > 0 && (
          <div className="space-y-4">
            {certificates.map((cert) => (
              <article
                key={cert.id}
                className="group flex flex-col overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-sm transition-all duration-300 hover:border-indigo-400/50 hover:shadow-md sm:flex-row"
              >
                {/* Thumbnail */}
                <div className="relative h-48 w-full overflow-hidden bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-indigo-500 via-indigo-600 to-indigo-900 sm:h-auto sm:w-48 sm:min-h-[190px] flex-shrink-0">
                  {/* Decorative corner accents */}
                  <div className="absolute top-2 left-2 w-8 h-8 border-t-2 border-l-2 border-indigo-300/40 rounded-tl-lg"></div>
                  <div className="absolute bottom-2 right-2 w-8 h-8 border-b-2 border-r-2 border-indigo-300/40 rounded-br-lg"></div>
                  
                  <div className="absolute inset-0 flex items-center justify-center p-4">
                    <div className="text-center w-full bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/20 shadow-xl transition-transform group-hover:scale-105 duration-500">
                      <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-amber-300 to-amber-500 shadow-lg shadow-amber-500/30">
                        <Award className="h-7 w-7 text-white" />
                      </div>
                      <p className="text-[11px] font-black uppercase tracking-widest text-amber-300 drop-shadow-sm">Chứng chỉ</p>
                      <p className="mt-1.5 text-[10px] font-medium text-indigo-50 line-clamp-2 leading-tight px-1">{cert.learningPathTitle}</p>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="flex flex-1 flex-col justify-between p-6">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 transition-colors group-hover:text-indigo-600">
                      {cert.learningPathTitle}
                    </h3>
                    <div className="mt-2 flex items-center gap-2">
                      <span className="text-sm text-slate-500">Người hướng dẫn:</span>
                      <span className="text-sm font-medium text-indigo-600">{cert.mentorName}</span>
                    </div>
                    <p className="mt-1 text-sm text-slate-500">
                      Hoàn thành vào {formatDate(cert.issuedAt)}
                    </p>
                  </div>
                  <div className="mt-4 flex justify-end">
                    <button
                      onClick={() => navigate(`/my-certificates/${cert.id}`)}
                      className="inline-flex items-center gap-2 rounded-lg border border-indigo-200 bg-white px-5 py-2 text-sm font-medium text-indigo-600 transition-all hover:bg-indigo-50 hover:border-indigo-300 active:scale-95"
                    >
                      Xem chi tiết
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 text-center text-sm text-slate-500">
        © 2026 EduPath. All rights reserved.
      </footer>
    </div>
  );
}
