"use client";

import { useState } from "react";
import DigitalTwin from "@/components/DigitalTwin";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";

const ROOM_NAMES: Record<string, string> = {
  "suite-presidencial": "Suíte Presidencial",
  "quarto-deluxe": "Quarto Deluxe",
  lobby: "Lobby Principal",
};

function calcPower(lightOn: boolean, acOn: boolean) {
  if (lightOn && acOn) return "1.24";
  if (lightOn) return "0.15";
  if (acOn) return "1.09";
  return "0.00";
}

export default function RoomDashboard() {
  const params = useParams();
  const searchParams = useSearchParams();
  const userName = searchParams.get("user") || "usuario@hotel.com";
  const returnUrl = searchParams.get("returnUrl") || "/";
  const roomId = params.id as string;
  const roomName = ROOM_NAMES[roomId] || "Ambiente";
  const [lightOn, setLightOn] = useState(true);
  const [acOn, setAcOn] = useState(false);

  return (
    <div className="flex flex-col min-h-screen bg-[#08080b]">
      <header className="sticky top-0 z-50 h-[72px] backdrop-blur-md bg-[#0b1120]/80 border-b border-[#1E293B]">
        <nav className="max-w-[1400px] mx-auto px-6 h-full flex items-center justify-between gap-6">
          <Link href="/" className="flex items-center gap-2.5 font-extrabold text-[22px] text-white tracking-[-0.02em] hover:opacity-80 transition-opacity">
            <svg className="w-[34px] h-[34px] text-[#00AEEF]" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
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
            <span className="text-[#94A3B8] text-sm mr-4 hidden sm:block">{userName}</span>
            <Link
              href={`/?user=${encodeURIComponent(userName)}&returnUrl=${encodeURIComponent(returnUrl)}`}
              className="inline-flex items-center gap-2 px-[18px] py-[10px] rounded-[10px] text-sm font-semibold border border-[#00AEEF] text-[#00AEEF] hover:bg-[#00AEEF]/10 transition-all"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 12H5M12 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Voltar ao hub
            </Link>
          </div>
        </nav>
      </header>
      <main className="flex-1 max-w-[1400px] w-full mx-auto p-6 sm:p-10 flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 border-b border-white/10 pb-6">
          <div>
            <div className="text-xs font-semibold tracking-widest text-primary uppercase">Ambiente monitorado</div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mt-1">{roomName}</h1>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setLightOn((v) => !v)}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-medium border transition-all ${lightOn ? "bg-white text-black border-white" : "bg-transparent text-white border-white/20 hover:bg-white/5"}`}
            >
              {lightOn ? "Luz ligada" : "Luz desligada"}
            </button>
            <button
              onClick={() => setAcOn((v) => !v)}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-medium border transition-all ${acOn ? "bg-[#2b86ff] text-white border-[#2b86ff]" : "bg-transparent text-white border-white/20 hover:bg-white/5"}`}
            >
              {acOn ? "Ar ligado" : "Ar desligado"}
            </button>
          </div>
        </div>
        <div className="relative w-full flex-1 min-h-[600px] border border-primary/30 rounded-2xl overflow-hidden bg-gradient-to-b from-slate-900/40 to-slate-950/60">
          <div className="absolute inset-0 z-10">
            <DigitalTwin lightOn={lightOn} acOn={acOn} />
          </div>
          <div className="absolute bottom-6 right-6 z-20 bg-black/60 backdrop-blur-md border border-white/10 p-4 rounded-xl flex items-center gap-6">
            <div>
              <div className="text-[10px] text-gray-400 uppercase tracking-widest mb-0.5">Temperatura</div>
              <div className="text-xl font-bold text-white">{acOn ? "21.0" : "27.5"}°C</div>
            </div>
            <div className="w-px h-8 bg-white/20" />
            <div>
              <div className="text-[10px] text-gray-400 uppercase tracking-widest mb-0.5">Consumo</div>
              <div className="text-xl font-bold text-white">{calcPower(lightOn, acOn)} kW</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
