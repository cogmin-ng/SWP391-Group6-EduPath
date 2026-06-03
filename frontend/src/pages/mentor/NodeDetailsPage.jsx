import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import NodeDetailHeader from '../../components/mentor/NodeDetailHeader';
import ChecklistSection from '../../components/mentor/ChecklistSection';
import MaterialsSection from '../../components/mentor/MaterialsSection';
import TipsSection from '../../components/mentor/TipsSection';
import QuizSection from '../../components/mentor/QuizSection';
import { getTips } from '../../services/roadmapService';

const NodeDetailsPage = () => {
  const { roadmapId, nodeId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  // State for tips
  const [tips, setTips] = useState([]);
  const [tipsLoading, setTipsLoading] = useState(true);

  // Get node data from state if available, otherwise use mock data
  const stateNodeData = location.state?.nodeData;
  
  // Mock data for node details (replace with API call later)
  const nodeData = stateNodeData ? {
    id: stateNodeData.id,
    title: stateNodeData.title,
    description: stateNodeData.description,
    category: stateNodeData.title.split(':')[0] || 'Backend',
    nodeNumber: 2,
    totalNodes: 3,
  } : {
    id: parseInt(nodeId),
    title: 'Backend Development',
    description: 'Học ExpressJS, Prisma, PostgreSQL và Authentication.',
    category: 'Backend',
    nodeNumber: 2,
    totalNodes: 3,
  };

  // Fetch tips on component mount
  useEffect(() => {
    const fetchTips = async () => {
      setTipsLoading(true);
      try {
        const data = await getTips(nodeId);
        setTips(data || []);
      } catch (err) {
        console.error('Failed to fetch tips:', err);
        // Fallback to empty array on error
        setTips([]);
      } finally {
        setTipsLoading(false);
      }
    };

    fetchTips();
  }, [nodeId]);

  const checklistItems = [
    { id: 1, title: 'Hiểu ExpressJS', completed: true },
    { id: 2, title: 'Hiểu Middleware', completed: true },
    { id: 3, title: 'Kết nối PostgreSQL với Prisma', completed: false },
  ];

  const materials = [
    {
      id: 1,
      title: 'ExpressJS Crash Course',
      type: 'VIDEO • 45 MINS',
      icon: 'Play',
      description: 'A comprehensive introduction to building RESTful APIs with Express.',
    },
    {
      id: 2,
      title: 'Prisma Official Docs',
      type: 'DOCUMENTATION',
      icon: 'BookOpen',
      description: 'Reference guide for Prisma ORM schema and client usage.',
    },
  ];

  const quizzes = [
    {
      id: 1,
      question: 'JWT (JSON Web Token) chủ yếu được sử dụng để làm gì?',
      options: [
        { id: 'A', label: 'Mã hóa mật khẩu người dùng', isCorrect: false },
        { id: 'B', label: 'Xác thực và ủy quyền an toàn giữa các bên', isCorrect: true },
        { id: 'C', label: 'Lưu trữ dữ liệu session trên server', isCorrect: false },
        { id: 'D', label: 'Thêm lựa chọn...', isCorrect: false },
      ],
      selectedAnswer: 'B',
      explanation: 'JWT là token dùng để xác thực người dùng.',
    },
  ];

  const handleBack = () => {
    // Navigate back to create roadmap page when editing nodes during creation
    if (roadmapId === 'new') {
      navigate('/mentor/create-roadmap');
    } else {
      navigate(`/mentor/roadmaps/${roadmapId}`);
    }
  };

  const handleRefreshTips = () => {
    const fetchTips = async () => {
      setTipsLoading(true);
      try {
        const data = await getTips(nodeId);
        setTips(data || []);
      } catch (err) {
        console.error('Failed to refresh tips:', err);
      } finally {
        setTipsLoading(false);
      }
    };

    fetchTips();
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Back Button */}
        <button
          onClick={handleBack}
          className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-medium mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Quay lại
        </button>

        {/* Header */}
        <NodeDetailHeader node={nodeData} />

        {/* Main Content - 2 Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Sections (70%) */}
          <div className="lg:col-span-2 space-y-6">
            <ChecklistSection items={checklistItems} />
            <MaterialsSection materials={materials} />
            <TipsSection tips={tips} nodeId={nodeData.id} onRefresh={handleRefreshTips} />
            <QuizSection quizzes={quizzes} />
          </div>

          {/* Right Column - Summary (30%) */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 sticky top-8">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">Tóm Tắt Node</h2>
              
              <div className="space-y-4">
                {/* Node Info */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">Node:</span>
                    <span className="font-semibold text-slate-900">{nodeData.nodeNumber} of {nodeData.totalNodes}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">Danh Mục:</span>
                    <span className="font-semibold text-slate-900">{nodeData.category}</span>
                  </div>
                </div>

                <div className="h-px bg-slate-200"></div>

                {/* Checklist Progress */}
                <div>
                  <p className="text-xs text-slate-600 mb-2">Hoàn Thiện Checklist</p>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div
                      className="bg-indigo-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: '66%' }}
                    ></div>
                  </div>
                  <p className="text-xs text-slate-600 mt-1">2/3</p>
                </div>

                {/* Material Count */}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Materials:</span>
                  <span className="font-semibold text-slate-900">{materials.length}</span>
                </div>

                {/* Tips Count */}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Tips:</span>
                  <span className="font-semibold text-slate-900">{tips.length}</span>
                </div>

                {/* Quiz Count */}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Quizzes:</span>
                  <span className="font-semibold text-slate-900">{quizzes.length}</span>
                </div>

                <div className="h-px bg-slate-200"></div>

                {/* Action Button */}
                <button
                  onClick={() => console.log('Save changes')}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 rounded-lg transition-colors"
                >
                  Lưu Thay Đổi
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Action Buttons */}
        <div className="mt-8 flex gap-3 max-w-2xl lg:max-w-none lg:col-span-2">
          <button
            onClick={handleBack}
            className="px-6 py-2.5 border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-medium rounded-lg transition-colors"
          >
            Quay lại
          </button>
        </div>
      </div>
    </div>
  );
};

export default NodeDetailsPage;
