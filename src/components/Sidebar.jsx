import { motion } from 'framer-motion'
import { Search, Tag, Brain, Copy, FolderTree, Shield, Sparkles, Zap, Wifi, WifiOff, AlertCircle } from 'lucide-react'
import Logo from '../assets/Logo.png'

const AGENTS = [
  { id: 1, page: 'discovery', icon: Search, label: 'File Discovery', sub: 'Locate & index paths', color: '#22d3ee' },
  { id: 2, page: 'classification', icon: Tag, label: 'Classification', sub: 'Scan & sort by type', color: '#a78bfa' },
  { id: 3, page: 'understanding', icon: Brain, label: 'Content Understanding', sub: 'Read & analyse content', color: '#34d399' },
  { id: 4, page: 'duplicates', icon: Copy, label: 'Duplicate Detection', sub: 'Find redundant files', color: '#f472b6' },
  { id: 5, page: 'file-operations', icon: FolderTree, label: 'File Operations', sub: 'Move, rename, delete', color: '#fbbf24' },
  { id: 6, page: 'organization', icon: Shield, label: 'Smart Organization', sub: 'Plan & reorganise dirs', color: '#60a5fa' },
]

const WS_COLORS = {
  connected: { color: '#34d399', label: 'Connected', Icon: Wifi },
  connecting: { color: '#fbbf24', label: 'Connecting…', Icon: Wifi },
  disconnected: { color: '#64748b', label: 'Disconnected', Icon: WifiOff },
  error: { color: '#f87171', label: 'Error', Icon: AlertCircle },
}

const STAGGER = { hidden: {}, show: { transition: { staggerChildren: 0.055, delayChildren: 0.12 } } }
const ITEM = { hidden: { opacity: 0, x: -20, filter: 'blur(4px)' }, show: { opacity: 1, x: 0, filter: 'blur(0px)', transition: { type: 'spring', stiffness: 320, damping: 26 } } }

