import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FolderOpen, Loader2, Zap, Search } from 'lucide-react'
import { useAgentApi } from '../hooks/useAgentApi'

const S = {
  pageTitle: { fontFamily: 'Poppins', fontSize: '2.4rem', fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 1.1, background: 'linear-gradient(135deg, #22d3ee 0%, #3b82f6 50%, #a78bfa 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' },
  pageSub:   { fontFamily: 'Poppins', fontSize: '0.95rem', color: '#64748b', marginTop: '0.55rem', lineHeight: 1.65 },
  card:      { borderRadius: '18px', background: 'rgba(255,255,255,0.028)', border: '1px solid rgba(255,255,255,0.08)', overflow: 'hidden' },
  label:     { fontFamily: 'Poppins', fontSize: '0.78rem', color: '#64748b', fontWeight: 600, letterSpacing: '0.04em' },
}

export default function FileDiscovery() {
  const [query, setQuery] = useState('')
  const { output, loading, error, run, clear } = useAgentApi('file-discovery')

  const handleRun = () => {
    const q = query.trim()
    if (!q || loading) return
    run(q)
  }

  return (
    <div>
      <div className="flex items-start justify-between" style={{ marginBottom: '2.4rem' }}>
        <div>
          <motion.h1 initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} style={S.pageTitle}>
            File Discovery
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} style={S.pageSub}>
            Locate the absolute path of any folder on your file system
          </motion.p>
        </div>
      </div>

      {/* Input */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
        style={{ ...S.card, padding: '1.75rem 2rem', marginBottom: '1.5rem', position: 'relative' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'linear-gradient(90deg, #22d3ee, #3b82f6, #a78bfa)' }} />
        <label style={{ ...S.label, display: 'block', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
          Folder Name
        </label>
        <div style={{ display: 'flex', gap: '0.85rem' }}>
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleRun()}
            placeholder="e.g. Downloads, Documents, my-project…"
            style={{ flex: 1, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.09)', borderRadius: 12, padding: '0.75rem 1rem', fontFamily: 'Poppins', fontSize: '0.88rem', color: '#e2e8f0', outline: 'none', caretColor: '#22d3ee' }}
          />
          <motion.button
            whileHover={{ scale: 1.04, boxShadow: '0 0 28px #22d3ee44' }}
            whileTap={{ scale: 0.96 }}
            onClick={handleRun}
            disabled={!query.trim() || loading}
            style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', padding: '0.75rem 1.5rem', borderRadius: 13, border: 'none', background: query.trim() && !loading ? 'linear-gradient(135deg, #22d3ee, #3b82f6)' : 'rgba(255,255,255,0.05)', color: query.trim() && !loading ? '#fff' : '#334155', fontFamily: 'Poppins', fontSize: '0.88rem', fontWeight: 700, cursor: query.trim() && !loading ? 'pointer' : 'not-allowed' }}
          >
            {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Searching…</> : <><Search className="w-4 h-4" /> Find Path</>}
          </motion.button>
          {(output || error) && (
            <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }} onClick={clear}
              style={{ padding: '0.75rem 1rem', borderRadius: 13, border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.04)', color: '#64748b', fontFamily: 'Poppins', fontSize: '0.82rem', fontWeight: 700, cursor: 'pointer' }}>
              Clear
            </motion.button>
          )}
        </div>
      </motion.div>

      {/* Result */}
      <AnimatePresence>
        {error && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            style={{ ...S.card, padding: '1.5rem 2rem', border: '1px solid rgba(248,113,113,0.3)', background: 'rgba(248,113,113,0.06)', marginBottom: '1.5rem' }}>
            <p style={{ fontFamily: 'Poppins', fontSize: '0.88rem', color: '#f87171' }}>{error}</p>
          </motion.div>
        )}

        {output && (
          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            style={{ ...S.card, padding: '1.75rem 2rem', border: '1px solid rgba(34,211,238,0.25)', background: 'rgba(34,211,238,0.05)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1.1rem' }}>
              <FolderOpen className="w-4 h-4" style={{ color: '#22d3ee' }} />
              <span style={{ fontFamily: 'Poppins', fontSize: '0.9rem', fontWeight: 700, color: '#22d3ee' }}>Result</span>
            </div>

            {output.resolved_paths?.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                {output.resolved_paths.map((p, i) => (
                  <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.85rem 1.1rem', borderRadius: 12, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
                    <Zap className="w-3.5 h-3.5" style={{ color: '#22d3ee', flexShrink: 0 }} />
                    <span style={{ fontFamily: 'JetBrains Mono', fontSize: '0.82rem', color: '#cbd5e1' }}>{p}</span>
                  </motion.div>
                ))}
              </div>
            ) : (
              <pre style={{ fontFamily: 'JetBrains Mono', fontSize: '0.78rem', color: '#94a3b8', whiteSpace: 'pre-wrap', wordBreak: 'break-word', lineHeight: 1.7, margin: 0 }}>
                {typeof output === 'string' ? output : JSON.stringify(output, null, 2)}
              </pre>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
