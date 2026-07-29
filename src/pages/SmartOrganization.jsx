import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Loader2, FolderTree } from 'lucide-react'
import { useAgentApi } from '../hooks/useAgentApi'

const S = {
  pageTitle: { fontFamily: 'Poppins', fontSize: '2.4rem', fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 1.1, background: 'linear-gradient(135deg, #fbbf24 0%, #a3e635 50%, #34d399 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' },
  pageSub:   { fontFamily: 'Poppins', fontSize: '0.95rem', color: '#64748b', marginTop: '0.55rem', lineHeight: 1.65 },
  card:      { borderRadius: '18px', background: 'rgba(255,255,255,0.028)', border: '1px solid rgba(255,255,255,0.08)', overflow: 'hidden' },
  label:     { fontFamily: 'Poppins', fontSize: '0.78rem', color: '#64748b', fontWeight: 600, letterSpacing: '0.04em' },
}

export default function SmartOrganization() {
  const [prompt, setPrompt] = useState('')
  const [path, setPath]     = useState('')
  const { output, loading, error, pendingApprovals, sendPermission, run, clear } = useAgentApi('smart-organization')

  const handleRun = () => {
    const p = prompt.trim()
    const d = path.trim()
    if (!p || !d || loading) return
    run(p, d)
  }

  const canRun = prompt.trim() && path.trim() && !loading

  return (
    <div>
      <div style={{ marginBottom: '2.4rem' }}>
        <motion.h1 initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} style={S.pageTitle}>
          Smart Organization
        </motion.h1>
        <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} style={S.pageSub}>
          Plan and execute directory-wide organisation — AI generates and runs a step-by-step plan
        </motion.p>
      </div>

      {/* Input */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
        style={{ ...S.card, padding: '1.75rem 2rem', marginBottom: '1.5rem', position: 'relative' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'linear-gradient(90deg, #fbbf24, #a3e635, #34d399)' }} />

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ ...S.label, display: 'block', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              Target Directory <span style={{ color: '#f87171' }}>*</span>
            </label>
            <input
              value={path}
              onChange={e => setPath(e.target.value)}
              placeholder="e.g. /home/user/Downloads"
              style={{ width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.09)', borderRadius: 12, padding: '0.75rem 1rem', fontFamily: 'JetBrains Mono', fontSize: '0.82rem', color: '#e2e8f0', outline: 'none', caretColor: '#fbbf24', boxSizing: 'border-box' }}
            />
          </div>
          <div>
            <label style={{ ...S.label, display: 'block', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Organisation Instruction</label>
            <div style={{ display: 'flex', gap: '0.85rem' }}>
              <input
                value={prompt}
                onChange={e => setPrompt(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleRun()}
                placeholder="e.g. Group files by type into subfolders"
                style={{ flex: 1, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.09)', borderRadius: 12, padding: '0.75rem 1rem', fontFamily: 'Poppins', fontSize: '0.88rem', color: '#e2e8f0', outline: 'none', caretColor: '#fbbf24' }}
              />
              <motion.button
                whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                onClick={handleRun} disabled={!canRun}
                style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', padding: '0.75rem 1.5rem', borderRadius: 13, border: 'none', background: canRun ? 'linear-gradient(135deg, #fbbf24, #34d399)' : 'rgba(255,255,255,0.05)', color: canRun ? '#0f172a' : '#334155', fontFamily: 'Poppins', fontSize: '0.88rem', fontWeight: 700, cursor: canRun ? 'pointer' : 'not-allowed', whiteSpace: 'nowrap' }}
              >
                {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Organising…</> : <><FolderTree className="w-4 h-4" /> Organise</>}
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
            <p style={{ fontFamily: 'Poppins', fontSize: '0.78rem', color: '#fbbf24' }}>⚠ Target directory is required for Smart Organization</p>
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
              <span style={{ fontFamily: 'Poppins', fontSize: '0.9rem', fontWeight: 700, color: '#fbbf24' }}>Organisation Result</span>
            </div>
            <pre style={{ fontFamily: 'JetBrains Mono', fontSize: '0.78rem', color: '#94a3b8', whiteSpace: 'pre-wrap', wordBreak: 'break-word', lineHeight: 1.7, margin: 0 }}>
              {typeof output === 'string' ? output : JSON.stringify(output, null, 2)}
            </pre>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
