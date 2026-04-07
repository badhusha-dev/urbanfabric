import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Rnd } from 'react-rnd';
import { 
  Trash2, Type, Image as ImageIcon, ArrowUp, ArrowDown, 
  RotateCw, GripVertical, Settings, Layers, Shapes, 
  Download, Eye, Lock, Unlock, EyeOff, Minus, Plus, 
  ShoppingCart, CheckCircle2, X, ChevronRight, Package, 
  CreditCard, Truck, User, ArrowLeft, Camera, MessageCircle, 
  UserPlus, Command, Zap, Star, RefreshCcw, Info, InfoIcon, 
  ExternalLink, ZoomIn, ZoomOut, Maximize2, Sparkles
} from 'lucide-react';
import html2canvas from 'html2canvas';

const FONTS = ['Orbitron', 'Inter', 'Bungee', 'Satisfy', 'Bebas Neue', 'Outfit'];
const SIZES = ['S', 'M', 'L', 'XL', 'XXL'];
const DEPLOYMENT_WINDOW = "3–5 Days India-Wide";

const COLOR_VARIANTS = [
  { id: 'white', name: 'Solar White', hex: '#ffffff', image: '/tshirts/tshirt-white.png', backImage: '/tshirts/tshirt-white-back.png', popular: true },
  { id: 'black', name: 'Pure Void', hex: '#0a0a0a', image: '/tshirts/tshirt-black.png', backImage: '/tshirts/tshirt-white-back.png', popular: true, dark: true },
  { id: 'grey', name: 'Atomic Grey', hex: '#888888', image: '/tshirts/tshirt-grey.png', backImage: '/tshirts/tshirt-white-back.png' },
  { id: 'red', name: 'Pulse Red', hex: '#ff3b3b', image: '/tshirts/tshirt-red.png', backImage: '/tshirts/tshirt-white-back.png' },
  { id: 'blue', name: 'Cyber Blue', hex: '#00e5ff', image: '/tshirts/tshirt-blue.png', backImage: '/tshirts/tshirt-white-back.png' },
  { id: 'green', name: 'Neon Green', hex: '#00ff88', image: '/tshirts/tshirt-green.png', backImage: '/tshirts/tshirt-white-back.png' },
  { id: 'yellow', name: 'Solar Yellow', hex: '#ffe100', image: '/tshirts/tshirt-yellow.png', backImage: '/tshirts/tshirt-white-back.png' },
  { id: 'orange', name: 'Solar Orange', hex: '#ff9933', image: '/tshirts/tshirt-orange.png', backImage: '/tshirts/tshirt-white-back.png' },
  { id: 'maroon', name: 'Imperial Maroon', hex: '#800000', image: '/tshirts/tshirt-maroon.png', backImage: '/tshirts/tshirt-white-back.png', dark: true },
  { id: 'navy', name: 'Royal Navy', hex: '#000080', image: '/tshirts/tshirt-navy.png', backImage: '/tshirts/tshirt-white-back.png', popular: true, dark: true },
  { id: 'pink', name: 'Pastel Rose', hex: '#ffb7b7', image: '/tshirts/tshirt-pink.png', backImage: '/tshirts/tshirt-white-back.png' }
];

