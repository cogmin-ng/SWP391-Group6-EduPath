import { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { Plus, X, Pencil, Trash2, Cloud, BookOpen } from 'lucide-react';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Textarea from '../../components/ui/Textarea';
import Select from '../../components/ui/Select';
import Badge from '../../components/ui/Badge';
import { getRoadmapById, updateRoadmap, submitRoadmap } from '../../services/roadmapService';
import { subjectCategoryService } from '../../services/subjectCategoryService';
import { subjectService } from '../../services/subjectService';

const EditRoadmapPage = () => {
  const navigate = useNavigate();
  const { roadmapId } = useParams();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    studyTips: '',
    category: '',
    subjectId: '',
    thumbnail: null,
    status: '',
  });

  const [nodes, setNodes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subjects, setSubjects] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [roadmapData, catData, subData] = await Promise.all([
          getRoadmapById(roadmapId),
          subjectCategoryService.getSubjectCategories(),
          subjectService.getAllSubjects(),
        ]);

        setCategories(catData || []);
        setSubjects(subData || []);

        if (location.state?.formData) {
          setFormData(location.state.formData);
        } else {
          setFormData({
            name: roadmapData.title || '',
            description: roadmapData.description || '',
            studyTips: roadmapData.studyTips || '',
            category: roadmapData.subject?.categoryId || '',
            subjectId: roadmapData.subjectId || '',
            thumbnail: roadmapData.thumbnail || null,
            status: roadmapData.status || '',
          });
        }

        if (location.state?.nodes) {
          setNodes(location.state.nodes);
        } else {
          setNodes(roadmapData.nodes || []);
        }
      } catch (error) {
        console.error('Failed to load data:', error);
        alert('Lỗi tải dữ liệu');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [roadmapId, location.state]);


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

  const handleAddNode = () => {
    navigate(`/mentor/roadmaps/${roadmapId}/nodes/new/edit`, {
      state: {
        formData,
        nodes,
      },
    });
  };

  const handleEditNode = (node) => {
    navigate(`/mentor/roadmaps/${roadmapId}/nodes/${node.id}/edit`, {
      state: {
        formData,
        nodes,
      },
    });
  };

  const handleDeleteNode = (id) => {
    setNodes(prev => prev.filter(node => node.id !== id));
  };

  const buildPayload = () => ({
    title: formData.name,
    description: formData.description,
    studyTips: formData.studyTips,
    subjectId: formData.subjectId || null,
    thumbnail: formData.thumbnail,
    nodes: nodes.map((n, i) => ({
      id: typeof n.id === 'string' && n.id.length > 20 ? n.id : undefined,
      title: n.title,
      description: n.description,
      duration: n.duration,
      studyTips: n.studyTips || '',
      orderIndex: i,
      checklists: n.checklists || [],
      materials: n.materials || [],
      quizzes: n.quizzes || [],
    }))
  });

  const handleSaveDraft = async () => {
    try {
      if (!formData.name) return alert('Vui lòng nhập tên lộ trình');
      const payload = { ...buildPayload(), status: 'DRAFT' };
      const updated = await updateRoadmap(roadmapId, payload);
      setNodes(updated.nodes || []);
      setFormData(prev => ({ ...prev, status: 'DRAFT' }));
      alert('Cập nhật lộ trình thành công!');
    } catch (err) {
      console.error(err);
      alert('Lỗi cập nhật: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleSubmitApproval = async () => {
    try {
      if (!formData.name) return alert('Vui lòng nhập tên lộ trình');
      if (nodes.length === 0) return alert('Lộ trình cần ít nhất 1 Node');
      
      const payload = buildPayload();
      await updateRoadmap(roadmapId, payload);
      await submitRoadmap(roadmapId);
      
      alert('Gửi phê duyệt thành công!');
      navigate('/mentor/roadmaps');
    } catch (err) {
      console.error(err);
      alert('Lỗi phê duyệt: ' + (err.response?.data?.message || err.message));
    }
  };

  const categoryOptions = categories.map(c => ({ value: c.id, label: c.name }));
  const subjectOptions = subjects
    .filter(s => !formData.category || s.categoryId === formData.category)
    .map(s => ({ value: s.id, label: s.name }));

  const isPublished = formData.status === 'PUBLISHED';

  if (loading) {
    return <div className="min-h-screen bg-slate-50 flex items-center justify-center">Đang tải...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Chỉnh Sửa Lộ Trình Học Tập</h1>
            <p className="text-slate-600 mt-1">Cập nhật lộ trình học tập của bạn</p>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Form (70%) */}
          <div className="lg:col-span-2 space-y-6">

            {/* Card 1: Thông Tin Lộ Trình */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
              <div className="flex items-center gap-2 mb-4">
                <BookOpen className="w-5 h-5 text-indigo-500" />
                <h2 className="text-lg font-semibold text-slate-900">Thông Tin Lộ Trình</h2>
              </div>
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Select
                    label="Chuyên Ngành"
                    name="category"
                    options={categoryOptions}
                    value={formData.category}
                    onChange={(e) => {
                      handleInputChange(e);
                      setFormData(prev => ({ ...prev, subjectId: '' }));
                    }}
                  />
                  <Select
                    label="Môn Học"
                    name="subjectId"
                    options={subjectOptions}
                    value={formData.subjectId}
                    onChange={handleInputChange}
                    disabled={!formData.category}
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
                  onClick={handleAddNode}
                  className="gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Thêm Node
                </Button>
              </div>

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
                Cập Nhật & Gửi
              </Button>
            </div>
          </div>

          {/* Right Column - Summary (30%) */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 sticky top-8">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">Tóm Tắt</h2>
              
              <div className="space-y-4">
                {/* Stats */}
                <div className="space-y-3">

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">Tổng Node:</span>
                    <span className="font-semibold text-slate-900">{nodes.length}</span>
                  </div>
                </div>

                <div className="h-px bg-slate-200"></div>

                {/* Info */}
                <div className="text-xs text-slate-600">
                  <p className="mb-2">
                    Lộ trình của bạn sẽ cần phê duyệt từ admin trước khi công khai.
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

export default EditRoadmapPage;
