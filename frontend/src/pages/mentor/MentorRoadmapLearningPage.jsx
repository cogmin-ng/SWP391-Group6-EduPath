import { useMemo, useState, useEffect } from 'react';
import { Link, Navigate, useParams, useNavigate } from 'react-router-dom';
import { ArrowRight, ChevronRight, Loader2 } from 'lucide-react';
import {
  NodeSidebar,
  NodeHeader,
  ChecklistSection,
  MaterialsSection,
  QuizSection,
  TipsSection,
  ProgressCard,
} from '../../components/mentee/node';
import { getRoadmapById } from '../../services/roadmapService';
import { getNodeDetails } from '../../services/nodeService';

function formatUpdatedAt(value) {
  if (!value) return 'Gần đây';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Gần đây';
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
}

function mapMaterialButtonLabel(type) {
  if (type === 'VIDEO') return 'Xem';
  if (type === 'ARTICLE') return 'Đọc';
  if (type === 'DOCUMENTATION') return 'Mở';
  return 'Mở';
}

export default function MentorRoadmapLearningPage() {
  const { roadmapId } = useParams();
  const navigate = useNavigate();

  const [roadmap, setRoadmap] = useState(null);
  const [nodeDetails, setNodeDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [nodeLoading, setNodeLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentNodeIndex, setCurrentNodeIndex] = useState(0);

  useEffect(() => {
    const fetchRoadmap = async () => {
      try {
        setLoading(true);
        const data = await getRoadmapById(roadmapId);
        setRoadmap(data);
        setError('');
      } catch (err) {
        console.error('Failed to load roadmap:', err);
        setError(err?.response?.data?.message || 'Không thể tải lộ trình.');
      } finally {
        setLoading(false);
      }
    };
    fetchRoadmap();
  }, [roadmapId]);

  const nodes = useMemo(() => roadmap?.nodes || [], [roadmap]);
  const currentPhase = nodes[currentNodeIndex] || null;

  useEffect(() => {
    let isMounted = true;
    if (!currentPhase?.id) return undefined;

    const loadNode = async () => {
      setNodeLoading(true);
      setNodeDetails(null);
      try {
        const data = await getNodeDetails(currentPhase.id);
        if (!isMounted) return;
        setNodeDetails(data);
      } catch (err) {
        if (!isMounted) return;
        console.error('Failed to load node details:', err);
        setError(err?.response?.data?.message || 'Không thể tải nội dung node.');
      } finally {
        if (isMounted) {
          setNodeLoading(false);
        }
      }
    };

    loadNode();
    return () => {
      isMounted = false;
    };
  }, [currentPhase?.id]);

  const roadmapForSidebar = useMemo(() => {
    if (!roadmap) return null;
    return {
      title: roadmap.title,
      progress: 0,
      nodes: nodes.map((node, i) => ({
        id: node.id,
        index: i + 1,
        title: node.title,
        status: i === currentNodeIndex ? 'in-progress' : 'completed',
        summary: {
          completed: 0,
          total: node.checklists?.length || 0,
        },
      })),
    };
  }, [roadmap, nodes, currentNodeIndex]);

  const nodeData = useMemo(() => {
    if (!currentPhase) return null;
    return {
      id: currentPhase.id,
      title: currentPhase.title,
      description: currentPhase.description || roadmap?.description || '',
      nodeNumber: currentNodeIndex + 1,
      totalNodes: nodes.length,
      estimatedHours: currentPhase.duration || Math.max(1, (nodeDetails?.materials?.length || 0) * 2 + (nodeDetails?.checklists?.length || 0)),
      mentorGuided: true,
      updatedAt: formatUpdatedAt(currentPhase.updatedAt),
    };
  }, [currentPhase, currentNodeIndex, nodes.length, nodeDetails, roadmap?.description]);

  const checklist = useMemo(() => {
    if (!nodeDetails) return [];
    return nodeDetails.checklists || [];
  }, [nodeDetails]);

  const materials = useMemo(() => {
    if (!nodeDetails) return [];
    return (nodeDetails.materials || []).map((item) => ({
      ...item,
      buttonLabel: mapMaterialButtonLabel(item.type),
    }));
  }, [nodeDetails]);

  const quiz = useMemo(() => {
    if (!nodeDetails?.quizzes?.length) return null;
    const firstQuiz = nodeDetails.quizzes[0];
    return {
      id: firstQuiz.id,
      title: firstQuiz.title,
      questionCount: firstQuiz.questionCount || 0,
      durationMinutes: Math.max(5, (firstQuiz.questionCount || 0) * 2),
      latestAttempt: null,
    };
  }, [nodeDetails]);

  const handleNodeClick = (nodeId) => {
    const idx = nodes.findIndex((node) => node.id === nodeId);
    if (idx >= 0 && idx < nodes.length) {
      setCurrentNodeIndex(idx);
    }
  };

  const handleTipsRefresh = async () => {
    if (!currentPhase?.id) return;
    try {
      const data = await getNodeDetails(currentPhase.id);
      setNodeDetails(data);
    } catch (err) {
      console.error('Failed to refresh tips:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <p className="text-slate-500 text-sm">Đang tải lộ trình...</p>
      </div>
    );
  }

  if (!roadmap) {
    return <Navigate to="/mentor/roadmaps" replace />;
  }

  return (
    <div className="w-full">
      {/* Breadcrumb & Top Actions */}
      <div className="border-b border-slate-200 bg-white -mx-4 -mt-4 md:-mx-8 md:-mt-8 mb-6">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs sm:text-sm">
              <Link to="/mentor/roadmaps" className="text-slate-500 hover:text-indigo-600">
                Lộ trình của tôi
              </Link>
              <ChevronRight className="h-3.5 w-3.5 text-slate-300" />
              <span className="font-medium text-slate-700">{roadmap.title}</span>
              <span className="ml-2 inline-flex items-center rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-blue-700">
                Góc nhìn học viên (Xem trước)
              </span>
            </div>
          </div>
        </div>
      </div>

      <main className="w-full">
        {/* Phase Navigation Pills */}
        <div className="mb-6 flex flex-wrap items-center gap-2">
          {nodes.map((node, idx) => (
            <button
              key={node.id || idx}
              onClick={() => setCurrentNodeIndex(idx)}
              className={`rounded-full px-4 py-1.5 text-xs font-medium transition-all ${idx === currentNodeIndex
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

        <div className="grid gap-6 xl:grid-cols-[320px_minmax(0,1fr)_360px] 2xl:grid-cols-[340px_minmax(0,1fr)_380px]">
          {/* Left: Sidebar */}
          <NodeSidebar
            roadmap={roadmapForSidebar}
            currentNodeId={currentPhase?.id}
            onNodeClick={handleNodeClick}
            hideProgress={true}
          />

          {/* Center: Main content */}
          <main className="min-w-0 xl:col-start-2">
            {error ? (
              <div className="mb-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                {error}
              </div>
            ) : null}

            {nodeLoading ? (
              <div className="flex flex-col items-center justify-center gap-3 py-20">
                <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
                <p className="text-sm text-slate-500">Đang tải nội dung...</p>
              </div>
            ) : (
              <>
                {nodeData && (
                  <NodeHeader
                    node={nodeData}
                    roadmapTitle={roadmap?.title}
                    overallProgress={0}
                    hideProgress={true}
                  />
                )}

                <div className="space-y-6 mt-6">
                  {/* Banner Preview Mode */}
                  <div className="rounded-2xl border border-blue-100 bg-gradient-to-r from-blue-50 via-white to-indigo-50 p-5">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="text-sm font-semibold text-blue-700 font-bold">Chế độ xem trước</p>
                        <p className="mt-1 text-sm text-slate-500">
                          Bạn đang xem lộ trình dưới góc nhìn của học viên. Một số tương tác thay đổi tiến độ sẽ không hoạt động ở đây.
                        </p>
                      </div>
                    </div>
                  </div>

                  <ChecklistSection items={checklist} onToggle={() => {}} />
                  <TipsSection tips={nodeDetails?.tips || []} nodeId={currentPhase?.id} onRefresh={handleTipsRefresh} />
                </div>
              </>
            )}
          </main>

          {/* Right: Sidebar Aside */}
          <aside className="space-y-6 xl:col-start-3">
            <MaterialsSection materials={materials} variant="compact" />
            <QuizSection
              quiz={quiz}
              compact
              onStart={() => {}}
            />
          </aside>
        </div>
      </main>
    </div>
  );
}
