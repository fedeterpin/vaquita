import { useEffect, useState } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import api from '../../api/client'
import { Card, CardContent, CardHeader } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'

interface Pool {
  id: string
  title: string
  description?: string
  status: string
  targetAmount?: number
  currency: string
  deadline: string
  ownerId: string
  isPublic: boolean
  contributionsVisibility: string
}

interface Contribution {
  id: string
  amount: number
  userId: string
  isVisibleToOthers: boolean
}

export default function PoolDetailPage() {
  const { id } = useParams<{ id: string }>()
  const [searchParams] = useSearchParams()
  const invite = searchParams.get('invite')
  const [pool, setPool] = useState<Pool | null>(null)
  const [contributions, setContributions] = useState<Contribution[]>([])
  const [form, setForm] = useState({ amount: '', isVisibleToOthers: true })
  const [inviteToken, setInviteToken] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const fetchData = async () => {
    if (!id) return
    const poolRes = await api.get(`/pools/${id}`)
    setPool(poolRes.data)
    const contribRes = await api.get(`/pools/${id}/contributions`, { params: { invite } })
    setContributions(contribRes.data.contributions)
  }

  useEffect(() => {
    fetchData()
  }, [id, invite])

  const contribute = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!id) return
    try {
      await api.post(`/pools/${id}/contributions`, {
        amount: Number(form.amount),
        isVisibleToOthers: form.isVisibleToOthers
      })
      setForm({ ...form, amount: '' })
      fetchData()
    } catch (err: any) {
      setError(err.response?.data?.message || 'Contribution failed')
    }
  }

  const closePool = async () => {
    if (!id) return
    await api.post(`/pools/${id}/close`)
    fetchData()
  }

  const generateInvite = async () => {
    if (!id) return
    const res = await api.post(`/pools/${id}/invites`)
    setInviteToken(res.data.token)
  }

  if (!pool) return <p>Loading...</p>
  const totalRaised = contributions.reduce((sum, c) => sum + Number(c.amount), 0)
  const target = pool.targetAmount || 0
  const percent = target ? Math.round((totalRaised / target) * 100) : null

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold">{pool.title}</h1>
              <p className="text-sm text-slate-600">{pool.description}</p>
            </div>
            {pool.status === 'OPEN' && (
              <Button asMotion onClick={closePool}>Close Pool</Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-2">
          <p>Status: {pool.status}</p>
          <p>Deadline: {new Date(pool.deadline).toLocaleString()}</p>
          <p>Total raised: {totalRaised} {pool.currency}</p>
          {percent !== null && <p>{percent}% of target reached</p>}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <h2 className="font-medium">Contribute</h2>
        </CardHeader>
        <CardContent>
          <form className="space-y-3" onSubmit={contribute}>
            <Input type="number" placeholder="Amount" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} required />
            <label className="flex items-center space-x-2 text-sm">
              <input type="checkbox" checked={form.isVisibleToOthers} onChange={(e) => setForm({ ...form, isVisibleToOthers: e.target.checked })} />
              <span>Visible to others</span>
            </label>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <Button type="submit" asMotion>Contribute</Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <h2 className="font-medium">Contributions</h2>
            {inviteToken && <span className="text-xs">Invite link: ?invite={inviteToken}</span>}
            {pool.ownerId && (
              <Button variant="outline" asMotion onClick={generateInvite}>Generate Invite</Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="space-y-2">
            {contributions.map((c, idx) => (
              <motion.div
                key={c.id}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="p-3 rounded-md border"
              >
                <p>Amount: {c.amount}</p>
                <p className="text-xs text-slate-500">Visibility: {c.isVisibleToOthers ? 'Visible' : 'Hidden'}</p>
              </motion.div>
            ))}
            {contributions.length === 0 && <p className="text-sm text-slate-500">No contributions yet.</p>}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
