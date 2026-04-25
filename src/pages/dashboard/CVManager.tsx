import { useState, useEffect, useRef } from "react";
import { fetchCVs, uploadCV, setActiveCV, deleteCV, type CV } from "../../services/cv";
import { uploadPdf } from "../../services/cloudinary";
import {
  AiOutlineLoading3Quarters,
  AiOutlineCloudUpload,
  AiOutlineDelete,
  AiOutlineDownload,
  AiOutlineCheck,
  AiOutlineFilePdf,
} from "react-icons/ai";
import { Timestamp } from "firebase/firestore";

function timeAgo(ts: Timestamp): string {
  const diff = Date.now() - ts.toMillis();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "ahora";
  if (mins < 60) return `hace ${mins}m`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `hace ${hours}h`;
  return `hace ${Math.floor(hours / 24)}d`;
}

export default function CVManager() {
  const [cvs, setCvs] = useState<CV[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [settingId, setSettingId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [name, setName] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchCVs().then(setCvs).finally(() => setLoading(false));
  }, []);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    if (!name) setName(f.name.replace(".pdf", ""));
  };

  const handleUpload = async () => {
    if (!file || !name.trim()) { setError("Completá el nombre y seleccioná un PDF."); return; }
    setError("");
    setUploading(true);
    try {
      const url = await uploadPdf(file);
      const created = await uploadCV(name.trim(), url);
      setCvs((prev) => [created, ...prev]);
      setFile(null);
      setName("");
      if (fileRef.current) fileRef.current.value = "";
    } catch {
      setError("Error al subir el archivo. Intentá de nuevo.");
    } finally {
      setUploading(false);
    }
  };

  const handleSetActive = async (id: string) => {
    setSettingId(id);
    await setActiveCV(id, cvs.map((c) => c.id!));
    setCvs((prev) => prev.map((c) => ({ ...c, active: c.id === id })));
    setSettingId(null);
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    await deleteCV(id);
    setCvs((prev) => prev.filter((c) => c.id !== id));
    setDeletingId(null);
  };

  return (
    <div className="p-8 space-y-8">
      <div>
        <p className="text-violet-400 font-mono text-xs tracking-widest uppercase mb-1">Dashboard</p>
        <h1 className="text-2xl font-bold text-white">CV</h1>
      </div>

      {/* Upload */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 space-y-4">
        <h2 className="text-white text-sm font-semibold">Subir nuevo CV</h2>

        <div>
          <label className="block text-xs text-gray-500 mb-1.5 font-mono">Nombre</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="CV Pablo Murillo - 2026"
            className="w-full bg-gray-950 border border-gray-800 rounded-xl px-3 py-2 text-sm text-gray-200 outline-none focus:border-indigo-500 transition-colors placeholder:text-gray-700"
          />
        </div>

        <div
          onClick={() => fileRef.current?.click()}
          className="cursor-pointer border border-dashed border-gray-700 rounded-xl p-6 flex flex-col items-center gap-2 hover:border-indigo-500 transition-colors"
        >
          <AiOutlineFilePdf size={28} className={file ? "text-violet-400" : "text-gray-600"} />
          <span className="text-xs text-gray-500">
            {file ? file.name : "Click para seleccionar un PDF"}
          </span>
          <input ref={fileRef} type="file" accept=".pdf" className="hidden" onChange={handleFile} />
        </div>

        {error && <p className="text-red-400 text-xs">{error}</p>}

        <button
          onClick={handleUpload}
          disabled={uploading || !file}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-sm font-medium px-5 py-2.5 rounded-xl transition-colors"
        >
          {uploading
            ? <><AiOutlineLoading3Quarters size={15} className="animate-spin" /> Subiendo...</>
            : <><AiOutlineCloudUpload size={15} /> Subir CV</>
          }
        </button>
      </div>

      {/* Lista */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
        <h2 className="text-white text-sm font-semibold mb-4">Mis CVs</h2>

        {loading ? (
          <div className="flex justify-center py-10">
            <AiOutlineLoading3Quarters className="text-2xl text-violet-400 animate-spin" />
          </div>
        ) : cvs.length === 0 ? (
          <p className="text-gray-600 text-sm">No hay CVs todavía.</p>
        ) : (
          <div className="space-y-3">
            {cvs.map((cv) => (
              <div
                key={cv.id}
                className={`flex items-center gap-4 p-4 rounded-xl border transition-colors ${
                  cv.active
                    ? "border-violet-500/50 bg-violet-500/5"
                    : "border-gray-800 bg-gray-950"
                }`}
              >
                <AiOutlineFilePdf size={22} className={cv.active ? "text-violet-400" : "text-gray-600"} />

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-white text-sm font-medium truncate">{cv.name}</p>
                    {cv.active && (
                      <span className="text-[10px] bg-violet-600/30 text-violet-300 px-2 py-0.5 rounded-full font-semibold shrink-0">
                        Activo
                      </span>
                    )}
                  </div>
                  <p className="text-gray-600 text-xs mt-0.5">{timeAgo(cv.uploadedAt)}</p>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href={cv.url.replace("/raw/upload/", "/raw/upload/fl_attachment/")}
                    download={`${cv.name}.pdf`}
                    className="p-2 rounded-lg text-gray-500 hover:text-white hover:bg-gray-800 transition-colors"
                    title="Descargar"
                  >
                    <AiOutlineDownload size={16} />
                  </a>
                  <button
                    onClick={() => handleSetActive(cv.id!)}
                    disabled={cv.active || settingId === cv.id}
                    className="p-2 rounded-lg text-gray-500 hover:text-violet-400 hover:bg-gray-800 transition-colors disabled:opacity-30"
                    title="Marcar como activo"
                  >
                    {settingId === cv.id
                      ? <AiOutlineLoading3Quarters size={16} className="animate-spin" />
                      : <AiOutlineCheck size={16} />
                    }
                  </button>
                  <button
                    onClick={() => handleDelete(cv.id!)}
                    disabled={deletingId === cv.id}
                    className="p-2 rounded-lg text-gray-500 hover:text-red-400 hover:bg-gray-800 transition-colors disabled:opacity-30"
                    title="Eliminar"
                  >
                    {deletingId === cv.id
                      ? <AiOutlineLoading3Quarters size={16} className="animate-spin" />
                      : <AiOutlineDelete size={16} />
                    }
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
