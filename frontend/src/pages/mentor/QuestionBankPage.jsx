import { useEffect, useState } from 'react';
import { Search, Plus, Pencil, Trash2, HelpCircle, ArrowRight, Loader2, BookOpen } from 'lucide-react';
import toast from 'react-hot-toast';
import { getQuestionBank, createQuestion, updateQuestion, deleteQuestion } from '../../services/questionBankService';
import { subjectService } from '../../services/subjectService';

export default function QuestionBankPage() {
  const [questions, setQuestions] = useState([]);
  const [total, setTotal] = useState(0);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Filters & Pagination
  const [search, setSearch] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('');
  const [skip, setSkip] = useState(0);
  const take = 10;

  // Add/Edit Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [modalForm, setModalForm] = useState({
    question: '',
    explanation: '',
    difficulty: 'TRUNG_BINH',
    subjectId: '',
    options: [
      { content: '', isCorrect: true },
      { content: '', isCorrect: false },
      { content: '', isCorrect: false },
      { content: '', isCorrect: false },
    ]
  });

  const loadInitialData = async () => {
    try {
      const subData = await subjectService.getAllSubjects();
      setSubjects(subData || []);
    } catch (err) {
      console.error('Failed to load subjects:', err);
    }
  };

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      const data = await getQuestionBank({
        skip,
        take,
        search,
        subjectId: selectedSubject || undefined,
        difficulty: selectedDifficulty || undefined
      });
      setQuestions(data.questions || []);
      setTotal(data.total || 0);
    } catch (err) {
      console.error('Failed to fetch questions:', err);
      toast.error('Không thể tải danh sách câu hỏi');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    fetchQuestions();
  }, [skip, search, selectedSubject, selectedDifficulty]);

  const handleOpenAddModal = () => {
    setEditingQuestion(null);
    setModalForm({
      question: '',
      explanation: '',
      difficulty: 'TRUNG_BINH',
      subjectId: subjects[0]?.id || '',
      options: [
        { content: '', isCorrect: true },
        { content: '', isCorrect: false },
        { content: '', isCorrect: false },
        { content: '', isCorrect: false },
      ]
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (q) => {
    setEditingQuestion(q);
    setModalForm({
      question: q.question,
      explanation: q.explanation || '',
      difficulty: q.difficulty,
      subjectId: q.subjectId,
      options: q.options.map(opt => ({
        id: opt.id,
        content: opt.content,
        isCorrect: opt.isCorrect
      }))
    });
    setIsModalOpen(true);
  };

  const handleOptionContentChange = (index, value) => {
    setModalForm(prev => {
      const updatedOptions = [...prev.options];
      updatedOptions[index] = { ...updatedOptions[index], content: value };
      return { ...prev, options: updatedOptions };
    });
  };

  const handleSelectCorrectOption = (index) => {
    setModalForm(prev => {
      const updatedOptions = prev.options.map((opt, idx) => ({
        ...opt,
        isCorrect: idx === index
      }));
      return { ...prev, options: updatedOptions };
    });
  };

  const handleAddOptionField = () => {
    if (modalForm.options.length >= 8) return toast.error('Tối đa 8 đáp án');
    setModalForm(prev => ({
      ...prev,
      options: [...prev.options, { content: '', isCorrect: false }]
    }));
  };

  const handleRemoveOptionField = (index) => {
    if (modalForm.options.length <= 2) return toast.error('Tối thiểu 2 đáp án');
    setModalForm(prev => {
      const updatedOptions = prev.options.filter((_, idx) => idx !== index);
      // If removed the correct option, set the first remaining option to correct
      const hasCorrect = updatedOptions.some(opt => opt.isCorrect);
      if (!hasCorrect && updatedOptions.length > 0) {
        updatedOptions[0].isCorrect = true;
      }
      return { ...prev, options: updatedOptions };
    });
  };

  const handleSaveQuestion = async (e) => {
    e.preventDefault();
    if (!modalForm.question.trim()) return toast.error('Vui lòng nhập nội dung câu hỏi');
    if (!modalForm.subjectId) return toast.error('Vui lòng chọn môn học');

    // Validate options
    const nonBlankOptions = modalForm.options.filter(opt => opt.content.trim() !== '');
    if (nonBlankOptions.length < 2) return toast.error('Vui lòng nhập ít nhất 2 đáp án');
    
    const correctOptions = nonBlankOptions.filter(opt => opt.isCorrect);
    if (correctOptions.length !== 1) return toast.error('Vui lòng chọn đúng 1 đáp án đúng');

    setSubmitting(true);
    try {
      const payload = {
        question: modalForm.question.trim(),
        explanation: modalForm.explanation.trim() || null,
        difficulty: modalForm.difficulty,
        subjectId: modalForm.subjectId,
        options: nonBlankOptions.map(opt => ({
          content: opt.content.trim(),
          isCorrect: opt.isCorrect
        }))
      };

      if (editingQuestion) {
        await updateQuestion(editingQuestion.id, payload);
        toast.success('Cập nhật câu hỏi thành công!');
      } else {
        await createQuestion(payload);
        toast.success('Thêm câu hỏi vào kho thành công!');
      }
      setIsModalOpen(false);
      fetchQuestions();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Có lỗi xảy ra khi lưu câu hỏi');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteQ = async (id) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa câu hỏi này khỏi kho không?')) return;
    try {
      await deleteQuestion(id);
      toast.success('Đã xóa câu hỏi khỏi kho!');
      fetchQuestions();
    } catch (err) {
      console.error(err);
      toast.error('Không thể xóa câu hỏi này');
    }
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Ngân hàng Câu hỏi</h1>
          <p className="text-slate-500 mt-1">Lưu trữ và tái sử dụng các câu hỏi trắc nghiệm của bạn.</p>
        </div>
        <button
          onClick={handleOpenAddModal}
          className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-semibold transition shadow-sm shadow-indigo-100 text-sm w-full sm:w-auto"
        >
          <Plus size={16} />
          Tạo câu hỏi mới
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="relative md:col-span-2">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Tìm kiếm nội dung câu hỏi..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setSkip(0); }}
            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl text-sm focus:border-indigo-500 focus:outline-none transition-colors"
          />
        </div>

        <div>
          <select
            value={selectedSubject}
            onChange={(e) => { setSelectedSubject(e.target.value); setSkip(0); }}
            className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:border-indigo-500 focus:outline-none transition-colors bg-white"
          >
            <option value="">Tất cả môn học</option>
            {subjects.map(s => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
        </div>

        <div>
          <select
            value={selectedDifficulty}
            onChange={(e) => { setSelectedDifficulty(e.target.value); setSkip(0); }}
            className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:border-indigo-500 focus:outline-none transition-colors bg-white"
          >
            <option value="">Tất cả độ khó</option>
            <option value="DE">Dễ</option>
            <option value="TRUNG_BINH">Trung bình</option>
            <option value="KHO">Khó</option>
          </select>
        </div>
      </div>

      {/* Question List */}
      {loading ? (
        <div className="flex items-center justify-center py-20 bg-white border border-slate-200 rounded-2xl shadow-sm">
          <Loader2 className="w-8 h-8 text-indigo-500 animate-spin mr-3" />
          <span className="text-slate-500 font-medium">Đang tải ngân hàng câu hỏi...</span>
        </div>
      ) : questions.length === 0 ? (
        <div className="text-center py-16 bg-white border border-slate-200 rounded-2xl shadow-sm">
          <HelpCircle className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500 font-medium">Không tìm thấy câu hỏi nào phù hợp.</p>
          <button
            onClick={handleOpenAddModal}
            className="mt-4 text-indigo-600 hover:text-indigo-700 font-semibold text-sm underline"
          >
            Tạo câu hỏi đầu tiên
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            {questions.map((q) => (
              <div
                key={q.id}
                className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition flex flex-col md:flex-row md:items-start justify-between gap-4 animate-in fade-in slide-in-from-bottom-2 duration-300"
              >
                <div className="space-y-3 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`text-xs px-2.5 py-0.5 rounded-full font-semibold border ${getDifficultyClass(q.difficulty)}`}>
                      {getDifficultyLabel(q.difficulty)}
                    </span>
                    <span className="flex items-center gap-1.5 text-xs text-slate-500 bg-slate-100 border border-slate-200 px-2.5 py-0.5 rounded-full font-medium">
                      <BookOpen size={12} />
                      {q.subject.name}
                    </span>
                  </div>
                  
                  <h3 className="font-semibold text-slate-800 text-base">{q.question}</h3>
                  
                  {/* Options List */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                    {q.options.map((opt) => (
                      <div
                        key={opt.id}
                        className={`p-2.5 rounded-xl border text-sm flex items-center gap-2 ${
                          opt.isCorrect
                            ? 'bg-emerald-50 border-emerald-200 text-emerald-800 font-medium'
                            : 'bg-slate-50 border-slate-200 text-slate-600'
                        }`}
                      >
                        <span className={`w-2 h-2 rounded-full ${opt.isCorrect ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                        <span>{opt.content}</span>
                      </div>
                    ))}
                  </div>

                  {q.explanation && (
                    <p className="text-xs text-slate-500 italic mt-1 bg-slate-50/50 p-2.5 rounded-xl border border-slate-100">
                      <strong>Giải thích:</strong> {q.explanation}
                    </p>
                  )}
                </div>

                {/* Actions */}
                <div className="flex md:flex-col gap-2 self-end md:self-start">
                  <button
                    onClick={() => handleOpenEditModal(q)}
                    className="p-2 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-100 rounded-xl transition flex items-center justify-center cursor-pointer"
                    title="Chỉnh sửa"
                  >
                    <Pencil size={15} />
                  </button>
                  <button
                    onClick={() => handleDeleteQ(q.id)}
                    className="p-2 text-slate-600 hover:text-red-600 hover:bg-red-50 border border-slate-200 hover:border-red-100 rounded-xl transition flex items-center justify-center cursor-pointer"
                    title="Xóa câu hỏi"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {total > take && (
            <div className="flex justify-between items-center bg-white border border-slate-200 rounded-2xl p-4 shadow-sm mt-4">
              <button
                onClick={() => setSkip(prev => Math.max(0, prev - take))}
                disabled={skip === 0}
                className="px-4 py-2 border border-slate-200 rounded-xl text-sm font-medium hover:bg-slate-50 disabled:opacity-50 disabled:hover:bg-white transition"
              >
                Trang trước
              </button>
              <span className="text-sm text-slate-500">
                Hiển thị {skip + 1} - {Math.min(skip + take, total)} trong tổng số {total} câu hỏi
              </span>
              <button
                onClick={() => setSkip(prev => prev + take)}
                disabled={skip + take >= total}
                className="px-4 py-2 border border-slate-200 rounded-xl text-sm font-medium hover:bg-slate-50 disabled:opacity-50 disabled:hover:bg-white transition"
              >
                Trang sau
              </button>
            </div>
          )}
        </div>
      )}

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-slate-100 animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-150 flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-800">
                {editingQuestion ? 'Cập nhật câu hỏi' : 'Tạo câu hỏi mới'}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1.5 hover:bg-slate-50 rounded-lg transition"
              >
                &times;
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSaveQuestion} className="p-6 space-y-5">
              {/* Subject & Difficulty */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Môn học</label>
                  <select
                    value={modalForm.subjectId}
                    onChange={(e) => setModalForm(prev => ({ ...prev, subjectId: e.target.value }))}
                    required
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:border-indigo-500 focus:outline-none transition bg-white"
                  >
                    <option value="">Chọn môn học</option>
                    {subjects.map(s => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Độ khó</label>
                  <select
                    value={modalForm.difficulty}
                    onChange={(e) => setModalForm(prev => ({ ...prev, difficulty: e.target.value }))}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:border-indigo-500 focus:outline-none transition bg-white"
                  >
                    <option value="DE">Dễ</option>
                    <option value="TRUNG_BINH">Trung bình</option>
                    <option value="KHO">Khó</option>
                  </select>
                </div>
              </div>

              {/* Question Text */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Nội dung câu hỏi</label>
                <textarea
                  value={modalForm.question}
                  onChange={(e) => setModalForm(prev => ({ ...prev, question: e.target.value }))}
                  required
                  placeholder="Nhập nội dung câu hỏi trắc nghiệm..."
                  rows={3}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:border-indigo-500 focus:outline-none transition resize-y"
                />
              </div>

              {/* Options Section */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="block text-sm font-semibold text-slate-700">Các đáp án</label>
                  <button
                    type="button"
                    onClick={handleAddOptionField}
                    className="text-xs text-indigo-600 hover:text-indigo-700 font-semibold flex items-center gap-1"
                  >
                    <Plus size={12} />
                    Thêm đáp án
                  </button>
                </div>

                <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                  {modalForm.options.map((opt, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      {/* Radio button for Correct choice */}
                      <input
                        type="radio"
                        name="correct-option-radio"
                        checked={opt.isCorrect}
                        onChange={() => handleSelectCorrectOption(idx)}
                        className="w-4 h-4 text-indigo-600 focus:ring-indigo-500 border-slate-300 cursor-pointer"
                        title="Đáp án đúng"
                      />
                      
                      {/* Input content */}
                      <input
                        type="text"
                        value={opt.content}
                        onChange={(e) => handleOptionContentChange(idx, e.target.value)}
                        placeholder={`Đáp án ${idx + 1}`}
                        required={idx < 2} // at least 2 are required
                        className="flex-1 px-3 py-2 border border-slate-200 rounded-xl text-sm focus:border-indigo-500 focus:outline-none transition"
                      />

                      {/* Remove Option Button */}
                      {modalForm.options.length > 2 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveOptionField(idx)}
                          className="p-2 text-slate-400 hover:text-red-500 rounded-lg hover:bg-slate-50 transition"
                        >
                          &times;
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Explanation */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Giải thích đáp án (Optional)</label>
                <textarea
                  value={modalForm.explanation}
                  onChange={(e) => setModalForm(prev => ({ ...prev, explanation: e.target.value }))}
                  placeholder="Giải thích lý do đáp án này đúng để hỗ trợ học viên..."
                  rows={2}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:border-indigo-500 focus:outline-none transition resize-y"
                />
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold rounded-xl text-sm transition"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl text-sm transition flex items-center justify-center gap-2 min-w-[100px] disabled:bg-indigo-400"
                >
                  {submitting ? (
                    <>
                      <Loader2 size={15} className="animate-spin" />
                      Đang lưu...
                    </>
                  ) : (
                    'Lưu câu hỏi'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
