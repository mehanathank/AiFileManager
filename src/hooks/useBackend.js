import { useState, useEffect, useRef, useCallback } from 'react'

const WS_URL  = import.meta.env.VITE_WS_URL
const API_URL = import.meta.env.VITE_API_URL

export function useBackend() {
  const [wsStatus, setWsStatus]     = useState('disconnected') // connecting | connected | disconnected | error
  const [logs, setLogs]             = useState([])
  const [plan, setPlan]             = useState(null)
  const [stepResults, setStepResults] = useState([])
  const [isRunning, setIsRunning]   = useState(false)
  const [finalOutput, setFinalOutput] = useState(null)
  const [pendingApprovals, setPendingApprovals] = useState([])
  const wsRef = useRef(null)
  const reconnectTimer = useRef(null)

  const addLog = useCallback((entry) => {
    setLogs(prev => [...prev, { ...entry, id: Date.now() + Math.random() }])
  }, [])

  const connect = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) return
    setWsStatus('connecting')
    const ws = new WebSocket(WS_URL)
    wsRef.current = ws

    ws.onopen = () => {
      setWsStatus('connected')
      addLog({ level: 'system', message: 'WebSocket connected to backend' })
    }

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data)
        if (data.type === 'log') {
          addLog({ level: 'info', message: data.message })
        } else if (data.type === 'plan') {
          setPlan(data.plan)
          addLog({ level: 'plan', message: `Execution plan created — ${data.plan.length} steps` })
        } else if (data.type === 'step_result') {
          setStepResults(prev => [...prev, { agentId: data.agent_id, output: data.output }])
          addLog({ level: 'success', message: `Agent ${data.agent_id} completed` })
        } else if (data.type === 'done') {
          setFinalOutput(data.final_output)
          setIsRunning(false)
          addLog({ level: 'success', message: 'Pipeline completed successfully ✓' })
        } else if (data.type === 'permission_request') {
          setPendingApprovals(prev => [...prev, {
            id: data.permission_id,
            operation: data.operation,
            target_path: data.target_path,
            destination: data.destination,
          }])
          addLog({ level: 'warn', message: `Permission requested: ${data.operation} on ${data.target_path}` })
        }
      } catch (e) {
        console.error('WS parse error', e)
      }
    }

    ws.onerror = () => setWsStatus('error')

    ws.onclose = () => {
      setWsStatus('disconnected')
      reconnectTimer.current = setTimeout(connect, 4000)
    }
  }, [addLog])

  useEffect(() => {
    connect()
    return () => {
      clearTimeout(reconnectTimer.current)
      wsRef.current?.close()
    }
  }, [connect])

  const runAgent = useCallback(async (prompt) => {
    setIsRunning(true)
    setPlan(null)
    setStepResults([])
    setFinalOutput(null)
    setPendingApprovals([])
    addLog({ level: 'system', message: `Sending prompt: "${prompt}"` })

    try {
      const res = await fetch(`${API_URL}/api/run-agent`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      })
      const data = await res.json()
      if (data.status === 'success') {
        setFinalOutput(data.final_output)
        addLog({ level: 'success', message: 'Pipeline completed successfully ✓' })
      } else {
        addLog({ level: 'error', message: `Error: ${data.detail || 'Unknown error'}` })
      }
    } catch (err) {
      addLog({ level: 'error', message: `Connection failed: ${err.message}` })
    } finally {
      setIsRunning(false)
    }
  }, [addLog])

  const sendPermission = useCallback((permissionId, allowed) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        type: 'permission_response',
        permission_id: permissionId,
        allowed,
      }))
      setPendingApprovals(prev => prev.filter(p => p.id !== permissionId))
      addLog({ level: allowed ? 'success' : 'warn', message: `Permission ${allowed ? 'granted' : 'denied'}: ${permissionId}` })
    }
  }, [addLog])

  const clearSession = useCallback(() => {
    setLogs([])
    setPlan(null)
    setStepResults([])
    setFinalOutput(null)
    setPendingApprovals([])
  }, [])

  return { wsStatus, logs, plan, stepResults, isRunning, finalOutput, pendingApprovals, runAgent, sendPermission, clearSession }
}
