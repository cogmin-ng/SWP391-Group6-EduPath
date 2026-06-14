import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import {
  NodeSidebar,
  NodeHeader,
  ChecklistSection,
  MaterialsSection,
  QuizSection,
  TipsSection,
  ProgressCard,
} from '../../components/mentee/node';

import {
  getRoadmapById,
  getNodeDetails,
  getChecklist,
  getMaterials,
  getQuiz,
  getTips,
  submitTip,
} from '../../services/roadmapService';

/**
 * Mentee Node Details Page
 * Route: /mentee/roadmaps/:roadmapId/nodes/:nodeId
 *
 * 3-column layout: Sidebar | Content | Progress Card
 * All data is fetched via the service layer (currently mock).
 */
export default function MenteeNodeDetailsPage() {
  const { roadmapId, nodeId } = useParams();

  // ─── State ──────────────────────────────────────────────
  const [roadmap, setRoadmap] = useState(null);
  const [node, setNode] = useState(null);
  const [checklist, setChecklist] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [quiz, setQuiz] = useState(null);
  const [tips, setTips] = useState([]);
  const [loading, setLoading] = useState(true);

  // ─── Data fetching ──────────────────────────────────────
  const fetchTips = async () => {
    try {
      const tipsData = await getTips(nodeId);
      setTips(tipsData || []);
    } catch (err) {
      console.error('Failed to fetch tips:', err);
      setTips([]);
    }
  };

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      try {
        const [roadmapData, nodeData, checklistData, materialsData, quizData] =
          await Promise.all([
            getRoadmapById(roadmapId),
            getNodeDetails(roadmapId, nodeId),
            getChecklist(nodeId),
            getMaterials(nodeId),
            getQuiz(nodeId),
          ]);

        setRoadmap(roadmapData);
        setNode(nodeData);
        setChecklist(checklistData);
        setMaterials(materialsData);
        setQuiz(quizData);

        // fetch tips separately to allow refresh
        await fetchTips();
      } catch (err) {
        console.error('Failed to load node details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, [roadmapId, nodeId]);

  // ─── Handlers ───────────────────────────────────────────
  const handleChecklistToggle = (itemId) => {
    setChecklist((prev) =>
      prev.map((item) =>
        item.id === itemId ? { ...item, completed: !item.completed } : item
      )
    );
  };

  const handleNodeClick = (clickedNodeId) => {
    // Mock action — in production, navigate to the node
    console.log(`Navigate to node: ${clickedNodeId}`);
  };

  const handleSubmitTip = async (content) => {
    try {
      await submitTip(nodeId, content);
      // Refresh tips list after submission
      await fetchTips();
    } catch (err) {
      console.error('Failed to submit tip:', err);
    }
  };

  // ─── Derived values ─────────────────────────────────────
  const completedChecklist = checklist.filter((i) => i.completed).length;
  const checklistProgress =
    checklist.length > 0
      ? Math.round((completedChecklist / checklist.length) * 100)
      : 0;
  const materialsRead = 25; // Mock — will come from backend
  const quizzesDone = '0/1'; // Mock — will come from backend
  const overallProgress = Math.round(
    (checklistProgress * 0.5 + materialsRead * 0.3 + 0 * 0.2)
  ); // Weighted mock formula

  // ─── Loading skeleton ───────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-3 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
          <p className="text-sm text-slate-400 font-medium">
            Đang tải nội dung...
          </p>
        </div>
      </div>
    );
  }

  // ─── Render ─────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-[1440px] mx-auto px-4 lg:px-6 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* ── Left: Sidebar ── */}
          <NodeSidebar
            roadmap={roadmap}
            currentNodeId={nodeId}
            onNodeClick={handleNodeClick}
          />

          {/* ── Center: Main content ── */}
          <main className="flex-1 min-w-0">
            <NodeHeader node={node} />

            <div className="flex flex-col xl:flex-row gap-6">
              {/* Content column */}
              <div className="flex-1 min-w-0 space-y-6">
                <ChecklistSection
                  items={checklist}
                  onToggle={handleChecklistToggle}
                />
                <MaterialsSection materials={materials} />
                <QuizSection quiz={quiz} roadmapId={roadmapId} nodeId={nodeId} />
                <TipsSection tips={tips} onSubmitTip={handleSubmitTip} />
              </div>

              {/* ── Right: Progress card ── */}
              <div className="w-full xl:w-64 flex-shrink-0">
                <ProgressCard
                  checklistProgress={checklistProgress}
                  materialsRead={materialsRead}
                  quizzesDone={quizzesDone}
                  overallProgress={overallProgress}
                />
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
