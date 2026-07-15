import { useState, useRef } from 'react';
import { X, Plus, UploadCloud, Link as LinkIcon, FileText, Video, File, Trash2 } from 'lucide-react';

export default function UploadMaterialsModal({ isOpen, onClose, onAddMaterials }) {
  const fileInputRef = useRef(null);
  
  const [dragActive, setDragActive] = useState(false);
  const [linkTitle, setLinkTitle] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  const [linkError, setLinkError] = useState('');

  // Staged items — shown in preview inside modal, added on "Lưu"
  const [stagedItems, setStagedItems] = useState([]);

  if (!isOpen) return null;

  const getFileIcon = (type) => {
    switch (type) {
      case 'VIDEO': return <Video className="w-4 h-4 text-blue-600" />;
      case 'DOCUMENTATION': return <FileText className="w-4 h-4 text-red-600" />;
      case 'ARTICLE': return <LinkIcon className="w-4 h-4 text-purple-600" />;
      default: return <File className="w-4 h-4 text-slate-500" />;
    }
  };

  // Drag and drop handlers
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      stageFiles(e.dataTransfer.files);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      stageFiles(e.target.files);
      // Reset input so same file can be re-selected
      e.target.value = '';
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  // Add files to staging area (preview), NOT yet to materials list
  const stageFiles = (files) => {
    const newItems = Array.from(files).map((file) => {
      const ext = file.name.split('.').pop().toLowerCase();
      let type = 'DOCUMENTATION';
      if (['mp4', 'mkv', 'avi', 'mov', 'webm'].includes(ext)) {
        type = 'VIDEO';
      }
      return {
        id: `staged-${crypto.randomUUID()}`,
        title: file.name,
        type,
        url: '#',
        size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
      };
    });
    setStagedItems((prev) => [...prev, ...newItems]);
  };

  const removeStagedItem = (id) => {
    setStagedItems((prev) => prev.filter((item) => item.id !== id));
  };

  // Add Link to staging area
  const handleAddLink = (e) => {
    e.preventDefault();
    if (!linkTitle.trim()) {
      setLinkError('Vui lòng nhập tên tài liệu');
      return;
    }
    if (!linkUrl.trim()) {
      setLinkError('Vui lòng nhập URL tài liệu');
      return;
    }
    if (!linkUrl.startsWith('http://') && !linkUrl.startsWith('https://')) {
      setLinkError('URL phải bắt đầu bằng http:// hoặc https://');
      return;
    }

    const newLink = {
      id: `staged-link-${crypto.randomUUID()}`,
      title: linkTitle.trim(),
      type: 'ARTICLE',
      url: linkUrl.trim(),
    };

    setStagedItems((prev) => [...prev, newLink]);
    setLinkTitle('');
    setLinkUrl('');
    setLinkError('');
  };

  // On "Lưu": commit staged items to parent and close
  const handleSave = () => {
    if (stagedItems.length > 0) {
      onAddMaterials(stagedItems);
    }
    setStagedItems([]);
    onClose();
  };

  // On "Hủy": discard staged items and close
  const handleCancel = () => {
    setStagedItems([]);
    setLinkTitle('');
    setLinkUrl('');
    setLinkError('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-xl w-full max-w-3xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
          <h2 className="text-xl font-bold text-slate-900">Thêm Tài Liệu Mới</h2>
          <button 
            onClick={handleCancel}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* File Upload (Drag & Drop) */}
          <div className="bg-slate-50/50 rounded-2xl p-6 border border-slate-100">
            <h3 className="text-sm font-bold text-slate-900 mb-4">Tải lên tệp tin</h3>
            <div 
              className={`border-2 border-dashed rounded-2xl p-6 transition-all flex flex-col items-center justify-center cursor-pointer ${
                dragActive 
                  ? 'border-indigo-500 bg-indigo-50/20 scale-[0.99]' 
                  : 'border-slate-200 hover:border-indigo-400 hover:bg-slate-50'
              }`}
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
              onClick={triggerFileInput}
            >
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                multiple
                onChange={handleFileChange}
                accept=".pdf,.zip,.docx,.xlsx,.mp4,.avi,.mov,.mkv"
              />
              <div className="w-12 h-12 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-600 mb-3 shadow-sm">
                <UploadCloud className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-semibold text-slate-900 mb-1">Kéo và thả tệp vào đây</h4>
              <p className="text-slate-400 text-xs text-center mb-4">
                Hỗ trợ: PDF, ZIP, DOCX, XLSX, MP4 (Tối đa 50MB)
              </p>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); triggerFileInput(); }}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl shadow-md transition-all active:scale-[0.98]"
              >
                Duyệt tệp tin
              </button>
            </div>
          </div>

          {/* Link Upload */}
          <div className="bg-slate-50/50 rounded-2xl p-6 border border-slate-100">
            <div className="flex items-center gap-2 mb-4">
              <LinkIcon className="w-4 h-4 text-indigo-600" />
              <h3 className="text-sm font-bold text-slate-900">Thêm liên kết tài liệu</h3>
            </div>
            <form onSubmit={handleAddLink} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1.5">Tên tài liệu</label>
                  <input
                    type="text"
                    placeholder="VD: Hướng dẫn React Query"
                    value={linkTitle}
                    onChange={(e) => { setLinkTitle(e.target.value); if (linkError) setLinkError(''); }}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1.5">URL</label>
                  <input
                    type="text"
                    placeholder="https://..."
                    value={linkUrl}
                    onChange={(e) => { setLinkUrl(e.target.value); if (linkError) setLinkError(''); }}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                  />
                </div>
              </div>
              {linkError && <p className="text-xs text-red-500 font-semibold">{linkError}</p>}
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-semibold text-sm transition-colors group bg-indigo-50 hover:bg-indigo-100 px-4 py-2 rounded-lg"
                >
                  <Plus className="w-4 h-4 transition-transform group-hover:rotate-90" />
                  <span>Thêm liên kết</span>
                </button>
              </div>
            </form>
          </div>

          {/* Staged Preview */}
          {stagedItems.length > 0 && (
            <div className="bg-emerald-50 rounded-2xl p-5 border border-emerald-100">
              <h3 className="text-sm font-bold text-slate-900 mb-3">
                Đã chọn ({stagedItems.length} mục) — Bấm <span className="text-indigo-600">Lưu</span> để xác nhận
              </h3>
              <div className="space-y-2">
                {stagedItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between gap-3 bg-white rounded-xl px-4 py-2.5 border border-slate-100 shadow-sm"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      {getFileIcon(item.type)}
                      <span className="text-sm text-slate-800 font-medium truncate">{item.title}</span>
                      {item.size && (
                        <span className="text-[10px] text-slate-400 flex-shrink-0">{item.size}</span>
                      )}
                    </div>
                    <button
                      onClick={() => removeStagedItem(item.id)}
                      className="p-1 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        
        {/* Footer */}
        <div className="border-t border-slate-100 p-5 flex justify-end gap-3">
          <button
            onClick={handleCancel}
            className="px-6 py-2.5 bg-white hover:bg-slate-50 text-slate-600 font-semibold rounded-xl border border-slate-200 hover:border-slate-300 transition-all"
          >
            Hủy
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-md shadow-indigo-600/20 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {stagedItems.length > 0 ? `Lưu (${stagedItems.length})` : 'Lưu'}
          </button>
        </div>
      </div>
    </div>
  );
}
