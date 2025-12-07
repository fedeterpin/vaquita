import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../../api/client'
import { Button } from '../../components/ui/button'
import { Card, CardContent, CardHeader } from '../../components/ui/card'
import { motion } from 'framer-motion'

interface Pool {
  id: string
  title: string
  status: string
}

export default function DashboardPage() {
  const [ownPools, setOwnPools] = useState<Pool[]>([])
  const [publicPools, setPublicPools] = useState<Pool[]>([])

  useEffect(() => {
    api.get('/pools').then((res) => setOwnPools(res.data))
    api.get('/pools/public').then((res) => setPublicPools(res.data))
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <Button asMotion asChild={false} onClick={() => (window.location.href = '/pools/new')}>
          Create Pool
        </Button>
      </div>
      <Card>
        <CardHeader>
          <h2 className="font-medium">Your Pools</h2>
        </CardHeader>
        <CardContent className="grid gap-3">
          {ownPools.map((pool) => (
            <motion.div key={pool.id} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}>
              <Link to={`/pools/${pool.id}`} className="text-blue-600 hover:underline">
                {pool.title} - {pool.status}
              </Link>
            </motion.div>
          ))}
          {ownPools.length === 0 && <p className="text-sm text-slate-500">No pools yet.</p>}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <h2 className="font-medium">Public Pools</h2>
        </CardHeader>
        <CardContent className="grid gap-3">
          {publicPools.map((pool) => (
            <motion.div key={pool.id} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}>
              <Link to={`/pools/${pool.id}`} className="text-blue-600 hover:underline">
                {pool.title}
              </Link>
            </motion.div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
