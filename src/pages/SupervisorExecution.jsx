import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Tag, Brain, Copy, FolderTree, Activity, Check, AlertTriangle, X, Play, Square } from 'lucide-react'

const AGENTS = [
  { id:'discovery',      label:'File Discovery',        sub:'Scan & index files',          icon:Search,    from:'#22d3ee', to:'#3b82f6'  },
  { id:'classification', label:'Classification',         sub:'Sort by type + content',      icon:Tag,        from:'#a78bfa', to:'#f472b6'  },
  { id:'understanding',  label:'Content Understanding', sub:'Extract text & entities',     icon:Brain,      from:'#34d399', to:'#22d3ee'  },
  { id:'duplicates',     label:'Duplicate Detection',   sub:'Find & flag redundant files', icon:Copy,       from:'#f472b6', to:'#fb923c'  },
  { id:'organization',   label:'Smart Organization',    sub:'Propose file moves',          icon:FolderTree, from:'#fbbf24', to:'#a3e635'  },
  { id:'supervisor',     label:'Supervisor',             sub:'Finalize & report',           icon:Activity,   from:'#818cf8', to:'#60a5fa'  },
]

const LOGS = [
  { id:1,  t:'10:01:02', lv:'info',    m:'[Discovery] Initiating deep scan — /Users/admin...' },
  { id:2,  t:'10:01:03', lv:'info',    m:'[Discovery] Found 342 documents in /Documents' },
  { id:3,  t:'10:01:05', lv:'success', m:'[Discovery] Complete — 1,247 files indexed ✓' },
  { id:4,  t:'10:01:06', lv:'info',    m:'[Classification] Starting ML pipeline v2.1...' },
  { id:5,  t:'10:01:09', lv:'info',    m:'[Classification] Processing 1,247 files...' },
  { id:6,  t:'10:01:12', lv:'success', m:'[Classification] All files classified ✓' },
  { id:7,  t:'10:01:13', lv:'info',    m:'[Understanding] Extracting content from 342 docs...' },
  { id:8,  t:'10:01:16', lv:'warn',    m:'[Understanding] 3 files skipped — unsupported encoding' },
  { id:9,  t:'10:01:19', lv:'success', m:'[Understanding] Extraction complete ✓' },
  { id:10, t:'10:01:20', lv:'info',    m:'[Duplicates] Comparing checksums + fuzzy hashes...' },
  { id:11, t:'10:01:23', lv:'info',    m:'[Duplicates] 12 groups found — 327 MB reclaimable' },
  { id:12, t:'10:01:24', lv:'success', m:'[Duplicates] Detection complete ✓' },
  { id:13, t:'10:01:25', lv:'info',    m:'[Organization] Generating AI reorganization plan...' },
  { id:14, t:'10:01:28', lv:'info',    m:'[Organization] 5 move operations proposed' },
  { id:15, t:'10:01:29', lv:'success', m:'[Organization] Plan ready — awaiting approval ✓' },
  { id:16, t:'10:01:30', lv:'success', m:'[Supervisor] Pipeline complete — generating report... ✓' },
]

const APPROVALS = [
  { id:1, title:'Move 5 files to organized folders?', desc:'Files relocated based on AI classification. Fully reversible via undo.' },
  { id:2, title:'Delete 3 confirmed duplicate files?', desc:'Frees 327 MB. All originals preserved and verified safe.' },
]

const LOG_COLORS = { info:'#64748b', success:'#34d399', warn:'#fbbf24', error:'#f87171' }

