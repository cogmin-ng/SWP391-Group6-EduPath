import { Plus, Check } from 'lucide-react';
import { useState } from 'react';

const ChecklistSection = ({ items: initialItems }) => {
  const [items, setItems] = useState(initialItems);

  const toggleCheckbox = (id) => {
    setItems(items.map((item) =>
      item.id === id ? { ...item, completed: !item.completed } : item
    ));
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
          <div key={item.id} className="flex items-center gap-3 p-3 hover:bg-slate-50 rounded-lg transition-colors">
            <input
              type="checkbox"
              checked={item.completed}
              onChange={() => toggleCheckbox(item.id)}
              className="w-5 h-5 rounded cursor-pointer accent-indigo-600"
            />
            <span
              className={`text-sm ${
                item.completed
                  ? 'text-slate-500 line-through'
                  : 'text-slate-900'
              }`}
            >
              {item.title}
            </span>
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
            style={{ width: `${(completedCount / items.length) * 100}%` }}
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
