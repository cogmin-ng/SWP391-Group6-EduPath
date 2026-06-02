import { useState, useEffect } from "react";
import {
  Search,
  Loader2,
  User,
  ChevronLeft,
  ChevronRight,
  Trash2,
  Edit2,
  X,
  Check,
  AlertCircle,
} from "lucide-react";
import { adminService } from "../../services/adminService";
import { toast } from "react-hot-toast";

const UserManagementPage = () => {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isActionLoading, setIsActionLoading] = useState(false);

  // Pagination and Search State
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const take = 10;

  // Edit/Delete State
  const [editingUserId, setEditingUserId] = useState(null);
  const [selectedRoleId, setSelectedRoleId] = useState("");
  const [userToDelete, setUserToDelete] = useState(null);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
      setPage(1); // Reset to page 1 on new search
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch Roles
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const data = await adminService.getRoles();
        setRoles(data.roles || []);
      } catch (error) {
        console.error("Error fetching roles:", error);
      }
    };
    fetchRoles();
  }, []);

  // Fetch data
  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const skip = (page - 1) * take;
      let data;
      if (debouncedQuery.trim()) {
        data = await adminService.searchUsers({
          q: debouncedQuery,
          skip,
          take,
        });
      } else {
        data = await adminService.getUsers({ skip, take });
      }
      setUsers(data.users || []);
      setTotal(data.total || 0);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Không thể tải người dùng");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [debouncedQuery, page]);

  const handleUpdateRole = async (userId) => {
    if (!selectedRoleId) return;
    setIsActionLoading(true);
    try {
      await adminService.updateUserRole(userId, selectedRoleId);
      toast.success("Cập nhật vai trò người dùng thành công");
      setEditingUserId(null);
      fetchUsers();
    } catch (error) {
      console.error("Error updating role:", error);
      toast.error(error.response?.data?.message || "Không thể cập nhật vai trò");
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!userToDelete) return;
    setIsActionLoading(true);
    try {
      await adminService.deleteUser(userToDelete.id);
      toast.success("Xóa người dùng thành công");
      setUserToDelete(null);
      fetchUsers();
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error(error.response?.data?.message || "Không thể xóa người dùng");
    } finally {
      setIsActionLoading(false);
    }
  };

  const startEditingRole = (user) => {
    setEditingUserId(user.id);
    setSelectedRoleId(user.role?.id || "");
  };

  const handlePreviousPage = () => {
    if (page > 1) setPage(page - 1);
  };

  const handleNextPage = () => {
    if (page < totalPages) setPage(page + 1);
  };

  const totalPages = Math.ceil(total / take) || 1;

  const getStatusColor = (status) => {
    switch (status) {
      case "ACTIVE":
        return "bg-emerald-50 text-emerald-600";
      case "INACTIVE":
        return "bg-slate-100 text-slate-600";
      case "BANNED":
        return "bg-rose-50 text-rose-600";
      case "PENDING":
        return "bg-amber-50 text-amber-600";
      default:
        return "bg-slate-50 text-slate-600";
    }
  };

  const getRoleBorderColor = (roleName) => {
    if (!roleName)
      return "border-slate-300 hover:border-slate-400 hover:shadow-md hover:shadow-slate-200";
    const lowerRole = roleName.toLowerCase();
    if (lowerRole.includes("admin"))
      return "border-red-400 hover:border-red-600 hover:shadow-lg hover:shadow-red-200";
    if (lowerRole.includes("mentor") || lowerRole.includes("mentor"))
      return "border-yellow-400 hover:border-yellow-600 hover:shadow-lg hover:shadow-yellow-200";
    if (lowerRole.includes("user") || lowerRole.includes("mentee"))
      return "border-blue-400 hover:border-blue-600 hover:shadow-lg hover:shadow-blue-200";
    return "border-slate-300 hover:border-slate-400 hover:shadow-md hover:shadow-slate-200";
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 relative">
      {/* Header & Search */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Quản lý Người dùng</h1>
          <p className="text-slate-500">
            Quản lý quyền người dùng và truy cập nền tảng.
          </p>
        </div>

        <div className="relative w-full sm:w-72">
          <input
            type="text"
            placeholder="Tìm kiếm người dùng..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all shadow-sm"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto min-h-[400px]">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100">
                  Người dùng
                </th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100">
                  Vai trò
                </th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100">
                  Trạng thái
                </th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100">
                  XP
                </th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100 text-right">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {isLoading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center">
                    <Loader2 className="w-8 h-8 text-indigo-500 animate-spin mx-auto mb-4" />
                    <p className="text-slate-500 text-sm">Đang tải người dùng...</p>
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center">
                    <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <User className="w-8 h-8 text-slate-400" />
                    </div>
                    <p className="text-slate-900 font-bold mb-1">
                      Không tìm thấy người dùng nào
                    </p>
                    <p className="text-slate-500 text-sm">
                      Hãy thử điều chỉnh tiêu chí tìm kiếm
                    </p>
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr
                    key={user.id}
                    className="hover:bg-slate-50/50 transition-colors group"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {user.avatar ? (
                          <img
                            src={user.avatar}
                            alt={user.name}
                            className="w-10 h-10 rounded-full object-cover border border-slate-200"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold border border-indigo-100">
                            {user.name
                              ? user.name.charAt(0).toUpperCase()
                              : "U"}
                          </div>
                        )}
                        <div>
                          <div className="text-sm font-semibold text-slate-800">
                            {user.name || "Người dùng không tên"}
                          </div>
                          <div className="text-xs text-slate-500">
                            {user.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {editingUserId === user.id ? (
                        <div className="flex items-center gap-2">
                          <select
                            value={selectedRoleId}
                            onChange={(e) => setSelectedRoleId(e.target.value)}
                            className="text-sm bg-white border border-slate-200 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            disabled={isActionLoading}
                          >
                            <option value="">Chọn Vai trò</option>
                            {roles.map((role) => (
                              <option key={role.id} value={role.id}>
                                {role.name}
                              </option>
                            ))}
                          </select>
                          <button
                            onClick={() => handleUpdateRole(user.id)}
                            className="p-1 text-emerald-600 hover:bg-emerald-50 rounded-md transition-colors"
                            disabled={isActionLoading}
                          >
                            <Check className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setEditingUserId(null)}
                            className="p-1 text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
                            disabled={isActionLoading}
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 group/role">
                          <span
                            className={`text-sm font-medium text-slate-700 border-2 px-3 py-1 rounded-lg cursor-pointer transition-all ${getRoleBorderColor(user.role?.name)}`}
                          >
                            {user.role?.name || "Người dùng"}
                          </span>
                          <button
                            onClick={() => startEditingRole(user)}
                            className="p-1 text-slate-400 hover:text-indigo-600 opacity-0 group-hover/role:opacity-100 transition-all"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold inline-flex items-center justify-center ${getStatusColor(user.status)}`}
                      >
                        {user.status || "ACTIVE"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-semibold text-slate-700">
                        {user.xp || 0}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => setUserToDelete(user)}
                        className="p-2 text-rose-600 border-2 border-rose-400 hover:border-rose-600 hover:bg-rose-50 hover:shadow-lg hover:shadow-rose-200 rounded-xl transition-all cursor-pointer"
                        title="Xóa Người dùng"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        {!isLoading && total > 0 && (
          <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between bg-slate-50/30">
            <div className="text-sm text-slate-500">
              Hiển thị{" "}
              <span className="font-semibold text-slate-800">
                {(page - 1) * take + 1}
              </span>{" "}
              đến{" "}
              <span className="font-semibold text-slate-800">
                {Math.min(page * take, total)}
              </span>{" "}
              trong <span className="font-semibold text-slate-800">{total}</span>{" "}
              người dùng
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handlePreviousPage}
                disabled={page === 1}
                className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-white hover:text-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                title="Trang Trước"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <div className="px-2 text-sm font-medium text-slate-700">
                Trang {page} / {totalPages}
              </div>
              <button
                onClick={handleNextPage}
                disabled={page === totalPages}
                className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-white hover:text-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                title="Trang Tiếp"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {userToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-6">
              <div className="w-12 h-12 bg-rose-50 rounded-2xl flex items-center justify-center mb-4">
                <AlertCircle className="w-6 h-6 text-rose-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">
                Xóa Người dùng
              </h3>
              <p className="text-slate-500 mb-6">
                Bạn có chắc chắn muốn xóa{" "}
                <span className="font-semibold text-slate-900">
                  {userToDelete.name || userToDelete.email}
                </span>
                ? Hành động này không thể hoàn tác và sẽ xóa người dùng khỏi hệ thống.
              </p>

              <div className="flex gap-3">
                <button
                  onClick={() => setUserToDelete(null)}
                  className="flex-1 px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                  disabled={isActionLoading}
                >
                  Hủy
                </button>
                <button
                  onClick={handleDeleteUser}
                  className="flex-1 px-4 py-2.5 bg-rose-600 text-white rounded-xl text-sm font-semibold hover:bg-rose-700 transition-colors shadow-lg shadow-rose-200 flex items-center justify-center gap-2"
                  disabled={isActionLoading}
                >
                  {isActionLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Trash2 className="w-4 h-4" />
                  )}
                  Xóa Người dùng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagementPage;
