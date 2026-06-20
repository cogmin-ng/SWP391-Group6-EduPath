import { useState, useEffect } from 'react';
import { CheckCircle2 } from 'lucide-react';
import ChecklistSection from './ChecklistSection';
import MaterialsSection from './MaterialsSection';
import QuizSection from './QuizSection';
import { getQuizzesByNode } from '../../services/quizService';

/**
 * Editor for a node's "detail" sections (Checklist, Materials, Quiz),
 * reused by both the Create and Edit roadmap pages inside the node form.
 *
 * Props:
 * - checklists / onChecklistsChange
 * - materials / onMaterialsChange
 * - roadmapId: used for quiz create/edit navigation
 * - nodeId: the node's real DB id (string) when already saved; null/number for
 *   a brand-new unsaved node. Quiz management is only available for saved nodes.
 */
const NodeDetailEditor = ({
  checklists,
  onChecklistsChange,
  materials,
  onMaterialsChange,
  roadmapId,
  nodeId,
}) => {
  const isSavedNode = typeof nodeId === 'string' && nodeId.length > 0;
  const [quizzes, setQuizzes] = useState([]);

  const fetchQuizzes = async () => {
    if (!isSavedNode) return;
    try {
      const data = await getQuizzesByNode(nodeId);
      setQuizzes(data || []);
    } catch (err) {
      console.error('Failed to fetch quizzes:', err);
      setQuizzes([]);
    }
  };

  useEffect(() => {
    if (isSavedNode) {
      fetchQuizzes();
    } else {
      setQuizzes([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nodeId]);

  return (
    <div className="space-y-2">
      <ChecklistSection items={checklists || []} onChange={onChecklistsChange} />
      <MaterialsSection materials={materials || []} onChange={onMaterialsChange} />

      {isSavedNode ? (
        <QuizSection
          quizzes={quizzes}
          roadmapId={roadmapId}
          nodeId={nodeId}
          onRefresh={fetchQuizzes}
        />
      ) : (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6 text-purple-600" />
            </div>
            <h2 className="text-xl font-bold text-slate-900">Quizzes & Assessments</h2>
          </div>
          <div className="py-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200">
            <p className="text-slate-500 text-sm">
              Hãy lưu lộ trình trước (Lưu Nháp) để thêm bài trắc nghiệm cho node này.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default NodeDetailEditor;
