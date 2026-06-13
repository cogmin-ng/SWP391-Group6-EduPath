import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { 
  Plus, 
  Trash2, 
  Pencil, 
  X, 
  Check, 
  FileText, 
  Video, 
  Link as LinkIcon, 
  UploadCloud, 
  ArrowLeft,
  Save,
  CheckCircle2
} from 'lucide-react';

// Mock list of roadmaps for the selector
const roadmapsList = [
  { id: '1', name: 'Fullstack Web Developer 2026' },
  { id: '2', name: 'Backend Developer' },
  { id: '3', name: 'Frontend Developer' },
  { id: '4', name: 'Mobile App Development' },
  { id: '5', name: 'Data Science Roadmap' },
  { id: '6', name: 'DevOps Engineer' }
];

// Mock nodes mapped by roadmap ID
const nodesByRoadmap = {
  '1': [
    { id: 'html-css', name: 'HTML & CSS Fundamentals' },
    { id: 'db-opt', name: 'Database Optimization' },
    { id: 'backend-api', name: 'Backend API Development' },
    { id: 'react-js', name: 'ReactJS & State Management' }
  ],
  '2': [
    { id: 'db-opt', name: 'Database Optimization' },
    { id: 'sql-nosql', name: 'SQL & NoSQL Databases' },
    { id: 'caching-redis', name: 'Caching & Redis' },
    { id: 'sys-design', name: 'System Design Basics' }
  ],
  '3': [
    { id: 'css-frameworks', name: 'TailwindCSS & CSS Frameworks' },
    { id: 'js-async', name: 'Asynchronous JavaScript' },
    { id: 'react-basics', name: 'React Basics' },
    { id: 'next-js', name: 'Next.js & SSR' }
  ],
  '4': [
    { id: 'rn-basics', name: 'React Native Basics' },
    { id: 'navigation', name: 'React Navigation' },
    { id: 'native-modules', name: 'Native Modules' }
  ],
  '5': [
    { id: 'python-data', name: 'Python for Data Science' },
    { id: 'pandas-numpy', name: 'Pandas & NumPy' },
    { id: 'ml-basics', name: 'Machine Learning Basics' }
  ],
  '6': [
    { id: 'docker-basics', name: 'Docker & Containerization' },
    { id: 'ci-cd', name: 'CI/CD Pipelines' },
    { id: 'k8s', name: 'Kubernetes' }
  ]
};

// Initial default materials matching the user's screenshot
const initialMaterials = [
  {
    id: 'mat-1',
    title: 'DB_Architecture.pdf',
    type: 'DOCUMENT',
    url: '#',
    size: '12.4 MB'
  },
  {
    id: 'mat-2',
    title: 'Video Tutorial: Introduction to Databases',
    type: 'VIDEO',
    url: '#',
    duration: '15 mins'
  },
  {
    id: 'mat-3',
    title: 'Mastering NoSQL Databases',
    type: 'LINK',
    url: 'https://example.com/nosql'
  }
];

