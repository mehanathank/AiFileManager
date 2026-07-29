import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search, Tag, Brain, Copy, FolderTree, Shield,
  Send, Trash2, Check, X, AlertTriangle, ChevronDown,
  Loader2, Zap, Terminal,
} from 'lucide-react'

const AGENT_META = {
  1: { label: 'File Discovery',        color: '#22d3ee', icon: Search     },
  2: { label: 'Classification',         color: '#a78bfa', icon: Tag        },
  3: { label: 'Content Understanding',  color: '#34d399', icon: Brain      },
  4: { label: 'Duplicate Detection',    color: '#f472b6', icon: Copy       },
  5: { label: 'File Operations',        color: '#fbbf24', icon: FolderTree },
  6: { label: 'Smart Organization',     color: '#60a5fa', icon: Shield     },
}

const LOG_CLR = {
  info:    '#64748b',
  success: '#34d399',
  warn:    '#fbbf24',
  error:   '#f87171',
  system:  '#818cf8',
  plan:    '#22d3ee',
}

const SUGGESTIONS = [
  '🔍 Find all PDF files in my Downloads folder',
  '🧹 Organize my Desktop folder automatically',
  '📋 Find duplicate images in Pictures',
  '📁 What files are in my Documents folder?',
  '🗑️ Delete the folder named "old_backup"',
  '🧠 Summarize the contents of report.pdf',
]

/* ── Sub-components ─────────────────────────────────────── */

