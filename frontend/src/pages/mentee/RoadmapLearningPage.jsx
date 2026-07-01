import { useEffect, useMemo, useState } from 'react';
import { Link, Navigate, useParams, useNavigate } from 'react-router-dom';
import { ArrowRight, ChevronRight, Loader2 } from 'lucide-react';
import MenteeHeader from '../../components/mentee/MenteeHeader';
import Button from '../../components/ui/Button';
import {
  NodeSidebar,
  NodeHeader,
  ChecklistSection,
  MaterialsSection,
  QuizSection,
  TipsSection,
  ProgressCard,
} from '../../components/mentee/node';
import { getRoadmapBySlug } from '../../services/roadmapService';
import { getNodeDetails, toggleChecklistProgress, updateNodeProgress } from '../../services/nodeService';

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

export default function RoadmapLearningPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [roadmap, setRoadmap] = useState(null);
  const [nodeDetails, setNodeDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [nodeLoading, setNodeLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0);

  useEffect(() => {
    let isMounted = true;

    const loadRoadmap = async () => {
      try {
        setLoading(true);
        const data = await getRoadmapBySlug(slug);
        if (!isMounted) return;
        setRoadmap(data);
        const firstIncompleteIndex = data.nodes.findIndex((node) => !node.completed);
        setCurrentPhaseIndex(firstIncompleteIndex >= 0 ? firstIncompleteIndex : 0);
        setError('');
      } catch (err) {
        if (!isMounted) return;
        setRoadmap(null);
        setError(err?.response?.data?.message || 'Không thể tải lộ trình.');
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadRoadmap();

    return () => {
      isMounted = false;
    };
  }, [slug]);

  const phases = useMemo(() => roadmap?.nodes || [], [roadmap]);
  const currentPhase = phases[currentPhaseIndex] || null;

  useEffect(() => {
    let isMounted = true;
    if (!currentPhase?.id) {
      return undefined;
    }

    const loadNode = async () => {
      setNodeLoading(true);
      setNodeDetails(null);
      try {
        const data = await getNodeDetails(currentPhase.id);
        if (!isMounted) return;
        setNodeDetails(data.data || data);
      } catch (err) {
        if (!isMounted) return;
        setNodeDetails(null);
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
      progress: Math.round(roadmap.enrollment?.progressPercent || 0),
      nodes: phases.map((node, i) => ({
        id: node.id,
        index: i + 1,
        title: node.title,
        status: node.completed ? 'completed' : i === currentPhaseIndex ? 'in-progress' : 'locked',
        summary: {
          completed:
            i === currentPhaseIndex
              ? (nodeDetails?.checklists || []).filter((item) => item.completed).length
              : node.completed
                ? node.checklists?.length || 0
                : 0,
          total: node.checklists?.length || 0,
        },
      })),
    };
  }, [roadmap, phases, currentPhaseIndex, nodeDetails]);

  const currentNode = useMemo(() => {
    if (!currentPhase || !nodeDetails) return null;
    return {
      id: currentPhase.id,
      title: currentPhase.title,
      description: currentPhase.description || roadmap?.description || '',
      nodeNumber: currentPhaseIndex + 1,
      totalNodes: phases.length,
      estimatedHours: Math.max(1, nodeDetails.materials.length * 2 + nodeDetails.checklists.length),
      mentorGuided: true,
      updatedAt: formatUpdatedAt(currentPhase.updatedAt),
    };
  }, [currentPhase, currentPhaseIndex, phases.length, nodeDetails, roadmap?.description]);

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
      latestAttempt: firstQuiz.latestAttempt || null,
    };
  }, [nodeDetails]);

  if (!loading && !roadmap) {
    return <Navigate to="/explore" replace />;
  }

  if (!loading && roadmap && !roadmap.enrollment) {
    return <Navigate to={`/explore/${slug}`} replace />;
  }

  const handleNodeClick = (nodeId) => {
    const idx = phases.findIndex((node) => node.id === nodeId);
    if (idx >= 0 && idx < phases.length) {
      setCurrentPhaseIndex(idx);
    }
  };

  const handleChecklistToggle = async (checklistId) => {
    if (!currentPhase?.id) return;

    const item = checklist.find((entry) => entry.id === checklistId);
    if (!item) return;

    try {
      const updatedNode = await toggleChecklistProgress(currentPhase.id, checklistId, !item.completed);
      setNodeDetails(updatedNode);
    } catch (err) {
      setError(err?.response?.data?.message || 'Không thể cập nhật checklist.');
    }
  };

  const handleContinue = async () => {
    if (!currentPhase?.id) return;

    try {
      const result = await updateNodeProgress(currentPhase.id, true);
      setRoadmap((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          enrollment: result.enrollment,
          nodes: prev.nodes.map((node) =>
            node.id === currentPhase.id ? { ...node, completed: true } : node
          ),
        };
      });

      const nextIndex = phases.findIndex((node) => node.id === currentPhase.id) + 1;
      if (nextIndex < phases.length) {
        setCurrentPhaseIndex(nextIndex);
      }
    } catch (err) {
      setError(err?.response?.data?.message || 'Không thể cập nhật tiến độ node.');
    }
  };

  const handleTipsRefresh = async () => {
    if (!currentPhase?.id) return;
    try {
      const data = await getNodeDetails(currentPhase.id);
      setNodeDetails(data.data || data);
    } catch (err) {
      setError(err?.response?.data?.message || 'Không thể làm mới tips.');
    }
  };

  const completedChecklist = checklist.filter((i) => i.completed).length;
  const checklistProgress = checklist.length > 0 ? Math.round((completedChecklist / checklist.length) * 100) : 0;
  const overallProgress = Math.round(roadmap?.enrollment?.progressPercent || 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <p className="text-sm text-slate-500">Đang tải lộ trình...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <MenteeHeader />

      {/* Breadcrumb */}
      <div className="mx-auto flex w-full max-w-[1560px] items-center gap-1 px-4 pt-24 text-xs text-slate-500 sm:px-6 lg:px-8">
        <Link to="/roadmaps" className="hover:text-indigo-600">Lộ trình của tôi</Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="font-medium text-slate-700">{roadmap.title}</span>
      </div>

      <main className="mx-auto w-full max-w-[1560px] px-4 py-6 sm:px-6 lg:px-8">
        {/* Phase nav pills */}
        <div className="mb-6 flex flex-wrap items-center gap-2">
          {phases.map((phase, idx) => (
            <button
              key={phase.name}
              onClick={() => setCurrentPhaseIndex(idx)}
              className={`rounded-full px-4 py-1.5 text-xs font-medium transition-all ${
                idx === currentPhaseIndex
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : idx < currentPhaseIndex
                    ? 'bg-indigo-50 text-indigo-700'
                    : 'border border-slate-200 bg-white text-slate-500'
              }`}
            >
              {phase.name}
            </button>
          ))}
        </div>

        <div className="grid gap-6 xl:grid-cols-[320px_minmax(0,1fr)_360px] 2xl:grid-cols-[340px_minmax(0,1fr)_380px]">
          <NodeSidebar
            roadmap={roadmapForSidebar}
            currentNodeId={currentPhase?.id}
            onNodeClick={handleNodeClick}
          />

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
                <NodeHeader
                  node={currentNode}
                  roadmapTitle={roadmap?.title}
                  overallProgress={overallProgress}
                />

                <div className="space-y-6">
                  <div className="rounded-2xl border border-indigo-100 bg-gradient-to-r from-indigo-50 via-white to-violet-50 p-5">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="text-sm font-semibold text-indigo-700">Tiếp tục lộ trình</p>
                        <p className="mt-1 text-sm text-slate-500">Hoàn thành module này để mở khóa module tiếp theo và cập nhật tiến độ của bạn.</p>
                      </div>
                      <Button className="gap-2 shrink-0" onClick={handleContinue}>
                        Học tiếp <ArrowRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <ChecklistSection items={checklist} onToggle={handleChecklistToggle} />
                  <TipsSection tips={nodeDetails?.tips || []} nodeId={currentPhase?.id} onRefresh={handleTipsRefresh} />
                </div>
              </>
            )}
          </main>

          <aside className="space-y-6 xl:col-start-3">
            <ProgressCard
              checklistProgress={checklistProgress}
              materialsRead={materials.length > 0 ? 100 : 0}
              quizzesDone={quiz?.latestAttempt?.status === 'PASS' ? '1/1' : quiz ? '0/1' : '0/0'}
              overallProgress={overallProgress}
            />
            <MaterialsSection materials={materials} variant="compact" />
            <QuizSection
              quiz={quiz}
              compact
              onStart={() => navigate(`/roadmaps/${slug}/learn/quiz?nodeId=${currentPhase?.id}`)}
            />
          </aside>
        </div>
      </main>

    </div>
  );
}
