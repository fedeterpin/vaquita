import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../api/client'
import { Card, CardContent, CardHeader } from '../../components/ui/card'
import { Input } from '../../components/ui/input'
import { Button } from '../../components/ui/button'
import { motion } from 'framer-motion'

export default function NewPoolPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    title: '',
    description: '',
    isPublic: true,
    contributionsVisibility: 'PUBLIC',
    targetAmount: '',
    deadline: ''
  })
  const [error, setError] = useState<string | null>(null)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    try {
      await api.post('/pools', {
        ...form,
        targetAmount: form.targetAmount ? Number(form.targetAmount) : undefined
      })
      navigate('/dashboard')
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create pool')
    }
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
      <Card>
        <CardHeader>
          <h1 className="text-xl font-semibold">Create Pool</h1>
        </CardHeader>
        <CardContent>
          <form className="space-y-3" onSubmit={submit}>
            <div>
              <label className="text-sm font-medium">Title</label>
              <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
            </div>
            <div>
              <label className="text-sm font-medium">Description</label>
              <Input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            </div>
            <div className="flex items-center space-x-2">
              <input type="checkbox" checked={form.isPublic} onChange={(e) => setForm({ ...form, isPublic: e.target.checked })} />
              <span>Public</span>
            </div>
            <div>
              <label className="text-sm font-medium">Contributions Visibility</label>
              <select
                className="border rounded-md px-3 py-2 w-full"
                value={form.contributionsVisibility}
                onChange={(e) => setForm({ ...form, contributionsVisibility: e.target.value })}
              >
                <option value="PUBLIC">Public</option>
                <option value="ANONYMOUS">Anonymous</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium">Target Amount</label>
              <Input value={form.targetAmount} onChange={(e) => setForm({ ...form, targetAmount: e.target.value })} />
            </div>
            <div>
              <label className="text-sm font-medium">Deadline</label>
              <Input type="datetime-local" value={form.deadline} onChange={(e) => setForm({ ...form, deadline: e.target.value })} required />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <Button type="submit" asMotion>Create</Button>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  )
}
