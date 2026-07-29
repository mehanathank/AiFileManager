import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Loader2, Copy } from 'lucide-react'
import { useAgentApi } from '../hooks/useAgentApi'

const S = {
  pageTitle: { fontFamily: 'Poppins', fontSize: '2.4rem', fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 1.1, background: 'linear-gradient(135deg, #f472b6 0%, #fb923c 50%, #fbbf24 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' },
  pageSub:   { fontFamily: 'Poppins', fontSize: '0.95rem', color: '#64748b', marginTop: '0.55rem', lineHeight: 1.65 },
  card:      { borderRadius: '18px', background: 'rgba(255,255,255,0.028)', border: '1px solid rgba(255,255,255,0.08)', overflow: 'hidden' },
  label:     { fontFamily: 'Poppins', fontSize: '0.78rem', color: '#64748b', fontWeight: 600, letterSpacing: '0.04em' },
}

export default function DuplicateDetection() {
  const [prompt, setPrompt] = useState('')
  const [path, setPath]     = useState('')
  const { output, loading, error, run, clear } = useAgentApi('duplicate-detection')

  const handleRun = () => {
    const p = prompt.trim()
    if (!p || loading) return
    run(p, path.trim() || null)
  }

  return (
    <div>
      <div style={{ marginBottom: '2.4rem' }}>
        <motion.h1 initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} style={S.pageTitle}>
          Duplicate Detection
        </motion.h1>
        <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} style={S.pageSub}>
          Identify exact and near-duplicate files — reclaim wasted storage with intelligent deduplication
        </motion.p>
      </div>

      {/* Input */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
        style={{ ...S.card, padding: '1.75rem 2rem', marginBottom: '1.5rem', position: 'relative' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'linear-gradient(90deg, #f472b6, #fb923c, #fbbf24)' }} />

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ ...S.label, display: 'block', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Directory Path (optional)</label>
            <input
              value={path}
              onChange={e => setPath(e.target.value)}
              placeholder="e.g. /home/user/Pictures  (leave blank to scan home directory)"
              style={{ width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.09)', borderRadius: 12, padding: '0.75rem 1rem', fontFamily: 'JetBrains Mono', fontSize: '0.82rem', color: '#e2e8f0', outline: 'none', caretColor: '#f472b6', boxSizing: 'border-box' }}
            />
          </div>
          <div>
            <label style={{ ...S.label, display: 'block', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Prompt / Instructions</label>
            <div style={{ display: 'flex', gap: '0.85rem' }}>
              <input
                value={prompt}
                onChange={e => setPrompt(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleRun()}
                placeholder="e.g. Find all duplicate images and show storage savings"
                style={{ flex: 1, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.09)', borderRadius: 12, padding: '0.75rem 1rem', fontFamily: 'Poppins', fontSize: '0.88rem', color: '#e2e8f0', outline: 'none', caretColor: '#f472b6' }}
              />
              <motion.button
                whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                onClick={handleRun} disabled={!prompt.trim() || loading}
                style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', padding: '0.75rem 1.5rem', borderRadius: 13, border: 'none', background: prompt.trim() && !loading ? 'linear-gradient(135deg, #f472b6, #fb923c)' : 'rgba(255,255,255,0.05)', color: prompt.trim() && !loading ? '#fff' : '#334155', fontFamily: 'Poppins', fontSize: '0.88rem', fontWeight: 700, cursor: prompt.trim() && !loading ? 'pointer' : 'not-allowed', whiteSpace: 'nowrap' }}
              >
                {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Scanning…</> : <><Copy className="w-4 h-4" /> Detect</>}
              </motion.button>
              {(output || error) && (
                <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }} onClick={clear}
                  style={{ padding: '0.75rem 1rem', borderRadius: 13, border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.04)', color: '#64748b', fontFamily: 'Poppins', fontSize: '0.82rem', fontWeight: 700, cursor: 'pointer' }}>
                  Clear
                </motion.button>
              )}
            </div>
          </div>
        </div>
      </motion.div>

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
            style={{ ...S.card, padding: '1.75rem 2rem', border: '1px solid rgba(244,114,182,0.25)', background: 'rgba(244,114,182,0.05)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1rem' }}>
              <Copy className="w-4 h-4" style={{ color: '#f472b6' }} />
              <span style={{ fontFamily: 'Poppins', fontSize: '0.9rem', fontWeight: 700, color: '#f472b6' }}>Detection Result</span>
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
