import { useState, useEffect, useRef, FormEvent } from "react";
import {
  fetchProjects,
  createProject,
  updateProject,
  deleteProject,
  type AirtableProject,
} from "../../services/airtable";
import { uploadImage } from "../../services/cloudinary";
import { translateToEnglish } from "../../services/groq";
import {
  AiOutlinePlus,
  AiOutlineEdit,
  AiOutlineDelete,
  AiOutlineGithub,
  AiOutlineLink,
  AiOutlineLoading3Quarters,
  AiOutlineClose,
  AiOutlineCloudUpload,
  AiFillStar,
  AiOutlinePicture,
  AiOutlineTranslation,
} from "react-icons/ai";

type FormState = {
  title: string;
  description: string;
  descriptionEn: string;
  githubUrl: string;
  deployUrl: string;
  featured: boolean;
  order: number;
};

const EMPTY_FORM: FormState = {
  title: "",
  description: "",
  descriptionEn: "",
  githubUrl: "",
  deployUrl: "",
  featured: false,
  order: 999,
};

export default function Projects() {
  const [projects, setProjects] = useState<AirtableProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<AirtableProject | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [draggingOver, setDraggingOver] = useState(false);
  const [translating, setTranslating] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchProjects()
      .then(setProjects)
      .finally(() => setLoading(false));
  }, []);

  const openCreate = () => {
    setEditing(null);
    setForm(EMPTY_FORM);
    setImageFile(null);
    setImagePreview("");
    setError("");
    setShowModal(true);
  };

  const openEdit = (p: AirtableProject) => {
    setEditing(p);
    setForm({
      title: p.title,
      description: p.description,
      descriptionEn: p.descriptionEn,
      githubUrl: p.githubUrl,
      deployUrl: p.deployUrl,
      featured: p.featured,
      order: p.order,
    });
    setImageFile(null);
    setImagePreview(p.image);
    setError("");
    setShowModal(true);
  };

  const closeModal = () => {
    if (saving) return;
    setShowModal(false);
  };

  const handleFile = (file: File | undefined) => {
    if (!file || !file.type.startsWith("image/")) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDraggingOver(false);
    handleFile(e.dataTransfer.files[0]);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    if (!imagePreview && !editing) {
      setError("Agregá una imagen al proyecto.");
      return;
    }
    setSaving(true);
    try {
      let imageUrl = editing?.image ?? "";
      if (imageFile) imageUrl = await uploadImage(imageFile);
      if (editing) {
        const updated = await updateProject(editing.id, { ...form, image: imageUrl });
        setProjects((prev) => prev.map((p) => (p.id === editing.id ? updated : p)));
      } else {
        const created = await createProject({ ...form, image: imageUrl });
        setProjects((prev) => [created, ...prev]);
      }
      setShowModal(false);
    } catch {
      setError("Ocurrió un error. Intentá de nuevo.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      await deleteProject(id);
      setProjects((prev) => prev.filter((p) => p.id !== id));
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="p-4 sm:p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 sm:mb-8">
        <div>
          <p className="text-violet-400 font-mono text-xs tracking-widest uppercase mb-1">Dashboard</p>
          <h1 className="text-2xl font-bold text-white">Proyectos</h1>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white text-sm font-medium px-4 py-2.5 rounded-xl transition-colors"
        >
          <AiOutlinePlus size={16} />
          <span className="hidden sm:inline">Nuevo proyecto</span>
          <span className="sm:hidden">Nuevo</span>
        </button>
      </div>

      {/* Lista */}
      {loading ? (
        <div className="flex justify-center py-20">
          <AiOutlineLoading3Quarters className="text-3xl text-violet-400 animate-spin" />
        </div>
      ) : projects.length === 0 ? (
        <div className="text-center py-20 text-gray-600 text-sm">No hay proyectos todavía.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {projects.map((p) => (
            <div key={p.id} className={`bg-gray-900 border rounded-2xl overflow-hidden ${p.featured ? "border-violet-500/50" : "border-gray-800"}`}>
              {p.image && (
                <div className="relative">
                  <img src={p.image} alt={p.title} className="w-full h-40 object-cover" />
                  {p.featured && (
                    <span className="absolute top-2 right-2 flex items-center gap-1 bg-violet-600/90 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full">
                      <AiFillStar size={10} />
                      Destacado
                    </span>
                  )}
                </div>
              )}
              <div className="p-4">
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="text-white font-semibold text-sm truncate">{p.title}</h2>
                  {p.order !== 999 && (
                    <span className="text-gray-600 text-[10px] font-mono shrink-0">#{p.order}</span>
                  )}
                </div>
                <p className="text-gray-500 text-xs leading-relaxed line-clamp-2 mb-4">{p.description}</p>
                <div className="flex items-center justify-between">
                  <div className="flex gap-3">
                    {p.githubUrl && (
                      <a href={p.githubUrl} target="_blank" rel="noreferrer" className="text-gray-500 hover:text-white transition-colors">
                        <AiOutlineGithub size={16} />
                      </a>
                    )}
                    {p.deployUrl && (
                      <a href={p.deployUrl} target="_blank" rel="noreferrer" className="text-gray-500 hover:text-white transition-colors">
                        <AiOutlineLink size={16} />
                      </a>
                    )}
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => openEdit(p)}
                      className="p-2 rounded-lg text-gray-500 hover:text-white hover:bg-gray-800 transition-colors"
                    >
                      <AiOutlineEdit size={15} />
                    </button>
                    <button
                      onClick={() => handleDelete(p.id)}
                      disabled={deletingId === p.id}
                      className="p-2 rounded-lg text-gray-500 hover:text-red-400 hover:bg-gray-800 transition-colors disabled:opacity-40"
                    >
                      {deletingId === p.id
                        ? <AiOutlineLoading3Quarters size={15} className="animate-spin" />
                        : <AiOutlineDelete size={15} />}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-end sm:items-center justify-center z-50 p-0 sm:p-4">
          <div className="bg-gray-900 border border-gray-800 rounded-t-2xl sm:rounded-2xl w-full sm:max-w-lg shadow-2xl flex flex-col max-h-[92dvh] sm:max-h-[90vh]">

            {/* Sticky header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-800 shrink-0">
              <div>
                <h2 className="text-white font-semibold text-sm">
                  {editing ? "Editar proyecto" : "Nuevo proyecto"}
                </h2>
                {editing && (
                  <p className="text-gray-600 text-xs mt-0.5 truncate max-w-65">{editing.title}</p>
                )}
              </div>
              <button
                onClick={closeModal}
                disabled={saving}
                className="p-1.5 text-gray-500 hover:text-white hover:bg-gray-800 rounded-lg transition-colors disabled:opacity-40"
              >
                <AiOutlineClose size={18} />
              </button>
            </div>

            {/* Scrollable body */}
            <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0">
              <div className="flex-1 overflow-y-auto px-5 py-5 space-y-5">

                {/* Image upload */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs text-gray-500 font-mono">Imagen</label>
                    {imagePreview && (
                      <button
                        type="button"
                        onClick={() => { setImageFile(null); setImagePreview(""); }}
                        className="text-xs text-gray-600 hover:text-red-400 transition-colors flex items-center gap-1"
                      >
                        <AiOutlineClose size={11} />
                        Quitar
                      </button>
                    )}
                  </div>
                  <div
                    onClick={() => !saving && fileRef.current?.click()}
                    onDragOver={(e) => { e.preventDefault(); setDraggingOver(true); }}
                    onDragLeave={() => setDraggingOver(false)}
                    onDrop={handleDrop}
                    className={`relative cursor-pointer border-2 border-dashed rounded-xl overflow-hidden transition-all ${
                      draggingOver
                        ? "border-indigo-400 bg-indigo-500/10 scale-[1.01]"
                        : imagePreview
                        ? "border-gray-700 hover:border-gray-600"
                        : "border-gray-700 hover:border-indigo-500"
                    }`}
                  >
                    {imagePreview ? (
                      <>
                        <img src={imagePreview} alt="preview" className="w-full h-48 object-cover" />
                        {saving && imageFile && (
                          <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center gap-2">
                            <AiOutlineLoading3Quarters size={24} className="text-white animate-spin" />
                            <span className="text-white text-xs">Subiendo imagen...</span>
                          </div>
                        )}
                        {!saving && (
                          <div className="absolute inset-0 bg-black/0 hover:bg-black/50 flex items-center justify-center opacity-0 hover:opacity-100 transition-all">
                            <div className="flex items-center gap-2 text-white text-xs bg-black/40 px-3 py-1.5 rounded-lg">
                              <AiOutlineCloudUpload size={15} />
                              Cambiar imagen
                            </div>
                          </div>
                        )}
                      </>
                    ) : (
                      <div className={`h-44 flex flex-col items-center justify-center gap-3 transition-colors ${draggingOver ? "text-indigo-400" : "text-gray-600"}`}>
                        {draggingOver
                          ? <AiOutlineCloudUpload size={32} className="text-indigo-400" />
                          : <AiOutlinePicture size={32} />
                        }
                        <div className="text-center">
                          <p className="text-sm font-medium">{draggingOver ? "Soltá la imagen" : "Arrastrá o hacé clic"}</p>
                          <p className="text-xs text-gray-700 mt-0.5">PNG, JPG, WEBP</p>
                        </div>
                      </div>
                    )}
                  </div>
                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleFile(e.target.files?.[0])}
                  />
                </div>

                {/* Divider */}
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-px bg-gray-800" />
                  <span className="text-[10px] text-gray-600 font-mono uppercase tracking-widest">Información</span>
                  <div className="flex-1 h-px bg-gray-800" />
                </div>

                {/* Título */}
                <div>
                  <label className="block text-xs text-gray-500 mb-1.5 font-mono">Título *</label>
                  <input
                    type="text"
                    required
                    autoFocus
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    placeholder="Mi proyecto"
                    className="w-full bg-gray-950 border border-gray-800 rounded-xl px-3 py-2.5 text-sm text-gray-200 outline-none focus:border-indigo-500 transition-colors placeholder:text-gray-700"
                  />
                </div>

                {/* Descriptions side by side */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1.5 font-mono">Descripción ES *</label>
                    <textarea
                      required
                      rows={3}
                      value={form.description}
                      onChange={(e) => setForm({ ...form, description: e.target.value })}
                      placeholder="Descripción en español..."
                      className="w-full bg-gray-950 border border-gray-800 rounded-xl px-3 py-2.5 text-sm text-gray-200 outline-none focus:border-indigo-500 transition-colors resize-none placeholder:text-gray-700"
                    />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs text-gray-500 font-mono">Descripción EN</label>
                      <button
                        type="button"
                        disabled={!form.description.trim() || translating}
                        onClick={async () => {
                          setTranslating(true);
                          try {
                            const translated = await translateToEnglish(form.description);
                            setForm((prev) => ({ ...prev, descriptionEn: translated }));
                          } finally {
                            setTranslating(false);
                          }
                        }}
                        className="flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                      >
                        {translating
                          ? <><AiOutlineLoading3Quarters size={12} className="animate-spin" /> Traduciendo...</>
                          : <><AiOutlineTranslation size={13} /> Traducir</>
                        }
                      </button>
                    </div>
                    <textarea
                      rows={3}
                      value={form.descriptionEn}
                      onChange={(e) => setForm({ ...form, descriptionEn: e.target.value })}
                      placeholder="Description in English..."
                      className="w-full bg-gray-950 border border-gray-800 rounded-xl px-3 py-2.5 text-sm text-gray-200 outline-none focus:border-indigo-500 transition-colors resize-none placeholder:text-gray-700"
                    />
                  </div>
                </div>

                {/* Divider */}
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-px bg-gray-800" />
                  <span className="text-[10px] text-gray-600 font-mono uppercase tracking-widest">Links</span>
                  <div className="flex-1 h-px bg-gray-800" />
                </div>

                {/* URLs side by side */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1.5 font-mono">GitHub</label>
                    <div className="relative">
                      <AiOutlineGithub size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" />
                      <input
                        type="url"
                        value={form.githubUrl}
                        onChange={(e) => setForm({ ...form, githubUrl: e.target.value })}
                        placeholder="github.com/..."
                        className="w-full bg-gray-950 border border-gray-800 rounded-xl pl-8 pr-3 py-2.5 text-sm text-gray-200 outline-none focus:border-indigo-500 transition-colors placeholder:text-gray-700"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1.5 font-mono">Deploy</label>
                    <div className="relative">
                      <AiOutlineLink size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" />
                      <input
                        type="url"
                        value={form.deployUrl}
                        onChange={(e) => setForm({ ...form, deployUrl: e.target.value })}
                        placeholder="mi-proyecto.vercel.app"
                        className="w-full bg-gray-950 border border-gray-800 rounded-xl pl-8 pr-3 py-2.5 text-sm text-gray-200 outline-none focus:border-indigo-500 transition-colors placeholder:text-gray-700"
                      />
                    </div>
                  </div>
                </div>

                {/* Divider */}
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-px bg-gray-800" />
                  <span className="text-[10px] text-gray-600 font-mono uppercase tracking-widest">Config</span>
                  <div className="flex-1 h-px bg-gray-800" />
                </div>

                {/* Order + Featured */}
                <div className="flex items-center gap-4">
                  <div className="w-28">
                    <label className="block text-xs text-gray-500 mb-1.5 font-mono">Orden</label>
                    <input
                      type="number"
                      min={1}
                      value={form.order === 999 ? "" : form.order}
                      onChange={(e) => setForm({ ...form, order: e.target.value === "" ? 999 : Number(e.target.value) })}
                      placeholder="1, 2..."
                      className="w-full bg-gray-950 border border-gray-800 rounded-xl px-3 py-2.5 text-sm text-gray-200 outline-none focus:border-indigo-500 transition-colors placeholder:text-gray-700"
                    />
                  </div>

                  <label className="flex items-center gap-3 cursor-pointer mt-5 flex-1">
                    <div className="relative shrink-0">
                      <input
                        type="checkbox"
                        className="sr-only"
                        checked={form.featured}
                        onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                      />
                      <div className={`w-11 h-6 rounded-full transition-colors ${form.featured ? "bg-violet-600" : "bg-gray-700"}`} />
                      <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${form.featured ? "translate-x-5" : ""}`} />
                    </div>
                    <div>
                      <p className="text-sm text-gray-300">Destacado</p>
                      <p className="text-xs text-gray-600">Aparece primero en el portfolio</p>
                    </div>
                  </label>
                </div>

                {error && (
                  <p className="text-red-400 text-xs bg-red-900/20 border border-red-800/50 rounded-xl px-3 py-2.5">
                    {error}
                  </p>
                )}
              </div>

              {/* Sticky footer */}
              <div className="shrink-0 flex gap-3 px-5 py-4 border-t border-gray-800">
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={saving}
                  className="flex-1 py-3 rounded-xl text-sm text-gray-400 bg-gray-800 hover:bg-gray-700 active:bg-gray-600 transition-colors disabled:opacity-40"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 py-3 rounded-xl text-sm text-white bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
                >
                  {saving
                    ? <><AiOutlineLoading3Quarters size={15} className="animate-spin" /> Guardando...</>
                    : editing ? "Guardar cambios" : "Crear proyecto"
                  }
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
