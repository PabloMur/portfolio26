import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { FcGoogle } from "react-icons/fc";

export default function Login() {
  const { loginWithGoogle, user } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (user) {
    navigate("/dashboard", { replace: true });
    return null;
  }

  const handleGoogle = async () => {
    setError("");
    setLoading(true);
    try {
      await loginWithGoogle();
      navigate("/dashboard", { replace: true });
    } catch (e: any) {
      setError(e.message ?? "Error al iniciar sesión.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8">
          <p className="text-violet-400 font-mono text-xs tracking-widest uppercase mb-2">Dashboard</p>
          <h1 className="text-2xl font-bold text-white">Iniciar sesión</h1>
          <p className="text-gray-500 text-sm mt-1">Solo cuentas autorizadas pueden acceder.</p>
        </div>

        {error && (
          <p className="text-red-400 text-sm mb-4">{error}</p>
        )}

        <button
          onClick={handleGoogle}
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 bg-gray-900 border border-gray-700 hover:border-gray-500 disabled:opacity-50 text-white text-sm font-medium py-3 rounded-xl transition-colors"
        >
          <FcGoogle size={20} />
          {loading ? "Iniciando sesión..." : "Continuar con Google"}
        </button>
      </div>
    </div>
  );
}
