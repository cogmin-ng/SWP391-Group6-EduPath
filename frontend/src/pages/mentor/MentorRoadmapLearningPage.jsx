import { useMemo, useState, useEffect } from 'react';
import { Link, Navigate, useParams, useNavigate } from 'react-router-dom';
import { ArrowRight, ChevronRight } from 'lucide-react';
import {
  NodeSidebar,
  NodeHeader,
  ChecklistSection,
  MaterialsSection,
  QuizSection,
  TipsSection,
} from '../../components/mentee/node';
import { getRoadmapById } from '../../services/roadmapService';

/**
 * Helper function to generate node data from roadmap nodes
 */
function generateNodeData(node, nodeIndex, totalNodes) {
  return {
    id: node.id || `node-${nodeIndex}`,
    title: node.title,
    description: node.description || '',
    nodeNumber: nodeIndex + 1,
    totalNodes: totalNodes,
    estimatedHours: node.duration || 'N/A',
    mentorGuided: true,
    updatedAt: 'N/A',
  };
}

/**
 * Helper function to generate checklist
 */
function generateChecklist(node) {
  return (node.checklists || []).map((c, i) => ({
    id: c.id || `cl-${i}`,
    title: c.title,
    completed: false,
  }));
}

/**
 * Helper function to generate materials
 */
function generateMaterials(node) {
  return (node.materials || []).map((m, i) => ({
    id: m.id || `mat-${i}`,
    title: m.title,
    type: m.type || 'DOCUMENTATION',
    buttonLabel: 'Open',
    url: m.url || '#',
  }));
}

/**
 * Helper function to generate quiz
 */
function generateQuiz(node) {
  if (!node.quizzes || node.quizzes.length === 0) return null;
  const q = node.quizzes[0];
  return {
    id: q.id,
    title: q.title || `${node.title} Quiz`,
    questionCount: 0,
    durationMinutes: 15,
    questions: [],
  };
}

export default function MentorRoadmapLearningPage() {
  const { roadmapId } = useParams();
  const navigate = useNavigate();

  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [currentNodeIndex, setCurrentNodeIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const fetchRoadmap = async () => {
      try {
        setLoading(true);
        const data = await getRoadmapById(roadmapId);
        setRoadmap(data);
      } catch (err) {
        console.error('Failed to load roadmap:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchRoadmap();
  }, [roadmapId]);

  const nodes = roadmap?.nodes || [];
  const currentNode = nodes[currentNodeIndex];

  // Generate sidebar roadmap data
  const roadmapForSidebar = useMemo(() => {
    if (!roadmap) return null;
    return {
      title: roadmap.title,
      progress,
      nodes: nodes.map((n, i) => ({
        id: n.id || `node-${i}`,
        title: n.title,
        status: 'active', // Mentor sees all phases as accessible
      })),
    };
  }, [roadmap, progress, nodes]);

  // Generate current node data
  const nodeData = useMemo(() => {
    if (!currentNode) return null;
    return generateNodeData(currentNode, currentNodeIndex, nodes.length);
  }, [currentNode, currentNodeIndex, nodes.length]);

  // Generate checklist
  const checklist = useMemo(() => {
    if (!currentNode) return [];
    return generateChecklist(currentNode);
  }, [currentNode]);

  // Generate materials
  const materials = useMemo(() => {
    if (!currentNode) return [];
    return generateMaterials(currentNode);
  }, [currentNode]);

  // Generate quiz
  const quiz = useMemo(() => {
    if (!currentNode) return null;
    return generateQuiz(currentNode);
  }, [currentNode]);

  const handleNodeClick = (nodeId) => {
    const idx = nodes.findIndex((n, i) => (n.id || `node-${i}`) === nodeId);
    if (idx >= 0 && idx < nodes.length) {
      setCurrentNodeIndex(idx);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <p className="text-slate-500">Đang tải...</p>
      </div>
    );
  }

  if (error || !roadmap) {
    return <Navigate to="/mentor/roadmaps" replace />;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Breadcrumb & Top Actions */}
      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Link to="/mentor/roadmaps" className="text-sm text-slate-500 hover:text-indigo-600">
                Lộ trình của tôi
              </Link>
              <ChevronRight className="h-4 w-4 text-slate-300" />
              <span className="text-sm font-medium text-slate-700">{roadmap.title}</span>
              <span className="ml-2 inline-flex items-center rounded-full bg-blue-50 px-2 py-1 text-xs font-semibold text-blue-700">
                Xem như học viên
              </span>
            </div>
          </div>
        </div>
      </div>

      <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {/* Phase Navigation Pills */}
        <div className="mb-6 flex flex-wrap items-center gap-2">
          {nodes.map((node, idx) => (
            <button
              key={node.id || idx}
              onClick={() => setCurrentNodeIndex(idx)}
              className={`rounded-full px-4 py-1.5 text-xs font-medium transition-all ${
                idx === currentNodeIndex
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : idx < currentNodeIndex
                    ? 'bg-indigo-50 text-indigo-700'
                    : 'border border-slate-200 bg-white text-slate-500 hover:border-slate-300'
              }`}
            >
              {node.title}
            </button>
          ))}
        </div>

        <div className="flex flex-col gap-6 lg:flex-row">
          {/* Left: Sidebar */}
          {roadmapForSidebar && (
            <NodeSidebar
              roadmap={roadmapForSidebar}
              currentNodeId={currentNode?.id || `node-${currentNodeIndex}`}
              onNodeClick={handleNodeClick}
            />
          )}

          {/* Center: Main content */}
          <main className="min-w-0 flex-1">
            {nodeData && <NodeHeader node={nodeData} />}

            <div className="flex flex-col gap-6 xl:flex-row">
              {/* Content column */}
              <div className="min-w-0 flex-1 space-y-6">
                <ChecklistSection items={checklist} onToggle={() => {}} />
                <MaterialsSection materials={materials} />
                <QuizSection quiz={quiz} onStart={() => {}} />
                <TipsSection tips={[]} onSubmitTip={async () => {}} />
              </div>
            </div>
          </main>
        </div>
      </main>
    </div>
  );
}
