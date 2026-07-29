import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Loader2, FolderTree, Trash2, PenLine, MoveRight, FolderPlus } from 'lucide-react'
import { useAgentApi } from '../hooks/useAgentApi'

const S = {
  pageTitle: { fontFamily: 'Poppins', fontSize: '2.4rem', fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 1.1, background: 'linear-gradient(135deg, #fbbf24 0%, #fb923c 50%, #f87171 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' },
  pageSub:   { fontFamily: 'Poppins', fontSize: '0.95rem', color: '#64748b', marginTop: '0.55rem', lineHeight: 1.65 },
  card:      { borderRadius: '18px', background: 'rgba(255,255,255,0.028)', border: '1px solid rgba(255,255,255,0.08)', overflow: 'hidden' },
  label:     { fontFamily: 'Poppins', fontSize: '0.78rem', color: '#64748b', fontWeight: 600, letterSpacing: '0.04em' },
}

const EXAMPLES = [
  { icon: Trash2,     color: '#f87171', text: 'Delete the file named old_report.pdf' },
  { icon: PenLine,    color: '#fbbf24', text: 'Rename notes.txt to meeting-notes.txt' },
  { icon: MoveRight,  color: '#60a5fa', text: 'Move invoice.pdf to the Finance subfolder' },
  { icon: FolderPlus, color: '#34d399', text: 'Create a folder named Archive' },
]

