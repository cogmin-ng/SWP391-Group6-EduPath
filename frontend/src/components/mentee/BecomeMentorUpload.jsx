import { useRef, useState, useCallback } from "react";
import { FileUp, Trash2, Upload } from "lucide-react";
import { MAX_FILE_SIZE } from "../../mock/becomeMentorData";

/**
 * Helper: format file size
 */
function formatFileSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/**
 * CV Upload section.
 *
 * @param {{
 *   cvFile: File | null,
 *   setCvFile: Function,
 *   cvError: string,
 *   setCvError: Function
 * }} props
 */
export default function BecomeMentorUpload({
  cvFile,
  setCvFile,
  cvError,
  setCvError,
}) {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const validateAndSetFile = useCallback(
    (file) => {
      if (!file) return;

      const ext = file.name.split(".").pop().toLowerCase();
      const validExts = ["pdf", "doc", "docx"];
      if (!validExts.includes(ext)) {
        setCvError("Chỉ chấp nhận file PDF, DOC hoặc DOCX.");
        return;
      }
      if (file.size > MAX_FILE_SIZE) {
        setCvError("Dung lượng file tối đa là 10MB.");
        return;
      }

      setCvError("");
      setCvFile(file);
    },
    [setCvFile, setCvError]
  );

  const handleFileDrop = useCallback(
    (e) => {
      e.preventDefault();
      setIsDragOver(false);
      const file = e.dataTransfer?.files?.[0];
      validateAndSetFile(file);
    },
    [validateAndSetFile]
  );

  const handleFileChange = useCallback(
    (e) => {
      const file = e.target.files?.[0];
      validateAndSetFile(file);
    },
    [validateAndSetFile]
  );

  const removeFile = () => {
    setCvFile(null);
    setCvError("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <section className="rounded-3xl border border-slate-100 bg-white p-6 sm:p-8 shadow-sm mb-8 animate-fadeIn">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-violet-50 text-violet-600">
          <FileUp className="w-5 h-5" />
        </div>
        <h2 className="text-lg font-bold text-slate-900 tracking-tight">
          CV & Hồ sơ đính kèm
        </h2>
      </div>

      {!cvFile ? (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragOver(true);
          }}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={handleFileDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`relative flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed px-6 py-12 text-center transition-all duration-200 cursor-pointer ${
            isDragOver
              ? "border-indigo-400 bg-indigo-50/50"
              : cvError
              ? "border-red-300 bg-red-50/30"
              : "border-slate-200 bg-slate-50/50 hover:border-indigo-300 hover:bg-indigo-50/30"
          }`}
        >
          <div
            className={`flex items-center justify-center w-14 h-14 rounded-2xl ${
              isDragOver
                ? "bg-indigo-100 text-indigo-600"
                : "bg-slate-100 text-slate-400"
            } transition-colors`}
          >
            <Upload className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-700">
              Kéo thả file vào đây hoặc{" "}
              <span className="text-indigo-600">chọn file</span>
            </p>
            <p className="mt-1 text-xs text-slate-400">
              PDF, DOC, DOCX — Tối đa 10MB
            </p>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>
      ) : (
        <div className="flex items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-indigo-100 text-indigo-600 shrink-0">
              <FileUp className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-slate-800 truncate">
                {cvFile.name}
              </p>
              <p className="text-xs text-slate-400">
                {formatFileSize(cvFile.size)}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={removeFile}
            className="shrink-0 rounded-lg p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
          >
            <Trash2 className="h-4.5 w-4.5" />
          </button>
        </div>
      )}

      {cvError && <p className="mt-2 text-xs text-red-500">{cvError}</p>}
    </section>
  );
}
