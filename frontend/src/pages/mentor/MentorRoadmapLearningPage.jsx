import { useMemo, useState } from 'react';
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
import { myRoadmaps } from '../../mock/mentorDashboardData';
import { jsQuizQuestions } from '../../mock/quizQuestions';

/**
 * Helper function to generate node data from roadmap phases
 */
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

/**
 * Helper function to generate checklist from phase highlights
 */
function generateChecklist(phase) {
  return (phase.highlights || []).map((h, i) => ({
    id: `cl-${phase.name}-${i}`,
    title: h,
    completed: phase.status === 'completed',
  }));
}

/**
 * Helper function to generate materials from phase highlights
 */
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

/**
 * Helper function to generate quiz from questions
 */
function generateQuiz(phase) {
  const questions = jsQuizQuestions.map((q) => ({
    ...q,
    id: `${phase.name}-${q.id}`,
  }));
  return {
    id: `quiz-${phase.name}`,
    title: `${phase.name} Quiz`,
    questionCount: questions.length,
    durationMinutes: 15,
    questions,
  };
}

export default function MentorRoadmapLearningPage() {
  const { roadmapId } = useParams();
  const navigate = useNavigate();

  // Find the roadmap from mock data (convert roadmapId to number for comparison)
  const roadmap = myRoadmaps.find((r) => r.id === parseInt(roadmapId));
  
  const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  if (!roadmap) {
    return <Navigate to="/mentor/roadmaps" replace />;
  }

  const phases = roadmap.phases || [];
  const currentPhase = phases[currentPhaseIndex];

  // Generate sidebar roadmap data
  const roadmapForSidebar = useMemo(() => {
    return {
      title: roadmap.title,
      progress,
      nodes: phases.map((p, i) => ({
        id: `phase-${i}`,
        title: p.name,
        status: 'active', // Mentor sees all phases as accessible
      })),
    };
  }, [roadmap, progress, phases]);

  // Generate current node data
  const currentNode = useMemo(() => {
    if (!currentPhase) return null;
    return generateNodeData(currentPhase, currentPhaseIndex, phases.length);
  }, [currentPhase, currentPhaseIndex, phases.length]);

  // Generate checklist
  const checklist = useMemo(() => {
    if (!currentPhase) return [];
    return generateChecklist(currentPhase);
  }, [currentPhase]);

  // Generate materials
  const materials = useMemo(() => {
    if (!currentPhase) return [];
    return generateMaterials(currentPhase);
  }, [currentPhase]);

  // Generate quiz
  const quiz = useMemo(() => {
    if (!currentPhase) return null;
    return generateQuiz(currentPhase);
  }, [currentPhase]);

  const handleNodeClick = (nodeId) => {
    const idx = parseInt(nodeId.replace('phase-', ''), 10);
    if (idx >= 0 && idx < phases.length) {
      setCurrentPhaseIndex(idx);
    }
  };

  const handleManageMentees = () => {
    // Navigate to mentee management page for this roadmap
    // navigate(`/mentor/roadmaps/${roadmapId}/mentees`);
  };

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

            {/* Top Action Buttons */}
            <div className="flex items-center gap-2">
            </div>
          </div>
        </div>
      </div>

      <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {/* Phase Navigation Pills */}
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
                    : 'border border-slate-200 bg-white text-slate-500 hover:border-slate-300'
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
