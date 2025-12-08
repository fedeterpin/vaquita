import { useEffect, useState } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import api from "../../api/client";
import { Card, CardContent, CardHeader } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { useAuth } from "../../hooks/useAuth";

interface Pool {
  id: string;
  title: string;
  description?: string;
  status: string;
  targetAmount?: number;
  currency: string;
  deadline: string;
  ownerId: string;
  isPublic: boolean;
  contributionsVisibility: string;
}

interface Contribution {
  id: string;
  amount: number;
  userId: string;
  isVisibleToOthers: boolean;
  user?: {
    id: string;
    name: string;
    email: string;
  };
}

export default function PoolDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { token } = useAuth();
  const invite = searchParams.get("invite");
  const [pool, setPool] = useState<Pool | null>(null);
  const [contributions, setContributions] = useState<Contribution[]>([]);
  const [form, setForm] = useState({ amount: "", isVisibleToOthers: true });
  const [inviteToken, setInviteToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [contributing, setContributing] = useState(false);

  const fetchData = async () => {
    if (!id) return;
    try {
      setLoading(true);
      const poolRes = await api.get(`/pools/${id}`);
      setPool(poolRes.data);
      const contribRes = await api.get(`/pools/${id}/contributions`, {
        params: { invite },
      });
      setContributions(contribRes.data.contributions);
    } catch (err: any) {
      setError(err.response?.data?.message || "Error al cargar la vaquita");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id, invite]);

  const contribute = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !token) {
      navigate("/login");
      return;
    }
    setError(null);
    setContributing(true);
    try {
      await api.post(`/pools/${id}/contributions`, {
        amount: Number(form.amount),
        isVisibleToOthers: form.isVisibleToOthers,
      });
      setForm({ ...form, amount: "" });
      fetchData();
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          "Error al contribuir. Por favor intenta nuevamente."
      );
    } finally {
      setContributing(false);
    }
  };

  const closePool = async () => {
    if (!id) return;
    if (!confirm("¿Estás seguro de que quieres cerrar esta vaquita?")) return;
    try {
      await api.post(`/pools/${id}/close`);
      fetchData();
    } catch (err: any) {
      setError(err.response?.data?.message || "Error al cerrar la vaquita");
    }
  };

  const generateInvite = async () => {
    if (!id) return;
    try {
      const res = await api.post(`/pools/${id}/invites`);
      setInviteToken(res.data.token);
    } catch (err: any) {
      setError(err.response?.data?.message || "Error al generar invitación");
    }
  };

  const copyInviteLink = () => {
    if (!inviteToken || !id) return;
    const link = `${window.location.origin}/pools/${id}?invite=${inviteToken}`;
    navigator.clipboard.writeText(link);
    alert("¡Enlace copiado al portapapeles!");
  };

  const getStatusLabel = (status: string) => {
    const statusMap: Record<string, string> = {
      OPEN: "Abierta",
      CLOSED: "Cerrada",
      CANCELLED: "Cancelada",
    };
    return statusMap[status] || status;
  };

  const getStatusColor = (status: string) => {
    const colorMap: Record<string, string> = {
      OPEN: "bg-verde/25 text-verde border-2 border-verde/50 shadow-md",
      CLOSED: "bg-celeste/25 text-celeste border-2 border-celeste/50 shadow-md",
      CANCELLED: "bg-bordo/25 text-bordo border-2 border-bordo/50 shadow-md",
    };
    return (
      colorMap[status] ||
      "bg-celeste/25 text-celeste border-2 border-celeste/50 shadow-md"
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-grafito/80">Cargando vaquita...</p>
      </div>
    );
  }

  if (!pool) {
    return (
      <div className="text-center py-12">
        <p className="text-grafito/80 mb-4">No se pudo cargar la vaquita</p>
        <Button onClick={() => navigate("/dashboard")}>Volver al panel</Button>
      </div>
    );
  }

  const totalRaised = contributions.reduce(
    (sum, c) => sum + Number(c.amount),
    0
  );
  const target = pool.targetAmount || 0;
  const percent = target ? Math.round((totalRaised / target) * 100) : null;
  const isOwner = token && pool.ownerId;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header Card */}
      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold text-grafito">
                  {pool.title}
                </h1>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                    pool.status
                  )}`}
                >
                  {getStatusLabel(pool.status)}
                </span>
              </div>
              {pool.description && (
                <p className="text-grafito/80 mb-4">{pool.description}</p>
              )}
            </div>
            {pool.status === "OPEN" && isOwner && (
              <Button variant="secondary" asMotion onClick={closePool}>
                Cerrar Vaquita
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="p-5 rounded-xl bg-turquesa/20 border-2 border-turquesa/50 shadow-md"
            >
              <p className="text-sm text-grafito/90 mb-2 font-medium">
                Recaudado
              </p>
              <p className="text-3xl font-bold text-turquesa">
                {totalRaised.toLocaleString()} {pool.currency}
              </p>
            </motion.div>
            {target > 0 && (
              <>
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="p-5 rounded-xl bg-celeste/20 border-2 border-celeste/50 shadow-md"
                >
                  <p className="text-sm text-grafito/90 mb-2 font-medium">
                    Meta
                  </p>
                  <p className="text-3xl font-bold text-celeste">
                    {target.toLocaleString()} {pool.currency}
                  </p>
                </motion.div>
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="p-5 rounded-xl bg-amarillo/30 border-2 border-amarillo/50 shadow-md"
                >
                  <p className="text-sm text-grafito mb-2 font-medium">
                    Progreso
                  </p>
                  <p className="text-3xl font-bold text-grafito">{percent}%</p>
                </motion.div>
              </>
            )}
          </div>

          {target > 0 && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-grafito/80">
                <span>Progreso hacia la meta</span>
                <span>{percent}%</span>
              </div>
              <div className="w-full bg-cemento/60 rounded-full h-4 shadow-inner">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(percent || 0, 100)}%` }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="bg-turquesa h-4 rounded-full shadow-sm"
                />
              </div>
            </div>
          )}

          <div className="pt-4 border-t">
            <p className="text-sm text-grafito/80">
              <span className="font-medium">Fecha límite:</span>{" "}
              {new Date(pool.deadline).toLocaleString("es-AR", {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Contribute Card */}
      {pool.status === "OPEN" && (
        <Card className="shadow-sm">
          <CardHeader>
            <h2 className="text-lg font-semibold text-grafito">
              Contribuir a esta vaquita
            </h2>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={contribute}>
              <div className="space-y-2">
                <label
                  htmlFor="amount"
                  className="text-sm font-medium text-grafito"
                >
                  Monto a contribuir ({pool.currency})
                </label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="Ingresa el monto"
                  value={form.amount}
                  onChange={(e) => setForm({ ...form, amount: e.target.value })}
                  required
                  min="1"
                  disabled={contributing || !token}
                />
              </div>
              <div className="flex items-center space-x-2 p-3 rounded-md bg-white/60">
                <input
                  type="checkbox"
                  id="isVisibleToOthers"
                  checked={form.isVisibleToOthers}
                  onChange={(e) =>
                    setForm({ ...form, isVisibleToOthers: e.target.checked })
                  }
                  disabled={contributing || !token}
                  className="rounded border-celeste/40"
                />
                <label
                  htmlFor="isVisibleToOthers"
                  className="text-sm text-grafito cursor-pointer"
                >
                  Hacer mi contribución visible para otros
                </label>
              </div>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 rounded-xl bg-bordo/15 border-2 border-bordo/40 shadow-md"
                >
                  <p className="text-sm text-bordo font-medium">{error}</p>
                </motion.div>
              )}
              {!token ? (
                <Button
                  type="button"
                  onClick={() => navigate("/login")}
                  className="w-full"
                >
                  Inicia sesión para contribuir
                </Button>
              ) : (
                <Button
                  type="submit"
                  asMotion
                  disabled={contributing}
                  className="w-full"
                >
                  {contributing ? "Contribuyendo..." : "Contribuir"}
                </Button>
              )}
            </form>
          </CardContent>
        </Card>
      )}

      {/* Contributions Card */}
      <Card className="shadow-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-grafito">
                Contribuciones
              </h2>
              <p className="text-sm text-grafito/80 mt-1">
                {contributions.length}{" "}
                {contributions.length === 1 ? "contribución" : "contribuciones"}
              </p>
            </div>
            {isOwner && pool.status === "OPEN" && (
              <div className="flex gap-2">
                {inviteToken && (
                  <Button variant="outline" asMotion onClick={copyInviteLink}>
                    Copiar Enlace
                  </Button>
                )}
                <Button variant="outline" asMotion onClick={generateInvite}>
                  Generar Invitación
                </Button>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {inviteToken && (
            <div className="mb-4 p-4 rounded-xl bg-celeste/20 border-2 border-celeste/50 shadow-md">
              <p className="text-sm text-grafito mb-2 font-semibold">
                <strong>Enlace de invitación:</strong>
              </p>
              <code className="text-xs bg-white/90 text-turquesa p-3 rounded-lg block break-all border border-turquesa/30">
                {window.location.origin}/pools/{id}?invite={inviteToken}
              </code>
            </div>
          )}
          <div className="space-y-3">
            {contributions.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-grafito/70">Aún no hay contribuciones</p>
                <p className="text-sm text-grafito/60 mt-2">
                  Sé el primero en contribuir
                </p>
              </div>
            ) : (
              contributions.map((c, idx) => (
                <motion.div
                  key={c.id}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="p-5 rounded-xl border-2 border-celeste/40 hover:border-turquesa hover:shadow-xl transition-all bg-white/80 hover:bg-white/90 backdrop-blur-sm"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-grafito">
                        {c.amount.toLocaleString()} {pool.currency}
                      </p>
                      <p className="text-xs text-grafito/70 mt-1">
                        {c.isVisibleToOthers && c.user
                          ? `Contribuido por ${c.user.name}`
                          : "Contribución anónima"}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