export default function UploadMaterialsPage() {
  const { roadmapId, nodeId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const fileInputRef = useRef(null);

  // States
  const [selectedRoadmapId, setSelectedRoadmapId] = useState(roadmapId || '1');
  const [selectedNodeId, setSelectedNodeId] = useState(nodeId || 'db-opt');
  const [materials, setMaterials] = useState(initialMaterials);
  const [dragActive, setDragActive] = useState(false);
  
  // Link inputs state
  const [linkTitle, setLinkTitle] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  const [linkError, setLinkError] = useState('');

  // Inline editing state
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState('');

  // Success toast/alert state
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Setup options based on route params
  useEffect(() => {
    // If roadmapId is 'new', we can treat it as ID '1' or pre-populate it
    if (roadmapId && roadmapId !== 'new') {
      setSelectedRoadmapId(roadmapId);
    }
    
    // Set node ID if provided in route
    if (nodeId) {
      setSelectedNodeId(nodeId);
    }
  }, [roadmapId, nodeId]);

  // Available nodes for current roadmap selection
  const currentNodes = nodesByRoadmap[selectedRoadmapId] || nodesByRoadmap['1'];

  // Handle roadmap selection change
  const handleRoadmapChange = (e) => {
    const rId = e.target.value;
    setSelectedRoadmapId(rId);
    // Auto select first node of this roadmap
    const nodes = nodesByRoadmap[rId] || [];
    if (nodes.length > 0) {
      setSelectedNodeId(nodes[0].id);
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
      handleFilesUpload(e.dataTransfer.files);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFilesUpload(e.target.files);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  // Process file upload locally
  const handleFilesUpload = (files) => {
    const newItems = Array.from(files).map((file, index) => {
      // Determine type based on extension
      const ext = file.name.split('.').pop().toLowerCase();
      let type = 'DOCUMENT';
      if (['mp4', 'mkv', 'avi', 'mov', 'webm'].includes(ext)) {
        type = 'VIDEO';
      }

      return {
        id: `file-${Date.now()}-${index}`,
        title: file.name,
        type,
        url: '#',
        size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`
      };
    });

    setMaterials(prev => [...prev, ...newItems]);
    showNotification(`Đã tải lên thành công ${newItems.length} tệp tin!`);
  };

  // Add Link Handler
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
    // Simple URL validation
    if (!linkUrl.startsWith('http://') && !linkUrl.startsWith('https://')) {
      setLinkError('URL phải bắt đầu bằng http:// hoặc https://');
      return;
    }

    const newLink = {
      id: `link-${Date.now()}`,
      title: linkTitle.trim(),
      type: 'LINK',
      url: linkUrl.trim()
    };

    setMaterials(prev => [...prev, newLink]);
    setLinkTitle('');
    setLinkUrl('');
    setLinkError('');
    showNotification('Đã thêm liên kết tài liệu mới!');
  };

  // Edit / Delete handlers
  const handleStartEdit = (item) => {
    setEditingId(item.id);
    setEditTitle(item.title);
  };

  const handleSaveEdit = (id) => {
    if (!editTitle.trim()) return;
    setMaterials(prev => prev.map(m => m.id === id ? { ...m, title: editTitle.trim() } : m));
    setEditingId(null);
    showNotification('Đã cập nhật tên tài liệu!');
  };

  const handleCancelEdit = () => {
    setEditingId(null);
  };

  const handleDeleteItem = (id) => {
    setMaterials(prev => prev.filter(m => m.id !== id));
    showNotification('Đã xóa tài liệu!');
  };

  // Notification helper
  const showNotification = (msg) => {
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 3000);
  };

  // Save changes and exit
  const handleSaveAndExit = () => {
    // Show success notice
    setToastMessage('Lưu và Cập nhật tài liệu thành công!');
    setShowToast(true);
    
    // Navigate back to node details page after short delay
    setTimeout(() => {
      if (roadmapId === 'new') {
        navigate('/mentor/create-roadmap');
      } else {
        navigate(`/mentor/roadmaps/${selectedRoadmapId}/nodes/${selectedNodeId}`);
      }
    }, 1200);
  };

  const handleCancel = () => {
    if (roadmapId === 'new') {
      navigate('/mentor/create-roadmap');
    } else {
      navigate(`/mentor/roadmaps/${selectedRoadmapId}/nodes/${selectedNodeId}`);
    }
  };

  // Helper to get type icon
  const getTypeIcon = (type) => {
    switch (type) {
      case 'DOCUMENT':
        return {
          icon: <FileText className="w-5 h-5 text-red-600" />,
          bgClass: 'bg-red-50 border border-red-100'
        };
      case 'VIDEO':
        return {
          icon: <Video className="w-5 h-5 text-blue-600" />,
          bgClass: 'bg-blue-50 border border-blue-100'
        };
      case 'LINK':
      default:
        return {
          icon: <LinkIcon className="w-5 h-5 text-purple-600" />,
          bgClass: 'bg-purple-50 border border-purple-100'
        };
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8 relative">
      {/* Toast Notification */}
      {showToast && (
        <div className="fixed top-6 right-6 z-50 flex items-center gap-3 bg-slate-900 text-white px-5 py-3.5 rounded-2xl shadow-xl border border-slate-800 transition-all duration-300 animate-in fade-in slide-in-from-top-4">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span className="text-sm font-semibold">{toastMessage}</span>
        </div>
      )}

      <div className="max-w-7xl mx-auto">
        {/* Navigation Back */}
        <button
          onClick={handleCancel}
          className="flex items-center gap-2 text-slate-500 hover:text-slate-900 font-medium transition-colors mb-6 group"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          <span>Quay lại trang chi tiết Node</span>
        </button>

        {/* Page Title Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Tải lên tài liệu học tập</h1>
          <p className="text-slate-500 mt-2 text-sm sm:text-base">
            Quản lý và chia sẻ tài liệu cho các Node trong lộ trình của bạn.
          </p>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Config, File Upload, Link Addition */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Card 1: Context Selectors */}
            <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-100/80 transition-all hover:shadow-md/50">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                
                {/* Roadmap Selector */}
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                    Lộ trình
                  </label>
                  <div className="relative">
                    <select
                      value={selectedRoadmapId}
                      onChange={handleRoadmapChange}
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50/80 text-slate-800 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 pl-4 pr-10 py-3.5 appearance-none cursor-pointer transition-all"
                    >
                      {roadmapsList.map((roadmap) => (
                        <option key={roadmap.id} value={roadmap.id}>
                          {roadmap.name}
                        </option>
                      ))}
                    </select>
                    <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Node Selector */}
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                    Node học tập
                  </label>
                  <div className="relative">
                    <select
                      value={selectedNodeId}
                      onChange={(e) => setSelectedNodeId(e.target.value)}
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50/80 text-slate-800 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 pl-4 pr-10 py-3.5 appearance-none cursor-pointer transition-all"
                    >
                      {currentNodes.map((node) => (
                        <option key={node.id} value={node.id}>
                          {node.name}
                        </option>
                      ))}
                    </select>
                    <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>

              </div>
            </div>

            {/* Card 2: File Upload (Drag & Drop) */}
            <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-100/80 transition-all hover:shadow-md/50">
              <h2 className="text-lg font-bold text-slate-900 mb-5">Tải lên tệp tin</h2>
              
              <div 
                className={`border-2 border-dashed rounded-3xl p-8 transition-all flex flex-col items-center justify-center cursor-pointer ${
                  dragActive 
                    ? 'border-indigo-500 bg-indigo-50/20 scale-[0.99]' 
                    : 'border-slate-200 hover:border-indigo-400 hover:bg-slate-50/30'
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
                
                <div className="w-14 h-14 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 mb-4 shadow-sm border border-indigo-100/50">
                  <UploadCloud className="w-7 h-7" />
                </div>
                
                <h3 className="text-base font-semibold text-slate-900 text-center mb-1">
                  Kéo và thả tệp vào đây
                </h3>
                <p className="text-slate-400 text-xs text-center mb-5 max-w-sm leading-relaxed">
                  Hỗ trợ: PDF, ZIP, DOCX, XLSX (Tối đa 50MB)
                </p>
                
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    triggerFileInput();
                  }}
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-2xl shadow-lg shadow-indigo-600/20 hover:shadow-indigo-600/35 transition-all active:scale-[0.98]"
                >
                  Duyệt tệp tin
                </button>
              </div>
            </div>

            {/* Card 3: Link Upload */}
            <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-100/80 transition-all hover:shadow-md/50">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-bold text-slate-900">Thêm liên kết tài liệu</h2>
                <LinkIcon className="w-5 h-5 text-indigo-600/70" />
              </div>

              <form onSubmit={handleAddLink} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-2">
                      Tên tài liệu
                    </label>
                    <input
                      type="text"
                      placeholder="VD: Hướng dẫn React Query"
                      value={linkTitle}
                      onChange={(e) => {
                        setLinkTitle(e.target.value);
                        if (linkError) setLinkError('');
                      }}
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50/30 hover:bg-slate-50/70 px-4 py-3.5 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-2">
                      URL (Youtube, Drive, Medium...)
                    </label>
                    <input
                      type="text"
                      placeholder="https://..."
                      value={linkUrl}
                      onChange={(e) => {
                        setLinkUrl(e.target.value);
                        if (linkError) setLinkError('');
                      }}
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50/30 hover:bg-slate-50/70 px-4 py-3.5 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all"
                    />
                  </div>
                </div>

                {linkError && (
                  <p className="text-xs text-red-500 font-semibold">{linkError}</p>
                )}

                <button
                  type="submit"
                  className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-semibold text-sm transition-colors pt-2 group"
                >
                  <Plus className="w-4 h-4 transition-transform group-hover:rotate-90" />
                  <span>Thêm liên kết khác</span>
                </button>
              </form>
            </div>

          </div>

          {/* Right Column: Uploaded Materials List */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-100/80 sticky top-8">
              <div className="mb-6">
                <h2 className="text-lg font-bold text-slate-900">Tài liệu đã tải lên</h2>
                <p className="text-slate-400 text-xs mt-1 font-medium">
                  {materials.length} mục đã sẵn sàng
                </p>
              </div>

              {/* Materials List */}
              <div className="space-y-4 max-h-[460px] overflow-y-auto pr-1">
                {materials.length === 0 ? (
                  <div className="text-center py-10 border-2 border-dashed border-slate-100 rounded-2xl">
                    <p className="text-slate-400 text-sm font-medium">Chưa có tài liệu học tập nào</p>
                  </div>
                ) : (
                  materials.map((item) => {
                    const { icon, bgClass } = getTypeIcon(item.type);
                    const isEditing = editingId === item.id;
                    
                    return (
                      <div 
                        key={item.id}
                        className="p-4 border border-slate-100 rounded-2xl bg-slate-50/30 hover:bg-slate-50/80 transition-all flex items-start justify-between gap-3 group/item"
                      >
                        {/* Icon Block */}
                        <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm ${bgClass}`}>
                          {icon}
                        </div>

                        {/* Detail Block */}
                        <div className="flex-1 min-w-0 pt-0.5">
                          {isEditing ? (
                            <div className="flex items-center gap-1.5 w-full mt-0.5">
                              <input
                                type="text"
                                value={editTitle}
                                onChange={(e) => setEditTitle(e.target.value)}
                                className="w-full px-2.5 py-1 border border-indigo-400 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                                autoFocus
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') handleSaveEdit(item.id);
                                  if (e.key === 'Escape') handleCancelEdit();
                                }}
                              />
                              <button 
                                onClick={() => handleSaveEdit(item.id)}
                                className="p-1 hover:bg-emerald-50 text-emerald-600 rounded-md transition-colors"
                                title="Lưu"
                              >
                                <Check className="w-4 h-4" />
                              </button>
                              <button 
                                onClick={handleCancelEdit}
                                className="p-1 hover:bg-slate-100 text-slate-400 rounded-md transition-colors"
                                title="Hủy"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          ) : (
                            <>
                              <h3 className="font-bold text-slate-800 text-sm truncate leading-snug group-hover/item:text-indigo-700 transition-colors" title={item.title}>
                                {item.title}
                              </h3>
                              <div className="flex items-center gap-2 mt-1.5">
                                <span className="text-[10px] font-bold tracking-wider px-2 py-0.5 rounded-md bg-slate-100 text-slate-500 border border-slate-200/50 uppercase">
                                  {item.type}
                                </span>
                                {item.size && (
                                  <span className="text-[10px] text-slate-400 font-medium">{item.size}</span>
                                )}
                                {item.duration && (
                                  <span className="text-[10px] text-slate-400 font-medium">{item.duration}</span>
                                )}
                              </div>
                            </>
                          )}
                        </div>

                        {/* Action Buttons */}
                        {!isEditing && (
                          <div className="flex gap-0.5 opacity-0 group-hover/item:opacity-100 transition-opacity flex-shrink-0">
                            <button
                              onClick={() => handleStartEdit(item)}
                              className="p-1.5 hover:bg-slate-100 text-slate-500 hover:text-slate-800 rounded-lg transition-colors"
                              title="Chỉnh sửa"
                            >
                              <Pencil className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteItem(item.id)}
                              className="p-1.5 hover:bg-red-50 text-slate-500 hover:text-red-600 rounded-lg transition-colors"
                              title="Xóa"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="flex justify-end items-center gap-4 mt-8 pt-6 border-t border-slate-200">
          <button
            onClick={handleCancel}
            className="px-6 py-3.5 rounded-2xl bg-white hover:bg-slate-50 text-slate-600 font-bold border border-slate-200 hover:border-slate-300 transition-all active:scale-[0.98]"
          >
            Hủy bỏ
          </button>
          
          <button
            onClick={handleSaveAndExit}
            className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-lg shadow-indigo-600/20 hover:shadow-indigo-600/35 transition-all active:scale-[0.98]"
          >
            <Save className="w-4 h-4" />
            <span>Lưu và Cập nhật</span>
          </button>
        </div>

      </div>
    </div>
  );
}