function PlanStep({ step, index, result }) {
  const meta = AGENT_META[step.agent_id] || { label: `Agent ${step.agent_id}`, color: '#64748b', icon: Zap }
  const Icon = meta.icon
  const [open, setOpen] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.07 }}
      style={{
        borderRadius: 14,
        background: 'rgba(255,255,255,0.03)',
        border: `1px solid ${meta.color}28`,
        overflow: 'hidden',
      }}
    >
      <div
        onClick={() => result && setOpen(o => !o)}
        style={{
          display: 'flex', alignItems: 'center', gap: '0.85rem',
          padding: '0.85rem 1.1rem',
          cursor: result ? 'pointer' : 'default',
        }}
      >
        <div style={{
          width: 34, height: 34, borderRadius: 10,
          background: `${meta.color}15`, border: `1px solid ${meta.color}35`,
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}>
          <Icon style={{ width: 15, height: 15, color: meta.color }} />
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontFamily: 'Poppins', fontSize: '0.75rem', fontWeight: 700, color: meta.color }}>
              Agent {step.agent_id}
            </span>
            <span style={{ fontFamily: 'Poppins', fontSize: '0.8rem', fontWeight: 600, color: '#cbd5e1' }}>
              {meta.label}
            </span>
          </div>
          <div style={{ fontFamily: 'Poppins', fontSize: '0.74rem', color: '#475569', marginTop: 2 }}>
            {step.reason}
          </div>
        </div>

        {result ? (
          <motion.div animate={{ rotate: open ? 180 : 0 }}>
            <ChevronDown style={{ width: 15, height: 15, color: '#475569' }} />
          </motion.div>
        ) : (
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: meta.color, boxShadow: `0 0 6px ${meta.color}` }} />
        )}
      </div>

      <AnimatePresence>
        {open && result && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            style={{ borderTop: `1px solid ${meta.color}18`, padding: '0.9rem 1.1rem' }}
          >
            <pre style={{
              fontFamily: 'JetBrains Mono', fontSize: '0.72rem', color: '#94a3b8',
              whiteSpace: 'pre-wrap', wordBreak: 'break-word', lineHeight: 1.65, margin: 0,
            }}>
              {typeof result.output === 'string' ? result.output : JSON.stringify(result.output, null, 2)}
            </pre>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

function ApprovalCard({ approval, onDecide }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -16, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -12, scale: 0.96 }}
      transition={{ type: 'spring', stiffness: 340 }}
      style={{
        borderRadius: 16,
        background: 'rgba(99,102,241,0.1)',
        border: '1px solid rgba(99,102,241,0.38)',
        padding: '1.25rem 1.4rem',
        boxShadow: '0 4px 28px rgba(99,102,241,0.14)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '0.55rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <motion.div animate={{ scale: [1, 1.22, 1] }} transition={{ duration: 1.5, repeat: Infinity }}>
            <AlertTriangle style={{ width: 15, height: 15, color: '#fbbf24' }} />
          </motion.div>
          <span style={{
            fontFamily: 'Poppins', fontSize: '0.7rem', fontWeight: 700,
            color: '#fbbf24', textTransform: 'uppercase', letterSpacing: '0.1em',
          }}>
            Permission Required
          </span>
        </div>
        <button onClick={() => onDecide(approval.id, false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
          <X style={{ width: 14, height: 14, color: '#475569' }} />
        </button>
      </div>

      <p style={{ fontFamily: 'Poppins', fontSize: '0.88rem', fontWeight: 700, color: '#e2e8f0', marginBottom: '0.35rem' }}>
        {approval.title || 'Agent requests permission'}
      </p>
      {approval.desc && (
        <p style={{ fontFamily: 'Poppins', fontSize: '0.78rem', color: '#64748b', marginBottom: '1rem', lineHeight: 1.6 }}>
          {approval.desc}
        </p>
      )}
      {approval.operation && (
        <div style={{ marginBottom: '1rem' }}>
          <p style={{ fontFamily: 'JetBrains Mono', fontSize: '0.78rem', color: '#94a3b8', marginBottom: '0.25rem' }}>
            Operation: <span style={{ color: '#f87171' }}>{approval.operation}</span>
          </p>
          <p style={{ fontFamily: 'JetBrains Mono', fontSize: '0.78rem', color: '#94a3b8', marginBottom: '0.25rem' }}>
            Target: {approval.target_path}
          </p>
          {approval.destination && (
            <p style={{ fontFamily: 'JetBrains Mono', fontSize: '0.78rem', color: '#94a3b8' }}>
              Destination: {approval.destination}
            </p>
          )}
        </div>
      )}

      <div style={{ display: 'flex', gap: '0.55rem' }}>
        {[
          { l: 'Allow', c: '#34d399', bg: 'rgba(52,211,153,0.12)',  b: 'rgba(52,211,153,0.3)',   allowed: true  },
          { l: 'Deny',  c: '#f87171', bg: 'rgba(248,113,113,0.1)', b: 'rgba(248,113,113,0.28)', allowed: false },
        ].map(btn => (
          <motion.button
            key={btn.l}
            whileHover={{ scale: 1.07, y: -1 }}
            whileTap={{ scale: 0.93 }}
            onClick={() => onDecide(approval.id, btn.allowed)}
            style={{
              display: 'flex', alignItems: 'center', gap: '0.4rem',
              padding: '0.5rem 1.1rem', borderRadius: 10,
              fontFamily: 'Poppins', fontSize: '0.8rem', fontWeight: 700,
              color: btn.c, background: btn.bg, border: `1px solid ${btn.b}`, cursor: 'pointer',
            }}
          >
            {btn.allowed ? <Check style={{ width: 13, height: 13 }} /> : <X style={{ width: 13, height: 13 }} />}
            {btn.l}
          </motion.button>
        ))}
      </div>
    </motion.div>
  )
}

/* ── Default export ─────────────────────────────────────── */

export default function Dashboard({ backend = {} }) {
  const {
    wsStatus = 'disconnected',
    logs = [],
    plan = null,
    stepResults = {},
    isRunning = false,
    finalOutput = null,
    pendingApprovals = [],
    runAgent = () => {},
    sendPermission = () => {},
    clearSession = () => {},
  } = backend

  const [prompt, setPrompt]   = useState('')
  const [showLog, setShowLog] = useState(true)
  const logRef   = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight
  }, [logs])

  const handleSubmit = (e) => {
    e?.preventDefault()
    const p = prompt.trim()
    if (!p || isRunning) return
    setPrompt('')
    runAgent(p)
  }

  const handleSuggestion = (s) => {
    const clean = s.replace(/^[\S]+ /, '')
    setPrompt(clean)
    inputRef.current?.focus()
  }

  const canSubmit = prompt.trim().length > 0 && !isRunning

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

      {/* ── Page title ── */}
      <div>
        <motion.h1
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            fontFamily: 'Poppins', fontSize: '2.3rem', fontWeight: 800,
            letterSpacing: '-0.04em', lineHeight: 1.1,
            background: 'linear-gradient(135deg, #22d3ee 0%, #a78bfa 50%, #f472b6 100%)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
          }}
        >
          AI File Manager
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          style={{ fontFamily: 'Poppins', fontSize: '0.95rem', color: '#64748b', marginTop: '0.5rem', lineHeight: 1.65 }}
        >
          Describe what you want to do — the AI supervisor will plan and execute it automatically
        </motion.p>
      </div>

      {/* ── Prompt input ── */}
      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        style={{
          borderRadius: 18,
          background: 'rgba(255,255,255,0.032)',
          border: '1px solid rgba(255,255,255,0.1)',
          padding: '1.5rem 1.75rem',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Rainbow top border */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'linear-gradient(90deg, #22d3ee, #a78bfa, #f472b6)' }} />

        <label style={{
          fontFamily: 'Poppins', fontSize: '0.78rem', fontWeight: 700,
          color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.1em',
          display: 'block', marginBottom: '0.85rem',
        }}>
          Your Prompt
        </label>

        <div style={{ display: 'flex', gap: '0.85rem', alignItems: 'flex-end' }}>
          <textarea
            ref={inputRef}
            value={prompt}
            onChange={e => setPrompt(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSubmit() } }}
            placeholder="e.g. Find all duplicate images in my Pictures folder and show me what to delete…"
            rows={3}
            style={{
              flex: 1,
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.09)',
              borderRadius: 12,
              padding: '0.85rem 1rem',
              fontFamily: 'Poppins', fontSize: '0.88rem',
              color: '#e2e8f0', resize: 'none', outline: 'none',
              caretColor: '#22d3ee', lineHeight: 1.6,
            }}
          />
          <motion.button
            type="submit"
            disabled={!canSubmit}
            whileHover={canSubmit ? { scale: 1.04, boxShadow: '0 0 28px #22d3ee44' } : {}}
            whileTap={canSubmit ? { scale: 0.96 } : {}}
            style={{
              display: 'flex', alignItems: 'center', gap: '0.55rem',
              padding: '0.85rem 1.5rem', borderRadius: 13,
              fontFamily: 'Poppins', fontSize: '0.88rem', fontWeight: 700,
              cursor: canSubmit ? 'pointer' : 'not-allowed',
              background: canSubmit ? 'linear-gradient(135deg, #22d3ee, #3b82f6)' : 'rgba(255,255,255,0.05)',
              color: canSubmit ? '#fff' : '#334155',
              border: 'none',
              boxShadow: canSubmit ? '0 4px 18px #22d3ee33' : 'none',
              transition: 'all 0.2s',
              whiteSpace: 'nowrap', flexShrink: 0,
            }}
          >
            {isRunning
              ? <><Loader2 style={{ width: 16, height: 16 }} className="animate-spin" /> Running…</>
              : <><Send style={{ width: 16, height: 16 }} /> Run</>
            }
          </motion.button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.75rem' }}>
          <span style={{ fontFamily: 'Poppins', fontSize: '0.72rem', color: '#334155' }}>
            Shift+Enter for newline · Enter to run
          </span>
          {wsStatus !== 'connected' && (
            <span style={{
              fontFamily: 'Poppins', fontSize: '0.72rem',
              color: '#f87171', background: 'rgba(248,113,113,0.1)',
              padding: '2px 8px', borderRadius: 99,
            }}>
              ⚠ Backend offline — start server on :8000
            </span>
          )}
        </div>
      </motion.form>

      {/* ── Suggestions ── */}
      {!isRunning && !plan && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }}>
          <p style={{ fontFamily: 'Poppins', fontSize: '0.78rem', color: '#475569', fontWeight: 600, marginBottom: '0.75rem', letterSpacing: '0.04em' }}>
            Try a prompt:
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.65rem' }}>
            {SUGGESTIONS.map((s, i) => (
              <motion.button
                key={i}
                whileHover={{ scale: 1.04, y: -1 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => handleSuggestion(s)}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 + i * 0.05 }}
                style={{
                  fontFamily: 'Poppins', fontSize: '0.78rem', fontWeight: 500,
                  padding: '0.45rem 1rem', borderRadius: 99,
                  background: 'rgba(255,255,255,0.04)', color: '#94a3b8',
                  border: '1px solid rgba(255,255,255,0.08)', cursor: 'pointer', transition: 'all 0.18s',
                }}
              >
                {s}
              </motion.button>
            ))}
          </div>
        </motion.div>
      )}

      {/* ── Pending approvals ── */}
      <AnimatePresence>
        {pendingApprovals.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {pendingApprovals.map(a => (
              <ApprovalCard key={a.id} approval={a} onDecide={sendPermission} />
            ))}
          </div>
        )}
      </AnimatePresence>

      {/* ── Execution plan ── */}
      {plan && plan.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            borderRadius: 18,
            background: 'rgba(255,255,255,0.025)',
            border: '1px solid rgba(255,255,255,0.08)',
            padding: '1.5rem 1.75rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1.1rem' }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#22d3ee', boxShadow: '0 0 8px #22d3ee' }} />
            <h3 style={{ fontFamily: 'Poppins', fontSize: '0.95rem', fontWeight: 700, color: '#94a3b8' }}>
              Execution Plan
            </h3>
            <span style={{ fontFamily: 'JetBrains Mono', fontSize: '0.7rem', color: '#334155' }}>
              {plan.length} steps
            </span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            {plan.map((step, i) => (
              <PlanStep key={i} step={step} index={i} result={stepResults?.[i]} />
            ))}
          </div>
        </motion.div>
      )}

      {/* ── Final output ── */}
      {finalOutput && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            borderRadius: 18,
            background: 'rgba(52,211,153,0.06)',
            border: '1px solid rgba(52,211,153,0.25)',
            padding: '1.5rem 1.75rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.85rem' }}>
            <Check style={{ width: 16, height: 16, color: '#34d399' }} />
            <h3 style={{ fontFamily: 'Poppins', fontSize: '0.95rem', fontWeight: 700, color: '#34d399' }}>
              Result
            </h3>
          </div>
          <p style={{ fontFamily: 'Poppins', fontSize: '0.88rem', color: '#94a3b8', lineHeight: 1.75 }}>
            {finalOutput}
          </p>
        </motion.div>
      )}

      {/* ── Log panel ── */}
      {logs.length > 0 && (
        <div style={{
          borderRadius: 18,
          background: 'rgba(255,255,255,0.02)',
          border: '1px solid rgba(255,255,255,0.07)',
          overflow: 'hidden',
        }}>
          <button
            onClick={() => setShowLog(p => !p)}
            style={{
              width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '0.9rem 1.5rem', background: 'none', border: 'none', cursor: 'pointer',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
              <Terminal style={{ width: 14, height: 14, color: '#475569' }} />
              <span style={{ fontFamily: 'Poppins', fontSize: '0.82rem', fontWeight: 700, color: '#64748b' }}>
                Activity Log
              </span>
              <span style={{ fontFamily: 'JetBrains Mono', fontSize: '0.68rem', color: '#334155' }}>
                {logs.length} entries
              </span>
            </div>
            <motion.div animate={{ rotate: showLog ? 180 : 0 }} transition={{ duration: 0.22 }}>
              <ChevronDown style={{ width: 15, height: 15, color: '#475569' }} />
            </motion.div>
          </button>

          <AnimatePresence>
            {showLog && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
              >
                <div ref={logRef} style={{ maxHeight: 320, overflowY: 'auto', padding: '1rem 1.4rem', display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                  {logs.map((l, i) => (
                    <div key={i} style={{ display: 'flex', gap: '0.85rem', alignItems: 'flex-start' }}>
                      <span style={{ fontFamily: 'JetBrains Mono', fontSize: '0.67rem', color: '#1e293b', flexShrink: 0 }}>
                        {new Date(l.timestamp || Date.now()).toLocaleTimeString()}
                      </span>
                      <span style={{ fontFamily: 'JetBrains Mono', fontSize: '0.72rem', color: LOG_CLR[l.level] || '#64748b', lineHeight: 1.6 }}>
                        {l.message || JSON.stringify(l)}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* ── Clear session ── */}
      {(plan || logs.length > 0) && !isRunning && (
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={clearSession}
            style={{
              display: 'flex', alignItems: 'center', gap: '0.5rem',
              padding: '0.55rem 1.25rem', borderRadius: 11,
              background: 'rgba(248,113,113,0.08)', color: '#f87171',
              border: '1px solid rgba(248,113,113,0.22)',
              fontFamily: 'Poppins', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer',
            }}
          >
            <Trash2 style={{ width: 13, height: 13 }} />
            Clear Session
          </motion.button>
        </div>
      )}

    </div>
  )
}
