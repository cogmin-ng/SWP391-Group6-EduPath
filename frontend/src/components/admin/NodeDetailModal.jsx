import { useState, useEffect } from 'react';
import {
  X,
  ArrowLeft,
  CheckSquare,
  FileText,
  HelpCircle,
  Lightbulb,
  ExternalLink,
  Loader2,
  AlertCircle,
  Star,
  Hash,
} from 'lucide-react';
import { getNodeDetails } from '../../services/nodeService';

const TABS = [
  { key: 'checklists', label: 'Checklist', icon: CheckSquare },
  { key: 'materials', label: 'Tài liệu', icon: FileText },
  { key: 'quizzes', label: 'Bài kiểm tra', icon: HelpCircle },
];

const NodeDetailModal = ({ nodeId, nodeTitle, isOpen, onClose }) => {
  const [nodeData, setNodeData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('checklists');

  useEffect(() => {
    if (!isOpen || !nodeId) return;

    const fetchNodeData = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getNodeDetails(nodeId);
        setNodeData(data);
      } catch (err) {
        console.error('Failed to fetch node details:', err);
        setError('Không thể tải chi tiết node. Vui lòng thử lại.');
      } finally {
        setLoading(false);
      }
    };

    fetchNodeData();
  }, [isOpen, nodeId]);

  if (!isOpen) return null;

  const checklists = nodeData?.checklists || [];
  const materials = nodeData?.materials || [];
  const quizzes = nodeData?.quizzes || [];
  const tips = nodeData?.tips || [];

  const tabCounts = {
    checklists: checklists.length,
    materials: materials.length,
    quizzes: quizzes.length,
    tips: tips.length,
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full max-w-3xl max-h-[90vh] flex flex-col bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center gap-3 p-5 border-b border-slate-100 bg-gradient-to-r from-indigo-50/50 to-white">
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-all"
            title="Quay lại"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest mb-0.5">
              Chi tiết Node
            </p>
            <h3 className="text-lg font-bold text-slate-900 truncate">
              {nodeTitle || nodeData?.title || 'Đang tải...'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Loading / Error states */}
        {loading && (
          <div className="flex-1 flex flex-col items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-indigo-500 animate-spin mb-4" />
            <p className="text-sm text-slate-500 font-medium">Đang tải chi tiết node...</p>
          </div>
        )}

        {error && (
          <div className="flex-1 flex flex-col items-center justify-center py-20 px-6">
            <AlertCircle className="w-10 h-10 text-rose-400 mb-4" />
            <p className="text-sm text-rose-600 font-medium text-center">{error}</p>
            <button
              onClick={onClose}
              className="mt-4 px-4 py-2 text-sm font-semibold text-slate-600 bg-slate-100 rounded-xl hover:bg-slate-200 transition-all"
            >
              Đóng
            </button>
          </div>
        )}

        {/* Content */}
        {!loading && !error && nodeData && (
          <>
            {/* Description */}
            {nodeData.description && (
              <div className="px-6 pt-5 pb-3">
                <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">
                  {nodeData.description}
                </p>
              </div>
            )}

            {/* Tabs */}
            <div className="px-6 pt-2 border-b border-slate-100">
              <div className="flex gap-1">
                {TABS.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.key;
                  const count = tabCounts[tab.key];
                  return (
                    <button
                      key={tab.key}
                      onClick={() => setActiveTab(tab.key)}
                      className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-t-xl transition-all ${
                        isActive
                          ? 'bg-indigo-50 text-indigo-700 border-b-2 border-indigo-500'
                          : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      {tab.label}
                      <span
                        className={`px-1.5 py-0.5 rounded-md text-[10px] font-black ${
                          isActive
                            ? 'bg-indigo-100 text-indigo-600'
                            : 'bg-slate-100 text-slate-400'
                        }`}
                      >
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Tab Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {/* Checklists Tab */}
              {activeTab === 'checklists' && (
                <div className="space-y-3">
                  {checklists.length === 0 ? (
                    <EmptyState icon={CheckSquare} text="Chưa có checklist nào." />
                  ) : (
                    checklists.map((item, idx) => (
                      <div
                        key={item.id || idx}
                        className="flex items-start gap-3 p-4 rounded-xl bg-slate-50 border border-slate-100 hover:border-slate-200 transition-all"
                      >
                        <div className="flex-shrink-0 w-6 h-6 rounded-lg bg-emerald-100 text-emerald-600 text-xs font-bold flex items-center justify-center mt-0.5">
                          {idx + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-slate-800">{item.title}</p>
                          {item.description && (
                            <p className="text-xs text-slate-500 mt-1">{item.description}</p>
                          )}
                          <div className="flex items-center gap-3 mt-2">
                            <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-100">
                              <Star className="w-3 h-3 inline mr-1" />
                              {item.xpReward || 10} XP
                            </span>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* Materials Tab */}
              {activeTab === 'materials' && (
                <div className="space-y-3">
                  {materials.length === 0 ? (
                    <EmptyState icon={FileText} text="Chưa có tài liệu nào." />
                  ) : (
                    materials.map((item, idx) => (
                      <div
                        key={item.id || idx}
                        className="flex items-start gap-3 p-4 rounded-xl bg-slate-50 border border-slate-100 hover:border-slate-200 transition-all"
                      >
                        <div className="flex-shrink-0 w-6 h-6 rounded-lg bg-blue-100 text-blue-600 text-xs font-bold flex items-center justify-center mt-0.5">
                          <FileText className="w-3.5 h-3.5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-slate-800">{item.title}</p>
                          {item.description && (
                            <p className="text-xs text-slate-500 mt-1">{item.description}</p>
                          )}
                          <div className="flex items-center gap-3 mt-2 flex-wrap">
                            <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200 uppercase tracking-wider">
                              {item.type || 'Tài liệu'}
                            </span>
                            {item.url && (
                              <a
                                href={item.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-100 flex items-center gap-1 hover:bg-indigo-100 transition-colors"
                              >
                                <ExternalLink className="w-3 h-3" />
                                Mở liên kết
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* Quizzes Tab */}
              {activeTab === 'quizzes' && (
                <div className="space-y-3">
                  {quizzes.length === 0 ? (
                    <EmptyState icon={HelpCircle} text="Chưa có bài kiểm tra nào." />
                  ) : (
                    quizzes.map((quiz, idx) => (
                      <div
                        key={quiz.id || idx}
                        className="p-4 rounded-xl bg-slate-50 border border-slate-100 hover:border-slate-200 transition-all"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-slate-800">{quiz.title}</p>
                            {quiz.description && (
                              <p className="text-xs text-slate-500 mt-1">{quiz.description}</p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-3 mt-3 flex-wrap">
                          <span className="text-[10px] font-bold text-violet-600 bg-violet-50 px-2 py-0.5 rounded-md border border-violet-100">
                            <Hash className="w-3 h-3 inline mr-1" />
                            Điểm đạt: {quiz.passingScore}
                          </span>
                          <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-100">
                            <Star className="w-3 h-3 inline mr-1" />
                            {quiz.xpReward || 50} XP
                          </span>
                          {quiz.questions && (
                            <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200">
                              {quiz.questions.length} câu hỏi
                            </span>
                          )}
                        </div>

                        {/* Quiz Questions Preview */}
                        {quiz.questions && quiz.questions.length > 0 && (
                          <div className="mt-4 space-y-3 pl-3 border-l-2 border-indigo-100">
                            {quiz.questions.map((q, qIdx) => (
                              <div key={q.id || qIdx} className="space-y-1.5">
                                <p className="text-xs font-bold text-slate-700">
                                  <span className="text-indigo-500 mr-1">Câu {qIdx + 1}:</span>
                                  {q.question}
                                </p>
                                {q.explanation && (
                                  <p className="text-[11px] text-slate-400 italic">
                                    💡 {q.explanation}
                                  </p>
                                )}
                                {q.options && q.options.length > 0 && (
                                  <div className="flex flex-wrap gap-1.5 mt-1">
                                    {q.options.map((opt, oIdx) => (
                                      <span
                                        key={opt.id || oIdx}
                                        className={`text-[10px] px-2 py-1 rounded-lg border font-semibold ${
                                          opt.isCorrect
                                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                            : 'bg-white text-slate-600 border-slate-200'
                                        }`}
                                      >
                                        {opt.isCorrect && '✓ '}
                                        {opt.content}
                                      </span>
                                    ))}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

const EmptyState = ({ icon: Icon, text }) => (
  <div className="flex flex-col items-center justify-center py-12 text-center">
    <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center mb-4">
      <Icon className="w-7 h-7 text-slate-300" />
    </div>
    <p className="text-sm text-slate-400 font-medium">{text}</p>
  </div>
);

export default NodeDetailModal;
