import { useState, useEffect, useRef, FormEvent } from "react";
import {
  fetchProjects,
  createProject,
  updateProject,
  deleteProject,
  type AirtableProject,
} from "../../services/airtable";
import { uploadImage } from "../../services/cloudinary";
import {
  AiOutlinePlus,
  AiOutlineEdit,
  AiOutlineDelete,
  AiOutlineGithub,
  AiOutlineLink,
  AiOutlineLoading3Quarters,
  AiOutlineClose,
  AiOutlineCloudUpload,
} from "react-icons/ai";

type FormState = {
  title: string;
  description: string;
  descriptionEn: string;
  githubUrl: string;
  deployUrl: string;
};

const EMPTY_FORM: FormState = {
  title: "",
  description: "",
  descriptionEn: "",
  githubUrl: "",
  deployUrl: "",
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

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (!imagePreview && !editing) {
      setError("Agregá una imagen.");
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
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-violet-400 font-mono text-xs tracking-widest uppercase mb-1">Dashboard</p>
          <h1 className="text-2xl font-bold text-white">Proyectos</h1>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium px-4 py-2 rounded-xl transition-colors"
        >
          <AiOutlinePlus size={16} />
          Nuevo proyecto
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
            <div key={p.id} className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
              {p.image && (
                <img src={p.image} alt={p.title} className="w-full h-40 object-cover" />
              )}
              <div className="p-4">
                <h2 className="text-white font-semibold text-sm mb-1 truncate">{p.title}</h2>
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
                  <div className="flex gap-2">
                    <button
                      onClick={() => openEdit(p)}
                      className="p-1.5 rounded-lg text-gray-500 hover:text-white hover:bg-gray-800 transition-colors"
                    >
                      <AiOutlineEdit size={15} />
                    </button>
                    <button
                      onClick={() => handleDelete(p.id)}
                      disabled={deletingId === p.id}
                      className="p-1.5 rounded-lg text-gray-500 hover:text-red-400 hover:bg-gray-800 transition-colors disabled:opacity-40"
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
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-md shadow-2xl">
            {/* Modal header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800">
              <h2 className="text-white font-semibold text-sm">
                {editing ? "Editar proyecto" : "Nuevo proyecto"}
              </h2>
              <button onClick={closeModal} className="text-gray-500 hover:text-white transition-colors">
                <AiOutlineClose size={18} />
              </button>
            </div>

            {/* Modal body */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Image upload */}
              <div>
                <label className="block text-xs text-gray-500 mb-1.5 font-mono">Imagen</label>
                <div
                  onClick={() => fileRef.current?.click()}
                  className="relative cursor-pointer border border-dashed border-gray-700 rounded-xl overflow-hidden hover:border-indigo-500 transition-colors"
                >
                  {imagePreview ? (
                    <img src={imagePreview} alt="preview" className="w-full h-36 object-cover" />
                  ) : (
                    <div className="h-36 flex flex-col items-center justify-center gap-2 text-gray-600">
                      <AiOutlineCloudUpload size={28} />
                      <span className="text-xs">Click para subir imagen</span>
                    </div>
                  )}
                  {imagePreview && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                      <span className="text-white text-xs">Cambiar imagen</span>
                    </div>
                  )}
                </div>
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
              </div>

              {/* Title */}
              <div>
                <label className="block text-xs text-gray-500 mb-1.5 font-mono">Título</label>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full bg-gray-950 border border-gray-800 rounded-xl px-3 py-2 text-sm text-gray-200 outline-none focus:border-indigo-500 transition-colors"
                />
              </div>

              {/* Description ES */}
              <div>
                <label className="block text-xs text-gray-500 mb-1.5 font-mono">Descripción (ES)</label>
                <textarea
                  required
                  rows={2}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full bg-gray-950 border border-gray-800 rounded-xl px-3 py-2 text-sm text-gray-200 outline-none focus:border-indigo-500 transition-colors resize-none"
                />
              </div>

              {/* Description EN */}
              <div>
                <label className="block text-xs text-gray-500 mb-1.5 font-mono">Descripción (EN)</label>
                <textarea
                  rows={2}
                  value={form.descriptionEn}
                  onChange={(e) => setForm({ ...form, descriptionEn: e.target.value })}
                  className="w-full bg-gray-950 border border-gray-800 rounded-xl px-3 py-2 text-sm text-gray-200 outline-none focus:border-indigo-500 transition-colors resize-none"
                />
              </div>

              {/* GitHub */}
              <div>
                <label className="block text-xs text-gray-500 mb-1.5 font-mono">GitHub URL</label>
                <input
                  type="url"
                  value={form.githubUrl}
                  onChange={(e) => setForm({ ...form, githubUrl: e.target.value })}
                  placeholder="https://github.com/..."
                  className="w-full bg-gray-950 border border-gray-800 rounded-xl px-3 py-2 text-sm text-gray-200 outline-none focus:border-indigo-500 transition-colors placeholder:text-gray-700"
                />
              </div>

              {/* Deploy */}
              <div>
                <label className="block text-xs text-gray-500 mb-1.5 font-mono">Deploy URL</label>
                <input
                  type="url"
                  value={form.deployUrl}
                  onChange={(e) => setForm({ ...form, deployUrl: e.target.value })}
                  placeholder="https://..."
                  className="w-full bg-gray-950 border border-gray-800 rounded-xl px-3 py-2 text-sm text-gray-200 outline-none focus:border-indigo-500 transition-colors placeholder:text-gray-700"
                />
              </div>

              {error && <p className="text-red-400 text-xs">{error}</p>}

              {/* Actions */}
              <div className="flex gap-3 pt-1">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 py-2 rounded-xl text-sm text-gray-400 bg-gray-800 hover:bg-gray-700 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 py-2 rounded-xl text-sm text-white bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
                >
                  {saving && <AiOutlineLoading3Quarters size={14} className="animate-spin" />}
                  {saving ? "Guardando..." : editing ? "Guardar cambios" : "Crear proyecto"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
