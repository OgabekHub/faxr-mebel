import React from 'react';
import { ErrorBoundary as ReactErrorBoundary } from 'react-error-boundary';

const ErrorFallback = ({ error, resetErrorBoundary }: any) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-background text-center">
      <div className="bento-card p-8 max-w-lg border-red-500/20 glow-tracer">
        <h2 className="text-2xl font-editorial-title font-bold text-red-500 mb-4">Xatolik yuz berdi!</h2>
        <p className="text-foreground/60 text-xs mb-6">
          Ilovada kutilmagan xatolik yuz berdi. Iltimos, sahifani yangilang yoki asosiy sahifaga qayting.
        </p>
        <pre className="text-left text-[10px] text-red-400 bg-red-500/10 p-4 rounded-xl overflow-auto mb-6">
          {error.message}
        </pre>
        <div className="flex gap-4 justify-center">
          <button 
            onClick={resetErrorBoundary}
            className="px-6 py-3 bg-brand-gold text-black rounded-xl text-xs font-bold uppercase tracking-widest hover:scale-105 transition-all duration-500 ease-out duration-500 ease-out"
          >
            Qayta urinish
          </button>
          <a 
            href="/"
            className="px-6 py-3 bg-foreground/10 text-foreground rounded-xl text-xs font-bold uppercase tracking-widest hover:scale-105 transition-all duration-500 ease-out duration-500 ease-out"
          >
            Bosh sahifa
          </a>
        </div>
      </div>
    </div>
  );
};

export const ErrorBoundary = ({ children }: { children: React.ReactNode }) => {
  return (
    <ReactErrorBoundary FallbackComponent={ErrorFallback}>
      {children}
    </ReactErrorBoundary>
  );
};
