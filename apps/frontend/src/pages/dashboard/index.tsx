import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../api/client";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader } from "../../components/ui/card";
import { motion } from "framer-motion";
import { useAuth } from "../../hooks/useAuth";

interface Pool {
  id: string;
  title: string;
  status: string;
  description?: string;
  targetAmount?: number;
  currency: string;
}

export default function DashboardPage() {
  const navigate = useNavigate();
  const { token } = useAuth();
  const [ownPools, setOwnPools] = useState<Pool[]>([]);
  const [publicPools, setPublicPools] = useState<Pool[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    Promise.all([
      api.get("/pools").then((res) => setOwnPools(res.data)),
      api.get("/pools/public").then((res) => setPublicPools(res.data)),
    ]).finally(() => setLoading(false));
  }, [token, navigate]);

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
        <p className="text-grafito/80">Cargando...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-grafito">Mi Panel</h1>
            <p className="text-grafito/80 mt-1">
              Gestiona tus vaquitas y descubre nuevas
            </p>
          </div>
          <Button
            asMotion
            onClick={() => navigate("/pools/new")}
            className="flex items-center gap-2"
          >
            <span>+</span>
            <span>Crear Vaquita</span>
          </Button>
        </div>

        <Card className="shadow-sm">
          <CardHeader>
            <h2 className="text-lg font-semibold text-grafito">Mis Vaquitas</h2>
            <p className="text-sm text-grafito/80">
              Las vaquitas que has creado
            </p>
          </CardHeader>
          <CardContent className="grid gap-4">
            {ownPools.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-grafito/70 mb-4">
                  Aún no has creado ninguna vaquita
                </p>
                <Button
                  asMotion
                  onClick={() => navigate("/pools/new")}
                  variant="outline"
                >
                  Crear mi primera vaquita
                </Button>
              </div>
            ) : (
              ownPools.map((pool) => (
                <motion.div
                  key={pool.id}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ scale: 1.01 }}
                >
                  <Link to={`/pools/${pool.id}`}>
                    <div className="p-5 rounded-xl border-2 border-celeste/40 hover:border-turquesa hover:shadow-xl transition-all bg-white/80 hover:bg-white/90 backdrop-blur-sm">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-grafito mb-1">
                            {pool.title}
                          </h3>
                          {pool.description && (
                            <p className="text-sm text-grafito/80 mb-2 line-clamp-2">
                              {pool.description}
                            </p>
                          )}
                          {pool.targetAmount && (
                            <p className="text-sm font-medium text-turquesa">
                              Meta: {pool.targetAmount} {pool.currency}
                            </p>
                          )}
                        </div>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                            pool.status
                          )}`}
                        >
                          {getStatusLabel(pool.status)}
                        </span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))
            )}
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader>
            <h2 className="text-lg font-semibold text-grafito">
              Vaquitas Públicas
            </h2>
            <p className="text-sm text-grafito/80">
              Descubre vaquitas creadas por otros
            </p>
          </CardHeader>
          <CardContent className="grid gap-4">
            {publicPools.length === 0 ? (
              <p className="text-sm text-grafito/70 text-center py-4">
                No hay vaquitas públicas disponibles
              </p>
            ) : (
              publicPools.map((pool) => (
                <motion.div
                  key={pool.id}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ scale: 1.01 }}
                >
                  <Link to={`/pools/${pool.id}`}>
                    <div className="p-5 rounded-xl border-2 border-celeste/40 hover:border-turquesa hover:shadow-xl transition-all bg-white/80 hover:bg-white/90 backdrop-blur-sm">
                      <h3 className="font-semibold text-grafito mb-1">
                        {pool.title}
                      </h3>
                      {pool.description && (
                        <p className="text-sm text-grafito/80 mb-2 line-clamp-2">
                          {pool.description}
                        </p>
                      )}
                      {pool.targetAmount && (
                        <p className="text-sm font-medium text-turquesa">
                          Meta: {pool.targetAmount} {pool.currency}
                        </p>
                      )}
                    </div>
                  </Link>
                </motion.div>
              ))
            )}
          </CardContent>
        </Card>
    </div>
  );
}
