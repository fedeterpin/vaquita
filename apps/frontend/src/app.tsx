import { Route, Routes, Navigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import LoginPage from './pages/auth/login'
import RegisterPage from './pages/auth/register'
import DashboardPage from './pages/dashboard'
import NewPoolPage from './pages/pools/new'
import PoolDetailPage from './pages/pools/detail'
import { useAuth } from './hooks/useAuth'

const PageContainer: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }} className="p-4 max-w-4xl mx-auto">
    {children}
  </motion.div>
)

function PrivateRoute({ children }: { children: JSX.Element }) {
  const { token } = useAuth()
  return token ? children : <Navigate to="/login" />
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<PageContainer><LoginPage /></PageContainer>} />
      <Route path="/register" element={<PageContainer><RegisterPage /></PageContainer>} />
      <Route path="/dashboard" element={<PrivateRoute><PageContainer><DashboardPage /></PageContainer></PrivateRoute>} />
      <Route path="/pools/new" element={<PrivateRoute><PageContainer><NewPoolPage /></PageContainer></PrivateRoute>} />
      <Route path="/pools/:id" element={<PrivateRoute><PageContainer><PoolDetailPage /></PageContainer></PrivateRoute>} />
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  )
}
