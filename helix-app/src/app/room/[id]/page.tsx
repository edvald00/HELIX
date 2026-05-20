"use client";

import { useState } from "react";
import DigitalTwin from "@/components/DigitalTwin";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function RoomDashboard() {
  const params = useParams();
  const roomId = params.id as string;
  
  const roomName = roomId === "suite-presidencial" ? "Suíte Presidencial" : 
                   roomId === "quarto-deluxe" ? "Quarto Deluxe" : 
                   roomId === "lobby" ? "Lobby Principal" : "Ambiente";

  const [lightOn, setLightOn] = useState(true);
  const [acOn, setAcOn] = useState(false);

  return (
    <div className="flex flex-col min-h-screen bg-[#08080b]">
      
      {/* Header Corporativo (Padrão dashboard.html) */}
      <header className="sticky top-0 z-50 h-[72px] backdrop-blur-md bg-[#0b1120]/80 border-b border-[#1E293B]">
        <nav className="max-w-[1400px] mx-auto px-6 h-full flex items-center justify-between gap-6">
          <Link href="/" className="flex items-center gap-2.5 font-extrabold text-[22px] text-white tracking-[-0.02em] hover:opacity-80 transition-opacity">
            <svg className="w-[34px] h-[34px] text-[#00AEEF] drop-shadow-[0_0_12px_rgba(0,174,239,0.55)]" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <defs>
                <linearGradient id="lg" x1="0" y1="0" x2="40" y2="40">
                  <stop offset="0%" stopColor="#00AEEF" />
                  <stop offset="100%" stopColor="#7C3AED" />
                </linearGradient>
              </defs>
              <g className="origin-center animate-[spin_14s_linear_infinite]" stroke="url(#lg)" strokeWidth="2.6" strokeLinecap="round" fill="none">
                <path d="M20 4 C 30 12, 30 18, 20 20 C 10 22, 10 28, 20 36" />
                <path d="M20 4 C 10 12, 10 18, 20 20 C 30 22, 30 28, 20 36" />
              </g>
              <circle cx="20" cy="20" r="2" fill="#00AEEF" />
            </svg>
            <span><b className="text-transparent bg-clip-text bg-gradient-to-r from-[#00AEEF] to-[#7C3AED]">Hé</b>lix</span>
          </Link>
          
          <div className="flex items-center">
            <span className="text-[#94A3B8] text-[14px] mr-[16px] hidden sm:block">usuario@hotel.com</span>
            <Link href="/" className="inline-flex items-center gap-[8px] px-[18px] py-[10px] rounded-[10px] text-[14px] font-[600] border border-[#00AEEF] text-[#00AEEF] hover:bg-[#00AEEF]/10 hover:shadow-[0_0_40px_rgba(0,174,239,0.35)] transition-all">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 12H5M12 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Voltar ao Hub
            </Link>
          </div>
        </nav>
      </header>

      {/* Main Content (Boxed) */}
      <main className="flex-1 max-w-[1400px] w-full mx-auto p-6 sm:p-10 flex flex-col gap-6">
        
        {/* Painel de Controle (Top) */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 border-b border-white/10 pb-6">
          <div>
            <div className="text-xs font-semibold tracking-widest text-primary uppercase">AMBIENTE SEGURO</div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mt-1">{roomName}</h1>
          </div>
          
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setLightOn(!lightOn)}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-lg font-medium text-sm transition-all border ${lightOn ? 'bg-white text-black border-white' : 'bg-transparent text-white border-white/20 hover:bg-white/5'}`}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
              {lightOn ? 'Luz Ligada' : 'Luz Desligada'}
            </button>
            <button 
              onClick={() => setAcOn(!acOn)}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-lg font-medium text-sm transition-all border ${acOn ? 'bg-[#2b86ff] text-white border-[#2b86ff]' : 'bg-transparent text-white border-white/20 hover:bg-white/5'}`}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="2" x2="12" y2="22"/><line x1="5.66" y1="5.66" x2="18.34" y2="18.34"/><line x1="4" y1="12" x2="20" y2="12"/><line x1="5.66" y1="18.34" x2="18.34" y2="5.66"/></svg>
              {acOn ? 'Ar Ligado' : 'Ar Desligado'}
            </button>
          </div>
        </div>

        {/* Container do Canvas (Boxed) */}
        <div className="relative w-full flex-1 min-h-[600px] border border-primary/30 rounded-2xl overflow-hidden bg-gradient-to-b from-slate-900/40 to-slate-950/60 shadow-[inset_0_0_40px_rgba(0,0,0,0.5)]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,174,239,0.1)_0%,transparent_60%)] pointer-events-none z-0"></div>
          
          <div className="absolute inset-0 z-10">
            <DigitalTwin lightOn={lightOn} acOn={acOn} />
          </div>

          {/* Telemetria Simplificada Overlay */}
          <div className="absolute bottom-6 right-6 z-20 bg-black/60 backdrop-blur-md border border-white/10 p-4 rounded-xl flex items-center gap-6">
            <div>
              <div className="text-[10px] text-gray-400 uppercase tracking-widest mb-0.5">Temp</div>
              <div className="text-xl font-bold text-white">{acOn ? "21.0" : "27.5"}°C</div>
            </div>
            <div className="w-px h-8 bg-white/20"></div>
            <div>
              <div className="text-[10px] text-gray-400 uppercase tracking-widest mb-0.5">Consumo</div>
              <div className="text-xl font-bold text-white">{lightOn && acOn ? "1.24" : (lightOn ? "0.15" : (acOn ? "1.09" : "0.00"))} kW</div>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}
