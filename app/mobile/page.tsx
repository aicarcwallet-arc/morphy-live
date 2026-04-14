// @ts-nocheck
"use client";
import React, { useState, useEffect } from 'react';
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
  metadata: { name: 'Morphy Mine Mobile', url: 'https://morphy-official.vercel.app' }
});

export default function MobilePage() {
  const [mounted, setMounted] = useState(false);
  const { open } = useAppKit();
  const { isConnected } = useAppKitAccount();

  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return null;

  return (
    <div style={{backgroundColor:'#050505', color:'#fff', minHeight:'100vh', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', fontFamily:'sans-serif', padding:'20px', textAlign:'center'}}>
      <div style={{background:'#111', padding:'6px 12px', borderRadius:'50px', fontSize:'0.65rem', border:'1px solid #333', marginBottom:'15px'}}>PARTNER: <span style={{color: '#00ff88'}}>CHANGELLY</span></div>
      <h1 style={{fontSize:'2.5rem', margin:'0 0 10px 0'}}>MORPHY MINE</h1>
      <p style={{color:'#888', fontSize:'0.9rem', marginBottom:'30px', padding:'0 10px'}}>
        Tap-to-Mine QUBIC hashes and swap via Changelly.
      </p>
      <div style={{background:'#111', padding:'35px', borderRadius:'24px', border:'1px solid #222', width:'100%', maxWidth:'320px'}}>
        <h3 style={{margin:'0 0 15px 0'}}>Portal Access</h3>
        <button onClick={() => open()} style={{background: isConnected ? '#00ff88' : '#0070f3', color: isConnected ? '#000' : '#fff', border:'none', padding:'16px', borderRadius:'12px', width:'100%', fontWeight:'bold', cursor:'pointer'}}>
          {isConnected ? "Enter Rigs" : "Connect Wallet"}
        </button>
      </div>
    </div>
  );
}
