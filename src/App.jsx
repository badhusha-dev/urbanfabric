import React, { useEffect, useState, useRef } from 'react';
import TshirtDesigner from './components/TshirtDesigner';
import Logo from './components/Logo';
import { ShoppingCart, Menu, ChevronDown, Rocket, Shield, Globe } from 'lucide-react';

const Background = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', resize);
    resize();

    const particles = Array.from({ length: 150 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 2,
      velocity: (Math.random() - 0.5) * 0.5,
    }));

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = 'rgba(0, 255, 163, 0.4)';
      particles.forEach(p => {
        p.y -= p.velocity + 0.1;
        if (p.y < 0) p.y = canvas.height;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      });
      animationFrameId = requestAnimationFrame(render);
    };
    render();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none">
      <canvas ref={canvasRef} className="w-full h-full opacity-30" />
      <div className="absolute inset-0 bg-[#020202] mix-blend-multiply" />
      {/* Background Parallax text */}
      <div className="absolute inset-0 flex items-center justify-center -z-10 opacity-[0.02] select-none pointer-events-none font-hero text-[18vw] font-black uppercase tracking-tighter">
        URBAN FABRIC
      </div>
    </div>
  );
};

const CustomCursor = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    const onMouseMove = (e) => setPosition({ x: e.clientX, y: e.clientY });
    const onMouseOver = (e) => { if (e.target.closest('button, a, input, [role="button"]')) setHovered(true); };
    const onMouseOut = (e) => { if (e.target.closest('button, a, input, [role="button"]')) setHovered(false); };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseover', onMouseOver);
    window.addEventListener('mouseout', onMouseOut);
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseover', onMouseOver);
      window.removeEventListener('mouseout', onMouseOut);
    };
  }, []);

  return (
    <div 
      className={`fixed top-0 left-0 pointer-events-none z-[10000] -translate-x-1/2 -translate-y-1/2 rounded-full transition-all duration-300 mix-blend-difference flex items-center justify-center font-hero text-[10px] font-bold text-black
        ${hovered ? 'w-24 h-24 bg-white' : 'w-4 h-4 bg-neon-blue'}
      `}
      style={{ transform: `translate3d(${position.x}px, ${position.y}px, 0)` }}
    >
      {hovered && <span>VIEW</span>}
    </div>
  );
};