export default function FileOperations() {
  const [prompt, setPrompt] = useState('')
  const [path, setPath]     = useState('')
  const { output, loading, error, pendingApprovals, sendPermission, run, clear } = useAgentApi('file-operations')

  const canRun = prompt.trim() && path.trim() && !loading

  const handleRun = () => {
    if (!canRun) return
    run(prompt.trim(), path.trim())
  }

  return (
    <div>
      <div style={{ marginBottom: '2.4rem' }}>
        <motion.h1 initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} style={S.pageTitle}>
          File Operations
        </motion.h1>
        <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} style={S.pageSub}>
          Move, rename, delete, or create files and folders within a specified path
        </motion.p>
      </div>

      {/* Example chips */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}
        style={{ display: 'flex', flexWrap: 'wrap', gap: '0.65rem', marginBottom: '1.75rem' }}>
        {EXAMPLES.map((ex, i) => {
          const Icon = ex.icon
          return (
            <motion.button key={i}
              whileHover={{ scale: 1.04, y: -1 }} whileTap={{ scale: 0.96 }}
              onClick={() => setPrompt(ex.text)}
              initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 + i * 0.05 }}
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.45rem 1rem', borderRadius: 99, background: `${ex.color}0e`, border: `1px solid ${ex.color}30`, cursor: 'pointer' }}>
              <Icon style={{ width: 13, height: 13, color: ex.color }} />
              <span style={{ fontFamily: 'Poppins', fontSize: '0.76rem', color: '#94a3b8', fontWeight: 500 }}>{ex.text}</span>
            </motion.button>
          )
        })}
      </motion.div>

      {/* Input */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        style={{ ...S.card, padding: '1.75rem 2rem', marginBottom: '1.5rem', position: 'relative' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'linear-gradient(90deg, #fbbf24, #fb923c, #f87171)' }} />

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ ...S.label, display: 'block', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              Target Path <span style={{ color: '#f87171' }}>*</span>
            </label>
            <input
              value={path}
              onChange={e => setPath(e.target.value)}
              placeholder="e.g. /home/user/Downloads"
              style={{ width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.09)', borderRadius: 12, padding: '0.75rem 1rem', fontFamily: 'JetBrains Mono', fontSize: '0.82rem', color: '#e2e8f0', outline: 'none', caretColor: '#fbbf24', boxSizing: 'border-box' }}
            />
            <p style={{ fontFamily: 'Poppins', fontSize: '0.72rem', color: '#475569', marginTop: '0.4rem' }}>
              The agent will only operate within this directory
            </p>
          </div>

          <div>
            <label style={{ ...S.label, display: 'block', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              Instruction <span style={{ color: '#f87171' }}>*</span>
            </label>
            <div style={{ display: 'flex', gap: '0.85rem' }}>
              <input
                value={prompt}
                onChange={e => setPrompt(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleRun()}
                placeholder="e.g. Delete the file named old_report.pdf"
                style={{ flex: 1, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.09)', borderRadius: 12, padding: '0.75rem 1rem', fontFamily: 'Poppins', fontSize: '0.88rem', color: '#e2e8f0', outline: 'none', caretColor: '#fbbf24' }}
              />
              <motion.button
                whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                onClick={handleRun} disabled={!canRun}
                style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', padding: '0.75rem 1.5rem', borderRadius: 13, border: 'none', background: canRun ? 'linear-gradient(135deg, #fbbf24, #fb923c)' : 'rgba(255,255,255,0.05)', color: canRun ? '#0f172a' : '#334155', fontFamily: 'Poppins', fontSize: '0.88rem', fontWeight: 700, cursor: canRun ? 'pointer' : 'not-allowed', whiteSpace: 'nowrap' }}
              >
                {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Running…</> : <><FolderTree className="w-4 h-4" /> Execute</>}
              </motion.button>
              {(output || error) && (
                <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }} onClick={clear}
                  style={{ padding: '0.75rem 1rem', borderRadius: 13, border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.04)', color: '#64748b', fontFamily: 'Poppins', fontSize: '0.82rem', fontWeight: 700, cursor: 'pointer' }}>
                  Clear
                </motion.button>
              )}
            </div>
          </div>

          {!path.trim() && prompt.trim() && (
            <p style={{ fontFamily: 'Poppins', fontSize: '0.78rem', color: '#fbbf24' }}>⚠ Target path is required</p>
          )}
        </div>
      </motion.div>

      {/* Permission Requests */}
      <AnimatePresence>
        {pendingApprovals.map(p => (
          <motion.div key={p.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            style={{ ...S.card, padding: '1.5rem 2rem', marginBottom: '1rem', border: '1px solid rgba(251,191,36,0.4)', background: 'rgba(251,191,36,0.07)' }}>
            <p style={{ fontFamily: 'Poppins', fontSize: '0.9rem', fontWeight: 700, color: '#fbbf24', marginBottom: '0.5rem' }}>🔒 Permission Required</p>
            <p style={{ fontFamily: 'JetBrains Mono', fontSize: '0.78rem', color: '#94a3b8', marginBottom: '0.25rem' }}>Operation: <span style={{ color: '#f87171' }}>{p.operation}</span></p>
            <p style={{ fontFamily: 'JetBrains Mono', fontSize: '0.78rem', color: '#94a3b8', marginBottom: '0.25rem' }}>Path: {p.target_path}</p>
            {p.destination && <p style={{ fontFamily: 'JetBrains Mono', fontSize: '0.78rem', color: '#94a3b8', marginBottom: '1rem' }}>Destination: {p.destination}</p>}
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button onClick={() => sendPermission(p.id, true)}
                style={{ padding: '0.5rem 1.25rem', borderRadius: 10, border: 'none', background: 'linear-gradient(135deg, #34d399, #059669)', color: '#0f172a', fontFamily: 'Poppins', fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer' }}>Allow</button>
              <button onClick={() => sendPermission(p.id, false)}
                style={{ padding: '0.5rem 1.25rem', borderRadius: 10, border: '1px solid rgba(248,113,113,0.4)', background: 'rgba(248,113,113,0.08)', color: '#f87171', fontFamily: 'Poppins', fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer' }}>Deny</button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Result */}
      <AnimatePresence>
        {error && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            style={{ ...S.card, padding: '1.5rem 2rem', border: '1px solid rgba(248,113,113,0.3)', background: 'rgba(248,113,113,0.06)' }}>
            <p style={{ fontFamily: 'Poppins', fontSize: '0.88rem', color: '#f87171' }}>{error}</p>
          </motion.div>
        )}
        {output && (
          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            style={{ ...S.card, padding: '1.75rem 2rem', border: '1px solid rgba(251,191,36,0.25)', background: 'rgba(251,191,36,0.05)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1rem' }}>
              <FolderTree className="w-4 h-4" style={{ color: '#fbbf24' }} />
              <span style={{ fontFamily: 'Poppins', fontSize: '0.9rem', fontWeight: 700, color: '#fbbf24' }}>Operation Result</span>
            </div>
            <pre style={{ fontFamily: 'JetBrains Mono', fontSize: '0.82rem', color: '#94a3b8', whiteSpace: 'pre-wrap', wordBreak: 'break-word', lineHeight: 1.7, margin: 0 }}>
              {typeof output === 'string' ? output : JSON.stringify(output, null, 2)}
            </pre>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
