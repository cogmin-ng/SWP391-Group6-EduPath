import { useEffect, useState } from 'react';
import { Search, Loader2, HelpCircle, BookOpen, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { getQuestionBank } from '../../services/questionBankService';

export default function ImportQuestionsModal({ isOpen, onClose, onImport, subjectId, excludeBankQuestionIds = [] }) {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [selectedIds, setSelectedIds] = useState([]);
  const [total, setTotal] = useState(0);
  const [skip, setSkip] = useState(0);
  const take = 15;

  const fetchQuestions = async () => {
    if (!isOpen) return;
    try {
      setLoading(true);
      const data = await getQuestionBank({
        skip,
        take,
        search,
        subjectId: subjectId || undefined,
        difficulty: difficulty || undefined
      });
      setQuestions(data.questions || []);
      setTotal(data.total || 0);
    } catch (err) {
      console.error('Failed to load bank questions:', err);
      toast.error('Không thể tải câu hỏi từ ngân hàng');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, [isOpen, skip, search, difficulty, subjectId]);

  // Reset selection when modal opens
  useEffect(() => {
    if (isOpen) {
      setSelectedIds([]);
      setSkip(0);
      setSearch('');
      setDifficulty('');
    }
  }, [isOpen]);

  const handleToggleSelect = (qId) => {
    setSelectedIds(prev =>
      prev.includes(qId) ? prev.filter(id => id !== qId) : [...prev, qId]
    );
  };

  const handleImportSubmit = () => {
    if (selectedIds.length === 0) {
      toast.error('Vui lòng chọn ít nhất 1 câu hỏi');
      return;
    }
    const selectedQuestions = questions.filter(q => selectedIds.includes(q.id));
    onImport(selectedQuestions);
    onClose();
    toast.success(`Đã nhập thành công ${selectedQuestions.length} câu hỏi!`);
  };

  const getDifficultyLabel = (difficulty) => {
    switch (difficulty) {
      case 'DE': return 'Dễ';
      case 'TRUNG_BINH': return 'Trung bình';
      case 'KHO': return 'Khó';
      default: return difficulty;
    }
  };

  const getDifficultyClass = (difficulty) => {
    switch (difficulty) {
      case 'DE': return 'bg-emerald-50 text-emerald-700 border-emerald-100';
      case 'TRUNG_BINH': return 'bg-amber-50 text-amber-700 border-amber-100';
      case 'KHO': return 'bg-rose-50 text-rose-700 border-rose-100';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-slate-100 animate-in zoom-in-95 duration-200 flex flex-col">
        
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-150 flex items-center justify-between flex-shrink-0">
          <div>
            <h2 className="text-xl font-bold text-slate-800">Chọn câu hỏi từ Ngân hàng</h2>
            <p className="text-xs text-slate-500 mt-0.5">Lọc theo môn học của lộ trình hiện tại</p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 hover:bg-slate-50 rounded-lg transition"
          >
            &times;
          </button>
        </div>

        {/* Filters */}
        <div className="p-4 border-b border-slate-100 flex-shrink-0 grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="relative sm:col-span-2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Tìm kiếm nội dung câu hỏi..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setSkip(0); }}
              className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-sm focus:border-indigo-500 focus:outline-none transition"
            />
          </div>
          <div>
            <select
              value={difficulty}
              onChange={(e) => { setDifficulty(e.target.value); setSkip(0); }}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:border-indigo-500 focus:outline-none transition bg-white"
            >
              <option value="">Tất cả độ khó</option>
              <option value="DE">Dễ</option>
              <option value="TRUNG_BINH">Trung bình</option>
              <option value="KHO">Khó</option>
            </select>
          </div>
        </div>

        {/* Modal Body / Questions List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 min-h-[30vh]">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16">
              <Loader2 className="w-8 h-8 text-indigo-500 animate-spin mb-2" />
              <span className="text-sm text-slate-500">Đang tải câu hỏi...</span>
            </div>
          ) : questions.filter(q => !excludeBankQuestionIds.includes(q.id)).length === 0 ? (
            <div className="text-center py-12">
              <HelpCircle className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-sm text-slate-500 font-medium">Không tìm thấy câu hỏi phù hợp hoặc tất cả đã được thêm vào Quiz.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {questions
                .filter(q => !excludeBankQuestionIds.includes(q.id))
                .map((q) => {
                  const isSelected = selectedIds.includes(q.id);
                return (
                  <div
                    key={q.id}
                    onClick={() => handleToggleSelect(q.id)}
                    className={`p-4 border rounded-xl cursor-pointer transition flex items-start gap-3 hover:bg-slate-50/50 ${
                      isSelected
                        ? 'border-indigo-500 bg-indigo-50/10 shadow-sm'
                        : 'border-slate-200 bg-white'
                    }`}
                  >
                    {/* Checkbox */}
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => {}} // handled by div onClick
                      className="w-4 h-4 rounded text-indigo-600 border-slate-300 focus:ring-indigo-500 mt-1 cursor-pointer flex-shrink-0"
                    />

                    {/* Question Content */}
                    <div className="space-y-1.5 flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${getDifficultyClass(q.difficulty)}`}>
                          {getDifficultyLabel(q.difficulty)}
                        </span>
                        <span className="text-[10px] text-slate-500 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-full font-medium">
                          {q.subject.name}
                        </span>
                      </div>
                      <p className="text-sm font-semibold text-slate-800 line-clamp-2">{q.question}</p>
                      
                      {/* Short list of option content */}
                      <div className="text-xs text-slate-500 flex flex-wrap gap-x-3 gap-y-1">
                        {q.options.map((opt, oIdx) => (
                          <span key={opt.id} className={opt.isCorrect ? 'text-emerald-600 font-medium' : ''}>
                            {String.fromCharCode(65 + oIdx)}. {opt.content}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-slate-100 flex-shrink-0 flex items-center justify-between bg-slate-50 rounded-b-2xl">
          <div className="text-sm text-slate-500">
            {selectedIds.length > 0 ? (
              <span className="font-semibold text-indigo-600">Đã chọn {selectedIds.length} câu hỏi</span>
            ) : (
              'Chọn các câu hỏi để import'
            )}
          </div>

          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-slate-200 hover:bg-slate-100 text-slate-700 font-semibold rounded-xl text-sm transition"
            >
              Hủy
            </button>
            <button
              onClick={handleImportSubmit}
              disabled={selectedIds.length === 0}
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 disabled:cursor-not-allowed text-white font-semibold rounded-xl text-sm transition"
            >
              Import vào Quiz
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
