import { Plus, Play, BookOpen, Pencil, Trash2, X, Check } from 'lucide-react';
import { useState } from 'react';

const MaterialsSection = ({ materials: initialMaterials }) => {
  const [materials, setMaterials] = useState(initialMaterials);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({ title: '', type: '', description: '' });

  const getIcon = (iconName) => {
    const icons = { Play, BookOpen };
    return icons[iconName] || BookOpen;
  };

  const handleDelete = (id) => {
    setMaterials(materials.filter((material) => material.id !== id));
    if (editingId === id) {
      setEditingId(null);
      setEditData({ title: '', type: '', description: '' });
    }
  };

  const startEdit = (material) => {
    setEditingId(material.id);
    setEditData({
      title: material.title,
      type: material.type,
      description: material.description,
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditData({ title: '', type: '', description: '' });
  };

  const saveEdit = () => {
    setMaterials(materials.map((material) =>
      material.id === editingId ? { ...material, ...editData } : material
    ));
    cancelEdit();
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 mb-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
          <BookOpen className="w-6 h-6 text-indigo-600" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">Tài Liệu</h2>
      </div>

      {/* Materials Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {materials.map((material) => {
          const IconComponent = getIcon(material.icon);
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
                  <input
                    type="text"
                    value={editData.type}
                    onChange={(e) => setEditData((prev) => ({ ...prev, type: e.target.value }))}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-900"
                    placeholder="Loại tài liệu"
                  />
                  <textarea
                    value={editData.description}
                    onChange={(e) => setEditData((prev) => ({ ...prev, description: e.target.value }))}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-900"
                    rows={3}
                    placeholder="Mô tả tài liệu"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={saveEdit}
                      className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 text-white px-3 py-2 text-xs font-semibold hover:bg-indigo-700 transition-colors"
                    >
                      <Check className="w-4 h-4" />
                      Lưu
                    </button>
                    <button
                      onClick={cancelEdit}
                      className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg bg-slate-100 text-slate-700 px-3 py-2 text-xs font-semibold hover:bg-slate-200 transition-colors"
                    >
                      <X className="w-4 h-4" />
                      Hủy
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  {/* Icon & Meta */}
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <IconComponent className="w-5 h-5 text-red-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-slate-900 text-sm line-clamp-2">
                        {material.title}
                      </h3>
                      <p className="text-xs text-slate-500 mt-1">
                        {material.type}
                        {material.duration && ` • ${material.duration}`}
                      </p>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-slate-600 line-clamp-2 mb-4">{material.description}</p>

                  <div className="flex gap-2">
                    <button
                      onClick={() => startEdit(material)}
                      className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg bg-white border border-slate-200 text-slate-700 px-3 py-2 text-xs font-semibold hover:bg-slate-50 transition-colors"
                    >
                      <Pencil className="w-4 h-4" />
                      Chỉnh Sửa
                    </button>
                    <button
                      onClick={() => handleDelete(material.id)}
                      className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg bg-white border border-red-200 text-red-600 px-3 py-2 text-xs font-semibold hover:bg-red-50 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                      Xóa
                    </button>
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>

      {/* Add Button */}
      <button className="w-full flex items-center justify-center gap-2 text-indigo-600 hover:text-indigo-700 font-medium text-sm py-2 rounded-lg hover:bg-indigo-50 transition-colors">
        <Plus className="w-4 h-4" />
        Thêm Tài Liệu
      </button>
    </div>
  );
};

export default MaterialsSection;
