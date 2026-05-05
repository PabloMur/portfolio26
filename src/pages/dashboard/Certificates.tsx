import { useState, useEffect, useRef } from "react";
import {
  fetchCertificates,
  addCertificate,
  deleteCertificate,
  type Certificate,
} from "../../services/certificates";
import { uploadImage } from "../../services/cloudinary";
import {
  AiOutlineLoading3Quarters,
  AiOutlinePlus,
  AiOutlineDelete,
  AiOutlineLink,
  AiOutlineClose,
  AiOutlineCloudUpload,
} from "react-icons/ai";

const CATEGORIES = ["Frontend", "Backend", "DevOps", "Diseño", "Data", "Otro"];

const EMPTY_FORM = {
  title: "",
  issuer: "",
  date: "",
  url: "",
  imageUrl: "",
  category: "Otro",
};

export default function Certificates() {
  const [certs, setCerts] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [draggingOver, setDraggingOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchCertificates()
      .then(setCerts)
      .finally(() => setLoading(false));
  }, []);

  function openModal() {
    setForm(EMPTY_FORM);
    setImageFile(null);
    setImagePreview(null);
    setShowModal(true);
  }

  function handleImageSelect(file: File) {
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  }

  function handleFileDrop(e: React.DragEvent) {
    e.preventDefault();
    setDraggingOver(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) handleImageSelect(file);
  }

  async function handleSave() {
    if (!form.title || !form.issuer || !form.date) return;
    setSaving(true);
    try {
      let imageUrl = form.imageUrl;
      if (imageFile) imageUrl = await uploadImage(imageFile);
      const cert = await addCertificate({ ...form, imageUrl });
      setCerts((prev) => [cert, ...prev]);
      setShowModal(false);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    setDeletingId(id);
    try {
      await deleteCertificate(id);
      setCerts((prev) => prev.filter((c) => c.id !== id));
    } finally {
      setDeletingId(null);
    }
  }

  const categoryColor: Record<string, string> = {
    Frontend: "text-indigo-400 bg-indigo-500/10 border-indigo-500/20",
    Backend: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    DevOps: "text-orange-400 bg-orange-500/10 border-orange-500/20",
    Diseño: "text-pink-400 bg-pink-500/10 border-pink-500/20",
    Data: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20",
    Otro: "text-gray-400 bg-gray-500/10 border-gray-500/20",
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <AiOutlineLoading3Quarters className="text-3xl text-violet-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-8 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-violet-400 font-mono text-xs tracking-widest uppercase mb-1">Dashboard</p>
          <h1 className="text-2xl font-bold text-white">Certificados</h1>
        </div>
        <button
          onClick={openModal}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-xl transition-colors shrink-0"
        >
          <AiOutlinePlus size={16} />
          <span className="hidden sm:inline">Nuevo</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 col-span-2 sm:col-span-1">
          <p className="text-gray-500 text-xs mb-2">Total</p>
          <p className="text-white text-3xl font-bold">{certs.length}</p>
        </div>
        {CATEGORIES.slice(0, 3).map((cat) => (
          <div key={cat} className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
            <p className="text-gray-500 text-xs mb-2">{cat}</p>
            <p className="text-white text-3xl font-bold">{certs.filter((c) => c.category === cat).length}</p>
          </div>
        ))}
      </div>

      {/* Grid */}
      {certs.length === 0 ? (
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-10 text-center">
          <p className="text-gray-600 text-sm">No hay certificados aún.</p>
          <button
            onClick={openModal}
            className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-xl transition-colors"
          >
            <AiOutlinePlus size={16} />
            Agregar primero
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {certs.map((cert) => (
            <div
              key={cert.id}
              className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden hover:border-gray-700 transition-colors group"
            >
              {cert.imageUrl ? (
                <div className="h-40 overflow-hidden bg-gray-800">
                  <img
                    src={cert.imageUrl}
                    alt={cert.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              ) : (
                <div className="h-40 bg-gray-800 flex items-center justify-center">
                  <span className="text-4xl opacity-20">🎓</span>
                </div>
              )}
              <div className="p-4 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-white text-sm font-semibold truncate">{cert.title}</p>
                    <p className="text-gray-500 text-xs mt-0.5">{cert.issuer} · {cert.date}</p>
                  </div>
                  <button
                    onClick={() => handleDelete(cert.id!)}
                    disabled={deletingId === cert.id}
                    className="p-1.5 text-gray-600 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors shrink-0"
                  >
                    {deletingId === cert.id
                      ? <AiOutlineLoading3Quarters size={14} className="animate-spin" />
                      : <AiOutlineDelete size={14} />}
                  </button>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${categoryColor[cert.category] ?? categoryColor["Otro"]}`}>
                    {cert.category}
                  </span>
                  {cert.url && (
                    <a
                      href={cert.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-indigo-400 hover:text-indigo-300 text-xs transition-colors"
                    >
                      <AiOutlineLink size={12} />
                      Ver credencial
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-gray-900 border border-gray-800 rounded-t-2xl sm:rounded-2xl w-full sm:max-w-lg flex flex-col max-h-[90vh]">
            {/* Modal header */}
            <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-gray-800 shrink-0">
              <h2 className="text-white font-semibold">Nuevo certificado</h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-1.5 text-gray-500 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
              >
                <AiOutlineClose size={16} />
              </button>
            </div>

            {/* Modal body */}
            <div className="overflow-y-auto flex-1 px-5 py-4 space-y-4">
              {/* Image drop zone */}
              <div
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => { e.preventDefault(); setDraggingOver(true); }}
                onDragLeave={() => setDraggingOver(false)}
                onDrop={handleFileDrop}
                className={`relative h-36 rounded-xl border-2 border-dashed cursor-pointer transition-colors overflow-hidden ${
                  draggingOver
                    ? "border-indigo-500 bg-indigo-500/10"
                    : "border-gray-700 hover:border-gray-600 bg-gray-800/50"
                }`}
              >
                {imagePreview ? (
                  <img src={imagePreview} alt="preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="flex flex-col items-center justify-center h-full gap-2 text-gray-500">
                    <AiOutlineCloudUpload size={28} />
                    <p className="text-xs">Arrastrá o hacé click para subir imagen</p>
                  </div>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => { const f = e.target.files?.[0]; if (f) handleImageSelect(f); }}
                />
              </div>

              {/* Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="sm:col-span-2">
                  <label className="text-gray-500 text-xs block mb-1">Título *</label>
                  <input
                    value={form.title}
                    onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                    placeholder="ej. React Developer Certificate"
                    className="w-full bg-gray-800 border border-gray-700 rounded-xl px-3 py-2.5 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="text-gray-500 text-xs block mb-1">Institución *</label>
                  <input
                    value={form.issuer}
                    onChange={(e) => setForm((f) => ({ ...f, issuer: e.target.value }))}
                    placeholder="ej. Coursera"
                    className="w-full bg-gray-800 border border-gray-700 rounded-xl px-3 py-2.5 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="text-gray-500 text-xs block mb-1">Fecha *</label>
                  <input
                    type="month"
                    value={form.date}
                    onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
                    className="w-full bg-gray-800 border border-gray-700 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="text-gray-500 text-xs block mb-1">Categoría</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                    className="w-full bg-gray-800 border border-gray-700 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-indigo-500"
                  >
                    {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-gray-500 text-xs block mb-1">URL credencial</label>
                  <input
                    value={form.url}
                    onChange={(e) => setForm((f) => ({ ...f, url: e.target.value }))}
                    placeholder="https://..."
                    className="w-full bg-gray-800 border border-gray-700 rounded-xl px-3 py-2.5 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>
            </div>

            {/* Modal footer */}
            <div className="px-5 pb-5 pt-3 border-t border-gray-800 shrink-0 flex gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 py-2.5 rounded-xl text-sm text-gray-400 bg-gray-800 hover:bg-gray-700 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                disabled={saving || !form.title || !form.issuer || !form.date}
                className="flex-1 py-2.5 rounded-xl text-sm text-white bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
              >
                {saving && <AiOutlineLoading3Quarters size={14} className="animate-spin" />}
                {saving ? "Guardando…" : "Guardar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
