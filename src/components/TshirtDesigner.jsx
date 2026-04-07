import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { Rnd } from 'react-rnd';
import {
  Trash2, Type, Image as ImageIcon, ArrowUp, ArrowDown,
  RotateCw, GripVertical, Settings, Layers, Shapes,
  Download, Eye, Lock, Unlock, EyeOff, Minus, Plus,
  ShoppingCart, X, ChevronRight, Package,
  CreditCard, Truck, User, ArrowLeft, MessageCircle,
  Command, Zap, Star, RefreshCcw, Info,
  Maximize2, Sparkles, AlignLeft, AlignCenter, AlignRight,
  Bold, Palette, Upload, Library, Pipette
} from 'lucide-react';
import html2canvas from 'html2canvas';
import TshirtCanvas from './TshirtCanvas';
import { Suspense } from 'react';

const FONTS = ['Orbitron', 'Inter', 'Bungee', 'Satisfy', 'Bebas Neue', 'Outfit', 'Rajdhani', 'Permanent Marker'];
const SIZES = ['S', 'M', 'L', 'XL', 'XXL'];
const DEPLOYMENT_WINDOW = "3–5 Days India-Wide";

const DESIGN_LIBRARY = [
  { id: 'lib1', label: '⚡ VOLT', type: 'text', content: '⚡ VOLT', fontFamily: 'Orbitron', fontWeight: '900', color: '#ffe100', fontSize: 28 },
  { id: 'lib2', label: '🔥 FIRE', type: 'text', content: '🔥 FIRE', fontFamily: 'Bungee', fontWeight: '400', color: '#ff3b3b', fontSize: 28 },
  { id: 'lib3', label: 'URBAN', type: 'text', content: 'URBAN\nFABRIC', fontFamily: 'Bebas Neue', fontWeight: '400', color: '#ffffff', fontSize: 24 },
  { id: 'lib4', label: '∞ INF', type: 'text', content: '∞', fontFamily: 'Inter', fontWeight: '900', color: '#00e5ff', fontSize: 48 },
  { id: 'lib5', label: 'FORGE', type: 'text', content: 'FORGE', fontFamily: 'Orbitron', fontWeight: '900', color: '#00ffa3', fontSize: 26 },
  { id: 'lib6', label: '★ STAR', type: 'text', content: '★★★★★', fontFamily: 'Inter', fontWeight: '900', color: '#ffe100', fontSize: 22 },
  { id: 'lib7', label: 'DRIP', type: 'text', content: 'NO CAP\nDRIP', fontFamily: 'Bungee', fontWeight: '400', color: '#ffb7b7', fontSize: 22 },
  { id: 'lib8', label: 'VOID', type: 'text', content: 'INTO THE\nVOID', fontFamily: 'Bebas Neue', fontWeight: '400', color: '#888888', fontSize: 22 },
];

const TEXT_COLORS = [
  '#ffffff','#000000','#ff3b3b','#00e5ff','#00ff88',
  '#ffe100','#ff9933','#ffb7b7','#800080','#ff69b4',
  '#00ffa3','#888888'
];

const COLOR_VARIANTS = [
  { id: 'white',  name: 'Solar White',     hex: '#ffffff', image: '/tshirts/tshirt-white.png',  backImage: '/tshirts/tshirt-white-back.png', popular: true },
  { id: 'black',  name: 'Pure Void',       hex: '#0a0a0a', image: '/tshirts/tshirt-black.png',  backImage: '/tshirts/tshirt-black-back.png', popular: true, dark: true },
  { id: 'grey',   name: 'Urban Alloy',     hex: '#555555', image: '/tshirts/tshirt-white.png',  backImage: '/tshirts/tshirt-white-back.png' },
  { id: 'navy',   name: 'Deep Protocol',   hex: '#001f3f', image: '/tshirts/tshirt-black.png',  backImage: '/tshirts/tshirt-black-back.png', dark: true },
  { id: 'maroon', name: 'Crimson Core',    hex: '#800000', image: '/tshirts/tshirt-white.png',  backImage: '/tshirts/tshirt-white-back.png', dark: true },
  { id: 'purple', name: 'Violet Pulse',    hex: '#4b0082', image: '/tshirts/tshirt-white.png',  backImage: '/tshirts/tshirt-white-back.png', dark: true },
  { id: 'blue',   name: 'Neon Blue',       hex: '#00e5ff', image: '/tshirts/tshirt-white.png',  backImage: '/tshirts/tshirt-white-back.png' },
  { id: 'green',  name: 'Forest Node',     hex: '#1e4d2b', image: '/tshirts/tshirt-white.png',  backImage: '/tshirts/tshirt-white-back.png', dark: true },
  { id: 'orange', name: 'Solar Orange',    hex: '#ff9933', image: '/tshirts/tshirt-white.png',  backImage: '/tshirts/tshirt-white-back.png' },
];

