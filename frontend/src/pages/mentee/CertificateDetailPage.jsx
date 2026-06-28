import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Award, Calendar, Download, Map, User } from 'lucide-react';
import MenteeHeader from '../../components/mentee/MenteeHeader';
import { getCertificateById, downloadCertificate } from '../../services/certificateService';
import toast from 'react-hot-toast';

export default function CertificateDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [certificate, setCertificate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    const fetchCertificate = async () => {
      try {
        setLoading(true);
        const data = await getCertificateById(id);
        setCertificate(data);
      } catch (err) {
        console.error('Failed to fetch certificate:', err);
        toast.error('Không thể tải thông tin chứng chỉ');
      } finally {
        setLoading(false);
      }
    };
    fetchCertificate();
  }, [id]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const handleDownload = async () => {
    try {
      setDownloading(true);
      const blob = await downloadCertificate(id);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `certificate-${id}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
      toast.success('Tải chứng chỉ thành công!');
    } catch (err) {
      toast.error(err.message || 'Không thể tải chứng chỉ');
    } finally {
      setDownloading(false);
    }
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

  if (!certificate) {
    return (
      <div className="min-h-screen bg-slate-50">
        <MenteeHeader />
        <main className="mx-auto max-w-7xl px-4 pb-16 pt-24 text-center">
          <div className="mb-6 flex h-24 w-24 mx-auto items-center justify-center rounded-full bg-slate-100">
            <Award className="h-12 w-12 text-slate-400" />
          </div>
          <h3 className="mb-2 text-xl font-semibold text-slate-900">Không tìm thấy chứng chỉ</h3>
          <p className="text-sm text-slate-500">Chứng chỉ này không tồn tại hoặc đã bị xóa.</p>
          <button
            onClick={() => navigate('/my-certificates')}
            className="mt-6 rounded-lg bg-indigo-600 px-6 py-2 text-sm font-medium text-white shadow-md transition-all active:scale-95"
          >
            Quay lại danh sách
          </button>
        </main>
      </div>
    );
  }

  const userName = JSON.parse(localStorage.getItem('user') || '{}')?.name || 'Học viên';

  return (
    <div className="min-h-screen bg-slate-50">
      <MenteeHeader />

      <main className="mx-auto max-w-4xl px-4 pb-16 pt-24 md:px-6 lg:px-8">
        {/* Back Button */}
        <button
          onClick={() => navigate('/my-certificates')}
          className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-indigo-600 transition-colors hover:text-indigo-800"
        >
          <ArrowLeft className="h-4 w-4" />
          Quay lại danh sách
        </button>

        {/* Certificate Preview */}
        <div className="mb-10 overflow-hidden rounded-3xl border-4 border-white bg-white shadow-2xl shadow-indigo-200/50 ring-1 ring-slate-200">
          <div className="relative bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-slate-50 via-white to-slate-100 p-8 sm:p-14 overflow-hidden">
            {/* Elegant outer border */}
            <div className="absolute inset-4 rounded-2xl border-[3px] border-double border-indigo-100 pointer-events-none"></div>
            
            {/* Corner decorations */}
            <div className="absolute top-6 left-6 w-10 h-10 border-t-2 border-l-2 border-amber-300 pointer-events-none"></div>
            <div className="absolute top-6 right-6 w-10 h-10 border-t-2 border-r-2 border-amber-300 pointer-events-none"></div>
            <div className="absolute bottom-6 left-6 w-10 h-10 border-b-2 border-l-2 border-amber-300 pointer-events-none"></div>
            <div className="absolute bottom-6 right-6 w-10 h-10 border-b-2 border-r-2 border-amber-300 pointer-events-none"></div>

            <div className="relative text-center">
              {/* Logo / Badge */}
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-indigo-600 to-indigo-800 shadow-xl ring-4 ring-indigo-50">
                <Award className="h-8 w-8 text-white" />
              </div>
              <p className="text-sm font-bold tracking-widest text-indigo-900 uppercase">EduPath Academy</p>

              {/* Title */}
              <h2 className="mt-6 text-4xl font-black tracking-tight text-slate-900 sm:text-5xl font-serif">
                CHỨNG CHỈ
              </h2>
              <p className="mt-3 text-sm font-bold uppercase tracking-[0.3em] text-amber-500">
                Hoàn thành Lộ trình
              </p>

              {/* Description */}
              <div className="mt-12 max-w-lg mx-auto">
                <p className="text-sm font-medium text-slate-500 uppercase tracking-widest">Chứng chỉ này được trao tặng cho</p>
                <h3 className="mt-4 text-3xl font-bold text-indigo-700 sm:text-4xl capitalize font-serif italic">
                  {userName}
                </h3>
                <div className="mt-6 mx-auto w-16 h-0.5 bg-amber-200"></div>
                <p className="mt-6 text-sm font-medium text-slate-600">vì đã hoàn thành xuất sắc lộ trình học tập</p>
                <p className="mt-2 text-xl font-bold text-slate-900 leading-snug">{certificate.learningPathTitle}</p>
              </div>

              {/* Mentor & Date (Signatures layout) */}
              <div className="mt-16 flex items-end justify-between px-4 sm:px-12">
                <div className="text-center w-32 sm:w-40">
                  <p className="text-base font-bold text-slate-800 border-b-2 border-slate-200 pb-2">{formatDate(certificate.issuedAt)}</p>
                  <p className="mt-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Ngày cấp</p>
                </div>
                
                {/* Gold Seal Graphic */}
                <div className="hidden sm:flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-amber-300 via-amber-400 to-amber-600 shadow-xl relative -mt-6 ring-4 ring-white">
                  <div className="absolute inset-1 rounded-full border border-amber-200 border-dashed"></div>
                  <Award className="h-10 w-10 text-amber-50" />
                </div>

                <div className="text-center w-32 sm:w-40">
                  <p className="text-lg font-bold text-slate-800 border-b-2 border-slate-200 pb-1 italic font-serif">{certificate.mentorName}</p>
                  <p className="mt-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Người hướng dẫn</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Certificate Information */}
        <div className="mb-8 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 px-6 py-4">
            <h4 className="flex items-center gap-2 text-base font-semibold text-slate-900">
              <Award className="h-5 w-5 text-indigo-600" />
              Thông tin chứng chỉ
            </h4>
          </div>
          <div className="grid grid-cols-1 gap-6 p-6 sm:grid-cols-3">
            <div>
              <div className="flex items-center gap-2 text-xs font-medium text-slate-400 uppercase tracking-wider mb-1.5">
                <Map className="h-3.5 w-3.5" />
                Lộ trình
              </div>
              <p className="text-sm font-semibold text-indigo-600">{certificate.learningPathTitle}</p>
            </div>
            <div>
              <div className="flex items-center gap-2 text-xs font-medium text-slate-400 uppercase tracking-wider mb-1.5">
                <User className="h-3.5 w-3.5" />
                Người hướng dẫn
              </div>
              <p className="text-sm font-semibold text-indigo-600">{certificate.mentorName}</p>
            </div>
            <div>
              <div className="flex items-center gap-2 text-xs font-medium text-slate-400 uppercase tracking-wider mb-1.5">
                <Calendar className="h-3.5 w-3.5" />
                Ngày cấp
              </div>
              <p className="text-sm font-semibold text-indigo-600">{formatDate(certificate.issuedAt)}</p>
            </div>
          </div>
        </div>

        {/* Download Button */}
        <button
          onClick={handleDownload}
          disabled={downloading}
          className="w-full flex items-center justify-center gap-3 rounded-xl bg-indigo-600 py-4 text-base font-semibold text-white shadow-lg shadow-indigo-600/20 transition-all hover:bg-indigo-700 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
        >
          <Download className="h-5 w-5" />
          {downloading ? 'Đang tải...' : 'Tải xuống chứng chỉ'}
        </button>
      </main>
    </div>
  );
}