const App = () => {
  return (
    <div id="app" className="relative min-h-screen">
      <CustomCursor />
      <Background />
      <div id="noise-overlay" />
      <div className="vignette" />

      {/* Header */}
      <header className="fixed top-0 left-0 w-full z-50 p-8 flex justify-between items-center bg-transparent backdrop-blur-sm lg:backdrop-blur-none transition-all duration-500">
        <Logo />
        <nav className="hidden lg:flex items-center gap-12 text-[11px] font-hero tracking-[0.3em] uppercase text-white/60">
           <a href="#lab" className="hover:text-neon-green transition-all">Forge</a>
           <a href="#collection" className="hover:text-neon-green transition-all">Vault</a>
           <a href="#tech" className="hover:text-neon-green transition-all">Specs</a>
           <ShoppingCart size={18} className="text-white hover:text-neon-green cursor-pointer" />
        </nav>
        <div className="lg:hidden p-2 rounded-xl bg-white/5 border border-white/5">
          <Menu size={24} />
        </div>
      </header>

      {/* Hero Section */}
      <section className="min-h-screen relative flex flex-col items-center justify-center px-8 lg:px-20 overflow-hidden">
        <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-2 items-center gap-20">
          <div className="z-10 text-center lg:text-left">
            <h1 className="font-hero text-7xl lg:text-9xl font-black leading-[0.85] uppercase -ml-1 text-transparent bg-clip-text bg-gradient-to-br from-white via-white to-neon-green drop-shadow-[0_0_30px_rgba(0,255,163,0.3)] animate-in fade-in slide-in-from-bottom-8 duration-1000">
              URBAN<br />FABRIC.
            </h1>
            <p className="mt-8 font-hero text-neon-blue text-sm lg:text-lg tracking-[0.6em] uppercase opacity-80 animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-300">
              WEAR YOUR IDENTITY
            </p>
            <div className="mt-12 flex flex-col sm:flex-row items-center gap-6 animate-in fade-in slide-in-from-bottom-16 duration-1000 delay-500">
               <a href="#lab" className="px-10 py-5 bg-white text-black font-hero font-bold tracking-widest text-xs uppercase rounded-full hover:scale-105 active:scale-95 transition-all shadow-[0_0_30px_rgba(255,255,255,0.3)] hover:shadow-neon-green/30">
                  Enter The Forge
               </a>
               <div className="flex items-center gap-2 text-xs font-hero tracking-widest text-white/40 border-b border-white/10 pb-1 cursor-pointer hover:text-white transition-all">
                  CORE TECH SPECS <ChevronDown size={14} className="animate-bounce mt-1" />
               </div>
            </div>
          </div>

          <div className="relative group perspective-1000">
            <div className="absolute inset-0 bg-radial-gradient from-neon-blue/10 to-transparent blur-3xl opacity-30 group-hover:opacity-50 transition-all duration-1000 animate-pulse-slow" />
            <img 
              src="/hero-tshirt.png" 
              alt="Floating Tshirt" 
              className="relative w-full max-w-[600px] z-10 floating-slow drop-shadow-3xl transform transition-all duration-700 hover:rotate-3"
            />
          </div>
        </div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 opacity-40">
           <div className="w-1 h-12 bg-gradient-to-b from-transparent via-white to-transparent" />
           <span className="text-[10px] font-hero uppercase tracking-[0.5em] rotate-180 [writing-mode:vertical-lr]">DRAG TO EXPLORE</span>
        </div>
      </section>

      {/* Customization Lab - THE FORGE */}
      <section id="lab" className="min-h-screen py-32 px-8 flex flex-col items-center justify-center relative overflow-hidden">
        <div className="mb-20 text-center">
          <h2 className="font-hero text-4xl lg:text-6xl uppercase tracking-[0.3em] font-black opacity-100 italic">The Forge</h2>
          <div className="h-1 w-20 bg-neon-green mx-auto mt-6 shadow-[0_0_15px_#00ffa3]" />
        </div>
        
        <TshirtDesigner />

        {/* Floating background decorations */}
        <div className="absolute top-1/4 -left-20 w-80 h-80 bg-neon-blue/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-neon-green/5 rounded-full blur-[100px]" />
      </section>

      {/* Specs / Features Grid */}
      <section id="tech" className="py-32 px-8 bg-white/[0.01]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
           {[
             { icon: <Rocket className="text-neon-green" />, title: 'Urban Fit', desc: 'Sustainably engineered for the modern streetwear enthusiast.' },
             { icon: <Shield className="text-neon-blue" />, title: 'Premium Fabric', desc: 'Hand-selected premium cotton blends for maximum comfort.' },
             { icon: <Globe className="text-white" />, title: 'Ethical Origin', desc: '100% transparent supply chain and eco-friendly manufacturing.' }
           ].map((item, i) => (
             <div key={i} className="p-12 rounded-[40px] bg-white/5 border border-white/5 hover:border-white/10 transition-all group">
                <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center mb-8 group-hover:scale-110 transition-all duration-500">
                  {item.icon}
                </div>
                <h3 className="font-hero text-xl uppercase tracking-widest mb-4">{item.title}</h3>
                <p className="text-sm text-white/40 leading-relaxed font-light">{item.desc}</p>
             </div>
           ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="p-20 text-center border-t border-white/5 opacity-50 flex flex-col items-center gap-10">
        <Logo variant="white" className="scale-75 opacity-50 grayscale hover:grayscale-0 transition-all" />
        <span className="font-hero text-[10px] uppercase tracking-[1em] mb-4">© 2026 URBAN FABRIC • WEAR YOUR IDENTITY</span>
        <div className="flex gap-12 text-[9px] font-hero uppercase tracking-[0.4em] opacity-60">
           <a href="#" className="hover:text-neon-green transition-all">Privacy</a>
           <a href="#" className="hover:text-neon-green transition-all">Terms</a>
           <a href="#" className="hover:text-neon-green transition-all">Wholesale</a>
        </div>
      </footer>
    </div>
  );
};

export default App;