export default function SupervisorExecution() {
  const [active, setActive]     = useState(-1)
  const [done, setDone]         = useState([])
  const [logs, setLogs]         = useState([])
  const [running, setRunning]   = useState(false)
  const [approvals, setApprovals] = useState([])
  const [dismissed, setDismissed] = useState([])
  const [elapsed, setElapsed]   = useState(0)
  const logRef  = useRef(null)
  const timerRef = useRef(null)

  const start = () => {
    setRunning(true); setDone([]); setActive(0); setLogs([]); setApprovals([]); setDismissed([]); setElapsed(0)
    timerRef.current = setInterval(() => setElapsed(p => p+1), 1000)

    LOGS.forEach((l,i) => setTimeout(() => setLogs(p => [...p, l]), i*370))
    AGENTS.forEach((_,i) => {
      setTimeout(() => setActive(i), i*2300)
      setTimeout(() => setDone(p => [...p, i]), i*2300+1900)
    })
    setTimeout(() => setApprovals([APPROVALS[0]]), 9500)
    setTimeout(() => setApprovals(p => [...p, APPROVALS[1]]), 13500)
    const end = AGENTS.length*2300+1900
    setTimeout(() => { setRunning(false); clearInterval(timerRef.current) }, end)
  }

  const dismiss = id => {
    setDismissed(p => [...p, id])
    setTimeout(() => setApprovals(p => p.filter(a => a.id !== id)), 350)
  }

  useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight
  }, [logs])

  const status = i => done.includes(i) ? 'done' : active===i ? 'active' : 'idle'

  const fmtTime = s => `${String(Math.floor(s/60)).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`

  return (
    <div>
      {/* ── Header ── */}
      <div style={{ marginBottom:'2.4rem', display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap:'2rem' }}>
        <div>
          <motion.h1 initial={{ opacity:0, y:14 }} animate={{ opacity:1, y:0 }}
            style={{ fontFamily:'Poppins', fontSize:'2.4rem', fontWeight:800, letterSpacing:'-0.04em', lineHeight:1.1, background:'linear-gradient(135deg, #818cf8 0%, #60a5fa 50%, #22d3ee 100%)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>
            Supervisor
          </motion.h1>
          <motion.p initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.1 }}
            style={{ fontFamily:'Poppins', fontSize:'0.95rem', color:'#64748b', marginTop:'0.55rem', lineHeight:1.65 }}>
            Orchestrate the full 6-agent pipeline with live monitoring and per-step approvals
          </motion.p>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:'0.75rem', flexShrink:0 }}>
          {running && (
            <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }}
              style={{ fontFamily:'JetBrains Mono', fontSize:'0.85rem', color:'#34d399', background:'rgba(52,211,153,0.1)', padding:'0.55rem 1rem', borderRadius:11, border:'1px solid rgba(52,211,153,0.25)' }}>
              {fmtTime(elapsed)}
            </motion.div>
          )}
          <motion.button
            whileHover={{ scale:1.05, boxShadow:'0 0 30px #818cf855' }}
            whileTap={{ scale:0.95 }}
            onClick={start} disabled={running}
            style={{
              display:'flex', alignItems:'center', gap:'0.6rem',
              padding:'0.85rem 1.75rem', borderRadius:14, border:'none',
              background: running ? 'rgba(129,140,248,0.12)' : 'linear-gradient(135deg, #6366f1, #818cf8)',
              color: running ? '#818cf8' : '#fff',
              fontFamily:'Poppins', fontSize:'0.92rem', fontWeight:700,
              cursor: running ? 'not-allowed' : 'pointer',
              boxShadow: running ? 'none' : '0 4px 20px rgba(99,102,241,0.4)',
              outline: running ? '1px solid #818cf840' : 'none',
            }}>
            {running ? <><Square className="w-4 h-4" /> Running…</> : <><Play className="w-4 h-4" /> Run Pipeline</>}
          </motion.button>
        </div>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1.1fr', gap:'1.5rem' }}>
        {/* ── Agent pipeline ── */}
        <div style={{ borderRadius:18, background:'rgba(255,255,255,0.028)', border:'1px solid rgba(255,255,255,0.08)', padding:'2rem', position:'relative', overflow:'hidden' }}>
          <div style={{ position:'absolute', inset:0, background:'radial-gradient(ellipse at 20% 50%, rgba(99,102,241,0.06) 0%, transparent 65%)', pointerEvents:'none' }} />
          <h2 style={{ fontFamily:'Poppins', fontSize:'1rem', fontWeight:700, color:'#94a3b8', marginBottom:'2rem' }}>Agent Pipeline</h2>

          <div style={{ display:'flex', flexDirection:'column', gap:0 }}>
            {AGENTS.map((ag, idx) => {
              const Icon = ag.icon
              const s = status(idx)
              const isActive = s==='active', isDone = s==='done'
              const color = isDone||isActive ? ag.from : '#1e293b'
              const last = idx === AGENTS.length-1

              return (
                <div key={ag.id} style={{ display:'flex', gap:'1.25rem', position:'relative' }}>
                  {/* Vertical line */}
                  {!last && (
                    <div style={{ position:'absolute', left:24, top:56, width:2, height:36, background:'rgba(255,255,255,0.05)', zIndex:0 }}>
                      {isDone && (
                        <motion.div initial={{ height:0 }} animate={{ height:'100%' }} transition={{ duration:0.5 }}
                          style={{ width:'100%', background:`linear-gradient(180deg, ${ag.from}, ${ag.to})` }} />
                      )}
                    </div>
                  )}

                  {/* Node */}
                  <div style={{ paddingBottom: last ? 0 : '2.5rem', position:'relative', zIndex:1 }}>
                    <motion.div
                      animate={isActive ? {
                        boxShadow:[`0 0 0 0 ${ag.from}80`, `0 0 0 12px transparent`],
                      } : {}}
                      transition={{ duration:1.3, repeat:Infinity }}
                      style={{
                        width:50, height:50, borderRadius:'50%',
                        display:'flex', alignItems:'center', justifyContent:'center',
                        border: `2px solid ${color}`,
                        background: isDone ? `linear-gradient(135deg, ${ag.from}25, ${ag.to}15)` : isActive ? `${ag.from}12` : 'rgba(255,255,255,0.025)',
                        transition:'all 0.4s ease',
                        flexShrink:0,
                      }}>
                      <AnimatePresence mode="wait">
                        {isDone ? (
                          <motion.div key="check" initial={{ scale:0, rotate:-45 }} animate={{ scale:1, rotate:0 }} transition={{ type:'spring', stiffness:500, damping:22 }}>
                            <Check className="w-5 h-5" style={{ color: ag.from }} />
                          </motion.div>
                        ) : (
                          <motion.div key="icon" initial={{ scale:0 }} animate={{ scale:1 }}>
                            <Icon className="w-5 h-5" style={{ color: isActive ? ag.from : '#334155' }} />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  </div>

                  {/* Text */}
                  <div style={{ flex:1, paddingTop:'0.55rem', paddingBottom: last ? 0 : '2.5rem' }}>
                    <div style={{ fontFamily:'Poppins', fontSize:'0.9rem', fontWeight:700, color: isDone||isActive ? '#e2e8f0' : '#475569', transition:'color 0.3s' }}>
                      {ag.label}
                    </div>
                    <div style={{ fontFamily:'Poppins', fontSize:'0.74rem', color: isDone||isActive ? ag.from : '#2d3748', marginTop:2, transition:'color 0.3s' }}>
                      {isDone ? '✓ Completed' : isActive ? '⟳ Running…' : ag.sub}
                    </div>
                  </div>

                  {/* Spinner */}
                  {isActive && (
                    <motion.div animate={{ rotate:360 }} transition={{ duration:0.85, repeat:Infinity, ease:'linear' }}
                      style={{ width:18, height:18, borderRadius:'50%', border:`2px solid ${ag.from}30`, borderTopColor:ag.from, alignSelf:'center', flexShrink:0, marginRight:'0.25rem' }} />
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* ── Right column ── */}
        <div style={{ display:'flex', flexDirection:'column', gap:'1.1rem' }}>
          {/* Approvals */}
          <AnimatePresence>
            {approvals.filter(a => !dismissed.includes(a.id)).map(a => (
              <motion.div key={a.id}
                initial={{ opacity:0, y:-18, scale:0.95 }} animate={{ opacity:1, y:0, scale:1 }} exit={{ opacity:0, y:-18, scale:0.95 }}
                transition={{ type:'spring', stiffness:350 }}
                style={{ borderRadius:16, background:'rgba(99,102,241,0.09)', border:'1px solid rgba(99,102,241,0.35)', padding:'1.4rem 1.5rem', boxShadow:'0 4px 30px rgba(99,102,241,0.12)' }}>
                <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:'0.65rem' }}>
                  <div style={{ display:'flex', alignItems:'center', gap:'0.5rem' }}>
                    <motion.div animate={{ scale:[1,1.2,1] }} transition={{ duration:1.5, repeat:Infinity }}>
                      <AlertTriangle className="w-4 h-4" style={{ color:'#fbbf24' }} />
                    </motion.div>
                    <span style={{ fontFamily:'Poppins', fontSize:'0.72rem', fontWeight:700, color:'#fbbf24', textTransform:'uppercase', letterSpacing:'0.1em' }}>Approval Required</span>
                  </div>
                  <button onClick={() => dismiss(a.id)} style={{ background:'none', border:'none', cursor:'pointer' }}>
                    <X className="w-4 h-4" style={{ color:'#475569' }} />
                  </button>
                </div>
                <p style={{ fontFamily:'Poppins', fontSize:'0.93rem', fontWeight:700, color:'#e2e8f0', marginBottom:'0.4rem' }}>{a.title}</p>
                <p style={{ fontFamily:'Poppins', fontSize:'0.8rem', color:'#64748b', marginBottom:'1.1rem', lineHeight:1.6 }}>{a.desc}</p>
                <div style={{ display:'flex', gap:'0.6rem' }}>
                  {[
                    { l:'Approve', c:'#34d399', bg:'rgba(52,211,153,0.12)', b:'rgba(52,211,153,0.3)' },
                    { l:'Skip',    c:'#64748b', bg:'rgba(255,255,255,0.05)', b:'rgba(255,255,255,0.1)' },
                    { l:'Cancel',  c:'#f87171', bg:'rgba(248,113,113,0.1)', b:'rgba(248,113,113,0.28)' },
                  ].map(btn => (
                    <motion.button key={btn.l} whileHover={{ scale:1.07, y:-1 }} whileTap={{ scale:0.93 }}
                      onClick={() => dismiss(a.id)}
                      style={{ padding:'0.55rem 1.1rem', borderRadius:10, fontFamily:'Poppins', fontSize:'0.8rem', fontWeight:700, color:btn.c, background:btn.bg, border:`1px solid ${btn.b}`, cursor:'pointer' }}>
                      {btn.l}
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Log panel */}
          <div style={{ flex:1, borderRadius:18, background:'rgba(255,255,255,0.022)', border:'1px solid rgba(255,255,255,0.07)', overflow:'hidden', display:'flex', flexDirection:'column' }}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'1rem 1.5rem', borderBottom:'1px solid rgba(255,255,255,0.06)' }}>
              <h2 style={{ fontFamily:'Poppins', fontSize:'0.9rem', fontWeight:700, color:'#64748b' }}>Execution Log</h2>
              <div style={{ display:'flex', alignItems:'center', gap:'0.55rem' }}>
                <motion.div
                  animate={{ scale: running ? [1,1.4,1] : 1, opacity: running ? [0.6,1,0.6] : 0.3 }}
                  transition={{ duration:1.2, repeat:Infinity }}
                  style={{ width:7, height:7, borderRadius:'50%', background: running ? '#34d399' : '#334155', boxShadow: running ? '0 0 8px #34d39980' : 'none' }} />
                <span style={{ fontFamily:'JetBrains Mono', fontSize:'0.68rem', color: running ? '#34d399' : '#334155' }}>{running ? 'LIVE' : 'IDLE'}</span>
              </div>
            </div>

            <div ref={logRef} style={{ flex:1, height:400, overflowY:'auto', padding:'1.1rem 1.4rem', display:'flex', flexDirection:'column', gap:'0.5rem' }}>
              {logs.length === 0 && (
                <div style={{ textAlign:'center', paddingTop:'4rem', fontFamily:'Poppins', fontSize:'0.82rem', color:'#1e293b' }}>
                  Click "Run Pipeline" to start execution…
                </div>
              )}
              <AnimatePresence>
                {logs.map(l => (
                  <motion.div key={l.id}
                    initial={{ opacity:0, x:8, backgroundColor: `${LOG_COLORS[l.lv]}18` }}
                    animate={{ opacity:1, x:0, backgroundColor:'rgba(0,0,0,0)' }}
                    transition={{ duration:0.28 }}
                    style={{ display:'flex', gap:'0.85rem', alignItems:'flex-start' }}>
                    <span style={{ fontFamily:'JetBrains Mono', fontSize:'0.68rem', color:'#1e293b', flexShrink:0, paddingTop:'0.1rem', letterSpacing:'0.02em' }}>{l.t}</span>
                    <span style={{ fontFamily:'JetBrains Mono', fontSize:'0.72rem', color:LOG_COLORS[l.lv], lineHeight:1.65 }}>{l.m}</span>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
