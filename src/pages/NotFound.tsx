import { Link } from 'react-router-dom';
import { Terminal, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-cyber-bg flex flex-col items-center justify-center font-mono text-center px-4 relative">
      {/* Background Dot Grid */}
      <div className="absolute inset-0 dot-grid opacity-20 pointer-events-none"></div>
      
      <div className="relative z-10 space-y-6 max-w-md">
        <div className="w-16 h-16 bg-cyber-orange/10 border border-cyber-orange/40 rounded flex items-center justify-center mx-auto mb-4">
          <Terminal className="w-8 h-8 text-cyber-orange animate-pulse" />
        </div>
        
        <div className="space-y-2">
          <h1 className="text-4xl font-extrabold text-white tracking-wider">ERROR_404</h1>
          <p className="text-xs text-cyber-orange uppercase tracking-widest font-bold">
            [ ROUTE_RESOLUTION_FAILED ]
          </p>
        </div>
        
        <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
          The requested system node coordinate does not exist. The memory address may have been relocated or purged from active sectors.
        </p>
        
        <div className="pt-4">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-cyber-teal text-cyber-bg font-bold rounded hover:bg-white hover:shadow-[0_0_15px_rgba(0,242,254,0.4)] transition-all duration-300"
          >
            <ArrowLeft className="w-4 h-4" />
            RETURN_TO_HOME_SECTOR
          </Link>
        </div>
      </div>
    </div>
  );
}
