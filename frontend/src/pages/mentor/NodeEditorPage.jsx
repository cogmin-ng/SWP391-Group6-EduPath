import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Lightbulb } from 'lucide-react';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Textarea from '../../components/ui/Textarea';
import NodeDetailEditor from '../../components/mentor/NodeDetailEditor';

const NodeEditorPage = () => {
  const { roadmapId, nodeId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const roadmapFormData = location.state?.formData;
  const nodesList = location.state?.nodes || [];

  const isEditing = nodeId !== 'new';

  const [nodeData, setNodeData] = useState({
    title: '',
    description: '',
    duration: '',
    studyTips: '',
    checklists: [],
    materials: [],
    quizzes: [],
  });

  const [error, setError] = useState('');

  // Initial load
  useEffect(() => {
    // If router state is missing, warn and navigate back
    if (!roadmapFormData) {
      alert('Không tìm thấy thông tin lộ trình học tập. Đang quay lại...');
      const backUrl = roadmapId === 'new' ? '/mentor/create-roadmap' : `/mentor/roadmaps/${roadmapId}/edit`;
      navigate(backUrl, { replace: true });
      return;
    }

    if (isEditing) {
      // Find the node in the passed state list
      // nodeId can be numeric/string ID or timestamp
      const foundNode = nodesList.find(
        (n) => String(n.id) === String(nodeId)
      );

      if (foundNode) {
        setNodeData({
          id: foundNode.id,
          title: foundNode.title || '',
          description: foundNode.description || '',
          duration: foundNode.duration || '',
          studyTips: foundNode.studyTips || '',
          checklists: foundNode.checklists || [],
          materials: foundNode.materials || [],
          quizzes: foundNode.quizzes || [],
        });
      } else {
        setError('Không tìm thấy thông tin của node cần chỉnh sửa.');
      }
    }
  }, [nodeId, isEditing, roadmapFormData, nodesList, navigate, roadmapId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNodeData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveNode = () => {
    if (!nodeData.title.trim()) {
      setError('Vui lòng nhập Tên Node.');
      return;
    }

    let updatedNodes;
    if (isEditing) {
      // Replace existing node
      updatedNodes = nodesList.map((n) =>
        String(n.id) === String(nodeId) ? { ...n, ...nodeData } : n
      );
    } else {
      // Create new node with temporary ID
      const newNode = {
        ...nodeData,
        id: Date.now(), // timestamp for front-end editing reference
      };
      updatedNodes = [...nodesList, newNode];
    }

    // Go back with the modified states
    const backUrl = roadmapId === 'new' ? '/mentor/create-roadmap' : `/mentor/roadmaps/${roadmapId}/edit`;
    navigate(backUrl, {
      state: {
        formData: roadmapFormData,
        nodes: updatedNodes,
      },
    });
  };

  const handleCancel = () => {
    const backUrl = roadmapId === 'new' ? '/mentor/create-roadmap' : `/mentor/roadmaps/${roadmapId}/edit`;
    navigate(backUrl, {
      state: {
        formData: roadmapFormData,
        nodes: nodesList,
      },
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Quay lại */}
        <div className="flex items-center gap-3 mb-8">
          <button
            onClick={handleCancel}
            className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-medium transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Quay lại Lộ trình
          </button>
        </div>

        {/* Tiêu đề trang */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">
            {isEditing ? 'Chỉnh Sửa Node' : 'Tạo Node Mới'}
          </h1>
          <p className="text-slate-600 mt-1">
            {isEditing ? 'Cập nhật nội dung hiển thị và tài liệu lớp học của node' : 'Thêm một điểm mốc mới trên tiến trình học tập'}
          </p>
        </div>

        {/* Biểu mẫu lỗi */}
        {error && (
          <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-xl font-medium">
            {error}
          </div>
        )}

        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 space-y-4">
            <h2 className="text-lg font-semibold text-slate-900 mb-2">Thông Tin Cơ Bản</h2>

            <Input
              label="Tên Node"
              name="title"
              placeholder="VD: Nhập môn React"
              value={nodeData.title}
              onChange={handleInputChange}
            />

            <Textarea
              label="Mô Tả Node"
              name="description"
              placeholder="Mô tả tóm tắt nội dung học tập của node..."
              rows={3}
              value={nodeData.description}
              onChange={handleInputChange}
            />

            <Input
              label="Thời lượng học"
              name="duration"
              placeholder="VD: 2 tuần, 5 ngày..."
              value={nodeData.duration}
              onChange={handleInputChange}
            />

            {/* Tip Trick Học Tập */}
            <Textarea
              label={
                <div className="flex items-center gap-1.5">
                  <Lightbulb className="w-4 h-4 text-amber-500" />
                  Tip Trick Học Tập
                </div>
              }
              name="studyTips"
              placeholder="Chia sẻ mẹo học tập hữu ích cho node này..."
              rows={3}
              value={nodeData.studyTips}
              onChange={handleInputChange}
            />
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Chi Tiết Học Tập & Đánh Giá</h2>
            <NodeDetailEditor
              checklists={nodeData.checklists}
              onChecklistsChange={(items) =>
                setNodeData((prev) => ({ ...prev, checklists: items }))
              }
              materials={nodeData.materials}
              onMaterialsChange={(mats) =>
                setNodeData((prev) => ({ ...prev, materials: mats }))
              }
              quizzes={nodeData.quizzes}
              onQuizzesChange={(qs) =>
                setNodeData((prev) => ({ ...prev, quizzes: qs }))
              }
              roadmapId={roadmapId === 'new' ? null : roadmapId}
              nodeId={nodeData.id}
            />
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-3 pt-4">
            <Button variant="primary" onClick={handleSaveNode} className="flex-1 sm:flex-initial px-8">
              Lưu Node
            </Button>
            <Button variant="secondary" onClick={handleCancel} className="flex-1 sm:flex-initial px-8">
              Hủy
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NodeEditorPage;
