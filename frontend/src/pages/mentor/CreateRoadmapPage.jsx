import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, X, Pencil, Trash2, Cloud, ArrowRight, Clock } from 'lucide-react';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Textarea from '../../components/ui/Textarea';
import Select from '../../components/ui/Select';
import Badge from '../../components/ui/Badge';
import NodeDetailEditor from '../../components/mentor/NodeDetailEditor';
import { createRoadmap, submitRoadmap, getMentorRoadmaps, deleteRoadmap } from '../../services/roadmapService';

const EMPTY_NODE = { title: '', description: '', duration: '', checklists: [], materials: [] };

const CreateRoadmapPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    thumbnail: null,
  });

  const [nodes, setNodes] = useState([]);

  const [showNodeForm, setShowNodeForm] = useState(false);
  const [newNode, setNewNode] = useState({ ...EMPTY_NODE });
  const [editingNodeId, setEditingNodeId] = useState(null);
  const [drafts, setDrafts] = useState([]);

  const loadDrafts = async () => {
    try {
      const data = await getMentorRoadmaps(0, 50);
      if (data && data.roadmaps) {
        const draftRoadmaps = data.roadmaps.filter(r => r.status === 'DRAFT');
        setDrafts(draftRoadmaps);
      }
    } catch (err) {
      console.error('Lỗi khi tải danh sách bản nháp:', err);
    }
  };

  // Fetch draft roadmaps when page loads
  useEffect(() => {
    loadDrafts();
  }, []);

  const handleDeleteDraft = async (e, id) => {
    e.stopPropagation(); // prevent navigation
    if (!window.confirm('Bạn có chắc chắn muốn xóa bản nháp này không?')) return;
    
    try {
      await deleteRoadmap(id);
      alert('Đã xóa bản nháp!');
      loadDrafts(); // reload list
    } catch (err) {
      console.error('Lỗi xóa bản nháp:', err);
      alert('Không thể xóa bản nháp: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleThumbnailChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, thumbnail: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const resetNodeForm = () => {
    setNewNode({ ...EMPTY_NODE });
    setEditingNodeId(null);
    setShowNodeForm(false);
  };

  const handleSaveNode = () => {
    if (!newNode.title.trim()) return;

    if (editingNodeId !== null) {
      // Cập nhật node đang chỉnh sửa (giữ nguyên vị trí)
      setNodes(prev =>
        prev.map(node =>
          node.id === editingNodeId ? { ...node, ...newNode } : node
        )
      );
    } else {
      // Thêm node mới
      setNodes(prev => [...prev, { id: Date.now(), ...newNode }]);
    }

    resetNodeForm();
  };

  const handleToggleNodeForm = () => {
    if (showNodeForm) {
      resetNodeForm();
    } else {
      setNewNode({ ...EMPTY_NODE });
      setEditingNodeId(null);
      setShowNodeForm(true);
    }
  };

  const handleDeleteNode = (id) => {
    setNodes(prev => prev.filter(node => node.id !== id));
    if (editingNodeId === id) resetNodeForm();
  };

  const handleEditNode = (node) => {
    // Mở form inline (giống giao diện Thêm Node) với dữ liệu đã điền sẵn
    setNewNode({
      title: node.title || '',
      description: node.description || '',
      duration: node.duration || '',
      checklists: node.checklists || [],
      materials: node.materials || [],
    });
    setEditingNodeId(node.id);
    setShowNodeForm(true);
  };

  const buildPayload = () => ({
    title: formData.name,
    description: formData.description,
    thumbnail: formData.thumbnail,
    nodes: nodes.map((n, i) => ({
      title: n.title,
      description: n.description,
      duration: n.duration,
      orderIndex: i,
      checklists: n.checklists || [],
      materials: n.materials || [],
    }))
  });

  const handleSaveDraft = async () => {
    try {
      if (!formData.name) return alert('Vui lòng nhập tên lộ trình');
      
      const payload = buildPayload();
      const created = await createRoadmap(payload);
      alert('Lưu nháp Lộ trình thành công!');
      navigate(`/mentor/roadmaps/${created.id}/edit`);
    } catch (err) {
      console.error(err);
      alert('Lỗi lưu nháp: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleSubmitApproval = async () => {
    try {
      if (!formData.name) return alert('Vui lòng nhập tên lộ trình');
      if (nodes.length === 0) return alert('Lộ trình cần ít nhất 1 Node');
      
      const payload = buildPayload();
      const created = await createRoadmap(payload);
      await submitRoadmap(created.id);
      
      alert('Đã tạo và gửi phê duyệt thành công!');
      navigate(`/mentor/roadmaps/${created.id}/edit`);
    } catch (err) {
      console.error(err);
      alert('Lỗi gửi phê duyệt: ' + (err.response?.data?.message || err.message));
    }
  };

  const categoryOptions = [
    { value: 'programming', label: 'Lập trình' },
    { value: 'design', label: 'Thiết kế' },
    { value: 'business', label: 'Kinh doanh' },
    { value: 'data', label: 'Dữ liệu' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Tạo Lộ Trình Học Tập</h1>
            <p className="text-slate-600 mt-1">Thiết kế một lộ trình học tập hiệu quả cho học viên</p>
          </div>
        </div>

        {/* Drafts Section */}
        {drafts.length > 0 && (
          <div className="mb-8 p-6 bg-white rounded-2xl shadow-sm border border-slate-100">
            <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-indigo-500" />
              Tiếp tục chỉnh sửa bản nháp
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {drafts.map((draft) => (
                <div 
                  key={draft.id} 
                  className="p-4 rounded-xl border border-slate-200 hover:border-indigo-300 hover:bg-slate-50 transition-all cursor-pointer flex flex-col justify-between"
                  onClick={() => navigate(`/mentor/roadmaps/${draft.id}/edit`)}
                >
                  <div className="mb-3">
                    <h3 className="font-semibold text-slate-900 line-clamp-1">{draft.title}</h3>
                    <p className="text-sm text-slate-500 mt-1 line-clamp-2">{draft.description || 'Chưa có mô tả'}</p>
                  </div>
                  <div className="flex items-center justify-between mt-4">
                    <button 
                      onClick={(e) => handleDeleteDraft(e, draft.id)}
                      className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      title="Xóa bản nháp"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <div className="flex items-center text-indigo-600 text-sm font-medium">
                      Chỉnh sửa <ArrowRight className="w-4 h-4 ml-1" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <hr className="my-8 border-slate-200" />

        <h2 className="text-xl font-bold text-slate-900 mb-6">Tạo Mới Lộ Trình</h2>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Form (70%) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Card 1: Thông Tin Lộ Trình */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">Thông Tin Lộ Trình</h2>
              <div className="space-y-4">
                <Input
                  label="Tên Lộ Trình"
                  name="name"
                  placeholder="VD: React Basics"
                  value={formData.name}
                  onChange={handleInputChange}
                />
                <Textarea
                  label="Mô Tả"
                  name="description"
                  placeholder="Mô tả chi tiết lộ trình học tập..."
                  rows={4}
                  value={formData.description}
                  onChange={handleInputChange}
                />
                <div className="grid grid-cols-2 gap-4">
                  <Select
                    label="Danh Mục"
                    name="category"
                    options={categoryOptions}
                    value={formData.category}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </div>

            {/* Card 2: Upload Thumbnail */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">Hình Đại Diện</h2>
              
              {formData.thumbnail ? (
                <div className="relative">
                  <img
                    src={formData.thumbnail}
                    alt="Thumbnail preview"
                    className="w-full h-48 object-cover rounded-xl"
                  />
                  <button
                    onClick={() => setFormData(prev => ({ ...prev, thumbnail: null }))}
                    className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <label className="flex items-center justify-center w-full h-48 border-2 border-dashed border-slate-200 rounded-xl hover:border-indigo-300 hover:bg-indigo-50/30 transition-all cursor-pointer group">
                  <div className="text-center">
                    <Cloud className="w-12 h-12 text-slate-300 group-hover:text-indigo-400 mx-auto mb-2 transition-colors" />
                    <p className="text-sm font-medium text-slate-600 group-hover:text-indigo-600">
                      Kéo thả hoặc bấm để tải lên
                    </p>
                    <p className="text-xs text-slate-500 mt-1">PNG, JPG tối đa 2MB</p>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleThumbnailChange}
                    className="hidden"
                  />
                </label>
              )}
            </div>

            {/* Card 3: Danh Sách Node */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-slate-900">Danh Sách Node</h2>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleToggleNodeForm}
                  className="gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Thêm Node
                </Button>
              </div>

              {showNodeForm && (
                <div className="bg-slate-50 rounded-xl p-4 mb-4 border border-slate-200">
                  <h3 className="text-sm font-semibold text-slate-900 mb-3">
                    {editingNodeId !== null ? 'Chỉnh Sửa Node' : 'Thêm Node Mới'}
                  </h3>
                  <div className="space-y-3">
                    <Input
                      placeholder="Tên Node"
                      value={newNode.title}
                      onChange={(e) => setNewNode(prev => ({ ...prev, title: e.target.value }))}
                    />
                    <Textarea
                      placeholder="Mô tả Node"
                      rows={3}
                      value={newNode.description}
                      onChange={(e) => setNewNode(prev => ({ ...prev, description: e.target.value }))}
                    />
                    <Input
                      placeholder="Thời lượng (VD: 2 tuần)"
                      value={newNode.duration}
                      onChange={(e) => setNewNode(prev => ({ ...prev, duration: e.target.value }))}
                    />

                    {/* Chi tiết Node: Checklist, Tài liệu & Quiz */}
                    <div className="pt-2">
                      <NodeDetailEditor
                        checklists={newNode.checklists || []}
                        onChecklistsChange={(items) => setNewNode(prev => ({ ...prev, checklists: items }))}
                        materials={newNode.materials || []}
                        onMaterialsChange={(mats) => setNewNode(prev => ({ ...prev, materials: mats }))}
                        roadmapId={null}
                        nodeId={editingNodeId}
                      />
                    </div>

                    <div className="flex gap-2 pt-2">
                      <Button
                        size="sm"
                        variant="primary"
                        onClick={handleSaveNode}
                        className="flex-1"
                      >
                        {editingNodeId !== null ? 'Lưu' : 'Thêm'}
                      </Button>
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={resetNodeForm}
                        className="flex-1"
                      >
                        Hủy
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {/* Timeline */}
              <div className="space-y-3">
                {nodes.map((node, index) => (
                  <div key={node.id} className="relative">
                    {/* Timeline Line */}
                    {index < nodes.length - 1 && (
                      <div className="absolute left-5 top-12 w-0.5 h-8 bg-indigo-200"></div>
                    )}

                    {/* Node Item */}
                    <div className="flex gap-4">
                      {/* Timeline Circle */}
                      <div className="flex flex-col items-center pt-1">
                        <div className="w-10 h-10 rounded-full bg-indigo-100 border-2 border-indigo-500 flex items-center justify-center flex-shrink-0">
                          <span className="text-xs font-bold text-indigo-600">{index + 1}</span>
                        </div>
                      </div>

                      {/* Node Content */}
                      <div className="flex-1 bg-slate-50 rounded-lg p-4 border border-slate-200 hover:border-slate-300 transition-colors">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="font-semibold text-slate-900">{node.title}</h3>
                            <p className="text-sm text-slate-600 mt-1">{node.description}</p>
                            <p className="text-xs text-slate-500 mt-2">Thời lượng: {node.duration}</p>
                            {((node.checklists?.length || 0) > 0 || (node.materials?.length || 0) > 0) && (
                              <p className="text-xs text-indigo-500 mt-1">
                                {node.checklists?.length || 0} checklist · {node.materials?.length || 0} tài liệu
                              </p>
                            )}
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEditNode(node)}
                              className="p-2 hover:bg-slate-200 rounded-lg transition-colors text-slate-600 hover:text-slate-900"
                            >
                              <Pencil className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteNode(node.id)}
                              className="p-2 hover:bg-red-100 rounded-lg transition-colors text-slate-600 hover:text-red-600"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 mt-6">
              <Button variant="secondary" className="w-full sm:w-auto" onClick={handleSaveDraft}>
                Lưu Nháp
              </Button>
              <Button variant="primary" className="w-full sm:w-auto" onClick={handleSubmitApproval}>
                Cập nhật & Gửi
              </Button>
            </div>
          </div>

          {/* Right Column - Summary (30%) */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 sticky top-8">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">Tóm Tắt Lộ Trình</h2>
              
              <div className="space-y-4">
                {/* Stats */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">Số Node:</span>
                    <span className="font-semibold text-slate-900">{nodes.length}</span>
                  </div>
                  {/* Category and Level removed from summary as requested */}
                </div>

                <div className="h-px bg-slate-200"></div>

                {/* Status */}
                <div>
                  <p className="text-xs text-slate-600 mb-2">Trạng Thái</p>
                  <Badge variant="draft">Bản Nháp</Badge>
                </div>

                {/* Progress */}
                <div>
                  <p className="text-xs text-slate-600 mb-2">Hoàn Thiện</p>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div
                      className="bg-indigo-500 h-2 rounded-full transition-all duration-300"
                      style={{
                        width: `${
                          (
                            (formData.name ? 25 : 0) +
                            (formData.description ? 25 : 0) +
                            (formData.category ? 25 : 0) +
                            (nodes.length > 0 ? 25 : 0)
                          ) / 100
                        }%`
                      }}
                    ></div>
                  </div>
                  <p className="text-xs text-slate-600 mt-1">
                    {Math.round(
                      (
                        (formData.name ? 25 : 0) +
                        (formData.description ? 25 : 0) +
                        (formData.category ? 25 : 0) +
                        (nodes.length > 0 ? 25 : 0)
                      )
                    )}%
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateRoadmapPage;
