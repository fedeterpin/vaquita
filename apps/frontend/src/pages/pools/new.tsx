import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/client";
import { Card, CardContent, CardHeader } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { motion } from "framer-motion";

export default function NewPoolPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    description: "",
    isPublic: true,
    contributionsVisibility: "PUBLIC",
    targetAmount: "",
    deadline: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await api.post("/pools", {
        ...form,
        targetAmount: form.targetAmount ? Number(form.targetAmount) : undefined,
      });
      navigate("/dashboard");
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          "Error al crear la vaquita. Por favor intenta nuevamente."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="shadow-xl border-turquesa/60">
          <CardHeader className="bg-turquesa/10">
            <h1 className="text-3xl font-bold text-turquesa">
              Crear Nueva Vaquita
            </h1>
            <p className="text-sm text-grafito/80 mt-1">
              Organiza una vaquita con tus amigos para juntar dinero
            </p>
          </CardHeader>
          <CardContent>
            <form className="space-y-5" onSubmit={submit}>
              <div className="space-y-2">
                <label
                  htmlFor="title"
                  className="text-sm font-medium text-grafito"
                >
                  Título de la vaquita *
                </label>
                <Input
                  id="title"
                  placeholder="Ej: Regalo de cumpleaños para Juan"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  required
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="description"
                  className="text-sm font-medium text-grafito"
                >
                  Descripción
                </label>
                <textarea
                  id="description"
                  className="flex min-h-[100px] w-full rounded-md border-2 border-celeste/50 bg-white/90 px-3 py-2 text-sm text-grafito placeholder:text-grafito/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-turquesa focus-visible:border-turquesa focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:cursor-not-allowed disabled:opacity-50 transition-colors shadow-sm"
                  placeholder="Describe para qué es esta vaquita..."
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-grafito">
                  Visibilidad de las contribuciones
                </label>
                <select
                  className="flex h-10 w-full rounded-md border-2 border-celeste/50 bg-white/90 px-3 py-2 text-sm text-grafito focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-turquesa focus-visible:border-turquesa focus-visible:ring-offset-2 focus-visible:ring-offset-white transition-colors shadow-sm"
                  value={form.contributionsVisibility}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      contributionsVisibility: e.target.value,
                    })
                  }
                  disabled={loading}
                >
                  <option value="PUBLIC">
                    Públicas - Todos pueden ver quién contribuyó
                  </option>
                  <option value="ANONYMOUS">
                    Anónimas - Solo se muestra el monto
                  </option>
                </select>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="targetAmount"
                  className="text-sm font-medium text-grafito"
                >
                  Meta (opcional)
                </label>
                <Input
                  id="targetAmount"
                  type="number"
                  placeholder="Ej: 50000"
                  value={form.targetAmount}
                  onChange={(e) =>
                    setForm({ ...form, targetAmount: e.target.value })
                  }
                  disabled={loading}
                />
                <p className="text-xs text-grafito/70">
                  Monto objetivo que quieres alcanzar
                </p>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="deadline"
                  className="text-sm font-medium text-grafito"
                >
                  Fecha límite *
                </label>
                <Input
                  id="deadline"
                  type="datetime-local"
                  value={form.deadline}
                  onChange={(e) =>
                    setForm({ ...form, deadline: e.target.value })
                  }
                  required
                  disabled={loading}
                />
              </div>

              <div className="flex items-center space-x-2 p-3 rounded-md bg-white/60 border border-celeste/30">
                <input
                  type="checkbox"
                  id="isPublic"
                  checked={form.isPublic}
                  onChange={(e) =>
                    setForm({ ...form, isPublic: e.target.checked })
                  }
                  disabled={loading}
                  className="rounded border-celeste/40"
                />
                <label
                  htmlFor="isPublic"
                  className="text-sm text-grafito cursor-pointer"
                >
                  Hacer esta vaquita pública (visible para todos)
                </label>
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

              <div className="flex gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/dashboard")}
                  disabled={loading}
                  className="flex-1"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  asMotion
                  disabled={loading}
                  className="flex-1"
                >
                  {loading ? "Creando..." : "Crear Vaquita"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
