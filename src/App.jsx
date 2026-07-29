import { useState } from 'react'
import Sidebar from './components/Sidebar'
import Header from './components/Header'
import Dashboard from './pages/Dashboard'
import FileDiscovery from './pages/FileDiscovery'
import FileClassification from './pages/FileClassification'
import ContentUnderstanding from './pages/ContentUnderstanding'
import DuplicateDetection from './pages/DuplicateDetection'
import FileOperations from './pages/FileOperations'
import SmartOrganization from './pages/SmartOrganization'
import { useBackend } from './hooks/useBackend'

const PAGES = {
  dashboard:         Dashboard,
  discovery:         FileDiscovery,
  classification:    FileClassification,
  understanding:     ContentUnderstanding,
  duplicates:        DuplicateDetection,
  'file-operations': FileOperations,
  organization:      SmartOrganization,
}

export default function App() {
  const [activePage, setActivePage] = useState('dashboard')
  const backend = useBackend()

  const PageComponent = PAGES[activePage] || Dashboard

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: 'var(--bg-base)' }}>

      {/* ── Ambient orbs ── */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="orb-a absolute" style={{ top:'-15%', left:'-12%', width:'560px', height:'560px', borderRadius:'50%', background:'radial-gradient(circle at 40% 40%, #22d3ee1a 0%, transparent 65%)' }} />
        <div className="orb-b absolute" style={{ top:'30%', right:'-15%', width:'500px', height:'500px', borderRadius:'50%', background:'radial-gradient(circle at 60% 40%, #a78bfa14 0%, transparent 65%)' }} />
        <div className="orb-c absolute" style={{ bottom:'-10%', left:'35%', width:'420px', height:'420px', borderRadius:'50%', background:'radial-gradient(circle at 50% 60%, #34d39910 0%, transparent 65%)' }} />
        <div style={{ position:'absolute', inset:0, backgroundImage:'linear-gradient(rgba(255,255,255,0.016) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.016) 1px, transparent 1px)', backgroundSize:'52px 52px' }} />
      </div>

      <Sidebar activePage={activePage} setActivePage={setActivePage} wsStatus={backend.wsStatus} />

      <div className="flex-1 flex flex-col overflow-hidden relative z-10">
        <Header activePage={activePage} wsStatus={backend.wsStatus} />
        <main className="flex-1 overflow-auto">
          <div style={{ padding:'2.5rem 2.8rem', minHeight:'100%' }}>
            {activePage === 'dashboard'
              ? <Dashboard backend={backend} />
              : <PageComponent />
            }
          </div>
        </main>
      </div>
    </div>
  )
}
