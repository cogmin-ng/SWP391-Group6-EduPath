import { useState, useEffect } from 'react';
import {
  Search,
  Plus,
  Loader2,
  FolderOpen,
  Edit2,
  Trash2,
  X,
  AlertCircle,
} from 'lucide-react';
import { subjectCategoryService } from '../../services/subjectCategoryService';
import { toast } from 'react-hot-toast';

const CategoryManagementPage = () => {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Modals state
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [categoryToEdit, setCategoryToEdit] = useState(null);

  // Form states
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  // Fetch all categories
  const fetchCategories = async () => {
    setIsLoading(true);
    try {
      const data = await subjectCategoryService.getSubjectCategories();
      setCategories(data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast.error('Không thể tải các danh mục');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    setIsActionLoading(true);
    try {
      await subjectCategoryService.createSubjectCategory({
        name: name.trim(),
        description: description.trim(),
      });
      toast.success('Thêm danh mục thành công');
      setIsAddOpen(false);
      setName('');
      setDescription('');
      fetchCategories();
    } catch (error) {
      console.error('Error creating category:', error);
      toast.error(
        error.response?.data?.message || 'Không thể tạo mới danh mục'
      );
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleUpdateCategory = async (e) => {
    e.preventDefault();
    if (!categoryToEdit || !name.trim()) return;
    setIsActionLoading(true);
    try {
      await subjectCategoryService.updateSubjectCategory(categoryToEdit.id, {
        name: name.trim(),
        description: description.trim(),
      });
      toast.success('Cập nhật danh mục thành công');
      setIsEditOpen(false);
      setCategoryToEdit(null);
      setName('');
      setDescription('');
      fetchCategories();
    } catch (error) {
      console.error('Error updating category:', error);
      toast.error(
        error.response?.data?.message || 'Không thể cập nhật danh mục'
      );
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleDeleteCategory = async () => {
    if (!categoryToDelete) return;
    setIsActionLoading(true);
    try {
      await subjectCategoryService.deleteSubjectCategory(categoryToDelete.id);
      toast.success('Xóa danh mục thành công');
      setCategoryToDelete(null);
      fetchCategories();
    } catch (error) {
      console.error('Error deleting category:', error);
      toast.error(
        error.response?.data?.message || 'Không thể xóa danh mục'
      );
    } finally {
      setIsActionLoading(false);
    }
  };

  const startEditCategory = (category) => {
    setCategoryToEdit(category);
    setName(category.name);
    setDescription(category.description || '');
    setIsEditOpen(true);
  };

  // Filtered categories helper
  const filteredCategories = categories.filter(
    (category) =>
      category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (category.description || '')
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
  );

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 relative">
      {/* Header & Search */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Quản lý Danh mục</h1>
          <p className="text-slate-500">
            Quản lý các danh mục chính và lĩnh vực đào tạo của hệ thống.
          </p>
        </div>

        <div className="flex w-full sm:w-auto items-center gap-3">
          <div className="relative w-full sm:w-64">
            <input
              type="text"
              placeholder="Tìm kiếm danh mục..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all shadow-sm"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          </div>

          <button
            onClick={() => {
              setName('');
              setDescription('');
              setIsAddOpen(true);
            }}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-xl hover:bg-indigo-700 shadow-md shadow-indigo-200 transition-all shrink-0 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Thêm danh mục
          </button>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto min-h-[300px]">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100">
                  Tên danh mục
                </th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100">
                  Mô tả
                </th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100 text-right">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {isLoading ? (
                <tr>
                  <td colSpan="3" className="px-6 py-12 text-center">
                    <Loader2 className="w-8 h-8 text-indigo-500 animate-spin mx-auto mb-4" />
                    <p className="text-slate-500 text-sm">Đang tải danh mục...</p>
                  </td>
                </tr>
              ) : filteredCategories.length === 0 ? (
                <tr>
                  <td colSpan="3" className="px-6 py-12 text-center">
                    <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <FolderOpen className="w-8 h-8 text-slate-400" />
                    </div>
                    <p className="text-slate-900 font-bold mb-1">
                      Không tìm thấy danh mục nào
                    </p>
                    <p className="text-slate-500 text-sm">
                      Hãy thử thêm mới hoặc điều chỉnh thanh tìm kiếm
                    </p>
                  </td>
                </tr>
              ) : (
                filteredCategories.map((category) => (
                  <tr
                    key={category.id}
                    className="hover:bg-slate-50/50 transition-colors group animate-in fade-in duration-300"
                  >
                    <td className="px-6 py-4">
                      <span className="text-sm font-semibold text-slate-800">
                        {category.name}
                      </span>
                    </td>
                    <td className="px-6 py-4 max-w-md">
                      <span className="text-sm text-slate-600 line-clamp-2">
                        {category.description || 'Chưa có mô tả'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end items-center gap-2">
                        <button
                          onClick={() => startEditCategory(category)}
                          className="p-2 text-indigo-600 border-2 border-indigo-100 hover:border-indigo-600 hover:bg-indigo-50/30 rounded-xl transition-all cursor-pointer"
                          title="Sửa danh mục"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setCategoryToDelete(category)}
                          className="p-2 text-rose-600 border-2 border-rose-100 hover:border-rose-600 hover:bg-rose-50/30 rounded-xl transition-all cursor-pointer"
                          title="Xóa danh mục"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="flex justify-between items-center px-6 py-4 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-900">
                Thêm danh mục mới
              </h3>
              <button
                onClick={() => setIsAddOpen(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleAddCategory} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Tên danh mục
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Thiết kế đồ họa, Marketing..."
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Mô tả
                </label>
                <textarea
                  rows="3"
                  placeholder="Mô tả chi tiết về danh mục này..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="flex-1 px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-all cursor-pointer"
                  disabled={isActionLoading}
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700 transition-all shadow-md shadow-indigo-200 flex items-center justify-center gap-2 cursor-pointer"
                  disabled={isActionLoading}
                >
                  {isActionLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                  Tạo mới
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {isEditOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="flex justify-between items-center px-6 py-4 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-900">
                Sửa thông tin danh mục
              </h3>
              <button
                onClick={() => setIsEditOpen(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleUpdateCategory} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Tên danh mục
                </label>
                <input
                  type="text"
                  required
                  placeholder="ID danh mục..."
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Mô tả
                </label>
                <textarea
                  rows="3"
                  placeholder="Mô tả chi tiết về danh mục này..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditOpen(false)}
                  className="flex-1 px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-all cursor-pointer"
                  disabled={isActionLoading}
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700 transition-all shadow-md shadow-indigo-200 flex items-center justify-center gap-2 cursor-pointer"
                  disabled={isActionLoading}
                >
                  {isActionLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                  Lưu thay đổi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {categoryToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-6">
              <div className="w-12 h-12 bg-rose-50 rounded-2xl flex items-center justify-center mb-4">
                <AlertCircle className="w-6 h-6 text-rose-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">
                Xóa Danh mục
              </h3>
              <p className="text-slate-500 mb-6">
                Bạn có chắc chắn muốn xóa danh mục{' '}
                <span className="font-semibold text-slate-900">
                  {categoryToDelete.name}
                </span>{' '}
                này không? Hành động này sẽ ẩn danh mục khỏi hệ thống.
              </p>

              <div className="flex gap-3">
                <button
                  onClick={() => setCategoryToDelete(null)}
                  className="flex-1 px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-all cursor-pointer"
                  disabled={isActionLoading}
                >
                  Hủy
                </button>
                <button
                  onClick={handleDeleteCategory}
                  className="flex-1 px-4 py-2.5 bg-rose-600 text-white rounded-xl text-sm font-semibold hover:bg-rose-700 transition-all shadow-lg shadow-rose-200 flex items-center justify-center gap-2 cursor-pointer"
                  disabled={isActionLoading}
                >
                  {isActionLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Trash2 className="w-4 h-4" />
                  )}
                  Xóa danh mục
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryManagementPage;
