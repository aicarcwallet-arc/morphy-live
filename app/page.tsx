// @ts-nocheck
"use client";
import React, { useEffect, useState } from 'react';
import { createAppKit, useAppKit, useAppKitAccount } from '@reown/appkit/react';
import { mainnet, arbitrum } from '@reown/appkit/networks';
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi';

const projectId = '1234567890abcdef1234567890abcdef'; 
const networks = [mainnet, arbitrum];
const wagmiAdapter = new WagmiAdapter({ projectId, networks });

createAppKit({
  adapters: [wagmiAdapter],
  networks,
  projectId,
  metadata: { name: 'Morphy Mine', url: 'https://morphy-official.vercel.app' }
});

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [view, setView] = useState('intro');
  const [hashPower, setHashPower] = useState(0);
  const [tabsCompleted, setTabsCompleted] = useState(0);
  const [isMining, setIsMining] = useState(false);
  const { open } = useAppKit();
  const { address, isConnected } = useAppKitAccount();

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    let interval;
    if (isMining && tabsCompleted < 10) {
      interval = setInterval(() => {
        setHashPower(prev => {
          if (prev >= 100) {
            setTabsCompleted(t => t + 1);
            return 0;
          }
          return prev + 10; // Speed up for testing
        });
      }, 100);
    } else if (tabsCompleted >= 10) {
      setTimeout(() => setView('tiers'), 800);
    }
    return () => clearInterval(interval);
  }, [isMining, tabsCompleted]);

  if (!mounted) return null;

  // --- VIEW 1: INTRO (RESPONSIVE) ---
  if (view === 'intro') return (
    <div style={styles.container}>
      <div className="responsive-wrapper" style={styles.introWrapper}>
        <div style={styles.infoSection}>
          <div style={styles.partnerBadge}>PROUD PARTNER OF <span style={{color: '#00ff88'}}>CHANGELLY DEX</span></div>
          <h1 style={styles.heroTitle}>MORPHY <span style={{color:'#0070f3'}}>MINE</span></h1>
          <div style={styles.infoCard}>
            <h3 style={styles.infoHeading}>Game Economy</h3>
            <p style={styles.infoText}>Deploy virtualized hardware to solve QUBIC hashes and earn Treasury distributions.</p>
          </div>
        </div>

        <div style={styles.loginSection}>
          <div style={styles.card}>
            <h2 style={{margin: '0 0 10px 0'}}>Portal Access</h2>
            <p style={{color: '#666', fontSize: '0.85rem', marginBottom: '20px'}}>
              {isConnected ? "Wallet Connected." : "Connect to start mining."}
            </p>
            {!isConnected ? (
              <button onClick={() => open()} style={styles.primaryBtn}>Connect Wallet</button>
            ) : (
              <button onClick={() => setView('mining')} style={styles.successBtn}>Enter Rig Room</button>
            )}
          </div>
        </div>
      </div>
      <style>{`
        .responsive-wrapper { display: flex; flex-direction: row; gap: 40px; align-items: center; width: 100%; max-width: 1000px; }
        @media (max-width: 768px) {
          .responsive-wrapper { flex-direction: column; text-align: center; gap: 20px; }
          h1 { font-size: 2.5rem !important; }
        }
      `}</style>
    </div>
  );

  // --- VIEW 2: RIG ROOM ---
  if (view === 'mining') return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={{color:'#00ff88', fontSize: '1.2rem'}}>RIG ROOM - NODE 01</h2>
        <div style={styles.rigContainer}>
           {[1,2,3].map(i => (
             <div key={i} style={{...styles.rig, borderColor: isMining ? '#0070f3' : '#333'}}>
                <div style={{...styles.fan, animation: isMining ? 'spin 1s linear infinite' : 'none'}}>⚙️</div>
                <p style={{fontSize:'0.5rem'}}>RIG_0{i}</p>
             </div>
           ))}
        </div>
        <div style={styles.progressSection}>
          <p style={{fontSize: '0.8rem'}}>Hashes: {tabsCompleted}/10 Segments</p>
          <div style={styles.progressBarOuter}><div style={{...styles.progressBarInner, width: `${hashPower}%`}}></div></div>
        </div>
        {!isMining ? (
          <button onClick={() => setIsMining(true)} style={styles.successBtn}>START MINING</button>
        ) : (
          <p style={{color:'#0070f3', fontSize: '0.8rem'}}>MINING ACTIVE...</p>
        )}
      </div>
      <style>{` @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } } `}</style>
    </div>
  );

  // --- VIEW 3: TIERS ---
  if (view === 'tiers') return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2>TREASURY</h2>
        <div style={styles.tierGrid}>
          <div style={{...styles.tierCard, borderColor:'#00ff88'}}>
            <span style={{color:'#00ff88', fontSize: '0.7rem'}}>READY</span>
            <h3 style={{fontSize: '1rem'}}>Beginner Pool</h3>
            <p style={styles.statValue}>118,000,000</p>
          </div>
        </div>
        <button onClick={() => setView('dex')} style={styles.successBtn}>EXCHANGE</button>
      </div>
    </div>
  );

  // --- VIEW 4: DEX ---
  return (
    <div style={styles.container}>
      <div style={styles.dexCard}>
        <div style={styles.dexHeader}><h3 style={{margin:0}}>Morphy DEX</h3><span style={styles.liveDot}>● SECURE</span></div>
        <div style={styles.swapBox}>
          <label style={styles.label}>Pay (QUBIC)</label>
          <div style={styles.inputRow}><input readOnly value="118,000,000" style={styles.input} /></div>
        </div>
        <div style={styles.arrowIcon}>↓</div>
        <div style={styles.swapBox}>
          <label style={styles.label}>Receive (USDT)</label>
          <div style={styles.inputRow}><input readOnly value="~ 4,250.00" style={styles.input} /></div>
        </div>
        <button style={styles.dexBtn} onClick={() => alert("Ready for Changelly Keys")}>Swap & Withdraw</button>
        <p style={{textAlign:'center', fontSize:'0.6rem', color:'#333', marginTop:'10px'}}>Changelly C2C Partner</p>
      </div>
    </div>
  );
}

