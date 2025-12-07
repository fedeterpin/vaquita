import { useEffect, useState } from 'react'

export function useAuth() {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('token'))

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token)
    }
  }, [token])

  const logout = () => {
    localStorage.removeItem('token')
    setToken(null)
  }

  return { token, setToken, logout }
}
