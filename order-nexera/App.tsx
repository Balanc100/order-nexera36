
import React, { useState, useMemo, useEffect } from 'react';
import { ShoppingCart, List, CheckCircle, Plus, Minus, Trash2, Store, Package, Truck, Settings, User } from 'lucide-react';
import { INITIAL_PRODUCTS } from './constants';
import { Product, CartItem, Order, ViewState } from './types';
import { OrderHistory } from './components/OrderHistory';
import { SettingsModal } from './components/SettingsModal';
import { generateOrderSummary } from './services/geminiService';
import { 
  getLocalOrders, 
  saveLocalOrders, 
  getAppConfig, 
  saveAppConfig, 
  fetchCloudOrders, 
  saveOrderToCloud,
  AppConfig 
} from './services/storageService';

const App: React.FC = () => {
  // --- State ---
  const [products] = useState<Product[]>(INITIAL_PRODUCTS);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [view, setView] = useState<ViewState>('shop');
  
  // Config State
  const [config, setConfig] = useState<AppConfig>(getAppConfig());
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  
  // Customer Form State
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // --- Effects ---

  // Initial Load
  useEffect(() => {
    const localData = getLocalOrders();
    setOrders(localData);
    
    // If cloud URL exists, try fetching from cloud immediately
    if (config.scriptUrl) {
      handleCloudSync(config.scriptUrl, localData);
    }
  }, []);

  // Save to LocalStorage on change
  useEffect(() => {
    saveLocalOrders(orders);
  }, [orders]);

  // --- Handlers ---

  const handleCloudSync = async (url: string, currentLocalOrders: Order[]) => {
    setIsSyncing(true);
    try {
      const cloudOrders = await fetchCloudOrders(url);
      
      if (cloudOrders.length > 0) {
        // Simple merge strategy: Prefer Cloud data if ID matches, otherwise add new
        // In a real app, you'd want more complex conflict resolution
        const mergedMap = new Map<string, Order>();
        
        // Add local orders first
        currentLocalOrders.forEach(o => mergedMap.set(o.id, o));
        
        // Overwrite/Add cloud orders
        cloudOrders.forEach(o => mergedMap.set(o.id, o));
        
        const mergedList = Array.from(mergedMap.values());
        setOrders(mergedList);
      }
    } catch (e) {
      console.error("Background sync failed", e);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleSaveConfig = (newConfig: AppConfig) => {
    setConfig(newConfig);
    saveAppConfig(newConfig);
    setIsSettingsOpen(false);
    if (newConfig.scriptUrl) {
      handleCloudSync(newConfig.scriptUrl, orders);
    }
  };

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        if (existing.quantity >= product.stock) return prev;
        return prev.map(item => 
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCart(prev => {
      return prev.map(item => {
        if (item.id === productId) {
          const newQty = item.quantity + delta;
          if (newQty <= 0) return item;
          const product = products.find(p => p.id === productId);
          if (product && newQty > product.stock) return item;
          return { ...item, quantity: newQty };
        }
        return item;
      });
    });
  };

  const handleSaveOrder = async () => {
    if (cart.length === 0) {
      alert("กรุณาเลือกสินค้า");
      return;
    }
    if (!customerName || !customerPhone) {
      alert("กรุณากรอกชื่อและเบอร์โทรศัพท์");
      return;
    }

    const cartItemTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const cartShippingTotal = cart.reduce((sum, item) => sum + (item.shippingCost * item.quantity), 0);
    const cartGrandTotal = cartItemTotal + cartShippingTotal;

    const newOrder: Order = {
      id: Date.now().toString(),
      customerName,
      customerPhone,
      items: [...cart],
      totalPrice: cartGrandTotal,
      totalShipping: cartShippingTotal,
      date: new Date().toISOString(),
      isLoadingAi: true,
      synced: false
    };

    // Optimistic UI Update
    setOrders(prev => [newOrder, ...prev]);
    setCart([]);
    setCustomerName('');
    setCustomerPhone('');
    setShowSuccessModal(true);

    // 1. Trigger Cloud Save if Configured
    if (config.scriptUrl) {
      // Fire and forget cloud save (or handle status later)
      saveOrderToCloud(config.scriptUrl, newOrder).then(success => {
        if (success) {
          setOrders(current => current.map(o => o.id === newOrder.id ? { ...o, synced: true } : o));
        }
      });
    }

    // 2. Trigger AI
    try {
      const summary = await generateOrderSummary(newOrder);
      setOrders(prev => prev.map(o => 
        o.id === newOrder.id ? { ...o, aiSummary: summary, isLoadingAi: false } : o
      ));
    } catch (e) {
      setOrders(prev => prev.map(o => 
        o.id === newOrder.id ? { ...o, isLoadingAi: false } : o
      ));
    }
  };

  // --- Computed ---
  const productsByBrand = useMemo(() => {
    const groups: Record<string, Product[]> = {};
    products.forEach(p => {
      if (!groups[p.brand]) groups[p.brand] = [];
      groups[p.brand].push(p);
    });
    return groups;
  }, [products]);

  const brands = Object.keys(productsByBrand);
  const cartItemTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const cartShippingTotal = cart.reduce((sum, item) => sum + (item.shippingCost * item.quantity), 0);
  const cartGrandTotal = cartItemTotal + cartShippingTotal;
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-24 lg:pb-0">
      {/* Navigation Bar */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 text-emerald-600 cursor-pointer" onClick={() => setView('shop')}>
            <div className="bg-emerald-100 p-2 rounded-lg">
              <Store className="w-6 h-6" />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-slate-800 hidden sm:block">Health<span className="text-emerald-600">Store</span></h1>
          </div>
          
          <div className="flex items-center gap-2 sm:gap-4">
            <div className="flex bg-slate-100 rounded-full p-1">
              <button 
                onClick={() => setView('shop')}
                className={`flex items-center gap-2 px-4 py-1.5 rounded-full transition-all text-sm font-medium ${view === 'shop' ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              >
                <Package className="w-4 h-4" />
                <span className="hidden sm:inline">สินค้า</span>
              </button>
              <button 
                onClick={() => setView('history')}
                className={`flex items-center gap-2 px-4 py-1.5 rounded-full transition-all text-sm font-medium ${view === 'history' ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              >
                <List className="w-4 h-4" />
                <span className="hidden sm:inline">ประวัติ</span>
              </button>
            </div>
            
            <div className="h-6 w-px bg-slate-200 mx-1"></div>

            <button 
              onClick={() => setIsSettingsOpen(true)}
              className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors relative"
              title="ตั้งค่า Cloud"
            >
              <Settings className="w-5 h-5" />
              {config.scriptUrl && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-emerald-500 rounded-full ring-2 ring-white"></span>
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {view === 'history' ? (
          <OrderHistory 
            orders={orders} 
            onSync={() => handleCloudSync(config.scriptUrl, orders)}
            isSyncing={isSyncing}
            useCloud={!!config.scriptUrl}
          />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            
            {/* Left: Product List */}
            <div className="lg:col-span-2 space-y-8">
              {brands.map(brand => (
                <div key={brand} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 scroll-mt-20">
                  <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2 border-b pb-2 border-slate-100">
                    <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-lg text-xs uppercase tracking-wider font-bold">{brand}</span>
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {productsByBrand[brand].map(product => {
                      const inCart = cart.find(item => item.id === product.id);
                      return (
                        <div key={product.id} className="flex gap-4 p-3 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-200 group">
                          <div className="relative">
                            <img 
                              src={product.imageUrl} 
                              alt={product.name} 
                              className="w-24 h-24 object-cover rounded-xl bg-slate-100 shadow-inner"
                            />
                            {product.stock === 0 && (
                              <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] flex items-center justify-center rounded-xl">
                                <span className="bg-slate-800 text-white text-xs px-2 py-1 rounded font-bold">หมด</span>
                              </div>
                            )}
                          </div>
                          <div className="flex-1 flex flex-col justify-between py-0.5">
                            <div>
                              <h4 className="font-semibold text-slate-800 line-clamp-2 leading-tight mb-1.5">{product.name}</h4>
                              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                                <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-600 font-medium flex items-center gap-1">
                                  <Truck className="w-3 h-3" />
                                  ฿{product.shippingCost}
                                </span>
                                <span>เหลือ: {product.stock}</span>
                              </div>
                            </div>
                            <div className="flex justify-between items-end mt-2">
                              <span className="font-bold text-emerald-600 text-lg">฿{product.price.toLocaleString()}</span>
                              {inCart ? (
                                <div className="flex items-center gap-3 bg-white shadow border border-slate-200 rounded-lg px-1.5 py-1">
                                  <button 
                                    onClick={() => {
                                      if (inCart.quantity === 1) removeFromCart(product.id);
                                      else updateQuantity(product.id, -1);
                                    }}
                                    className="p-0.5 hover:bg-slate-100 rounded text-slate-600"
                                  >
                                    <Minus className="w-4 h-4" />
                                  </button>
                                  <span className="text-sm font-bold w-4 text-center text-slate-800">{inCart.quantity}</span>
                                  <button 
                                    onClick={() => updateQuantity(product.id, 1)}
                                    className="p-0.5 hover:bg-slate-100 rounded text-emerald-600"
                                    disabled={inCart.quantity >= product.stock}
                                  >
                                    <Plus className="w-4 h-4" />
                                  </button>
                                </div>
                              ) : (
                                <button 
                                  onClick={() => addToCart(product)}
                                  disabled={product.stock === 0}
                                  className="bg-slate-900 text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-slate-700 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100"
                                >
                                  เพิ่ม
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* Right: Cart & Form */}
            <div className="lg:col-span-1 space-y-6 sticky top-24">
              {/* Customer Info Form */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <User className="w-5 h-5 text-emerald-600" />
                  ข้อมูลลูกค้า
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1.5">ชื่อลูกค้า</label>
                    <input
                      type="text"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="กรอกชื่อลูกค้า"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-shadow text-slate-800 placeholder:text-slate-400"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1.5">เบอร์โทรศัพท์</label>
                    <input
                      type="tel"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="081-234-5678"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-shadow text-slate-800 placeholder:text-slate-400"
                    />
                  </div>
                </div>
              </div>

              {/* Cart Summary */}
              <div className="bg-white rounded-2xl p-6 shadow-xl border border-slate-100 ring-1 ring-slate-900/5">
                <div className="flex items-center gap-2 mb-4 pb-4 border-b border-slate-100">
                  <div className="bg-emerald-100 p-1.5 rounded-lg">
                    <ShoppingCart className="w-5 h-5 text-emerald-600" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-800">สรุปรายการ</h3>
                  {cartCount > 0 && (
                    <span className="ml-auto bg-slate-900 text-white text-xs font-bold px-2.5 py-1 rounded-full">{cartCount} ชิ้น</span>
                  )}
                </div>
                
                {cart.length === 0 ? (
                  <div className="text-center py-10">
                    <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                      <ShoppingCart className="w-8 h-8 text-slate-300" />
                    </div>
                    <p className="text-slate-400 font-medium">ตะกร้าว่างเปล่า</p>
                    <p className="text-xs text-slate-400 mt-1">เลือกสินค้าจากรายการด้านซ้าย</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="max-h-60 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
                      {cart.map(item => (
                        <div key={item.id} className="flex justify-between items-start text-sm group">
                          <div className="flex flex-col">
                            <span className="text-slate-700 font-semibold">{item.name}</span>
                            <div className="text-slate-400 text-xs mt-0.5 flex items-center gap-2">
                              <span>{item.quantity} x ฿{item.price.toLocaleString()}</span>
                              <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                              <span>ค่าส่ง ฿{item.shippingCost * item.quantity}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                             <span className="font-bold text-slate-800">฿{(item.quantity * item.price).toLocaleString()}</span>
                             <button 
                               onClick={() => removeFromCart(item.id)}
                               className="text-slate-300 hover:text-red-500 transition-colors p-1 -mr-1"
                             >
                               <Trash2 className="w-4 h-4" />
                             </button>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="pt-4 border-t border-slate-100 space-y-2.5">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-slate-600">ค่าสินค้า</span>
                        <span className="font-medium text-slate-900">฿{cartItemTotal.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center text-sm text-slate-600">
                        <span className="flex items-center gap-1.5"><Truck className="w-3.5 h-3.5 text-slate-400"/> ค่าจัดส่ง</span>
                        <span className="font-medium">฿{cartShippingTotal.toLocaleString()}</span>
                      </div>
                      
                      <div className="flex justify-between items-center pt-3 mt-2 border-t border-dashed border-slate-200">
                        <span className="font-bold text-slate-800 text-lg">ยอดรวมสุทธิ</span>
                        <span className="text-2xl font-bold text-emerald-600">฿{cartGrandTotal.toLocaleString()}</span>
                      </div>
                      
                      <button
                        onClick={handleSaveOrder}
                        className="w-full bg-emerald-600 text-white py-3.5 rounded-xl font-bold text-lg hover:bg-emerald-700 active:scale-[0.98] transition-all shadow-lg shadow-emerald-200 mt-2 flex justify-center items-center gap-2"
                      >
                        <span>ยืนยันการสั่งซื้อ</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Mobile Floating Cart Button */}
      {view === 'shop' && cart.length > 0 && (
        <div className="lg:hidden fixed bottom-4 left-4 right-4 z-40 animate-in slide-in-from-bottom-4">
           <button 
             onClick={() => {
               window.scrollTo({ top: 0, behavior: 'smooth' });
             }}
             className="w-full bg-slate-900 text-white p-4 rounded-2xl shadow-2xl flex justify-between items-center active:scale-[0.98] transition-transform"
           >
             <div className="flex items-center gap-3">
               <div className="bg-emerald-500 w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold shadow-lg shadow-emerald-500/20">{cartCount}</div>
               <div className="flex flex-col items-start">
                 <span className="font-bold text-sm">ดูตะกร้าสินค้า</span>
                 <span className="text-xs text-slate-400">แตะเพื่อชำระเงิน</span>
               </div>
             </div>
             <span className="font-bold text-xl">฿{cartGrandTotal.toLocaleString()}</span>
           </button>
        </div>
      )}

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner ring-8 ring-emerald-50">
              <CheckCircle className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-bold text-slate-800 mb-2">บันทึกสำเร็จ!</h3>
            <p className="text-slate-500 mb-8 leading-relaxed">
              ออเดอร์ของคุณถูกบันทึกเรียบร้อยแล้ว <br/>
              {config.scriptUrl && <span className="text-emerald-600 text-xs font-bold bg-emerald-50 px-2 py-1 rounded mt-1 inline-block">Synced to Cloud</span>}
            </p>
            <div className="flex gap-3">
              <button 
                onClick={() => {
                  setShowSuccessModal(false);
                  setView('history');
                }}
                className="flex-1 bg-slate-900 text-white py-3 rounded-xl font-bold hover:bg-slate-800 transition-colors"
              >
                ดูประวัติ
              </button>
              <button 
                onClick={() => setShowSuccessModal(false)}
                className="flex-1 bg-slate-100 text-slate-700 py-3 rounded-xl font-bold hover:bg-slate-200 transition-colors"
              >
                ปิด
              </button>
            </div>
          </div>
        </div>
      )}

      <SettingsModal 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)}
        config={config}
        onSave={handleSaveConfig}
      />
    </div>
  );
};

export default App;