const styles = {
  container: { backgroundColor:'#050505', color:'#fff', minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'sans-serif', padding:'15px' },
  introWrapper: { display: 'flex', width: '100%', maxWidth: '1000px' },
  infoSection: { flex: 1, padding: '10px' },
  partnerBadge: { background: '#111', padding: '6px 12px', borderRadius: '50px', fontSize: '0.65rem', border: '1px solid #333', marginBottom: '15px', display: 'inline-block' },
  heroTitle: { fontSize:'3.5rem', letterSpacing:'-2px', margin: '0 0 20px 0' },
  infoCard: { marginBottom: '15px', background: '#111', padding: '15px', borderRadius: '12px', borderLeft: '4px solid #0070f3' },
  infoHeading: { margin: '0 0 5px 0', fontSize: '1rem' },
  infoText: { color: '#888', fontSize: '0.8rem', lineHeight: '1.4' },
  loginSection: { flex: '0 0 320px', display: 'flex', justifyContent: 'center' },
  card: { background:'#111', padding:'25px', borderRadius:'20px', border:'1px solid #222', textAlign:'center', width:'100%', maxWidth:'320px' },
  primaryBtn: { background:'#0070f3', color:'#fff', border:'none', padding:'14px', borderRadius:'10px', width:'100%', fontWeight:'bold', cursor:'pointer' },
  successBtn: { background:'#00ff88', color:'#000', border:'none', padding:'14px', borderRadius:'10px', width:'100%', fontWeight:'bold', cursor:'pointer' },
  rigContainer: { display:'flex', gap:'8px', justifyContent:'center', margin:'20px 0' },
  rig: { background:'#000', padding:'10px', border:'1px solid #333', borderRadius:'10px', width:'70px' },
  fan: { fontSize:'1.5rem', marginBottom:'5px' },
  progressSection: { margin:'15px 0' },
  progressBarOuter: { background:'#222', height:'8px', borderRadius:'4px', overflow:'hidden', marginTop:'8px' },
  progressBarInner: { background:'#0070f3', height:'100%', transition:'width 0.1s linear' },
  tierGrid: { margin:'15px 0' },
  tierCard: { background:'#000', padding:'15px', borderRadius:'12px', border:'1px solid #333' },
  statValue: { fontSize:'1.3rem', fontWeight:'bold' },
  dexCard: { background:'#111', padding:'20px', borderRadius:'20px', border:'1px solid #333', width:'100%', maxWidth:'340px' },
  dexHeader: { display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'15px' },
  liveDot: { color:'#00ff88', fontSize:'0.6rem' },
  swapBox: { background:'#000', padding:'12px', borderRadius:'12px' },
  label: { fontSize:'0.65rem', color:'#666' },
  inputRow: { display:'flex', justifyContent:'space-between', alignItems:'center', marginTop:'4px' },
  input: { background:'none', border:'none', color:'#fff', fontSize:'1.1rem', outline:'none', width: '100%' },
  arrowIcon: { textAlign: 'center', padding: '5px', color: '#0070f3' },
  dexBtn: { background: '#0070f3', color: '#fff', border: 'none', padding: '14px', borderRadius: '10px', width: '100%', fontWeight: 'bold', marginTop: '15px' }
};