export default function Sidebar({ activePage, setActivePage, wsStatus = 'disconnected' }) {
  const ws = WS_COLORS[wsStatus] || WS_COLORS.disconnected

  return (
    <aside className="flex flex-col flex-shrink-0 relative z-20" style={{ width: '272px', background: 'rgba(5,9,26,0.82)', backdropFilter: 'blur(28px) saturate(160%)', borderRight: '1px solid rgba(255,255,255,0.07)' }}>

      {/* ── Logo ── */}
      <div style={{ padding: '2rem 1.75rem 1.5rem', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }} style={{ display: 'flex', alignItems: 'center', gap: '0.9rem' }}>
          <div style={{ flexShrink: 0, width: 44, height: 44, borderRadius: 12, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
            <img src={Logo} alt="FileMind AI Logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          <div style={{ minWidth: 0 }}>
            <h1 style={{ fontFamily: 'Poppins', fontSize: '1.22rem', fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.15, color: '#f8fafc', textShadow: '0 0 22px #22d3eecc', whiteSpace: 'nowrap' }}>
              FileMind <span style={{ background: 'linear-gradient(135deg,#22d3ee,#a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>AI</span>
            </h1>
            <p style={{ fontFamily: 'Poppins', fontSize: '0.64rem', color: '#94a3b8', letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 600, marginTop: 3, whiteSpace: 'nowrap' }}>
              AI File Manager
            </p>
          </div>
        </motion.div>
      </div>

      {/* ── Nav ── */}
      <nav style={{ flex: 1, padding: '1.4rem 1rem', overflowY: 'auto' }}>
        
        {/* Multi-Agent Dashboard */}
        {/* <p style={{ fontFamily: 'Poppins', fontSize: '0.62rem', fontWeight: 700, color: '#64748b', letterSpacing: '0.14em', textTransform: 'uppercase', paddingLeft: '0.9rem', marginBottom: '0.6rem' }}>
          Supervisor
        </p>
        <motion.button
          initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ type: 'spring', stiffness: 320, damping: 26 }}
          onClick={() => setActivePage('dashboard')}
          style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '0.8rem', padding: '0.65rem 0.85rem', borderRadius: 13, background: activePage === 'dashboard' ? 'rgba(34,211,238,0.1)' : 'rgba(255,255,255,0.025)', border: activePage === 'dashboard' ? '1px solid rgba(34,211,238,0.38)' : '1px solid rgba(255,255,255,0.06)', cursor: 'pointer', marginBottom: '1.1rem' }}
        >
          <div style={{ width: 20, height: 20, borderRadius: 6, background: 'rgba(34,211,238,0.2)', border: '1px solid rgba(34,211,238,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <span style={{ fontFamily: 'Poppins', fontSize: '0.62rem', fontWeight: 800, color: '#22d3ee' }}>M</span>
          </div>
          <div style={{ width: 30, height: 30, borderRadius: 9, background: 'rgba(34,211,238,0.12)', border: '1px solid rgba(34,211,238,0.28)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Sparkles style={{ width: 14, height: 14, color: '#22d3ee' }} />
          </div>
          <div style={{ flex: 1, minWidth: 0, textAlign: 'left' }}>
            <div style={{ fontFamily: 'Poppins', fontSize: '0.8rem', fontWeight: 600, color: activePage === 'dashboard' ? '#22d3ee' : '#cbd5e1', lineHeight: 1.2 }}>Multi-Agent</div>
            <div style={{ fontFamily: 'Poppins', fontSize: '0.67rem', color: '#475569', marginTop: 1 }}>Supervisor pipeline</div>
          </div>
        </motion.button>  */}

        {/* Individual Agents */}
        <p style={{ fontFamily: 'Poppins', fontSize: '0.62rem', fontWeight: 700, color: '#64748b', letterSpacing: '0.14em', textTransform: 'uppercase', paddingLeft: '0.9rem', marginBottom: '0.6rem' }}>
          Individual Agents
        </p>
        <motion.ul variants={STAGGER} initial="hidden" animate="show" style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {AGENTS.map((ag) => {
            const Icon = ag.icon
            const isActive = activePage === ag.page
            return (
              <motion.li key={ag.id} variants={ITEM} style={{ listStyle: 'none' }}>
                <button onClick={() => setActivePage(ag.page)}
                  style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '0.8rem', padding: '0.65rem 0.85rem', borderRadius: 13, background: isActive ? `${ag.color}12` : 'rgba(255,255,255,0.025)', border: isActive ? `1px solid ${ag.color}45` : '1px solid rgba(255,255,255,0.06)', cursor: 'pointer' }}>
                  <div style={{ width: 20, height: 20, borderRadius: 6, background: `${ag.color}20`, border: `1px solid ${ag.color}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <span style={{ fontFamily: 'Poppins', fontSize: '0.62rem', fontWeight: 800, color: ag.color }}>{ag.id}</span>
                  </div>
                  <div style={{ width: 30, height: 30, borderRadius: 9, background: `${ag.color}12`, border: `1px solid ${ag.color}28`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Icon style={{ width: 14, height: 14, color: ag.color }} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0, textAlign: 'left' }}>
                    <div style={{ fontFamily: 'Poppins', fontSize: '0.8rem', fontWeight: 600, color: isActive ? ag.color : '#cbd5e1', lineHeight: 1.2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{ag.label}</div>
                    <div style={{ fontFamily: 'Poppins', fontSize: '0.67rem', color: '#475569', marginTop: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{ag.sub}</div>
                  </div>
                  <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 2.2, repeat: Infinity, delay: ag.id * 0.3 }}
                    style={{ width: 5, height: 5, borderRadius: '50%', background: ag.color, boxShadow: `0 0 5px ${ag.color}`, flexShrink: 0 }} />
                </button>
              </motion.li>
            )
          })}
        </motion.ul>
      </nav>

      {/* ── Footer: WS status ── */}
      <div style={{ padding: '1rem 1rem 1.75rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
          style={{ padding: '0.9rem 1.1rem', borderRadius: 14, background: 'rgba(255,255,255,0.025)', border: `1px solid ${ws.color}28` }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.65rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <motion.div animate={wsStatus === 'connected' ? { scale: [1, 1.3, 1] } : {}} transition={{ duration: 2, repeat: Infinity }}>
                <ws.Icon style={{ width: 13, height: 13, color: ws.color }} />
              </motion.div>
              <span style={{ fontFamily: 'Poppins', fontSize: '0.72rem', color: ws.color, fontWeight: 600 }}>{ws.label}</span>
            </div>
            <span style={{ fontFamily: 'JetBrains Mono', fontSize: '0.62rem', color: '#475569' }}>:8000</span>
          </div>
          <div style={{ display: 'flex', gap: 3, marginBottom: '0.65rem' }}>
            {AGENTS.map((ag, i) => (
              <motion.div key={ag.id} style={{ flex: 1, height: 3, borderRadius: 99, background: ag.color }}
                animate={{ opacity: [0.4, 0.9, 0.4], scaleY: [1, 1.6, 1] }}
                transition={{ duration: 2.4, repeat: Infinity, delay: i * 0.32, ease: 'easeInOut' }} />
            ))}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Zap style={{ width: 11, height: 11, color: '#475569' }} />
            <span style={{ fontFamily: 'Poppins', fontSize: '0.68rem', color: '#475569' }}>
              LLM: <span style={{ color: '#94a3b8', fontWeight: 600 }}>llama-3.3-70b</span>
            </span>
          </div>
        </motion.div>
      </div>
    </aside>
  )
}
