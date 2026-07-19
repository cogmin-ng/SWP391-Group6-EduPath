import { useEffect, useState } from 'react';
import { Search, Plus, Pencil, Trash2, HelpCircle, ArrowRight, Loader2, BookOpen, Lightbulb } from 'lucide-react';
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
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Ngân hàng Câu hỏi</h1>
          <p className="text-slate-500 mt-1.5 text-sm sm:text-base">Lưu trữ và tái sử dụng các câu hỏi trắc nghiệm của bạn một cách dễ dàng.</p>
        </div>
        <button
          onClick={handleOpenAddModal}
          className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-3 rounded-xl font-semibold transition-all duration-300 shadow-md shadow-indigo-100 hover:shadow-indigo-200 hover:scale-[1.02] active:scale-[0.98] text-sm w-full sm:w-auto cursor-pointer"
        >
          <Plus size={18} />
          Tạo câu hỏi mới
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-sm grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="relative md:col-span-2">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
          <input
            type="text"
            placeholder="Tìm kiếm nội dung câu hỏi..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setSkip(0); }}
            className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 focus:outline-none transition-all duration-200"
          />
        </div>

        <div>
          <select
            value={selectedSubject}
            onChange={(e) => { setSelectedSubject(e.target.value); setSkip(0); }}
            className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 focus:outline-none transition-all duration-200 bg-white cursor-pointer"
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
            className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 focus:outline-none transition-all duration-200 bg-white cursor-pointer"
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
        <div className="flex flex-col items-center justify-center py-24 bg-white border border-slate-200 rounded-2xl shadow-sm">
          <Loader2 className="w-10 h-10 text-indigo-600 animate-spin mb-3" />
          <span className="text-slate-500 font-medium text-sm">Đang tải ngân hàng câu hỏi...</span>
        </div>
      ) : questions.length === 0 ? (
        <div className="text-center py-20 bg-white border border-slate-200 rounded-2xl shadow-sm px-6">
          <HelpCircle className="w-14 h-14 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-600 font-semibold text-lg">Không tìm thấy câu hỏi nào phù hợp.</p>
          <p className="text-slate-400 text-sm mt-1">Hãy thêm các câu hỏi trắc nghiệm mới vào kho lưu trữ của bạn.</p>
          <button
            onClick={handleOpenAddModal}
            className="mt-5 bg-indigo-55 bg-indigo-50 hover:bg-indigo-100/80 text-indigo-700 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200"
          >
            Tạo câu hỏi đầu tiên
          </button>
        </div>
      ) : (
        <div className="space-y-5">
          <div className="grid grid-cols-1 gap-5">
            {questions.map((q) => (
              <div
                key={q.id}
                className="bg-white border border-slate-200 hover:border-slate-350 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-2 duration-300"
              >
                {/* Card Header (Badges on left, Actions on right) */}
                <div className="flex items-center justify-between gap-4 border-b border-slate-50 pb-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`text-xs px-3 py-1 rounded-full font-bold border ${getDifficultyClass(q.difficulty)}`}>
                      {getDifficultyLabel(q.difficulty)}
                    </span>
                    <span className="flex items-center gap-1.5 text-xs text-indigo-700 bg-indigo-50 border border-indigo-100/50 px-3 py-1 rounded-full font-semibold">
                      <BookOpen size={13} />
                      {q.subject.name}
                    </span>
                  </div>

                  {/* Action Group */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleOpenEditModal(q)}
                      className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 border border-slate-100 hover:border-indigo-100/85 rounded-xl transition-all duration-200 cursor-pointer"
                      title="Chỉnh sửa"
                    >
                      <Pencil size={15} />
                    </button>
                    <button
                      onClick={() => handleDeleteQ(q.id)}
                      className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 border border-slate-100 hover:border-red-100/85 rounded-xl transition-all duration-200 cursor-pointer"
                      title="Xóa câu hỏi"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
                
                {/* Question Body */}
                <div className="space-y-4">
                  <h3 className="font-bold text-slate-800 text-lg leading-relaxed">{q.question}</h3>
                  
                  {/* Options List */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {q.options.map((opt, idx) => {
                      const optionLetter = String.fromCharCode(65 + idx);
                      return (
                        <div
                          key={opt.id}
                          className={`p-3.5 rounded-xl border text-sm flex items-center gap-3 transition-all duration-200 ${
                            opt.isCorrect
                              ? 'bg-emerald-50/60 border-emerald-200 text-emerald-800 font-medium shadow-sm shadow-emerald-50'
                              : 'bg-slate-50/40 border-slate-150 text-slate-700 hover:bg-slate-50 hover:border-slate-200'
                          }`}
                        >
                          <span
                            className={`w-6 h-6 flex items-center justify-center text-xs font-bold rounded-full flex-shrink-0 transition-colors ${
                              opt.isCorrect
                                ? 'bg-emerald-500 text-white shadow-sm shadow-emerald-250'
                                : 'bg-slate-200 text-slate-600'
                            }`}
                          >
                            {optionLetter}
                          </span>
                          <span className={opt.isCorrect ? 'font-semibold' : ''}>{opt.content}</span>
                        </div>
                      );
                    })}
                  </div>

                  {q.explanation && (
                    <div className="bg-indigo-50/40 border-l-4 border-indigo-500 text-slate-700 p-4 rounded-r-xl text-sm flex items-start gap-2.5 mt-2">
                      <Lightbulb className="w-4 h-4 text-indigo-500 flex-shrink-0 mt-0.5 animate-pulse" />
                      <div className="space-y-0.5">
                        <span className="font-semibold text-indigo-900 text-xs uppercase tracking-wider block">Giải thích đáp án</span>
                        <p className="text-slate-600 text-sm leading-relaxed">{q.explanation}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {total > take && (
            <div className="flex justify-between items-center bg-white border border-slate-200 rounded-2xl p-4 shadow-sm mt-6">
              <button
                onClick={() => setSkip(prev => Math.max(0, prev - take))}
                disabled={skip === 0}
                className="px-4 py-2 border border-slate-200 rounded-xl text-sm font-semibold text-slate-750 hover:bg-slate-50 disabled:opacity-50 disabled:hover:bg-white transition cursor-pointer"
              >
                Trang trước
              </button>
              <span className="text-sm text-slate-500 font-medium">
                Hiển thị {skip + 1} - {Math.min(skip + take, total)} trong tổng số {total} câu hỏi
              </span>
              <button
                onClick={() => setSkip(prev => prev + take)}
                disabled={skip + take >= total}
                className="px-4 py-2 border border-slate-200 rounded-xl text-sm font-semibold text-slate-750 hover:bg-slate-50 disabled:opacity-50 disabled:hover:bg-white transition cursor-pointer"
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
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-slate-100 animate-in zoom-in-95 duration-200 flex flex-col">
            {/* Modal Header */}
            <div className="px-6 py-4.5 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-800">
                {editingQuestion ? 'Cập nhật câu hỏi ngân hàng' : 'Thêm câu hỏi vào ngân hàng'}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1.5 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer text-xl font-semibold"
              >
                &times;
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSaveQuestion} className="p-6 space-y-5 overflow-y-auto flex-1">
              {/* Subject & Difficulty */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1.5">Môn học</label>
                  <select
                    value={modalForm.subjectId}
                    onChange={(e) => setModalForm(prev => ({ ...prev, subjectId: e.target.value }))}
                    required
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 focus:outline-none transition-all bg-white cursor-pointer"
                  >
                    <option value="">Chọn môn học</option>
                    {subjects.map(s => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1.5">Độ khó</label>
                  <select
                    value={modalForm.difficulty}
                    onChange={(e) => setModalForm(prev => ({ ...prev, difficulty: e.target.value }))}
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 focus:outline-none transition-all bg-white cursor-pointer"
                  >
                    <option value="DE">Dễ</option>
                    <option value="TRUNG_BINH">Trung bình</option>
                    <option value="KHO">Khó</option>
                  </select>
                </div>
              </div>

              {/* Question Text */}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">Nội dung câu hỏi</label>
                <textarea
                  value={modalForm.question}
                  onChange={(e) => setModalForm(prev => ({ ...prev, question: e.target.value }))}
                  required
                  placeholder="Nhập nội dung câu hỏi trắc nghiệm..."
                  rows={3}
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 focus:outline-none transition-all resize-y"
                />
              </div>

              {/* Options Section */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="block text-sm font-bold text-slate-700">Các đáp án</label>
                  <button
                    type="button"
                    onClick={handleAddOptionField}
                    className="text-xs text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 px-2.5 py-1.5 rounded-lg border border-dashed border-indigo-200 hover:border-indigo-350 font-semibold flex items-center gap-1 transition cursor-pointer"
                  >
                    <Plus size={12} />
                    Thêm đáp án
                  </button>
                </div>

                <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                  {modalForm.options.map((opt, idx) => (
                    <div key={idx} className="flex items-center gap-3 bg-slate-50/50 p-2.5 rounded-xl border border-slate-100 hover:border-slate-200 transition-colors">
                      {/* Correct answer indicator - Custom styled radio button */}
                      <label className="flex items-center gap-2 cursor-pointer select-none">
                        <input
                          type="radio"
                          name="correct-option-radio"
                          checked={opt.isCorrect}
                          onChange={() => handleSelectCorrectOption(idx)}
                          className="sr-only"
                        />
                        <div
                          className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all ${
                            opt.isCorrect
                              ? 'border-emerald-500 bg-emerald-500 text-white'
                              : 'border-slate-300 bg-white text-transparent hover:border-slate-400'
                          }`}
                          title="Đánh dấu đáp án đúng"
                        >
                          <svg className="w-3.5 h-3.5 fill-current stroke-current" viewBox="0 0 20 20">
                            <path d="M0 11l2-2 5 5L18 3l2 2L7 18z"/>
                          </svg>
                        </div>
                      </label>

                      {/* Letter Badge (A, B, C, D...) */}
                      <span className={`w-6 h-6 flex items-center justify-center text-xs font-bold rounded-full flex-shrink-0 transition-colors ${
                        opt.isCorrect ? 'bg-emerald-500 text-white shadow-sm' : 'bg-slate-200 text-slate-600'
                      }`}>
                        {String.fromCharCode(65 + idx)}
                      </span>
                      
                      {/* Input content */}
                      <input
                        type="text"
                        value={opt.content}
                        onChange={(e) => handleOptionContentChange(idx, e.target.value)}
                        placeholder={`Nhập nội dung đáp án ${idx + 1}`}
                        required={idx < 2} // at least 2 are required
                        className={`flex-1 px-3 py-2 border rounded-xl text-sm focus:outline-none transition-all ${
                          opt.isCorrect
                            ? 'border-emerald-250 bg-emerald-50/15 focus:border-emerald-550 focus:ring-2 focus:ring-emerald-100/60'
                            : 'border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 bg-white'
                        }`}
                      />

                      {/* Remove Option Button */}
                      {modalForm.options.length > 2 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveOptionField(idx)}
                          className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                          title="Xóa đáp án này"
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Explanation */}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">Giải thích đáp án (Không bắt buộc)</label>
                <textarea
                  value={modalForm.explanation}
                  onChange={(e) => setModalForm(prev => ({ ...prev, explanation: e.target.value }))}
                  placeholder="Giải thích lý do đáp án này đúng để giúp học viên ôn tập..."
                  rows={2}
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 focus:outline-none transition-all resize-y"
                />
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3 bg-white">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold rounded-xl text-sm transition-all duration-200 cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl text-sm transition-all duration-200 flex items-center justify-center gap-2 min-w-[110px] disabled:bg-indigo-400 cursor-pointer shadow-md shadow-indigo-100"
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
