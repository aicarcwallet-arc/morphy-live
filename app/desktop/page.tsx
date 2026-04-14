// @ts-nocheck
"use client";
import React, { useState, useEffect } from 'react';
import { createAppKit, useAppKit, useAppKitAccount } from '@reown/appkit/react';
import { mainnet, arbitrum } from '@reown/appkit/networks';
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi';

// Initialize AppKit for this route
const projectId = '1234567890abcdef1234567890abcdef'; 
const networks = [mainnet, arbitrum];
const wagmiAdapter = new WagmiAdapter({ projectId, networks });

createAppKit({
  adapters: [wagmiAdapter],
  networks,
  projectId,
  metadata: { name: 'Morphy Mine Desktop', url: 'https://morphy-official.vercel.app' }
});

export default function DesktopPage() {
  const [mounted, setMounted] = useState(false);
  const { open } = useAppKit();
  const { isConnected } = useAppKitAccount();

  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return null;

  return (
    <div style={styles.container}>
      <div style={styles.wrapper}>
        
        <div style={styles.infoSection}>
          <div style={styles.partnerBadge}>
            PROUD PARTNER OF <span style={{color: '#00ff88'}}>CHANGELLY DEX</span>
          </div>
          <h1 style={styles.heroTitle}>MORPHY <span style={{color:'#0070f3'}}>MINE</span></h1>
          
          <div style={styles.infoCard}>
            <h3 style={styles.infoHeading}>Detailed Game Economy Logic</h3>
            <p style={styles.infoText}>
              Our ecosystem utilizes decentralized node computing to solve QUBIC network hashes. 
              By deploying virtualized hardware, users participate in a high-fidelity distribution 
              mechanism that rewards 118,000,000 QUBIC per validated sequence. 
            </p>
            <p style={{...styles.infoText, marginTop: '10px'}}>
              This institutional-grade bridge ensures liquidity through our Changelly partnership, 
              allowing for automated swap-and-withdraw cycles.
            </p>
          </div>
        </div>

        <div style={styles.loginSection}>
          <div style={styles.card}>
            <div style={styles.statusDot}>● SERVER LIVE</div>
            <h2 style={{margin: '10px 0'}}>Portal Access</h2>
            <p style={{color: '#666', fontSize: '0.9rem', marginBottom: '30px'}}>
              {isConnected ? "Wallet Authorized." : "Connect your institutional wallet to access the mining floor."}
            </p>
            
            <button onClick={() => open()} style={isConnected ? styles.successBtn : styles.primaryBtn}>
              {isConnected ? "Enter Mining Floor" : "Connect Wallet"}
            </button>
            
            <p style={{marginTop: '20px', fontSize: '0.7rem', color: '#444'}}>
              Nusrat Properties LLC © 2026
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}

const styles = {
  container: { backgroundColor:'#050505', color:'#fff', minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'sans-serif', padding:'40px' },
  wrapper: { display: 'flex', maxWidth: '1100px', gap: '60px', alignItems: 'center' },
  infoSection: { flex: 1.2 },
  partnerBadge: { background: '#111', padding: '8px 16px', borderRadius: '50px', fontSize: '0.75rem', border: '1px solid #333', marginBottom: '25px', display: 'inline-block', fontWeight: 'bold' },
  heroTitle: { fontSize:'4.5rem', letterSpacing:'-3px', margin: '0 0 30px 0', lineHeight: '1' },
  infoCard: { marginBottom: '25px', background: '#111', padding: '25px', borderRadius: '18px', borderLeft: '5px solid #0070f3' },
  infoHeading: { margin: '0 0 10px 0', color: '#fff', fontSize: '1.2rem' },
  infoText: { color: '#888', fontSize: '1rem', lineHeight: '1.7' },
  loginSection: { flex: '0 0 400px' },
  card: { background:'#111', padding:'45px', borderRadius:'28px', border:'1px solid #222', textAlign:'center', position: 'relative' },
  statusDot: { position: 'absolute', top: '20px', right: '20px', color: '#00ff88', fontSize: '0.6rem', fontWeight: 'bold' },
  primaryBtn: { background:'#0070f3', color:'#fff', border:'none', padding:'18px', borderRadius:'14px', width:'100%', fontWeight:'bold', cursor:'pointer' },
  successBtn: { background:'#00ff88', color:'#000', border:'none', padding:'18px', borderRadius:'14px', width:'100%', fontWeight:'bold', cursor:'pointer' }
};
