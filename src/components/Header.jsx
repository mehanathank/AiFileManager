import { motion } from 'framer-motion'
import Logo from '../assets/Logo.png'

const WS_INFO = {
  connected:    { color:'#34d399', label:'Live',        dot:'#34d399' },
  connecting:   { color:'#fbbf24', label:'Connecting…', dot:'#fbbf24' },
  disconnected: { color:'#64748b', label:'Offline',      dot:'#475569' },
  error:        { color:'#f87171', label:'Error',        dot:'#f87171' },
}

export default function Header({ wsStatus = 'disconnected' }) {
  const ws = WS_INFO[wsStatus] || WS_INFO.disconnected

  return (
    <header style={{ height:64, display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 2.4rem', background:'rgba(5,9,26,0.72)', backdropFilter:'blur(24px) saturate(160%)', borderBottom:'1px solid rgba(255,255,255,0.06)', flexShrink:0, position:'relative', zIndex:10 }}>

      {/* Top accent line */}
      <div style={{ position:'absolute', top:0, left:0, right:0, height:2, background:'linear-gradient(90deg, transparent 0%, #22d3ee 30%, #a78bfa 70%, transparent 100%)' }} />

      {/* Left: title + ws status */}
      <div style={{ display:'flex', alignItems:'center', gap:'1.25rem' }}>
        <div style={{ display:'flex', alignItems:'center', gap:'0.65rem' }}>
          <img src={Logo} alt="FileMind AI Logo" style={{ width:32, height:32, borderRadius:8, objectFit:'cover', border:'1px solid rgba(255,255,255,0.1)' }} />
          <div>
            <div style={{ fontFamily:'Poppins', fontSize:'0.95rem', fontWeight:800, color:'#f8fafc', letterSpacing:'-0.02em' }}>FileMind AI</div>
            <div style={{ fontFamily:'Poppins', fontSize:'0.68rem', color:'#475569', marginTop:1 }}>AI File Manager Dashboard</div>
          </div>
        </div>

        {/* WS status pill */}
        <div style={{ display:'flex', alignItems:'center', gap:'0.45rem', padding:'0.3rem 0.75rem', borderRadius:99, background:`${ws.dot}12`, border:`1px solid ${ws.dot}35` }}>
          <motion.div
            animate={ wsStatus==='connected' ? { scale:[1,1.4,1], opacity:[0.7,1,0.7] } : { opacity:[0.4,0.8,0.4] }}
            transition={{ duration:1.8, repeat:Infinity }}
            style={{ width:6, height:6, borderRadius:'50%', background:ws.dot, boxShadow: wsStatus==='connected' ? `0 0 6px ${ws.dot}` : 'none' }}
          />
          <span style={{ fontFamily:'Poppins', fontSize:'0.72rem', fontWeight:600, color:ws.color }}>{ws.label}</span>
          <span style={{ fontFamily:'JetBrains Mono', fontSize:'0.65rem', color:'#334155' }}>ws://localhost:8000</span>
        </div>
      </div>
    </header>
  )
}