const TshirtDesigner = () => {
  // Global View State
  const [activeSide, setActiveSide] = useState('front');
  const [activeColor, setActiveColor] = useState(COLOR_VARIANTS[0]);
  const [customColor, setCustomColor] = useState('#ffffff');
  const [hoverColor, setHoverColor] = useState(null);

  // Element State
  const [frontElements, setFrontElements] = useState([]);
  const [backElements, setBackElements] = useState([]);
  const [selectedId, setSelectedId] = useState(null);

  // UI State
  const [activeTab, setActiveTab] = useState('text');
  const [gridVisible, setGridVisible] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  // Order State
  const [size, setSize] = useState('M');
  const [quantity, setQuantity] = useState(1);
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [currentView, setCurrentView] = useState('editor');
  const [previewSubject, setPreviewSubject] = useState('female');
  const [viewAngle, setViewAngle] = useState('front');
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  const imageInputRef = useRef(null);

  // Production Analytics Agent
  const trackAction = (event, params = {}) => {
    console.log(`URBAN_FABRIC_EVENT: [${event}]`, params);
    // Here you would normally call window.gtag('event', event, params) or similar
  };

  // Performance & Responsive Agent
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const stageRef = useRef(null);

  // Computed Elements based on active view
  const currentElements = activeSide === 'front' ? frontElements : backElements;
  const setCurrentElements = activeSide === 'front' ? setFrontElements : setBackElements;
  
  // -- PRICING ENGINE --
  // -- ADVANCED PRICING ENGINE --
  const BASE_PRICE = 699;
  const pricing = useMemo(() => {
    let price = BASE_PRICE;
    const all = [...frontElements, ...backElements];
    
    // Per-layer pricing
    const textCount = all.filter(e => e.type === 'text').length;
    const imageCount = all.filter(e => e.type === 'image').length;
    price += textCount * 50;
    price += imageCount * 100;

    // Bonus: Print Volume (Large Design)
    const hasLarge = all.some(e => e.width > 160 || e.height > 160);
    if (hasLarge) price += 50;

    // Bonus: Front + Back complexity
    if (frontElements.length > 0 && backElements.length > 0) price += 100;

    // Bonus: Color Diversity
    const uniqueColors = new Set(all.map(e => e.color)).size;
    if (uniqueColors > 2) price += 50;

    return {
       base: BASE_PRICE,
       textCharge: textCount * 50,
       imageCharge: imageCount * 100,
       complexityBonus: (hasLarge ? 50 : 0) + (frontElements.length > 0 && backElements.length > 0 ? 100 : 0) + (uniqueColors > 2 ? 50 : 0),
       unit: price,
       total: price * quantity
    };
  }, [frontElements, backElements, quantity]);

  // -- ACCESSIBILITY AGENT --
  const contrastWarning = useMemo(() => {
    const selEl = currentElements.find(e => e.id === selectedId);
    if (!selEl || selEl.type !== 'text') return null;
    
    // Standard Contrast Shield (Placeholder for real luminance calculation)
    if (activeColor.id === 'white' && (selEl.color === '#ffffff' || selEl.color === '#eeeeee')) return "LOW VISIBILITY: DIM PROTOCOL";
    if (activeColor.id === 'black' && (selEl.color === '#000000' || selEl.color === '#111111')) return "LOW VISIBILITY: VOID OVERLAP";
    return null;
  }, [selectedId, currentElements, activeColor]);

  // -- PRODUCTION ORDER AGENT --
  const [checkoutData, setCheckoutData] = useState({ name: '', phone: '', address: '', city: '', pincode: '', email: '' });
  const [orderErrors, setOrderErrors] = useState({});
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [lockedOrder, setLockedOrder] = useState(null);

  const validateDetails = () => {
    const errors = {};
    if (!checkoutData.name.trim()) errors.name = "ID Required";
    if (!/^\d{10}$/.test(checkoutData.phone)) errors.phone = "Invalid Comm Link (10 digits)";
    if (!checkoutData.address.trim()) errors.address = "Coordinates Required";
    if (!checkoutData.city.trim()) errors.city = "Sector/City Required";
    if (!/^\d{6}$/.test(checkoutData.pincode)) errors.pincode = "Invalid Pin Protocol";
    setOrderErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const prepareCheckout = async () => {
    setIsExporting(true);
    setSelectedId(null); // Deselect for clean snapshot
    
    // Tiny delay for UI to settle (handles selection removal animations)
    await new Promise(r => setTimeout(r, 150));
    
    try {
      const canvas = await html2canvas(stageRef.current, { 
        backgroundColor: null, 
        logging: false, 
        scale: 2,
        useCORS: true,
        allowTaint: true
      });
      const previewImage = canvas.toDataURL('image/png');
      
      setLockedOrder({
        id: `UF-${Date.now()}`,
        design: { front: frontElements, back: backElements },
        color: activeColor,
        price: { ...pricing },
        quantity,
        size,
        previewImage,
        timestamp: new Date().toISOString(),
      });
      
      setCurrentView('checkout');
    } catch (e) {
      console.error("FORGE_SNAPSHOT_ERROR", e);
      alert("Snapshot Synchronization Failed: Please verify design and retry.");
    } finally {
      setIsExporting(false);
    }
  };

  const placeOrder = async () => {
    // 1. Transaction Validation
    if (!lockedOrder && frontElements.length === 0 && backElements.length === 0) {
       alert("Design Forge Empty: Add elements to your design first.");
       return;
    }
    
    if (currentView === 'checkout' && !validateDetails()) return;

    setIsProcessingPayment(true);
    trackAction('order_authorization_start', { total: lockedOrder?.price?.total || pricing.total });

    try {
      // 2. Pricing & Asset Lock (Critical for unmounted states)
      const finalPricing = lockedOrder?.price || pricing;
      const previewImage = lockedOrder?.previewImage;
      
      if (!previewImage && currentView === 'checkout') {
        throw new Error("Asset Desync: Design snapshot missing in unmounted state.");
      }

      // If called from a view where the editor IS mounted (e.g. mobile direct buy)
      let currentPreview = previewImage;
      if (!currentPreview && stageRef.current) {
         const canvas = await html2canvas(stageRef.current, { backgroundColor: null, logging: false, scale: 2 });
         currentPreview = canvas.toDataURL('image/png');
      }

      const orderData = {
        id: lockedOrder?.id || `UF-${Date.now()}`,
        design: lockedOrder?.design || { front: frontElements, back: backElements },
        color: lockedOrder?.color || activeColor,
        price: finalPricing,
        quantity: lockedOrder?.quantity || quantity,
        size: lockedOrder?.size || size,
        previewImage: currentPreview,
        recipient: checkoutData,
        timestamp: new Date().toISOString(),
        paymentStatus: 'authorizing'
      };

      setLockedOrder(orderData); // Persist locked state

      // 4. Simulated Razorpay Protocol (Secure Handshake)
      await new Promise(resolve => setTimeout(resolve, 2000)); 

      const isSuccess = Math.random() > 0.05; 
      
      if (isSuccess) {
        orderData.paymentStatus = 'success';
        const existingOrders = JSON.parse(localStorage.getItem('urban_fabric_orders') || '[]');
        localStorage.setItem('urban_fabric_orders', JSON.stringify([...existingOrders, orderData]));
        
        trackAction('payment_verified', { orderId: orderData.id });
        setCurrentView('success');
      } else {
        throw new Error("Razorpay Transaction Aborted by Neural Sink");
      }
      
    } catch (error) {
      console.error("Order Forge Failure:", error);
      alert("Payment Context Aborted: " + (error.message.includes('Snapshot') ? "Design capture failed." : "Please verify your comms and retry."));
      trackAction('payment_failure', { error: error.message });
    } finally {
      setIsProcessingPayment(false);
    }
  };

  // ── Designer Logic ───────────────────────────────────────────────────────────
  const addElement = (type, overrides = {}) => {
    const isDark = activeColor.dark;
    const newEl = {
      id: Date.now(),
      type,
      content: type === 'text' ? 'FORGE IDENTITY' : '',
      x: 70, y: 90,
      width: type === 'image' ? 110 : 120,
      height: type === 'image' ? 110 : 44,
      fontSize: 22,
      fontFamily: 'Orbitron',
      fontWeight: '900',
      textAlign: 'center',
      color: isDark ? '#ffffff' : '#000000',
      outline: false,
      outlineColor: '#000000',
      shadow: false,
      glow: false,
      rotate: 0,
      opacity: 1,
      zIndex: currentElements.length + 1,
      visible: true,
      locked: false,
      ...overrides,
    };
    setCurrentElements([...currentElements, newEl]);
    setSelectedId(newEl.id);
    trackAction(`add_${type}`, { id: newEl.id });
  };

  const addFromLibrary = (item) => {
    addElement('text', {
      content: item.content,
      fontFamily: item.fontFamily,
      fontWeight: item.fontWeight,
      color: item.color,
      fontSize: item.fontSize,
    });
  };

  const handleImageUpload = useCallback((file) => {
    if (!file || !file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      addElement('image', { content: e.target.result, width: 120, height: 120 });
    };
    reader.readAsDataURL(file);
  }, [currentElements, activeSide]);

  const updateElement = (id, updates) =>
    setCurrentElements(currentElements.map(el => el.id === id ? { ...el, ...updates } : el));

  const deleteElement = (id) => {
    const target = id || selectedId;
    setCurrentElements(currentElements.filter(el => el.id !== target));
    if (selectedId === target) setSelectedId(null);
  };

  const bringForward = (id) => {
    const el = currentElements.find(e => e.id === id);
    if (!el) return;
    const maxZ = Math.max(...currentElements.map(e => e.zIndex));
    if (el.zIndex < maxZ) updateElement(id, { zIndex: el.zIndex + 1 });
  };

  const sendBackward = (id) => {
    const el = currentElements.find(e => e.id === id);
    if (!el) return;
    const minZ = Math.min(...currentElements.map(e => e.zIndex));
    if (el.zIndex > minZ) updateElement(id, { zIndex: el.zIndex - 1 });
  };

  const addToCart = async () => {
    if (frontElements.length === 0 && backElements.length === 0) return;
    setIsExporting(true);
    setSelectedId(null);
    trackAction('checkout_initiated', { items: frontElements.length + backElements.length });
    
    setTimeout(async () => {
      try {
        const canvas = await html2canvas(stageRef.current, { 
          backgroundColor: null, 
          scale: 0.8,
          useCORS: true,
          allowTaint: true
        });
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
        trackAction('cart_add_success', { total: pricing.total });
        
        import('canvas-confetti').then(confetti => confetti.default({
          particleCount: 150,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#00ffa3', '#00e5ff', '#ffffff']
        }));
      } catch (e) {
        console.error("FORGE_EXPORT_ERROR", e);
        setIsExporting(false);
      }
    }, 500);
  };

  return (
    <div className="w-full max-w-7xl mx-auto flex flex-col gap-8 text-white relative">
      
      {/* Premium Regional Navigation */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 md:gap-10 px-4 border-b border-white/5 pb-6 md:pb-10">
         <div className="w-full md:w-auto">
            <h2 className="text-4xl md:text-6xl font-hero font-black tracking-tighter uppercase leading-none mb-4">Forge <span className="text-neon-green">Master IN</span></h2>
            <div className="flex items-center gap-5">
               <span className="px-4 py-2 bg-white/5 rounded-full text-[8px] md:text-[9px] font-hero tracking-widest text-neon-blue font-bold uppercase">{DEPLOYMENT_WINDOW}</span>
            </div>
         </div>
         
         <div className="flex items-center gap-4 md:gap-6 w-full md:w-auto">
            <button onClick={() => window.open(`https://wa.me/91XXXXXXXXXX?text=Forge-Inquiry: Custom Allocation`)} className="flex-1 md:flex-none px-6 py-4 bg-[#25D366]/10 text-[#25D366] border border-[#25D366]/10 rounded-[24px] hover:bg-[#25D366]/20 transition-all font-hero text-[10px] uppercase tracking-widest flex items-center justify-center gap-3">
               <MessageCircle size={16} /> <span className="hidden sm:inline">Direct Support</span>
            </button>
            <button onClick={() => setShowCart(true)} className="relative p-5 md:p-7 bg-white/5 rounded-[24px] md:rounded-[32px] border border-white/5 hover:border-white/20 transition-all group shadow-2xl">
               <ShoppingCart size={20} className="group-hover:scale-110 transition-transform" />
               {cart.length > 0 && <span className="absolute -top-1 -right-1 w-6 h-6 md:w-7 md:h-7 bg-white text-black text-[10px] md:text-[11px] font-black rounded-full flex items-center justify-center shadow-neon">{cart.length}</span>}
            </button>
         </div>
      </div>

      {currentView === 'editor' ? (
        <div className="flex flex-col xl:flex-row gap-6 bg-white/5 backdrop-blur-[120px] p-6 lg:p-12 rounded-[80px] border border-white/5 shadow-inner overflow-hidden relative">
          
          {/* Tool Selector - Global 3D Console */}
          <div className="flex xl:flex-col gap-3 md:gap-4 z-40 transition-all duration-700 overflow-x-auto scrollbar-hide pb-2 xl:pb-0 mb-4 xl:mb-0">
            {[
              { id: 'text', icon: <Type size={isMobile ? 20 : 24}/>, label: 'Text' },
              { id: 'graphics', icon: <Shapes size={20}/>, label: 'Images' },
              { id: 'queue', icon: <Layers size={20}/>, label: 'Queue' },
              { id: 'allocation', icon: <Zap size={20}/>, label: 'Allo-C' },
              { id: 'config', icon: <Command size={20}/>, label: 'Visual' }
            ].map(tab => (
              <button 
                key={tab.id} 
                onClick={() => {
                   setActiveTab(tab.id);
                   trackAction('switch_tab', { tab: tab.id });
                }} 
                className={`flex flex-col items-center justify-center p-4 md:p-6 min-w-[80px] md:min-w-[100px] rounded-[24px] md:rounded-[44px] transition-all duration-700 ${activeTab === tab.id ? 'bg-white text-black shadow-3xl scale-105' : 'bg-white/5 text-white/30 hover:bg-white/10'}`}
              >
                 {tab.icon}
                 <span className="text-[8px] md:text-[10px] mt-2 md:mt-3 font-hero uppercase tracking-[0.2em]">{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Designer Main Stage */}
          <div className="flex-1 min-h-[800px] bg-black rounded-[72px] border border-white/5 relative overflow-hidden flex items-center justify-center group shadow-2xl">
             
             {/* Side Switcher - Pure 3D Toggle */}
             <div className="absolute top-10 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-6">
                 <div className="flex p-1 bg-white/5 backdrop-blur-2xl rounded-full border border-white/5 animate-in fade-in zoom-in duration-500">
                    <button onClick={() => setActiveSide('front')} className={`px-8 py-3 rounded-full text-[9px] font-hero uppercase tracking-widest transition-all ${activeSide === 'front' ? 'bg-white text-black shadow-lg' : 'text-white/40 hover:text-white'}`}>Front</button>
                    <button onClick={() => setActiveSide('back')} className={`px-8 py-3 rounded-full text-[9px] font-hero uppercase tracking-widest transition-all ${activeSide === 'back' ? 'bg-white text-black shadow-lg' : 'text-white/40 hover:text-white'}`}>Back</button>
                 </div>
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

              {/* Reality Projection Forge - ALWAYS 3D */}
              <div 
                ref={stageRef} 
                className="relative w-full aspect-square md:aspect-auto md:h-full flex justify-center items-center transition-all duration-1000 max-w-full overflow-hidden"
                style={{ minHeight: isMobile ? '500px' : '750px' }}
              >

                 {/* 3D Real-time Projection Layer */}
                 <div className="absolute inset-0 z-10 transition-all duration-1000">
                    <Suspense fallback={
                      <div className="flex flex-col items-center justify-center gap-6 opacity-20 h-full">
                        <div className="w-16 h-16 border-4 border-white/5 border-t-neon-green rounded-full animate-spin" />
                        <span className="text-[8px] font-hero tracking-[0.5em] uppercase">Forging 3D...</span>
                      </div>
                    }>
                       <TshirtCanvas 
                          frontElements={frontElements}
                          backElements={backElements}
                          color={activeColor.hex} 
                          activeSide={activeSide} 
                          autoRotate={!selectedId}
                          controlsEnabled={true}
                          viewAngle={viewAngle}
                          isDesignerMode={true}
                          isMobile={isMobile}
                       />
                    </Suspense>
                 </div>

                 <div className="absolute inset-0 pointer-events-none overflow-hidden z-20">
                    
                    {/* High-End HUD - LEFT */}
                    <div className="absolute top-1/2 left-4 md:left-10 -translate-y-1/2 flex flex-col gap-6 md:gap-10 animate-in slide-in-from-left duration-1000 scale-75 md:scale-100 origin-left">
                       <div className="space-y-2">
                          <span className="text-[8px] md:text-[10px] font-hero opacity-30 uppercase tracking-[0.5em] font-black">Variant Code</span>
                          <div className="flex items-center gap-4 md:gap-6">
                             <div className="w-3 h-3 md:w-4 md:h-4 rounded-full shadow-neon" style={{ backgroundColor: activeColor.hex }} />
                             <span className="text-sm md:text-xl font-hero font-black uppercase tracking-widest">{activeColor.name}</span>
                          </div>
                       </div>
                    </div>

                    {/* Action HUD - RIGHT BOTTOM */}
                    <div className="absolute bottom-6 md:bottom-10 right-4 md:right-10 flex flex-col items-end gap-4 md:gap-6 pointer-events-auto animate-in slide-in-from-right duration-700">
                        <div className="text-right mb-2 md:mb-4">
                           <span className="block text-[8px] md:text-[11px] font-hero opacity-30 font-black uppercase tracking-widest mb-1">Unit Cost</span>
                           <span className="text-3xl md:text-7xl font-hero font-black text-white tracking-tighter drop-shadow-3xl leading-none">₹{pricing.total.toLocaleString()}</span>
                        </div>
                    </div>
                 </div>
                 
                 <>
                    {/* Mobile 3D Warning */}
                    {isMobile && (
                       <div className="absolute top-10 left-1/2 -translate-x-1/2 z-40 bg-black/60 backdrop-blur-xl px-4 py-2 border border-neon-blue/20 rounded-full animate-in fade-in slide-in-from-top duration-1000">
                          <span className="text-[7px] font-hero text-neon-blue uppercase tracking-widest font-black">Performance mode active on mobile</span>
                       </div>
                    )}

                    {/* 3D View Controls */}
                    <div className={`absolute top-28 right-4 md:right-10 flex flex-col gap-3 md:gap-4 z-40 animate-in slide-in-from-right duration-1000 ${isMobile ? 'scale-90' : ''}`}>
                       <button onClick={() => setViewAngle('front')} className={`px-4 md:px-6 py-2.5 md:py-3 rounded-2xl border text-[8px] md:text-[9px] font-hero uppercase tracking-widest transition-all ${viewAngle === 'front' ? 'bg-white text-black border-white shadow-neon-white font-black' : 'bg-black/40 text-white/40 border-white/10 hover:border-white/30'}`}>Front View</button>
                       <button onClick={() => setViewAngle('back')} className={`px-4 md:px-6 py-2.5 md:py-3 rounded-2xl border text-[8px] md:text-[9px] font-hero uppercase tracking-widest transition-all ${viewAngle === 'back' ? 'bg-white text-black border-white shadow-neon-white font-black' : 'bg-black/40 text-white/40 border-white/10 hover:border-white/30'}`}>Back View</button>
                       <div className="h-0.5 bg-white/5 w-full my-1" />
                       <button onClick={() => setViewAngle('reset')} className="px-4 md:px-6 py-2.5 md:py-3 rounded-2xl border bg-black/60 text-white/40 border-white/10 hover:border-white/30 text-[8px] md:text-[9px] font-hero uppercase tracking-widest transition-all font-black">Reset Cam</button>
                    </div>

                    {/* Interactive Tooltip (Center) */}
                    {!selectedId && !isMobile && (
                       <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-black/60 backdrop-blur-3xl px-8 py-4 rounded-full border border-white/10 animate-pulse z-20 pointer-events-none">
                          <RotateCw size={14} className="text-neon-green" />
                          <span className="text-[10px] font-hero uppercase tracking-[0.3em] font-black italic">Haptic Drag enabled for 360 Rotation</span>
                       </div>
                    )}
                 </>
                 
                 {selectedId && (
                    <div className="absolute bottom-24 md:top-1/2 right-4 md:right-10 md:-translate-y-1/2 p-6 md:p-10 bg-black/80 backdrop-blur-3xl border border-white/10 rounded-[32px] md:rounded-[48px] w-[90%] md:w-80 space-y-6 md:space-y-8 z-50 animate-in slide-in-from-bottom md:slide-in-from-right duration-500 shadow-3xl mx-auto left-0 md:left-auto">
                       <h3 className="text-[8px] md:text-[10px] font-hero uppercase tracking-widest opacity-40 font-black italic">Advanced Projection Node</h3>
                       
                       <div className="space-y-4">
                          <div className="flex justify-between text-[7px] md:text-[8px] font-hero opacity-30 uppercase tracking-widest">
                             <span>Horizontal_Shift</span>
                             <span>{Math.round(currentElements.find(e => e.id === selectedId).x)}</span>
                          </div>
                          <input 
                             type="range" min="0" max="260" 
                             value={currentElements.find(e => e.id === selectedId).x} 
                             onChange={(e) => updateElement(selectedId, { x: parseInt(e.target.value) })}
                             className="w-full accent-neon-green bg-white/5 h-2 rounded-full appearance-none cursor-pointer" 
                          />
                       </div>

                       <div className="space-y-4">
                          <div className="flex justify-between text-[7px] md:text-[8px] font-hero opacity-30 uppercase tracking-widest">
                             <span>Vertical_Shift</span>
                             <span>{Math.round(currentElements.find(e => e.id === selectedId).y)}</span>
                          </div>
                          <input 
                             type="range" min="0" max="240" 
                             value={currentElements.find(e => e.id === selectedId).y} 
                             onChange={(e) => updateElement(selectedId, { y: parseInt(e.target.value) })}
                             className="w-full accent-neon-blue bg-white/5 h-2 rounded-full appearance-none cursor-pointer" 
                          />
                       </div>

                       <div className="space-y-4">
                          <div className="flex justify-between text-[7px] md:text-[8px] font-hero opacity-30 uppercase tracking-widest">
                             <span>Scale_Resolution</span>
                             <span>{Math.round(currentElements.find(e => e.id === selectedId).width)}</span>
                          </div>
                          <input 
                             type="range" min="20" max="260" 
                             value={currentElements.find(e => e.id === selectedId).width} 
                             onChange={(e) => {
                                const newW = parseInt(e.target.value);
                                const el = currentElements.find(e => e.id === selectedId);
                                const aspect = el.height / el.width;
                                updateElement(selectedId, { 
                                   width: newW, 
                                   height: el.type === 'image' ? newW * aspect : el.height 
                                });
                             }}
                             className="w-full accent-white bg-white/5 h-2 rounded-full appearance-none cursor-pointer" 
                          />
                       </div>

                       <button onClick={() => setSelectedId(null)} className="w-full py-4 md:py-4 bg-white/5 hover:bg-white/10 rounded-2xl text-[8px] md:text-[9px] font-hero uppercase tracking-widest border border-white/5 transition-all font-black">Detach Control</button>
                    </div>
                 )}
                
                {/* Master Mapping Overlay */}
                <div className={`absolute top-[32%] left-1/2 -translate-x-1/2 w-[260px] h-[240px] border border-dashed rounded-[48px] transition-all duration-1000 z-10
                   ${gridVisible ? 'border-neon-green bg-neon-green/5 scale-100' : 'border-white/5 scale-[0.98]'}
                   ${selectedId ? 'opacity-100' : 'opacity-0 hover:opacity-100'}
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

          {/* Commander Sidebar - Pure 3D Experience */}
          <div className="w-full xl:w-[480px] flex flex-col gap-10 transition-all duration-700">
             <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-12">
                
                {activeTab === 'config' && (
                   <div className="space-y-12 animate-in slide-in-from-right-10 duration-700">
                      <div>
                         <h3 className="text-[11px] font-hero uppercase tracking-[0.5em] opacity-30 mb-8 font-black">Base Fabric Spectrum</h3>
                         <div className="grid grid-cols-2 gap-5 mb-8">
                            {COLOR_VARIANTS.map(v => (
                               <button 
                                  key={v.id} 
                                  onClick={() => { setActiveColor(v); setCustomColor(v.hex); }}
                                  className={`group relative p-2 rounded-[40px] border-2 transition-all duration-700 overflow-hidden text-left
                                    ${activeColor.id === v.id ? 'border-white bg-white/5 ring-4 ring-white/5' : 'border-white/5 opacity-50 hover:opacity-100 hover:bg-white/5'}
                                  `}
                               >
                                  <div className="aspect-[4/3] rounded-[32px] overflow-hidden bg-[#0a0a0a] flex items-center justify-center relative inner-shadow-lg">
                                     <img src={v.image} onError={(e) => (e.target.src = "/tshirts/tshirt-white.png")} className="w-full h-full object-contain scale-125 group-hover:scale-110 transition-all duration-700 drop-shadow-2xl" alt={v.name} />
                                  </div>
                                  <div className="px-6 py-4 flex items-center justify-between">
                                     <span className="text-[10px] font-hero uppercase tracking-widest font-black leading-none">{v.name}</span>
                                     <div className="w-4 h-4 rounded-full border border-white/10" style={{ backgroundColor: v.hex }} />
                                  </div>
                                </button>
                            ))}
                         </div>
                         
                         <div className="p-8 bg-white/5 rounded-[48px] border border-white/5 space-y-6">
                            <h4 className="text-[9px] font-hero uppercase opacity-30 tracking-[0.4em] font-black italic">Experimental_Substrate</h4>
                            <div className="flex items-center gap-8">
                               <div className="relative group">
                                  <input 
                                     type="color" 
                                     value={customColor} 
                                     onChange={(e) => {
                                        const c = e.target.value;
                                        setCustomColor(c);
                                        setActiveColor({ id: 'custom', name: 'Custom Alloy', hex: c, dark: true });
                                     }}
                                     className="w-20 h-20 rounded-full cursor-pointer bg-transparent border-0 outline-none appearance-none"
                                  />
                                  <Pipette className="absolute inset-0 m-auto pointer-events-none text-white/40 group-hover:text-white transition-all" size={24} />
                               </div>
                               <div className="flex-1 space-y-2">
                                  <span className="text-[14px] font-hero font-black tracking-widest uppercase">{customColor}</span>
                                  <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
                                     <div className="h-full bg-neon-green" style={{ width: '100%' }} />
                                  </div>
                               </div>
                            </div>
                         </div>
                      </div>
                   </div>
                )}

                {activeTab === 'text' && (() => {
                    const selEl = currentElements.find(e => e.id === selectedId);
                    const isText = selEl?.type === 'text';
                    return (
                       <div className="space-y-8 animate-in slide-in-from-right-10 duration-700">
                          <button onClick={() => addElement('text')} className="w-full py-10 bg-white text-black font-hero font-black tracking-[0.4em] uppercase rounded-[44px] hover:scale-[1.01] transition-all shadow-3xl flex items-center justify-center gap-4">
                             <Plus size={24} /> GEN_TEXT_CORE
                          </button>

                          {selectedId && isText && (
                             <div className="space-y-8 p-10 bg-white/5 rounded-[56px] border border-white/5 shadow-2xl relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-neon-blue opacity-[0.03] blur-[60px]" />
                                <div className="flex items-center gap-4 text-[10px] font-hero uppercase opacity-30 tracking-widest px-2"><Settings size={14}/> Node Config</div>
                                
                                <input 
                                   type="text" 
                                   value={selEl.content} 
                                   onChange={e => updateElement(selectedId, { content: (e.target.value).toUpperCase() })}
                                   placeholder="TERMINAL INPUT..."
                                   className="w-full bg-black border border-white/10 rounded-[32px] px-10 py-8 text-xl font-hero outline-none focus:border-neon-green uppercase tracking-widest shadow-2xl transition-all" 
                                />

                                <div>
                                   <div className="text-[9px] font-hero opacity-30 uppercase tracking-widest mb-4 italic">Neural Fonts</div>
                                   <div className="grid grid-cols-2 gap-3">
                                      {FONTS.map(f => (
                                         <button key={f} onClick={() => updateElement(selectedId, { fontFamily: f })} style={{ fontFamily: f }} className={`py-5 px-6 rounded-[24px] border text-[11px] transition-all truncate ${selEl.fontFamily === f ? 'border-neon-green bg-neon-green/10 text-white font-black' : 'border-white/5 opacity-50 hover:bg-white/5'}`}>{f}</button>
                                      ))}
                                   </div>
                                </div>

                                <div className="flex gap-4">
                                   <div className="flex-1 space-y-4">
                                      <div className="flex justify-between text-[9px] font-hero opacity-30 uppercase tracking-widest"><span>Size</span><span>{selEl.fontSize}px</span></div>
                                      <input type="range" min="12" max="120" value={selEl.fontSize} onChange={e => updateElement(selectedId, { fontSize: parseInt(e.target.value) })} className="w-full accent-neon-green bg-white/5 h-2 rounded-full cursor-pointer" />
                                   </div>
                                   <div className="space-y-4">
                                      <div className="text-[9px] font-hero opacity-30 uppercase tracking-widest">Align</div>
                                      <div className="flex p-1 bg-black rounded-2xl border border-white/5">
                                         {[['left', <AlignLeft size={16}/>], ['center', <AlignCenter size={16}/>], ['right', <AlignRight size={16}/>]].map(([a, icon]) => (
                                            <button key={a} onClick={() => updateElement(selectedId, { textAlign: a })} className={`p-3 rounded-xl transition-all ${selEl.textAlign === a ? 'bg-white text-black' : 'text-white/30 hover:text-white'}`}>{icon}</button>
                                         ))}
                                      </div>
                                   </div>
                                </div>

                                <div>
                                   <div className="text-[9px] font-hero opacity-30 uppercase tracking-widest mb-4 italic">Color Space</div>
                                   <div className="flex flex-wrap gap-3">
                                      {TEXT_COLORS.map(c => (
                                         <button key={c} onClick={() => updateElement(selectedId, { color: c })} style={{ backgroundColor: c }} className={`w-10 h-10 rounded-full border-4 transition-all ${selEl.color === c ? 'border-white scale-110 shadow-xl' : 'border-transparent opacity-40 hover:opacity-100'}`} />
                                      ))}
                                   </div>
                                </div>

                                <div className="grid grid-cols-3 gap-3 pt-4">
                                   {[['outline', 'Outline', selEl.outline], ['shadow', 'Shadow', selEl.shadow], ['glow', 'Glow', selEl.glow]].map(([key, label, val]) => (
                                      <button 
                                         key={key} 
                                         onClick={() => updateElement(selectedId, { [key]: !val })} 
                                         className={`py-4 rounded-[20px] border text-[9px] font-hero uppercase tracking-widest transition-all ${val ? 'border-neon-blue bg-neon-blue/10 text-white font-black' : 'border-white/5 opacity-40'}`}
                                      >
                                         {label}
                                      </button>
                                   ))}
                                </div>
                             </div>
                          )}
                       </div>
                    );
                })()}

                {activeTab === 'graphics' && (
                   <div className="space-y-12 animate-in slide-in-from-right-10 duration-700">
                      <div>
                         <h3 className="text-[11px] font-hero uppercase tracking-[0.5em] opacity-30 mb-8 font-black">Design Repository</h3>
                         
                         <div 
                           onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                           onDragLeave={() => setDragOver(false)}
                           onDrop={(e) => { e.preventDefault(); setDragOver(false); handleImageUpload(e.dataTransfer.files[0]); }}
                           className={`p-10 border-2 border-dashed rounded-[56px] flex flex-col items-center justify-center gap-6 transition-all duration-500 cursor-pointer mb-12
                              ${dragOver ? 'border-neon-green bg-neon-green/5 scale-[1.02]' : 'border-white/10 bg-white/5 hover:border-white/20'}
                           `}
                           onClick={() => imageInputRef.current?.click()}
                         >
                            <input type="file" ref={imageInputRef} className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e.target.files[0])} />
                            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center text-neon-blue"><Upload size={28} /></div>
                            <div className="text-center">
                               <span className="block text-[11px] font-hero uppercase tracking-widest font-black">Upload Raster Asset</span>
                               <span className="block text-[8px] font-hero opacity-30 uppercase tracking-widest mt-2">PNG / JPG / WEBP — MAX 5MB</span>
                            </div>
                         </div>

                         <div className="space-y-8">
                            <div className="flex items-center gap-4 text-[10px] font-hero uppercase opacity-30 tracking-widest italic"><Library size={14}/> Pre-compiled Assets</div>
                            <div className="grid grid-cols-2 gap-4">
                               {DESIGN_LIBRARY.map(item => (
                                  <button 
                                     key={item.id} 
                                     onClick={() => addFromLibrary(item)}
                                     className="p-8 bg-white/5 border border-white/5 rounded-[40px] flex flex-col items-center justify-center gap-4 hover:bg-white/10 transition-all group overflow-hidden"
                                  >
                                     <div className="flex-1 flex items-center justify-center py-4 px-2 scale-90 group-hover:scale-105 transition-all duration-700">
                                        <span style={{ fontFamily: item.fontFamily, color: item.color, fontWeight: item.fontWeight }} className="text-xl uppercase whitespace-nowrap leading-none truncate w-full text-center">{item.label}</span>
                                     </div>
                                     <div className="w-full h-px bg-white/5" />
                                     <span className="text-[8px] font-hero opacity-30 uppercase tracking-widest">{item.fontFamily}</span>
                                  </button>
                               ))}
                            </div>
                         </div>
                      </div>
                   </div>
                )}

                {activeTab === 'queue' && (
                    <div className="space-y-5 animate-in slide-in-from-right-10 duration-700">
                       <h3 className="text-[11px] font-hero uppercase tracking-[0.5em] opacity-30 mb-4 font-black">Layers — {activeSide}</h3>
                       {currentElements.length === 0 && <div className="py-20 text-center opacity-10 uppercase tracking-[1em] font-hero text-[10px] border-2 border-dashed border-white/5 rounded-[40px]">No Content</div>}
                       {[...currentElements].sort((a,b) => b.zIndex - a.zIndex).map(el => (
                          <div key={el.id} className={`flex items-center justify-between p-5 rounded-[36px] border transition-all duration-500 ${
                            selectedId === el.id ? 'bg-white/10 border-white/20 shadow-2xl' : 'bg-white/5 border-white/5 hover:bg-white/10'
                          }`}>
                             <div className="flex items-center gap-4 cursor-pointer" onClick={() => !el.locked && setSelectedId(el.id)}>
                                <div className={`p-4 rounded-xl ${el.type === 'text' ? 'bg-neon-blue/20 text-neon-blue' : 'bg-neon-green/20 text-neon-green'}`}>
                                   {el.type === 'text' ? <Type size={16}/> : <ImageIcon size={16}/>}
                                </div>
                                <div className="flex flex-col gap-0.5">
                                   <span className="text-[11px] font-hero font-black uppercase tracking-widest truncate max-w-[130px]">{el.type === 'text' ? el.content.slice(0,14) : 'Image'}</span>
                                   <span className="text-[8px] font-hero opacity-30 uppercase tracking-widest">index: {el.zIndex} {el.locked ? '🔒' : ''}</span>
                                </div>
                             </div>
                             <div className="flex gap-2 flex-shrink-0">
                                <button onClick={() => bringForward(el.id)} title="Bring Forward" className="p-2 rounded-xl border border-white/5 opacity-40 hover:opacity-100 hover:bg-white/10 transition-all"><ArrowUp size={14}/></button>
                                <button onClick={() => sendBackward(el.id)} title="Send Backward" className="p-2 rounded-xl border border-white/5 opacity-40 hover:opacity-100 hover:bg-white/10 transition-all"><ArrowDown size={14}/></button>
                                <button onClick={() => updateElement(el.id, { visible: !el.visible })} className="p-2 rounded-xl border border-white/5 opacity-40 hover:opacity-100 transition-all">{el.visible ? <Eye size={14}/> : <EyeOff size={14}/>}</button>
                                <button onClick={() => updateElement(el.id, { locked: !el.locked })} className={`p-2 rounded-xl border transition-all ${ el.locked ? 'border-neon-blue/50 bg-neon-blue/10 text-neon-blue opacity-100' : 'border-white/5 opacity-40 hover:opacity-100'}`}>{el.locked ? <Lock size={14}/> : <Unlock size={14}/>}</button>
                                <button onClick={() => deleteElement(el.id)} className="p-2 rounded-xl border border-white/5 text-red-500 opacity-20 hover:opacity-100 transition-all"><Trash2 size={14}/></button>
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

                      <div className="p-10 bg-black/40 rounded-[64px] border border-white/5 space-y-7 relative overflow-hidden shadow-3xl">
                         <Star className="absolute -top-10 -right-10 w-48 h-48 text-neon-green opacity-5 rotate-12" />
                         <div className="flex justify-between items-center z-10 relative">
                            <div className="space-y-2">
                               <div className="text-[10px] font-hero uppercase tracking-widest opacity-30">Base Pattern</div>
                               <div className="text-[10px] font-hero uppercase tracking-widest opacity-30">Text Synthesis (+{Math.round(pricing.textCharge / 50)} Layers)</div>
                               <div className="text-[10px] font-hero uppercase tracking-widest opacity-30">Raster Infusion (+{Math.round(pricing.imageCharge / 100)} Assets)</div>
                               <div className="text-[10px] font-hero uppercase tracking-widest opacity-30">Complexity Protocols</div>
                            </div>
                            <div className="space-y-2 text-right font-hero text-[11px] font-bold">
                               <div className="opacity-60">₹{pricing.base.toLocaleString()}</div>
                               <div className="opacity-60">₹{pricing.textCharge.toLocaleString()}</div>
                               <div className="opacity-60">₹{pricing.imageCharge.toLocaleString()}</div>
                               <div className="text-neon-blue">₹{pricing.complexityBonus.toLocaleString()}</div>
                            </div>
                         </div>
                         <div className="h-px bg-white/5 w-full z-10 relative" />
                         <div className="flex justify-between items-end z-10 relative">
                            <div className="flex flex-col">
                               <span className="text-[10px] font-hero font-black opacity-20 tracking-[0.4em]">TOTAL ALLOC</span>
                               <span className="text-[8px] font-hero text-neon-green/50 uppercase tracking-widest font-black italic">Unit: ₹{pricing.unit}</span>
                            </div>
                            <span className="text-6xl font-hero font-black text-white tracking-tighter shadow-neon-green/20">₹{pricing.total.toLocaleString()}</span>
                         </div>
                      </div>
                   </div>
                )}
             </div>

             {/* Sticky Bottom Actions (Mobile Focused) */}
             <div className="pt-10 border-t border-white/5 px-2">
                <div className="flex gap-4">
                   <button 
                     onClick={prepareCheckout} 
                     disabled={(frontElements.length === 0 && backElements.length === 0) || isExporting} 
                     className={`flex-1 py-10 rounded-[48px] font-hero font-black uppercase tracking-[0.5em] transition-all relative overflow-hidden flex items-center justify-center gap-6
                        ${(frontElements.length === 0 && backElements.length === 0) ? 'bg-white/5 text-white/10 cursor-not-allowed border border-white/5' : 'bg-neon-green text-black hover:scale-[1.01] shadow-neon-green/40 shadow-2xl active:scale-[0.98]'}
                     `}
                   >
                      {isExporting ? <RefreshCcw className="animate-spin" size={24} /> : <Zap size={28} />}
                      {isExporting ? 'PROCESSING...' : 'COMMIT ALLOCATION'}
                   </button>
                </div>
             </div>
             
             {/* Sticky Conversion Bar (Mobile Only - Global Overlay) */}
             {isMobile && !selectedId && (
                <div className="fixed bottom-0 left-0 right-0 p-8 bg-[#020202]/95 backdrop-blur-3xl border-t border-white/5 z-[100] flex items-center justify-between animate-in slide-in-from-bottom duration-1000 shadow-[0_-20px_60px_rgba(0,0,0,0.8)]">
                   <div className="flex flex-col">
                      <span className="text-[8px] font-hero opacity-30 uppercase tracking-[0.6em] mb-1">Total INR</span>
                      <span className="text-3xl font-hero font-black text-white leading-none">₹{pricing.total.toLocaleString()}</span>
                   </div>
                   <button onClick={prepareCheckout} disabled={isExporting} className="px-12 py-5 bg-neon-green text-black rounded-full font-hero font-black uppercase text-[10px] tracking-widest shadow-neon flex items-center gap-4 active:scale-95 transition-all">
                      {isExporting ? <RefreshCcw className="animate-spin" size={18} /> : <Zap size={18} />} {isExporting ? 'WAITING...' : 'ORDER NOW'}
                   </button>
                </div>
             )}
          </div>


        </div>
      ) : currentView === 'checkout' ? (
        /* Multi-Page Protocol Checkout */
        <div className="flex flex-col items-center justify-center p-28 bg-[#010101] rounded-[80px] border border-white/5 text-center animate-in zoom-in-95 duration-1000 relative shadow-3xl overflow-hidden min-h-[900px]">
           <Sparkles className="absolute top-20 right-20 w-40 h-40 text-neon-green opacity-10 animate-pulse" />
           <ArrowLeft onClick={() => setCurrentView('editor')} className="absolute top-16 left-16 cursor-pointer opacity-30 hover:opacity-100 p-8 bg-white/5 rounded-full transition-all group hover:scale-110" size={80} />
           <div className="w-40 h-40 bg-white rounded-full flex items-center justify-center mb-16 shadow-neon-white"><User size={80} className="text-black" /></div>
           <h3 className="text-8xl font-hero font-black uppercase tracking-tighter mb-10 text-white">Protocol Alpha <span className="text-neon-green">IN</span></h3>
           <p className="text-[12px] font-hero opacity-30 tracking-[0.8em] max-w-2xl mx-auto mb-28 uppercase font-bold leading-relaxed px-10">Data manifest verified for regional deployment. Authorized for physical allocation across the Indian subcontinent.</p>
           
           <div className="w-full max-w-3xl space-y-8 text-left z-10 px-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div className="space-y-3">
                    <label className="text-[10px] font-hero opacity-40 uppercase tracking-[0.2em] ml-4">Recipient Name</label>
                    <input 
                      type="text" 
                      placeholder="LEGAL ID" 
                      value={checkoutData.name}
                      onChange={(e) => setCheckoutData({ ...checkoutData, name: e.target.value })}
                      className={`w-full bg-white/5 border ${orderErrors.name ? 'border-red-500/50' : 'border-white/10'} p-10 rounded-[32px] font-hero text-[11px] tracking-widest uppercase outline-none focus:border-neon-green transition-all`} 
                    />
                    {orderErrors.name && <p className="text-[9px] text-red-500 font-hero uppercase tracking-widest ml-4">{orderErrors.name}</p>}
                 </div>
                 <div className="space-y-3">
                    <label className="text-[10px] font-hero opacity-40 uppercase tracking-[0.2em] ml-4">Neural Comm Link</label>
                    <input 
                      type="text" 
                      placeholder="+91 XXXXX XXXXX" 
                      value={checkoutData.phone}
                      onChange={(e) => setCheckoutData({ ...checkoutData, phone: e.target.value })}
                      className={`w-full bg-white/5 border ${orderErrors.phone ? 'border-red-500/50' : 'border-white/10'} p-10 rounded-[32px] font-hero text-[11px] tracking-widest uppercase outline-none focus:border-neon-green transition-all`} 
                    />
                    {orderErrors.phone && <p className="text-[9px] text-red-500 font-hero uppercase tracking-widest ml-4">{orderErrors.phone}</p>}
                 </div>
              </div>
              <div className="space-y-3">
                 <label className="text-[10px] font-hero opacity-40 uppercase tracking-[0.2em] ml-4">Deployment Zone (Coordinates)</label>
                 <input 
                   type="text" 
                   placeholder="STREET / BUILDING / LOCALITY" 
                   value={checkoutData.address}
                   onChange={(e) => setCheckoutData({ ...checkoutData, address: e.target.value })}
                   className={`w-full bg-white/5 border ${orderErrors.address ? 'border-red-500/50' : 'border-white/10'} p-10 rounded-[32px] font-hero text-[11px] tracking-widest uppercase outline-none focus:border-neon-green transition-all`} 
                 />
                 {orderErrors.address && <p className="text-[9px] text-red-500 font-hero uppercase tracking-widest ml-4">{orderErrors.address}</p>}
              </div>
              <div className="grid grid-cols-2 gap-8">
                 <div className="space-y-3">
                    <label className="text-[10px] font-hero opacity-40 uppercase tracking-[0.2em] ml-4">City Grid</label>
                    <input 
                      type="text" 
                      placeholder="BANGALORE_CORE" 
                      value={checkoutData.city}
                      onChange={(e) => setCheckoutData({ ...checkoutData, city: e.target.value })}
                      className={`w-full bg-white/5 border ${orderErrors.city ? 'border-red-500/50' : 'border-white/10'} p-10 rounded-[32px] font-hero text-[11px] tracking-widest uppercase outline-none focus:border-neon-green transition-all`} 
                    />
                    {orderErrors.city && <p className="text-[9px] text-red-500 font-hero uppercase tracking-widest ml-4">{orderErrors.city}</p>}
                 </div>
                 <div className="space-y-3">
                    <label className="text-[10px] font-hero opacity-40 uppercase tracking-[0.2em] ml-4">PIN Protocol</label>
                    <input 
                      type="text" 
                      placeholder="XXXXXX" 
                      value={checkoutData.pincode}
                      onChange={(e) => setCheckoutData({ ...checkoutData, pincode: e.target.value })}
                      className={`w-full bg-white/5 border ${orderErrors.pincode ? 'border-red-500/50' : 'border-white/10'} p-10 rounded-[32px] font-hero text-[11px] tracking-widest uppercase outline-none focus:border-neon-green transition-all`} 
                    />
                    {orderErrors.pincode && <p className="text-[9px] text-red-500 font-hero uppercase tracking-widest ml-4">{orderErrors.pincode}</p>}
                 </div>
              </div>
              <div className="pt-10 flex flex-col gap-6 items-center">
                 <button 
                   onClick={placeOrder} 
                   disabled={isProcessingPayment}
                   className={`w-full py-14 font-hero font-black uppercase tracking-[0.6em] rounded-[60px] shadow-neon-white transition-all flex items-center justify-center gap-8 text-2xl
                     ${isProcessingPayment ? 'bg-white/10 text-white/20 cursor-wait' : 'bg-white text-black hover:bg-neon-green hover:scale-[1.02] active:scale-[0.98]'}
                   `}
                 >
                    {isProcessingPayment ? <RefreshCcw size={36} className="animate-spin" /> : <CreditCard size={36} />} 
                    {isProcessingPayment ? 'AUTHORIZING...' : `AUTHORIZE INR ${pricing.total.toLocaleString()} ALLOC`}
                 </button>
                 <span className="text-[9px] font-hero opacity-20 uppercase tracking-[0.5em] group cursor-pointer hover:opacity-50 transition-all flex items-center gap-3">
                    <Truck size={14} /> SECURE CRYPTOGRAPHIC SHIPMENT GUARANTEED
                 </span>
              </div>
           </div>
        </div>
      ) : (
        /* Success View - Deployment Confirmation */
        <div className="flex flex-col items-center justify-center p-28 bg-[#010101] rounded-[80px] border border-white/5 text-center animate-in zoom-in duration-1000 relative shadow-3xl overflow-hidden min-h-[900px]">
           <div className="absolute inset-0 bg-neon-green/5 animate-pulse" />
           <div className="w-48 h-48 bg-neon-green text-black rounded-full flex items-center justify-center mb-16 shadow-neon-green scale-110 animate-bounce"><Zap size={80} /></div>
           <h3 className="text-8xl font-hero font-black uppercase tracking-tighter mb-8 text-white">FORGE <span className="text-neon-green">INITIALIZED</span></h3>
           <p className="text-[14px] font-hero opacity-40 tracking-[0.8em] max-w-2xl mx-auto mb-20 uppercase font-black">Manifest {lockedOrder?.id || 'UF-INTERNAL'} Locked. Physical Payload Dispatched to Regional Logistics Rail.</p>
           
           <div className="w-full max-w-2xl bg-white/5 border border-white/10 p-14 rounded-[64px] space-y-8 backdrop-blur-3xl mb-20">
              <div className="flex justify-between items-center text-[11px] font-hero uppercase tracking-widest opacity-40">
                 <span>Protocol Reference</span>
                 <span>Alloc Total</span>
              </div>
              <div className="flex justify-between items-end">
                 <span className="text-3xl font-hero font-black text-white">{lockedOrder?.id || 'UF-LOG-01'}</span>
                 <span className="text-6xl font-hero font-black text-white text-neon-green shadow-neon-green/20">₹{(lockedOrder?.price?.total || pricing.total).toLocaleString()}</span>
              </div>
              <div className="h-px bg-white/5 w-full" />
              <div className="flex justify-between items-center text-[10px] font-hero uppercase tracking-widest">
                 <span className="text-white/30 italic">ETA: 3–5 Days India-Wide</span>
                 <span className="text-neon-blue font-black flex items-center gap-2"> <Truck size={14} /> SECURE RAIL DISPATCH</span>
              </div>
           </div>

           <button onClick={() => { 
             setFrontElements([]); 
             setBackElements([]); 
             setLockedOrder(null);
             setCurrentView('editor'); 
           }} className="px-20 py-10 bg-white text-black font-hero font-black uppercase tracking-[0.8em] rounded-full shadow-neon-white hover:bg-neon-green transition-all hover:scale-105 active:scale-95 text-xl">
              RETURN TO FORGE
           </button>
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
                           <img 
                              src={item.designImage || "/tshirts/tshirt-white.png"} 
                              onError={(e) => e.target.src = "/tshirts/tshirt-white.png"}
                              className="w-full h-full object-contain p-8 animate-in zoom-in duration-1000" 
                           />
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
