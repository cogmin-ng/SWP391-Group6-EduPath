import { useMemo, useState, useEffect } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { ArrowRight, ChevronRight } from 'lucide-react';
import MenteeHeader from '../../components/mentee/MenteeHeader';
import Footer from '../../components/landing/Footer';
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
import { getRoadmapBySlug } from './features/explore/data/roadmaps';
import { getEnrollmentBySlug, isEnrolled, updateEnrollmentProgress } from './features/enrollments/storage';

function generateNodeData(phase, phaseIndex, totalPhases) {
  return {
    id: `phase-${phaseIndex}`,
    title: phase.name,
    description: `${phase.highlights?.join(', ') || ''}`,
    nodeNumber: phaseIndex + 1,
    totalNodes: totalPhases,
    level: phaseIndex === 0 ? 'Beginner' : phaseIndex === totalPhases - 1 ? 'Advanced' : 'Intermediate',
    estimatedHours: parseInt(phase.weeks) * 3 || 8,
    mentorGuided: true,
    updatedAt: 'Oct 24',
  };
}

function generateChecklist(phase) {
  return (phase.highlights || []).map((h, i) => ({
    id: `cl-${phase.name}-${i}`,
    title: h,
    completed: phase.status === 'completed',
  }));
}

function generateMaterials(phase) {
  const types = ['VIDEO', 'ARTICLE', 'DOCUMENTATION'];
  return (phase.highlights || []).slice(0, 3).map((h, i) => ({
    id: `mat-${phase.name}-${i}`,
    title: h,
    type: types[i % types.length],
    buttonLabel: types[i % types.length] === 'VIDEO' ? 'Watch' : types[i % types.length] === 'ARTICLE' ? 'Read' : 'Open',
    url: '#',
  }));
}

function generateQuiz(phase) {
  return {
    id: `quiz-${phase.name}`,
    title: `${phase.name} Quiz`,
    questionCount: 10,
    durationMinutes: 10,
  };
}

export default function RoadmapLearningPage() {
  const { slug } = useParams();
  const roadmap = getRoadmapBySlug(slug);
  const enrollment = getEnrollmentBySlug(slug);
  const [progress, setProgress] = useState(enrollment?.progress ?? 0);
  const [currentPhaseIndex, setCurrentPhaseIndex] = useState(() => {
    if (!roadmap) return 0;
    const activeIdx = roadmap.phases.findIndex((p) => p.status === 'active');
    return activeIdx >= 0 ? activeIdx : 0;
  });

  const phases = roadmap?.phases || [];
  const currentPhase = phases[currentPhaseIndex];

  const roadmapForSidebar = useMemo(() => {
    if (!roadmap) return null;
    return {
      title: roadmap.title,
      progress,
      nodes: phases.map((p, i) => ({
        id: `phase-${i}`,
        title: p.name,
        status: i < currentPhaseIndex ? 'completed' : i === currentPhaseIndex ? 'in-progress' : 'locked',
      })),
    };
  }, [roadmap, progress, phases, currentPhaseIndex]);

  const currentNode = useMemo(() => {
    if (!currentPhase) return null;
    return generateNodeData(currentPhase, currentPhaseIndex, phases.length);
  }, [currentPhase, currentPhaseIndex, phases.length]);

  const checklist = useMemo(() => {
    if (!currentPhase) return [];
    return generateChecklist(currentPhase);
  }, [currentPhase]);

  const materials = useMemo(() => {
    if (!currentPhase) return [];
    return generateMaterials(currentPhase);
  }, [currentPhase]);

  const quiz = useMemo(() => {
    if (!currentPhase) return null;
    return generateQuiz(currentPhase);
  }, [currentPhase]);

  if (!roadmap) return <Navigate to="/explore" replace />;
  if (!isEnrolled(slug)) return <Navigate to={`/explore/${slug}`} replace />;

  const handleNodeClick = (nodeId) => {
    const idx = parseInt(nodeId.replace('phase-', ''), 10);
    if (idx >= 0 && idx < phases.length) {
      setCurrentPhaseIndex(idx);
    }
  };

  const handleContinue = () => {
    const next = Math.min(progress + 10, 100);
    setProgress(next);
    updateEnrollmentProgress(slug, next);
  };

  const completedChecklist = checklist.filter((i) => i.completed).length;
  const checklistProgress = checklist.length > 0 ? Math.round((completedChecklist / checklist.length) * 100) : 0;
  const overallProgress = progress;

  return (
    <div className="min-h-screen bg-slate-50">
      <MenteeHeader />

      {/* Breadcrumb */}
      <div className="mx-auto flex w-full max-w-7xl items-center gap-1 px-4 pt-24 text-xs text-slate-500 sm:px-6 lg:px-8">
        <Link to="/roadmaps" className="hover:text-indigo-600">Lộ trình của tôi</Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="font-medium text-slate-700">{roadmap.title}</span>
      </div>

      <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
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

        <div className="flex flex-col gap-6 lg:flex-row">
          {/* Left: Sidebar */}
          <NodeSidebar
            roadmap={roadmapForSidebar}
            currentNodeId={`phase-${currentPhaseIndex}`}
            onNodeClick={handleNodeClick}
          />

          {/* Center: Main content */}
          <main className="min-w-0 flex-1">
            <NodeHeader node={currentNode} />

            <div className="flex flex-col gap-6 xl:flex-row">
              {/* Content column */}
              <div className="min-w-0 flex-1 space-y-6">
                <ChecklistSection items={checklist} onToggle={() => {}} />
                <MaterialsSection materials={materials} />
                <QuizSection quiz={quiz} />
                <TipsSection tips={[]} onSubmitTip={async () => {}} />

                {/* Continue button */}
                <div className="rounded-2xl border border-indigo-100 bg-indigo-50/40 p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-indigo-700">Tiếp tục lộ trình</p>
                      <p className="mt-0.5 text-xs text-slate-500">Hoàn thành module này để mở khóa module tiếp theo.</p>
                    </div>
                    <Button className="gap-2 shrink-0" onClick={handleContinue}>
                      Học tiếp <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Right: Progress card */}
              <div className="w-full shrink-0 xl:w-64">
                <ProgressCard
                  checklistProgress={checklistProgress}
                  materialsRead={Math.min(checklistProgress + 10, 100)}
                  quizzesDone={progress >= 100 ? '1/1' : '0/1'}
                  overallProgress={overallProgress}
                />
              </div>
            </div>
          </main>
        </div>
      </main>

      <Footer />
    </div>
  );
}
