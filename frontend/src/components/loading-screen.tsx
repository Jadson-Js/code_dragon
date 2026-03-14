export function LoadingScreen() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-bg-1 selection:bg-primary/30">
      <div className="flex flex-col items-center gap-12 animate-in fade-in slide-in-from-bottom-4 duration-1000">
        {/* Logo Container com um brilho super suave e elegante */}
        <div className="relative flex items-center justify-center">
          <div className="absolute w-32 h-32 bg-primary/10 rounded-full blur-2xl animate-pulse" />
          <img
            src="/logo.svg"
            alt="Code Dragon Logo"
            className=" object-contain relative z-10 drop-shadow-2xl"
          />
        </div>

        {/* Indicador de Carregamento Refinado */}
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 rounded-full border-2 border-t-bg-1 animate-spin border-white-1 " />
          <p className="typ-h3 text-white-2">Iniciando</p>
        </div>
      </div>
    </div>
  );
}
