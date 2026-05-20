import Link from "next/link";
import Image from "next/image";

export default function HubCentral() {
  const rooms = [
    {
      id: "suite-presidencial",
      name: "Suíte Presidencial",
      status: "Sistema Online",
      statusColor: "bg-green-500",
      image: "/images/suite.png",
      border: "border-primary/30"
    },
    {
      id: "quarto-deluxe",
      name: "Quarto Deluxe",
      status: "Modo Standby",
      statusColor: "bg-yellow-500",
      image: "/images/deluxe.png",
      border: "border-white/10"
    },
    {
      id: "lobby",
      name: "Lobby Principal",
      status: "Desconectado",
      statusColor: "bg-red-500",
      image: "/images/lobby.png",
      border: "border-white/10"
    }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-[#08080b]">
      {/* Header Corporativo (Padrão dashboard.html) */}
      <header className="sticky top-0 z-50 h-[72px] backdrop-blur-md bg-[#0b1120]/80 border-b border-[#1E293B]">
        <nav className="max-w-[1400px] mx-auto px-6 h-full flex items-center justify-between gap-6">
          <Link href="/" className="flex items-center gap-2.5 font-extrabold text-[22px] text-white tracking-[-0.02em]">
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
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                <polyline points="16 17 21 12 16 7"></polyline>
                <line x1="21" y1="12" x2="9" y2="12"></line>
              </svg>
              Sair
            </Link>
          </div>
        </nav>
      </header>

      {/* Main Content (Boxed) */}
      <main className="flex-1 max-w-[1400px] w-full mx-auto p-6 sm:p-10 flex flex-col gap-8">
        <div className="flex flex-col gap-2 border-b border-white/10 pb-8">
          <div className="text-xs font-semibold tracking-widest text-[#00AEEF] uppercase">Portfólio Hélix</div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">Selecione o Gêmeo Digital</h1>
        </div>

        {/* Grid de Quartos Padrão Corporativo com Fotos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rooms.map((room) => (
            <Link 
              href={`/room/${room.id}`} 
              key={room.id}
              className={`group relative h-80 rounded-2xl overflow-hidden border ${room.border} flex flex-col justify-end p-6 transition-all hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(0,174,239,0.15)] cursor-pointer bg-slate-900`}
            >
              {/* Imagem de Fundo Renderizada */}
              <Image 
                src={room.image}
                alt={room.name}
                fill
                className="object-cover opacity-60 group-hover:opacity-40 transition-opacity duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-[#0f172a]/40 to-transparent"></div>
              
              <div className="absolute top-4 left-4 flex items-center gap-2 bg-black/50 backdrop-blur px-3 py-1.5 rounded-full border border-white/10">
                <span className={`w-2 h-2 rounded-full ${room.statusColor} ${room.status === 'Sistema Online' ? 'animate-pulse' : ''}`}></span>
                <span className="text-[10px] uppercase font-bold tracking-wider text-gray-300">{room.status}</span>
              </div>

              <div className="relative z-10">
                <h3 className="text-2xl font-bold text-white mb-1 drop-shadow-md">{room.name}</h3>
                <p className="text-sm text-gray-300 group-hover:text-white transition-colors">Clique para abrir o painel 3D</p>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
