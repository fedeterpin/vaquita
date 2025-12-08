import { useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import api from "../../api/client";
import { Card, CardContent, CardHeader } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { useAuth } from "../../hooks/useAuth";
import { motion } from "framer-motion";

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { setToken } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const message = location.state?.message;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await api.post("/auth/login", form);
      setToken(res.data.token);
      navigate("/dashboard");
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          "Error al iniciar sesión. Verifica tus credenciales."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md"
      >
        <Card className="shadow-xl border-turquesa/60">
          <CardHeader className="text-center bg-turquesa/10">
            <h1 className="text-3xl font-bold text-turquesa">
              Bienvenido a Vaquita
            </h1>
            <p className="text-sm text-grafito/80 mt-2">
              Inicia sesión para continuar
            </p>
          </CardHeader>
          <CardContent>
            {message && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-3 rounded-md bg-verde/20 border border-verde/30 mb-4"
              >
                <p className="text-sm text-verde">{message}</p>
              </motion.div>
            )}
            <form className="space-y-4" onSubmit={submit}>
              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="text-sm font-medium text-grafito"
                >
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="tu@email.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                  disabled={loading}
                />
              </div>
              <div className="space-y-2">
                <label
                  htmlFor="password"
                  className="text-sm font-medium text-grafito"
                >
                  Contraseña
                </label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Ingresa tu contraseña"
                    value={form.password}
                    onChange={(e) =>
                      setForm({ ...form, password: e.target.value })
                    }
                    required
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-grafito/70 hover:text-grafito text-sm"
                    disabled={loading}
                  >
                    {showPassword ? "Ocultar" : "Mostrar"}
                  </button>
                </div>
              </div>
              {error && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="p-3 rounded-md bg-bordo/10 border border-bordo/30"
                >
                  <p className="text-sm text-bordo">{error}</p>
                </motion.div>
              )}
              <Button
                type="submit"
                asMotion
                className="w-full"
                disabled={loading}
              >
                {loading ? "Iniciando sesión..." : "Iniciar sesión"}
              </Button>
              <div className="text-center text-sm text-grafito/80">
                ¿No tienes una cuenta?{" "}
                <Link
                  to="/register"
                  className="text-turquesa hover:text-[#00C4C4] font-medium"
                >
                  Regístrate aquí
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
