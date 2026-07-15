import { Plus, BookOpen, Pencil, Trash2, X, Check, FileText, Link as LinkIcon, Video } from 'lucide-react';
import { useState } from 'react';
import UploadMaterialsModal from './UploadMaterialsModal';

const MaterialsSection = ({ materials = [], onChange }) => {
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({ title: '', type: '', description: '' });
  const [isModalOpen, setIsModalOpen] = useState(false);

  const getTypeIcon = (type) => {
    switch (type) {
      case 'DOCUMENTATION': return FileText;
      case 'VIDEO': return Video;
      case 'ARTICLE': return LinkIcon;
      default: return BookOpen;
    }
  };

  const getBgClass = (type) => {
    switch (type) {
      case 'DOCUMENTATION': return 'bg-red-50 text-red-600';
      case 'VIDEO': return 'bg-blue-50 text-blue-600';
      case 'ARTICLE': return 'bg-purple-50 text-purple-600';
      default: return 'bg-indigo-50 text-indigo-600';
    }
  };

  const handleDelete = (id) => {
    onChange(materials.filter((material) => material.id !== id));
    if (editingId === id) cancelEdit();
  };

  const startEdit = (material) => {
    setEditingId(material.id);
    setEditData({
      title: material.title,
      type: material.type || 'LINK',
      description: material.description || '',
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditData({ title: '', type: '', description: '' });
  };

  const saveEdit = () => {
    onChange(materials.map((material) =>
      material.id === editingId ? { ...material, ...editData } : material
    ));
    cancelEdit();
  };

  const handleAddMaterials = (newItems) => {
    onChange([...materials, ...newItems]);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 mb-6 relative">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
          <BookOpen className="w-6 h-6 text-indigo-600" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">Tài Liệu Học Tập</h2>
      </div>

      {/* Materials Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {materials.length === 0 && (
          <div className="col-span-full text-center py-6 border border-dashed border-slate-200 rounded-xl">
            <p className="text-slate-500 text-sm">Chưa có tài liệu nào.</p>
          </div>
        )}
        {materials.map((material) => {
          const IconComponent = getTypeIcon(material.type);
          const iconBg = getBgClass(material.type);
          const isEditing = editingId === material.id;
          
          return (
            <div
              key={material.id}
              className="p-4 border border-slate-100 rounded-xl transition-all bg-slate-50/50"
            >
              {isEditing ? (
                <div className="space-y-3">
                  <input
                    type="text"
                    value={editData.title}
                    onChange={(e) => setEditData((prev) => ({ ...prev, title: e.target.value }))}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-900"
                    placeholder="Tên tài liệu"
                  />
                  <select
                    value={editData.type}
                    onChange={(e) => setEditData((prev) => ({ ...prev, type: e.target.value }))}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-900"
                  >
                    <option value="DOCUMENTATION">Tài liệu (PDF, Word...)</option>
                    <option value="VIDEO">Video</option>
                    <option value="ARTICLE">Bài viết (Link)</option>
                  </select>
                  <textarea
                    value={editData.description}
                    onChange={(e) => setEditData((prev) => ({ ...prev, description: e.target.value }))}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-900"
                    rows={2}
                    placeholder="Mô tả tài liệu"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={saveEdit}
                      className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 text-white px-3 py-2 text-xs font-semibold hover:bg-indigo-700 transition-colors"
                    >
                      <Check className="w-4 h-4" /> Lưu
                    </button>
                    <button
                      onClick={cancelEdit}
                      className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg bg-slate-100 text-slate-700 px-3 py-2 text-xs font-semibold hover:bg-slate-200 transition-colors"
                    >
                      <X className="w-4 h-4" /> Hủy
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-start gap-3 mb-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${iconBg}`}>
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-slate-900 text-sm line-clamp-2">
                        {material.title}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] font-bold tracking-wider px-1.5 py-0.5 rounded bg-white text-slate-500 border border-slate-200 uppercase">
                          {material.type}
                        </span>
                      </div>
                    </div>
                  </div>
                  {material.description && (
                    <p className="text-sm text-slate-600 line-clamp-2 mb-4">{material.description}</p>
                  )}
                  {material.url && material.url !== '#' && (
                    <a href={material.url} target="_blank" rel="noreferrer" className="text-xs text-indigo-500 hover:underline mb-4 block truncate">
                      {material.url}
                    </a>
                  )}

                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={() => startEdit(material)}
                      className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg bg-white border border-slate-200 text-slate-700 px-3 py-2 text-xs font-semibold hover:bg-slate-50 transition-colors"
                    >
                      <Pencil className="w-4 h-4" /> Chỉnh Sửa
                    </button>
                    <button
                      onClick={() => handleDelete(material.id)}
                      className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg bg-white border border-red-200 text-red-600 px-3 py-2 text-xs font-semibold hover:bg-red-50 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" /> Xóa
                    </button>
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>

      <button 
        onClick={() => setIsModalOpen(true)}
        className="w-full flex items-center justify-center gap-2 text-indigo-600 hover:text-indigo-700 font-medium text-sm py-2 rounded-lg hover:bg-indigo-50 transition-colors"
      >
        <Plus className="w-4 h-4" />
        Thêm Tài Liệu Mới
      </button>

      <UploadMaterialsModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddMaterials={handleAddMaterials}
      />
    </div>
  );
};

export default MaterialsSection;
