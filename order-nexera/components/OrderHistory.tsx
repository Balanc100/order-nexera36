
import React from 'react';
import { Order } from '../types';
import { Clock, ShoppingBag, Sparkles, User, Phone, Truck, Cloud, CloudOff, RotateCw } from 'lucide-react';

interface OrderHistoryProps {
  orders: Order[];
  onSync?: () => void;
  isSyncing?: boolean;
  useCloud?: boolean;
}

export const OrderHistory: React.FC<OrderHistoryProps> = ({ orders, onSync, isSyncing, useCloud }) => {
  
  const sortedOrders = [...orders].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="space-y-6 pb-20">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
          <Clock className="w-6 h-6" />
          ประวัติการสั่งซื้อ
        </h2>
        
        {useCloud && (
           <button 
             onClick={onSync}
             disabled={isSyncing}
             className="flex items-center gap-2 text-sm bg-white border border-slate-200 px-4 py-2 rounded-lg hover:bg-slate-50 text-slate-600 transition-colors disabled:opacity-50"
           >
             <RotateCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
             {isSyncing ? 'กำลังอัปเดต...' : 'อัปเดตข้อมูลล่าสุด'}
           </button>
        )}
      </div>
      
      {orders.length === 0 ? (
        <div className="text-center py-20 text-slate-400 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
          <ShoppingBag className="w-16 h-16 mx-auto mb-4 opacity-30" />
          <p className="text-xl font-medium text-slate-500">ยังไม่มีประวัติการสั่งซื้อ</p>
          <p className="text-sm mt-2 opacity-70">รายการสั่งซื้อของคุณจะปรากฏที่นี่</p>
        </div>
      ) : (
        <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
          {sortedOrders.map((order) => {
             // Fallback calculations
             const shippingTotal = order.totalShipping || order.items.reduce((acc, item) => acc + ((item.shippingCost || 0) * item.quantity), 0);
             const itemsTotal = order.items.reduce((acc, item) => acc + (item.price * item.quantity), 0);

             return (
            <div key={order.id} className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden group hover:shadow-md transition-all duration-300">
              <div className="bg-slate-50/80 p-4 border-b border-slate-100 flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2 font-semibold text-slate-700">
                    <User className="w-4 h-4 text-slate-400" /> {order.customerName}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-500 mt-1">
                    <Phone className="w-4 h-4 text-slate-400" /> {order.customerPhone}
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center justify-end gap-2 text-sm text-slate-400 mb-1">
                    {useCloud && (
                      <span title={order.synced ? "Saved to Cloud" : "Local Only"}>
                         {order.synced ? <Cloud className="w-4 h-4 text-sky-500" /> : <CloudOff className="w-4 h-4 text-amber-400" />}
                      </span>
                    )}
                    {new Date(order.date).toLocaleString('th-TH', { 
                      day: 'numeric', month: 'short', year: '2-digit', hour: '2-digit', minute:'2-digit' 
                    })}
                  </div>
                  <div className="font-bold text-emerald-600 text-lg">
                    ฿{order.totalPrice.toLocaleString()}
                  </div>
                </div>
              </div>

              <div className="p-5">
                <div className="mb-4">
                   <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">รายการสินค้า</h4>
                   <ul className="space-y-2.5">
                    {order.items.map((item, idx) => (
                      <li key={idx} className="flex justify-between text-sm text-slate-700 items-center">
                        <div className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400"></div>
                          <span>{item.name}</span>
                          <span className="text-xs bg-slate-100 px-1.5 py-0.5 rounded text-slate-500">x{item.quantity}</span>
                        </div>
                        <span className="font-medium text-slate-600">฿{(item.price * item.quantity).toLocaleString()}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Summary Breakdown */}
                <div className="bg-slate-50 rounded-lg p-3 mb-4 text-sm space-y-1.5 border border-slate-100">
                   <div className="flex justify-between text-slate-600">
                      <span>ค่าสินค้า</span>
                      <span>฿{itemsTotal.toLocaleString()}</span>
                   </div>
                   <div className="flex justify-between text-slate-600">
                      <span className="flex items-center gap-1.5"><Truck className="w-3 h-3"/> ค่าจัดส่ง</span>
                      <span>฿{shippingTotal.toLocaleString()}</span>
                   </div>
                   <div className="flex justify-between font-bold text-slate-800 pt-2 border-t border-slate-200 mt-1.5">
                      <span>ยอดรวมสุทธิ</span>
                      <span>฿{order.totalPrice.toLocaleString()}</span>
                   </div>
                </div>

                {/* AI Summary Section */}
                <div className={`bg-indigo-50 rounded-lg p-3.5 text-sm border border-indigo-100 relative overflow-hidden ${order.isLoadingAi ? 'opacity-70' : ''}`}>
                  {order.isLoadingAi && (
                    <div className="absolute inset-0 bg-white/50 flex items-center justify-center z-10 backdrop-blur-[1px]">
                       <Sparkles className="w-5 h-5 text-indigo-400 animate-pulse" />
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-indigo-700 font-bold mb-1.5">
                    <Sparkles className="w-4 h-4" />
                    <span>ข้อความจาก AI Assistant</span>
                  </div>
                  <p className="text-indigo-900/80 leading-relaxed text-sm">
                    {order.aiSummary || (order.isLoadingAi ? "..." : "ขอบคุณที่ใช้บริการ")}
                  </p>
                </div>
              </div>
            </div>
          )})}
        </div>
      )}
    </div>
  );
};