const TshirtDesigner = () => {
  // Global View State
  const [activeSide, setActiveSide] = useState('front'); // 'front' | 'back'
  const [activeColor, setActiveColor] = useState(COLOR_VARIANTS[0]);
  const [hoverColor, setHoverColor] = useState(null);
  
  // Element State (Split architecture)
  const [frontElements, setFrontElements] = useState([]);
  const [backElements, setBackElements] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  
  // UI State
  const [activeTab, setActiveTab] = useState('text');
  const [gridVisible, setGridVisible] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  
  // Order State
  const [size, setSize] = useState('M');
  const [quantity, setQuantity] = useState(1);
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [currentView, setCurrentView] = useState('editor'); // editor | checkout
  const [previewSubject, setPreviewSubject] = useState('female');

  const stageRef = useRef(null);

  // Computed Elements based on active view
  const currentElements = activeSide === 'front' ? frontElements : backElements;
  const setCurrentElements = activeSide === 'front' ? setFrontElements : setBackElements;
  
  // -- PRICING ENGINE --
  const basePrice = 999;
  const pricing = useMemo(() => {
    let elementsCost = (frontElements.length + backElements.length) * 100;
    let multicolorBonus = (frontElements.length + backElements.length) > 2 ? 150 : 0;
    let backBonus = backElements.length > 0 ? 300 : 0; // Printing on both sides cost more
    return {
       base: basePrice,
       elements: elementsCost,
       special: multicolorBonus + backBonus,
       total: (basePrice + elementsCost + multicolorBonus + backBonus) * quantity
    };
  }, [frontElements, backElements, quantity]);

  // -- SMART CONTRAST AGENT --
  const contrastWarning = useMemo(() => {
    const selected = currentElements.find(el => el.id === selectedId);
    if (!selected || selected.type !== 'text') return null;
    const isDarkShirt = activeColor.dark;
    const isDarkText = ['#000000', '#000080', '#800000'].includes(selected.color);
    const isLightText = ['#ffffff', '#00e5ff', '#00ff88', '#ffe100', '#ffb7b7'].includes(selected.color);
    
    if (isDarkShirt && isDarkText) return "LOW CONTRAST: Use lighter font for better visibility.";
    if (!isDarkShirt && isLightText && activeColor.id === 'white') return "LOW CONTRAST: Use darker font on light base.";
    return null;
  }, [selectedId, activeColor, currentElements]);

  // Designer Logic
  const addElement = (type) => {
    const isDark = activeColor.dark;
    const newEl = {
      id: Date.now(),
      type,
      content: type === 'text' ? 'URBAN FABRIC' : 'https://api.dicebear.com/7.x/pixel-art/svg?seed=URBAN_FABRIC',
      x: 75, y: 100,
      width: 120, height: 40,
      fontSize: 22,
      fontFamily: 'Orbitron',
      fontWeight: '900',
      color: isDark ? '#ffffff' : '#000000',
      rotate: 0, opacity: 1, zIndex: currentElements.length + 1,
      visible: true
    };
    if (type === 'image') { newEl.width = 100; newEl.height = 100; }
    setCurrentElements([...currentElements, newEl]);
    setSelectedId(newEl.id);
  };

  const updateElement = (id, updates) => setCurrentElements(currentElements.map(el => el.id === id ? { ...el, ...updates } : el));
  const deleteElement = (id) => {
    setCurrentElements(currentElements.filter(el => el.id !== (id || selectedId)));
    if (selectedId === (id || selectedId)) setSelectedId(null);
  };

  const addToCart = async () => {
    if (frontElements.length === 0 && backElements.length === 0) return;
    setIsExporting(true);
    setSelectedId(null);
    setTimeout(async () => {
      const canvas = await html2canvas(stageRef.current, { backgroundColor: null, scale: 0.8 });
      const designPreview = canvas.toDataURL('image/png');
      const cartItem = {
         id: Date.now(),
         designImage: designPreview,
         color: activeColor.name,
         colorHex: activeColor.hex,
         size,
         quantity,
         price: pricing.total,
         frontCount: frontElements.length,
         backCount: backElements.length
      };
      setCart([...cart, cartItem]);
      setIsExporting(false);
      setShowCart(true);
    }, 300);
  };

  return (
    <div className="w-full max-w-7xl mx-auto flex flex-col gap-8 text-white relative">
      
      {/* Premium Regional Navigation */}
      <div className="flex justify-between items-end gap-10 px-4 border-b border-white/5 pb-10">
         <div>
            <h2 className="text-6xl font-hero font-black tracking-tighter uppercase leading-none mb-4">Forge <span className="text-neon-green">Master IN</span></h2>
            <div className="flex items-center gap-5">
               <span className="px-4 py-2 bg-white/5 rounded-full text-[9px] font-hero tracking-widest text-neon-blue font-bold uppercase">{DEPLOYMENT_WINDOW}</span>
               <div className="flex -space-x-4">
                  {[1,2,3].map(i => <div key={i} className="w-8 h-8 rounded-full border-2 border-black bg-white/10 overflow-hidden"><img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i * 123}`} /></div>)}
                  <div className="w-8 h-8 rounded-full border-2 border-black bg-neon-green flex items-center justify-center text-[8px] font-black text-black">4k+</div>
               </div>
            </div>
         </div>
         
         <div className="flex items-center gap-6">
            <button onClick={() => window.open(`https://wa.me/91XXXXXXXXXX?text=Forge-Inquiry: Custom Allocation`)} className="px-8 py-5 bg-[#25D366]/10 text-[#25D366] border border-[#25D366]/10 rounded-[28px] hover:bg-[#25D366]/20 transition-all font-hero text-[11px] uppercase tracking-widest flex items-center gap-3">
               <MessageCircle size={18} /> Direct Support
            </button>
            <button onClick={() => setShowCart(true)} className="relative p-7 bg-white/5 rounded-[32px] border border-white/5 hover:border-white/20 transition-all group shadow-2xl">
               <ShoppingCart size={24} className="group-hover:scale-110 transition-transform" />
               {cart.length > 0 && <span className="absolute -top-1 -right-1 w-7 h-7 bg-white text-black text-[11px] font-black rounded-full flex items-center justify-center shadow-neon">{cart.length}</span>}
            </button>
         </div>
      </div>

      {currentView === 'editor' ? (
        <div className="flex flex-col xl:flex-row gap-6 bg-white/5 backdrop-blur-[120px] p-6 lg:p-12 rounded-[80px] border border-white/5 shadow-inner overflow-hidden relative">
          
          {/* Tool Selector */}
          <div className="flex xl:flex-col gap-4 z-20 pb-4 xl:pb-0 scrollbar-hide overflow-x-auto">
            {[
              { id: 'text', icon: <Type size={24}/>, label: 'Text' },
              { id: 'graphics', icon: <Shapes size={24}/>, label: 'Graphics' },
              { id: 'layers', icon: <Layers size={24}/>, label: 'Queue' },
              { id: 'allocation', icon: <Zap size={24}/>, label: 'Alloc' },
              { id: 'config', icon: <Command size={24}/>, label: 'Visual' }
            ].map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex flex-col items-center justify-center p-6 min-w-[100px] rounded-[44px] transition-all duration-700 ${activeTab === tab.id ? 'bg-white text-black shadow-3xl scale-105' : 'bg-white/5 text-white/30 hover:bg-white/10'}`}>
                 {tab.icon}
                 <span className="text-[10px] mt-3 font-hero uppercase tracking-[0.2em]">{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Designer Main Stage */}
          <div className="flex-1 min-h-[800px] bg-black rounded-[72px] border border-white/5 relative overflow-hidden flex items-center justify-center group shadow-2xl">
             
             {/* Dual View Toggle */}
             <div className="absolute top-10 left-1/2 -translate-x-1/2 z-30 flex p-2 bg-white/5 backdrop-blur-3xl rounded-[32px] border border-white/5 shadow-2xl">
                <button onClick={() => setActiveSide('front')} className={`px-10 py-5 rounded-[28px] text-[11px] font-hero uppercase tracking-widest transition-all duration-500 font-black ${activeSide === 'front' ? 'bg-white text-black shadow-neon-white' : 'text-white/40 hover:text-white'}`}>Front</button>
                <button onClick={() => setActiveSide('back')} className={`px-10 py-5 rounded-[28px] text-[11px] font-hero uppercase tracking-widest transition-all duration-500 font-black ${activeSide === 'back' ? 'bg-white text-black shadow-neon-white' : 'text-white/40 hover:text-white'}`}>Back</button>
             </div>

             {/* UI Feedback Overlays */}
             <div className="absolute top-12 left-12 z-20 flex flex-col gap-4">
                <div className="px-8 py-4 bg-black/60 border border-white/5 rounded-full backdrop-blur-3xl flex items-center gap-4 animate-in slide-in-from-left-8 duration-700 shadow-xl">
                   <div className="w-3 h-3 rounded-full animate-pulse" style={{ backgroundColor: (hoverColor || activeColor).hex }} />
                   <span className="text-[10px] font-hero uppercase tracking-[0.3em] font-black">Variant: {(hoverColor || activeColor).name}</span>
                </div>
                {contrastWarning && (
                   <div className="px-8 py-4 bg-orange-500/10 border border-orange-500/20 text-orange-400 rounded-full backdrop-blur-3xl flex items-center gap-3 animate-in fade-in duration-500">
                      <Info size={14} />
                      <span className="text-[9px] font-hero uppercase tracking-widest font-black leading-none">{contrastWarning}</span>
                   </div>
                )}
             </div>

             {/* Stage Toolbar */}
             <div className="absolute top-12 right-12 flex gap-4 z-20 opacity-0 group-hover:opacity-100 transition-all duration-1000 scale-90 group-hover:scale-100">
                <button onClick={() => setShowPreview(true)} className="flex items-center gap-4 px-10 py-6 bg-neon-blue text-black border border-neon-blue rounded-[32px] text-[12px] font-hero uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-neon font-black">
                   <Maximize2 size={20} /> Reality Previz
                </button>
                <button onClick={() => setGridVisible(!gridVisible)} className={`p-6 rounded-[32px] border border-white/10 transition-all ${gridVisible ? 'bg-white text-black' : 'bg-white/5 text-white/30'}`}>
                   <GripVertical size={24} />
                </button>
             </div>

             {/* Base Rendering Engine */}
             <div ref={stageRef} className="relative w-full max-w-[650px] h-full flex justify-center items-center">
                {imageLoading && <div className="absolute inset-0 z-40 bg-black/20 backdrop-blur-sm animate-pulse rounded-[72px]" />}
                
                <div className={`relative w-full h-[750px] flex items-center justify-center transition-all duration-1000 ${imageLoading ? 'opacity-20 translate-y-8 blur-3xl' : 'opacity-100 translate-y-0 blur-0'}`}>
                   <img 
                      src={activeSide === 'front' ? activeColor.image : activeColor.backImage} 
                      className="w-full h-full object-contain pointer-events-none drop-shadow-[0_80px_120px_rgba(0,0,0,1)]" 
                      onLoad={() => setImageLoading(false)}
                   />
                </div>
                
                {/* Master Mapping Overlay */}
                <div className={`absolute top-[28%] left-1/2 -translate-x-1/2 w-[260px] h-[240px] border border-dashed rounded-[48px] transition-all duration-1000
                   ${gridVisible ? 'border-neon-green bg-neon-green/5 scale-100' : 'border-white/5 scale-[0.98]'}
                `}>
                   {gridVisible && <div className="absolute inset-0 pointer-events-none opacity-5 bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:16px_16px]" />}
                   
                   {currentElements.filter(el => el.visible).map(el => (
                      <Rnd
                         key={`${activeSide}-${el.id}`}
                         size={{ width: el.width, height: el.height }}
                         position={{ x: el.x, y: el.y }}
                         onDragStop={(e, d) => updateElement(el.id, { x: d.x, y: d.y })}
                         onResizeStop={(e, dir, ref, del, pos) => updateElement(el.id, { width: ref.offsetWidth, height: ref.offsetHeight, ...pos })}
                         bounds="parent"
                         onDragStart={() => setSelectedId(el.id)}
                         style={{ 
                            zIndex: el.zIndex, 
                            mixBlendMode: activeColor.id === 'white' ? 'multiply' : 'screen',
                            filter: activeColor.dark ? 'contrast(1.2) brightness(1.1)' : 'none'
                         }}
                      >
                         <div style={{ transform: `rotate(${el.rotate || 0}deg)`, opacity: el.opacity }} className="w-full h-full flex items-center justify-center transition-all duration-300 relative">
                            {el.type === 'text' ? (
                               <div style={{ fontSize: `${el.fontSize}px`, color: el.color, fontFamily: el.fontFamily, fontWeight: el.fontWeight }} className="w-full h-full flex items-center justify-center select-none text-center break-words leading-none px-4 uppercase tracking-tighter">
                                  {el.content}
                               </div>
                            ) : (
                               <img src={el.content} className="w-full h-full object-contain pointer-events-none select-none drop-shadow-2xl" />
                            )}
                         </div>
                         {selectedId === el.id && (
                            <>
                               <div className="absolute -top-10 left-1/2 -translate-x-1/2 p-3 rounded-full bg-white text-black shadow-3xl z-50 cursor-pointer hover:rotate-90 transition-all duration-700" onMouseDown={(e) => { e.stopPropagation(); updateElement(el.id, { rotate: (el.rotate || 0) + 45 }); }}>
                                  <RotateCw size={18} />
                               </div>
                               <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 p-3 rounded-full bg-red-500 text-white shadow-3xl z-50 cursor-pointer hover:scale-110 transition-all" onClick={() => deleteElement(el.id)}>
                                  <Trash2 size={16} />
                               </div>
                            </>
                         )}
                      </Rnd>
                   ))}
                </div>
             </div>

             {/* Side Indicators */}
             <div className="absolute bottom-10 inset-x-10 flex justify-between items-center px-10 pointer-events-none">
                <span className="text-[10px] font-hero opacity-10 uppercase tracking-[1em]">{activeSide.toUpperCase()}_ARRAY_ACTIVE</span>
                <div className="w-20 h-px bg-white/10" />
                <span className="text-[10px] font-hero opacity-10 uppercase tracking-[1em]">ID_PROTO_{activeColor.id.toUpperCase()}</span>
             </div>
          </div>

          {/* Commander Sidebar */}
          <div className="w-full xl:w-[480px] flex flex-col gap-10">
             <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-12">
                
                {activeTab === 'config' && (
                   <div className="space-y-12 animate-in slide-in-from-right-10 duration-700">
                      <div>
                         <h3 className="text-[11px] font-hero uppercase tracking-[0.5em] opacity-30 mb-8 font-black">Base Fabric Spectrum</h3>
                         <div className="grid grid-cols-2 gap-5">
                            {COLOR_VARIANTS.map(v => (
                               <button 
                                  key={v.id} 
                                  onMouseEnter={() => setHoverColor(v)}
                                  onMouseLeave={() => setHoverColor(null)}
                                  onClick={() => { setActiveColor(v); setImageLoading(true); }}
                                  className={`group relative p-2 rounded-[40px] border-2 transition-all duration-1000 overflow-hidden text-left
                                    ${activeColor.id === v.id ? 'border-white bg-white/5 ring-8 ring-white/5' : 'border-white/5 opacity-50 hover:opacity-100 hover:bg-white/5 hover:translate-y-[-4px]'}
                                  `}
                               >
                                  <div className="aspect-[4/3] rounded-[32px] overflow-hidden bg-[#0a0a0a] flex items-center justify-center relative inner-shadow-lg">
                                     <img src={v.image} className="w-full h-full object-contain scale-125 group-hover:scale-110 transition-all duration-1000 drop-shadow-2xl" />
                                     {v.popular && <div className="absolute top-4 right-4 px-3 py-1.5 bg-neon-green/90 text-black rounded-xl text-[7px] font-hero font-black uppercase shadow-lg">Popular</div>}
                                  </div>
                                  <div className="px-6 py-6 border-t border-white/5 flex items-center justify-between">
                                     <div className="space-y-1">
                                        <div className="text-[11px] font-hero uppercase tracking-widest font-black leading-none">{v.name}</div>
                                        <div className="text-[8px] font-hero opacity-30 uppercase tracking-widest leading-none">IDENTITY_B_{v.id}</div>
                                     </div>
                                     <div className="w-6 h-6 rounded-full border border-white/10" style={{ backgroundColor: v.hex }} />
                                  </div>
                               </button>
                            ))}
                         </div>
                      </div>
                   </div>
                )}

                {activeTab === 'layers' && (
                   <div className="space-y-6 animate-in slide-in-from-right-10 duration-700">
                      <h3 className="text-[11px] font-hero uppercase tracking-[0.5em] opacity-30 mb-4 font-black">Neural Stack ({activeSide})</h3>
                      {currentElements.length === 0 && <div className="py-20 text-center opacity-10 uppercase tracking-[1em] font-hero text-[10px] border-2 border-dashed border-white/5 rounded-[40px]">Queue Clear</div>}
                      {currentElements.slice().reverse().map(el => (
                         <div key={el.id} className={`flex items-center justify-between p-6 rounded-[40px] border transition-all duration-700 ${selectedId === el.id ? 'bg-white/10 border-white/20 shadow-2xl' : 'bg-white/5 border-white/5 group hover:bg-white/10'}`}>
                            <div className="flex items-center gap-6 cursor-pointer" onClick={() => setSelectedId(el.id)}>
                               <div className={`p-5 rounded-2xl ${el.type === 'text' ? 'bg-neon-blue/20 text-neon-blue' : 'bg-neon-green/20 text-neon-green'}`}>
                                  {el.type === 'text' ? <Type size={20}/> : <ImageIcon size={20}/>}
                               </div>
                               <div className="flex flex-col gap-1">
                                  <span className="text-[12px] font-hero font-black uppercase tracking-widest">{el.type === 'text' ? el.content.slice(0, 15) : 'RASTER_ID'}</span>
                                  <span className="text-[9px] font-hero opacity-30 uppercase tracking-widest">Index: {el.zIndex}</span>
                               </div>
                            </div>
                            <div className="flex gap-4">
                               <button onClick={() => updateElement(el.id, { visible: !el.visible })} className="opacity-40 hover:opacity-100 transition-all">{el.visible ? <Eye size={20}/> : <EyeOff size={20}/>}</button>
                               <button onClick={() => deleteElement(el.id)} className="text-red-500 opacity-20 hover:opacity-100 hover:scale-125 transition-all"><Trash2 size={20}/></button>
                            </div>
                         </div>
                      ))}
                   </div>
                )}

                {activeTab === 'allocation' && (
                   <div className="space-y-12 animate-in slide-in-from-right-10 duration-700">
                      <div>
                         <h3 className="text-[11px] font-hero uppercase tracking-[0.5em] opacity-30 mb-8 font-black">Scale Deployment</h3>
                         <div className="grid grid-cols-5 gap-3">
                            {SIZES.map(s => (
                               <button key={s} onClick={() => setSize(s)} className={`py-6 rounded-3xl border text-[12px] font-hero transition-all duration-700 ${size === s ? 'border-neon-green bg-neon-green/10 text-white font-black shadow-neon' : 'border-white/5 opacity-40 hover:opacity-100 hover:bg-white/5'}`}>{s}</button>
                            ))}
                         </div>
                      </div>
                      
                      <div className="p-10 bg-white/5 rounded-[56px] border border-white/5 flex items-center justify-between group hover:border-neon-blue/20 transition-all">
                         <span className="text-[11px] font-hero uppercase tracking-[0.3em] opacity-30">Unit Count</span>
                         <div className="flex items-center gap-10">
                            <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-4 bg-white/5 rounded-2xl hover:bg-red-500 group transition-all duration-700"><Minus size={22} className="text-white/40 group-hover:text-white"/></button>
                            <span className="text-4xl font-black font-hero text-white tracking-tighter">{quantity}</span>
                            <button onClick={() => setQuantity(quantity + 1)} className="p-4 bg-white/5 rounded-2xl hover:bg-neon-green group transition-all duration-700"><Plus size={22} className="text-white/40 group-hover:text-black"/></button>
                         </div>
                      </div>

                      <div className="p-12 bg-black/40 rounded-[64px] border border-white/5 space-y-8 relative overflow-hidden shadow-3xl">
                         <Star className="absolute -top-10 -right-10 w-48 h-48 text-neon-green opacity-5 rotate-12" />
                         <div className="flex justify-between items-center">
                            <div className="space-y-1">
                               <div className="text-[11px] font-hero uppercase tracking-widest opacity-40">Base Alloy</div>
                               <div className="text-[11px] font-hero uppercase tracking-widest opacity-40">Neural Modules ({frontElements.length + backElements.length})</div>
                               <div className="text-[11px] font-hero uppercase tracking-widest opacity-40">Special Protocols</div>
                            </div>
                            <div className="space-y-1 text-right font-hero text-[11px] font-bold">
                               <div>₹{pricing.base.toLocaleString()}</div>
                               <div>₹{pricing.elements.toLocaleString()}</div>
                               <div className="text-neon-blue">₹{pricing.special.toLocaleString()}</div>
                            </div>
                         </div>
                         <div className="h-px bg-white/5 w-full" />
                         <div className="flex justify-between items-end">
                            <span className="text-[12px] font-hero font-black opacity-30 tracking-[0.4em]">TOTAL ALLOC</span>
                            <span className="text-6xl font-hero font-black text-white tracking-tighter shadow-neon-green/20">₹{pricing.total.toLocaleString()}</span>
                         </div>
                      </div>
                   </div>
                )}
                
                {activeTab === 'text' && (
                   <div className="space-y-10 animate-in slide-in-from-right-10 duration-700">
                      <button onClick={() => addElement('text')} className="w-full py-10 bg-white text-black font-hero font-black tracking-[0.4em] uppercase rounded-[40px] hover:scale-[1.01] active:scale-[0.98] transition-all shadow-3xl flex items-center justify-center gap-4">
                         <Plus size={24} /> GEN_TEXT_CORE
                      </button>
                      {selectedId && currentElements.find(e => e.id === selectedId)?.type === 'text' && (
                         <div className="space-y-10 p-10 bg-white/5 rounded-[56px] border border-white/5 shadow-2xl relative">
                            <div className="flex items-center gap-4 text-[10px] font-hero uppercase opacity-30 tracking-widest px-2"><Settings size={14}/> Module Configuration</div>
                            <input type="text" value={currentElements.find(e => e.id === selectedId).content} onChange={(e) => updateElement(selectedId, { content: e.target.value.toUpperCase() })} className="w-full bg-black border border-white/10 rounded-[32px] px-10 py-10 text-xl font-hero outline-none focus:border-neon-green uppercase tracking-widest shadow-2xl transition-all" />
                            <div className="grid grid-cols-2 gap-4">
                               {FONTS.map(f => (
                                  <button key={f} onClick={() => updateElement(selectedId, { fontFamily: f })} style={{ fontFamily: f }} className={`py-6 px-6 text-[11px] rounded-[24px] border transition-all ${currentElements.find(e => e.id === selectedId).fontFamily === f ? 'border-neon-green bg-neon-green/10 shadow-neon' : 'border-white/5 opacity-50 hover:bg-white/5'}`}>{f}</button>
                               ))}
                            </div>
                            <div className="flex flex-wrap gap-5">
                               {['#ffffff', '#000000', '#ff0000', '#00e5ff', '#00ff88', '#ffe100'].map(c => (
                                  <button key={c} onClick={() => updateElement(selectedId, { color: c })} style={{ backgroundColor: c }} className={`w-12 h-12 rounded-full border-4 transition-all ${currentElements.find(e => e.id === selectedId).color === c ? 'border-white scale-125 shadow-3xl' : 'border-transparent opacity-40 hover:opacity-100'}`} />
                               ))}
                            </div>
                         </div>
                      )}
                   </div>
                )}

             </div>

             {/* Sticky Bottom Actions (Mobile Focused) */}
             <div className="pt-10 border-t border-white/5 px-2">
                <div className="flex gap-4">
                   <button 
                     onClick={addToCart} 
                     disabled={(frontElements.length === 0 && backElements.length === 0) || isExporting} 
                     className={`flex-1 py-10 rounded-[48px] font-hero font-black uppercase tracking-[0.5em] transition-all relative overflow-hidden flex items-center justify-center gap-6
                        ${(frontElements.length === 0 && backElements.length === 0) ? 'bg-white/5 text-white/10 cursor-not-allowed border border-white/5' : 'bg-neon-green text-black hover:scale-[1.01] shadow-neon-green/40 shadow-2xl'}
                     `}
                   >
                      {isExporting ? <RefreshCcw className="animate-spin" size={24} /> : <Zap size={28} />}
                      {isExporting ? 'Capturing Twin...' : 'COMMIT ALLOCATION'}
                   </button>
                </div>
             </div>
          </div>

        </div>
      ) : (
        /* Multi-Page Protocol Checkout */
        <div className="flex flex-col items-center justify-center p-28 bg-[#010101] rounded-[80px] border border-white/5 text-center animate-in zoom-in-95 duration-1000 relative shadow-3xl overflow-hidden min-h-[900px]">
           <Sparkles className="absolute top-20 right-20 w-40 h-40 text-neon-green opacity-10 animate-pulse" />
           <ArrowLeft onClick={() => setCurrentView('editor')} className="absolute top-16 left-16 cursor-pointer opacity-30 hover:opacity-100 p-8 bg-white/5 rounded-full transition-all group hover:scale-110" size={80} />
           <div className="w-40 h-40 bg-white rounded-full flex items-center justify-center mb-16 shadow-neon-white"><User size={80} className="text-black" /></div>
           <h3 className="text-8xl font-hero font-black uppercase tracking-tighter mb-10 text-white">Protocol Alpha <span className="text-neon-green">IN</span></h3>
           <p className="text-[12px] font-hero opacity-30 tracking-[0.8em] max-w-2xl mx-auto mb-28 uppercase font-bold leading-relaxed px-10">Data manifest verified for regional deployment. Authorized for physical allocation across the Indian subcontinent.</p>
           
           <div className="w-full max-w-3xl space-y-8 text-left z-10 px-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div className="space-y-4">
                    <label className="text-[10px] font-hero opacity-40 uppercase tracking-[0.2em] ml-4">Recipient Name</label>
                    <input type="text" placeholder="LEGAL ID" className="w-full bg-white/5 border border-white/10 p-10 rounded-[32px] font-hero text-[11px] tracking-widest uppercase outline-none focus:border-neon-green focus:bg-white/10 transition-all shadow-inner" />
                 </div>
                 <div className="space-y-4">
                    <label className="text-[10px] font-hero opacity-40 uppercase tracking-[0.2em] ml-4">Neural Comm Link</label>
                    <input type="text" placeholder="+91 XXXXX XXXXX" className="w-full bg-white/5 border border-white/10 p-10 rounded-[32px] font-hero text-[11px] tracking-widest uppercase outline-none focus:border-neon-green focus:bg-white/10 transition-all shadow-inner" />
                 </div>
              </div>
              <div className="space-y-4">
                 <label className="text-[10px] font-hero opacity-40 uppercase tracking-[0.2em] ml-4">Deployment Zone (Coordinates)</label>
                 <input type="text" placeholder="STREET / BUILDING / LOCALITY" className="w-full bg-white/5 border border-white/10 p-10 rounded-[32px] font-hero text-[11px] tracking-widest uppercase outline-none focus:border-neon-green focus:bg-white/10 transition-all shadow-inner" />
              </div>
              <div className="grid grid-cols-2 gap-8">
                 <div className="space-y-4">
                    <label className="text-[10px] font-hero opacity-40 uppercase tracking-[0.2em] ml-4">City Grid</label>
                    <input type="text" placeholder="BANGALORE_CORE" className="w-full bg-white/5 border border-white/10 p-10 rounded-[32px] font-hero text-[11px] tracking-widest uppercase outline-none focus:border-neon-green focus:bg-white/10 transition-all shadow-inner" />
                 </div>
                 <div className="space-y-4">
                    <label className="text-[10px] font-hero opacity-40 uppercase tracking-[0.2em] ml-4">PIN Protocol</label>
                    <input type="text" placeholder="XXXXXX" className="w-full bg-white/5 border border-white/10 p-10 rounded-[32px] font-hero text-[11px] tracking-widest uppercase outline-none focus:border-neon-green focus:bg-white/10 transition-all shadow-inner" />
              </div>
              </div>
              <div className="pt-10 flex flex-col gap-6 items-center">
                 <button onClick={() => alert("FORGE INITIALIZED: Physical deployment payload dispatched across Indian Logistics Corridors.")} className="w-full py-14 bg-white text-black font-hero font-black uppercase tracking-[0.6em] rounded-[60px] shadow-neon-white hover:bg-neon-green hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-8 text-2xl">
                    <CreditCard size={36} /> AUTHORIZE INR {pricing.total.toLocaleString()} ALLOC
                 </button>
                 <span className="text-[9px] font-hero opacity-20 uppercase tracking-[0.5em] group cursor-pointer hover:opacity-50 transition-all flex items-center gap-3">
                    <Truck size={14} /> SECURE CRYPTOGRAPHIC SHIPMENT GUARANTEED
                 </span>
              </div>
           </div>
        </div>
      )}

      {/* Product Manifest Drawer (Cart) */}
      {showCart && (
         <div className="fixed inset-0 z-[1000] flex justify-end bg-black/98 backdrop-blur-[100px] animate-in fade-in duration-500">
            <div className="w-full max-w-3xl h-full bg-[#020202] border-l border-white/5 p-16 lg:p-24 flex flex-col animate-in slide-in-from-right-full duration-1000 shadow-3xl overflow-hidden relative">
               <div className="absolute top-0 right-0 w-full h-[600px] bg-neon-blue opacity-[0.03] blur-[150px] -translate-y-1/2 translate-x-1/2 rounded-full" />
               <div className="flex items-center justify-between mb-28 z-10 relative">
                  <h3 className="text-5xl font-hero font-black uppercase tracking-tighter flex items-center gap-10">
                    <Package className="text-neon-green" /> Cargo Manifest <span className="opacity-10">/</span> IN
                  </h3>
                  <X onClick={() => setShowCart(false)} className="cursor-pointer opacity-30 hover:opacity-100 p-8 hover:bg-white/5 rounded-full transition-all group hover:scale-110" />
               </div>
               
               <div className="flex-1 overflow-y-auto space-y-14 custom-scrollbar pr-10 z-10 relative">
                  {cart.length === 0 && <div className="text-center py-60 opacity-5 uppercase tracking-[2em] font-hero text-[12px] border-4 border-dashed border-white/5 rounded-[64px]">Cargo Capacity Available</div>}
                  {cart.map(item => (
                     <div key={item.id} className="p-12 bg-white/[0.03] rounded-[72px] border border-white/5 flex flex-col md:flex-row gap-16 relative group hover:border-white/20 transition-all duration-1000 shadow-[0_40px_80px_rgba(0,0,0,1)]">
                        <div className="w-full md:w-60 h-60 bg-black/80 rounded-[56px] border border-white/10 flex items-center justify-center overflow-hidden flex-shrink-0 group-hover:scale-105 transition-transform duration-1000 relative">
                           <img src={item.designImage} className="w-full h-full object-contain p-8 animate-in zoom-in duration-1000" />
                           <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-all" />
                        </div>
                        <div className="flex-1 flex flex-col justify-center gap-6">
                           <div className="flex justify-between items-center mb-2">
                              <span className="text-[12px] font-hero font-black tracking-[0.4em] uppercase opacity-40">Identity Prototype x {item.quantity}</span>
                              <Trash2 onClick={() => setCart(cart.filter(c => c.id !== item.id))} size={24} className="text-red-500 cursor-pointer opacity-0 group-hover:opacity-100 transition-all duration-700" />
                           </div>
                           <h4 className="text-white font-hero text-4xl font-black uppercase tracking-tighter leading-none">{item.color} Forge Alloy</h4>
                           <div className="flex flex-wrap gap-5">
                              <div className="px-6 py-3 bg-white/5 rounded-full text-[11px] font-hero uppercase tracking-widest text-white/50 border border-white/5 shadow-xl">Size: {item.size}</div>
                              <div className="px-6 py-3 bg-neon-blue/10 rounded-full text-[11px] font-hero uppercase tracking-widest text-neon-blue border border-neon-blue/10 shadow-xl">Alloc: {item.frontCount + item.backCount} Modules</div>
                           </div>
                           <div className="flex justify-between items-end mt-10">
                              <p className="text-6xl font-black font-hero text-neon-green drop-shadow-neon tracking-tighter">₹{item.price.toLocaleString()}</p>
                              <span className="text-[9px] font-hero opacity-20 uppercase tracking-widest mb-2 font-bold italic">Signature Verified</span>
                           </div>
                        </div>
                     </div>
                  ))}
               </div>
               
               {cart.length > 0 && (
                  <div className="pt-20 space-y-12 border-t border-white/10 mt-auto z-10 relative">
                     <div className="flex justify-between items-end text-6xl font-hero font-black uppercase tracking-tighter">
                        <span className="opacity-20 text-3xl mb-1">TOTAL ALLOC</span>
                        <span className="text-white drop-shadow-[0_0_40px_rgba(255,255,255,0.2)]">₹{cart.reduce((acc, curr) => acc + curr.price, 0).toLocaleString()}</span>
                     </div>
                     <button onClick={() => { setShowCart(false); setCurrentView('checkout'); }} className="w-full py-14 bg-neon-green text-black font-hero font-black tracking-[0.6em] rounded-[72px] shadow-neon-green/30 flex items-center justify-center gap-10 hover:scale-[1.02] active:scale-[0.98] transition-all text-xl shadow-2xl">
                        DEPLOY ACROSS INDIA <ChevronRight size={36} />
                     </button>
                  </div>
               )}
            </div>
         </div>
      )}

      {/* Production Reality Previz (Simulation Modal) */}
      {showPreview && (
         <div className="fixed inset-0 z-[2000] flex items-center justify-center p-6 lg:p-24 backdrop-blur-[150px] bg-black/98 animate-in fade-in duration-1000">
            <div className="relative w-full max-w-[1600px] h-full max-h-[95vh] bg-[#000000] rounded-[120px] overflow-hidden border border-white/10 shadow-[0_0_500px_rgba(0,0,0,1)] flex flex-col lg:flex-row shadow-3xl">
               
               <X onClick={() => setShowPreview(false)} className="absolute top-16 right-16 z-[2100] cursor-pointer p-10 bg-white text-black rounded-full hover:bg-neon-green hover:scale-110 transition-all duration-1000 shadow-3xl flex items-center justify-center" size={80} />
               
               {/* Subject Configuration */}
               <div className="absolute top-16 left-16 z-[2100] flex gap-8">
                  <button onClick={() => setPreviewSubject('male')} className={`px-12 py-8 rounded-[48px] font-hero text-[11px] uppercase tracking-[0.6em] transition-all flex items-center gap-6 shadow-2xl ${previewSubject === 'male' ? 'bg-white text-black scale-105 shadow-neon-white font-black' : 'bg-white/5 border border-white/10 text-white/30 hover:text-white'}`}>
                     Male Subject
                  </button>
                  <button onClick={() => setPreviewSubject('female')} className={`px-12 py-8 rounded-[48px] font-hero text-[11px] uppercase tracking-[0.6em] transition-all flex items-center gap-6 shadow-2xl ${previewSubject === 'female' ? 'bg-white text-black scale-105 shadow-neon-white font-black' : 'bg-white/5 border border-white/10 text-white/30 hover:text-white'}`}>
                     Female Subject
                  </button>
               </div>

               {/* Neural Projection Core */}
               <div className="flex-1 h-full relative bg-[#010101] overflow-hidden group">
                  <img src={previewSubject === 'male' ? "/model-male.png" : "/model-female.png"} className="w-full h-full object-cover transition-all duration-5000 animate-in fade-in zoom-in-125" />
                  
                  {/* Spectral Filter */}
                  <div className="absolute inset-0 pointer-events-none mix-blend-color opacity-40 transition-all duration-2000" style={{ backgroundColor: activeColor.hex }} />
                  
                  {/* Design Mapping Lattice (Scaled for model chest) */}
                  <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                     <div className="relative w-[18%] h-[16%] translate-y-[8%] opacity-95 blur-[0.3px] drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
                        {/* Dynamic Rendering of FRONT elements in simulation */}
                        {frontElements.filter(el => el.visible).map(el => (
                           <div 
                             key={el.id} 
                             style={{ 
                               position: 'absolute',
                               left: `${(el.x / 260) * 100}%`,
                               top: `${(el.y / 240) * 100}%`,
                               width: `${(el.width / 260) * 100}%`,
                               height: `${(el.height / 240) * 100}%`,
                               zIndex: el.zIndex,
                               transform: `rotate(${el.rotate}deg)`,
                               opacity: el.opacity,
                               mixBlendMode: activeColor.id === 'white' ? 'multiply' : 'screen'
                             }}
                             className="flex items-center justify-center overflow-hidden"
                           >
                              {el.type === 'text' ? (
                                 <span style={{ fontSize: '0.6vw', color: el.color, fontFamily: el.fontFamily, fontWeight: el.fontWeight }} className="text-center font-black uppercase whitespace-nowrap leading-none tracking-tighter shadow-xl px-1">{el.content}</span>
                              ) : (
                                 <img src={el.content} className="w-full h-full object-contain" />
                              )}
                           </div>
                        ))}
                     </div>
                  </div>
                  
                  {/* Status HUD Control */}
                  <div className="absolute bottom-16 left-16 right-16 flex justify-between items-end">
                     <div className="p-16 backdrop-blur-3xl bg-black/60 border border-white/5 rounded-[80px] max-w-2xl animate-in slide-in-from-bottom-16 duration-1000 shadow-x3l">
                        <h4 className="text-4xl font-hero font-black uppercase tracking-tighter text-neon-green mb-8 flex items-center gap-5"><Sparkles size={32} /> Reality Sync <span className="text-white opacity-20">/</span> <span className="text-white">ACTIVE</span></h4>
                        <p className="text-[12px] font-hero opacity-30 uppercase tracking-[0.6em] leading-relaxed font-black">Neural mapping success for {activeColor.name} alloy. Proprietary design signatures verified across biometric textile frames. Deployment link ready for dispatch.</p>
                        <div className="mt-12 flex items-center gap-8">
                           <div className="w-4 h-4 rounded-full bg-neon-green animate-ping shadow-[0_0_20px_rgba(0,255,163,1)]" />
                           <span className="text-[11px] font-hero text-neon-green uppercase tracking-[0.6em] font-black italic">Regional Link Established</span>
                        </div>
                     </div>
                  </div>
               </div>

               {/* Specification & Finalize Column */}
               <div className="w-full lg:w-[700px] h-full p-28 flex flex-col justify-between bg-[#020202] border-l border-white/5 relative z-10">
                  <div className="space-y-24">
                     <div className="space-y-8">
                        <h3 className="text-6xl font-hero font-black uppercase tracking-tighter text-white">Identity Meta-Twin</h3>
                        <p className="text-sm font-hero opacity-30 leading-relaxed uppercase tracking-[0.3em] font-black">Validating physical deployment manifest. Your proprietary digital signature has been projected onto the {activeColor.name} material substrate.</p>
                     </div>
                     
                     <div className="space-y-10">
                        <div className="flex items-center justify-between p-12 bg-white/5 rounded-[64px] hover:bg-white/10 transition-all border border-white/5 group shadow-xl">
                           <div className="flex items-center gap-10">
                              <Zap size={32} className="text-neon-green group-hover:scale-125 transition-all drop-shadow-neon" />
                              <div className="space-y-2">
                                 <span className="block text-[14px] font-hero uppercase tracking-widest font-black text-white">Allocation Protocol</span>
                                 <span className="block text-[9px] font-hero opacity-20 uppercase tracking-widest font-bold">Standard Regional Link</span>
                              </div>
                           </div>
                           <span className="text-[12px] font-hero opacity-40 uppercase tracking-[0.5em] font-bold">3-5 DAYS IN</span>
                        </div>
                        <div className="flex items-center justify-between p-12 bg-white/5 rounded-[64px] hover:bg-white/10 transition-all border border-white/5 group shadow-xl">
                           <div className="flex items-center gap-10">
                              <CreditCard size={32} className="text-neon-blue group-hover:scale-125 transition-all drop-shadow-neon" />
                              <div className="space-y-2">
                                 <span className="block text-[14px] font-hero uppercase tracking-widest font-black text-white">Payment Mesh</span>
                                 <span className="block text-[9px] font-hero opacity-20 uppercase tracking-widest font-bold">Encrypted Authorization</span>
                              </div>
                           </div>
                           <span className="text-[12px] font-hero opacity-40 uppercase tracking-[0.5em] font-bold italic">INR ENABLED</span>
                        </div>
                     </div>
                  </div>
                  
                  <div className="space-y-10">
                     <div className="flex justify-between items-end px-4">
                        <span className="text-[14px] font-hero font-black opacity-30 uppercase tracking-[0.6em]">ESTIMATED ALLOC</span>
                        <span className="text-7xl font-hero font-black text-white tracking-tighter">₹{pricing.total.toLocaleString()}</span>
                     </div>
                     <button onClick={() => { setShowPreview(false); addToCart(); }} className="w-full py-16 bg-white text-black font-hero font-black uppercase tracking-[0.8em] rounded-[80px] shadow-neon-white hover:bg-neon-green hover:scale-[1.02] active:scale-[0.98] transition-all text-2xl shadow-3xl">ALLOCATE IDENTITY</button>
                  </div>
               </div>

            </div>
         </div>
      )}

    </div>
  );
};

export default TshirtDesigner;
