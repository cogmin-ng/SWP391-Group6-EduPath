import { Plus, Check, Pencil, Trash2, X } from 'lucide-react';
import { useState } from 'react';

const ChecklistSection = ({ items: initialItems }) => {
  const [items, setItems] = useState(initialItems);
  const [editingId, setEditingId] = useState(null);
  const [editingTitle, setEditingTitle] = useState('');

  const toggleCheckbox = (id) => {
    setItems(items.map((item) =>
      item.id === id ? { ...item, completed: !item.completed } : item
    ));
  };

  const handleDelete = (id) => {
    setItems(items.filter((item) => item.id !== id));
    if (editingId === id) {
      setEditingId(null);
      setEditingTitle('');
    }
  };

  const startEdit = (item) => {
    setEditingId(item.id);
    setEditingTitle(item.title);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingTitle('');
  };

  const saveEdit = () => {
    setItems(items.map((item) =>
      item.id === editingId ? { ...item, title: editingTitle } : item
    ));
    cancelEdit();
  };

  const completedCount = items.filter((item) => item.completed).length;

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 mb-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
          <Check className="w-6 h-6 text-indigo-600" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">Checklist Học Tập</h2>
      </div>

      {/* Checklist Items */}
      <div className="space-y-3 mb-6">
        {items.map((item) => (
          <div key={item.id} className="rounded-lg border border-slate-200 p-3 hover:border-slate-300 transition-colors">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={item.completed}
                  onChange={() => toggleCheckbox(item.id)}
                  className="w-5 h-5 rounded cursor-pointer accent-indigo-600"
                />
                {editingId === item.id ? (
                  <input
                    type="text"
                    value={editingTitle}
                    onChange={(e) => setEditingTitle(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 text-sm text-slate-900"
                  />
                ) : (
                  <span className={`text-sm ${item.completed ? 'text-slate-500 line-through' : 'text-slate-900'}`}>
                    {item.title}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                {editingId === item.id ? (
                  <>
                    <button
                      onClick={saveEdit}
                      className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 text-white px-3 py-2 text-xs font-semibold hover:bg-indigo-700 transition-colors"
                    >
                      <Check className="w-4 h-4" />
                      Lưu
                    </button>
                    <button
                      onClick={cancelEdit}
                      className="inline-flex items-center gap-2 rounded-lg bg-slate-100 text-slate-700 px-3 py-2 text-xs font-semibold hover:bg-slate-200 transition-colors"
                    >
                      <X className="w-4 h-4" />
                      Hủy
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => startEdit(item)}
                      className="inline-flex items-center gap-2 rounded-lg bg-white border border-slate-200 text-slate-700 px-3 py-2 text-xs font-semibold hover:bg-slate-50 transition-colors"
                    >
                      <Pencil className="w-4 h-4" />
                      Chỉnh Sửa
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="inline-flex items-center gap-2 rounded-lg bg-white border border-red-200 text-red-600 px-3 py-2 text-xs font-semibold hover:bg-red-50 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                      Xóa
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Progress */}
      <div className="mb-6 pb-6 border-t border-slate-100">
        <p className="text-sm text-slate-600">
          Hoàn thành: <span className="font-bold text-slate-900">{completedCount}/{items.length}</span>
        </p>
        <div className="w-full bg-slate-100 rounded-full h-2 mt-2">
          <div
            className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${items.length ? (completedCount / items.length) * 100 : 0}%` }}
          ></div>
        </div>
      </div>

      {/* Add Button */}
      <button className="w-full flex items-center justify-center gap-2 text-indigo-600 hover:text-indigo-700 font-medium text-sm py-2 rounded-lg hover:bg-indigo-50 transition-colors">
        <Plus className="w-4 h-4" />
        Thêm Checklist
      </button>
    </div>
  );
};

export default ChecklistSection;
