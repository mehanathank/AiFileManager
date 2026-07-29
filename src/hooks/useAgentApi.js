import { useState, useCallback, useRef } from 'react'

const API_URL = import.meta.env.VITE_API_URL
const WS_URL  = import.meta.env.VITE_WS_URL

const ENDPOINTS = {
  'file-discovery':        '/api/agent/file-discovery',
  'file-classification':   '/api/agent/file-classification',
  'content-understanding': '/api/agent/content-understanding',
  'duplicate-detection':   '/api/agent/duplicate-detection',
  'file-operations':       '/api/agent/file-operations',
  'smart-organization':    '/api/agent/smart-organization',
}

export function useAgentApi(agentKey) {
  const [output, setOutput]               = useState(null)
  const [loading, setLoading]             = useState(false)
  const [error, setError]                 = useState(null)
  const [pendingApprovals, setPendingApprovals] = useState([])
  const wsRef = useRef(null)

  const run = useCallback(async (prompt, path = null) => {
    setLoading(true)
    setError(null)
    setOutput(null)
    setPendingApprovals([])

    // Open WebSocket to receive permission_request events during this call
    const ws = new WebSocket(WS_URL)
    wsRef.current = ws
    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data)
        if (data.type === 'permission_request') {
          setPendingApprovals(prev => [...prev, {
            id: data.permission_id,
            operation: data.operation,
            target_path: data.target_path,
            destination: data.destination,
          }])
        }
      } catch (e) {}
    }
    await new Promise(resolve => { ws.onopen = resolve })

    try {
      const res = await fetch(`${API_URL}${ENDPOINTS[agentKey]}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, path }),
      })
      const data = await res.json()
      if (data.status === 'success') {
        setOutput(data.output)
      } else {
        const detail = data.detail
        setError(Array.isArray(detail) ? detail.map(d => d.msg).join(', ') : String(detail || 'Agent returned an error'))
      }
    } catch (err) {
      setError(`Connection failed: ${err.message}`)
    } finally {
      setLoading(false)
      ws.close()
      wsRef.current = null
    }
  }, [agentKey])

  const sendPermission = useCallback((permissionId, allowed) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        type: 'permission_response',
        permission_id: permissionId,
        allowed,
      }))
      setPendingApprovals(prev => prev.filter(p => p.id !== permissionId))
    }
  }, [])

  const clear = useCallback(() => { setOutput(null); setError(null); setPendingApprovals([]) }, [])

  return { output, loading, error, pendingApprovals, sendPermission, run, clear }
}
