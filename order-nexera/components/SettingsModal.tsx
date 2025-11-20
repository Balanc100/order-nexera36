
import React, { useState } from 'react';
import { X, Save, Database, Copy, Check, Users, Globe, ShieldAlert } from 'lucide-react';
import { AppConfig } from '../services/storageService';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: AppConfig;
  onSave: (config: AppConfig) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, config, onSave }) => {
  const [url, setUrl] = useState(config.scriptUrl);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const GAS_CODE = `
function doGet() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Orders');
  if (!sheet) {
    sheet = SpreadsheetApp.getActiveSpreadsheet().insertSheet('Orders');
    sheet.appendRow(['JSON_DATA', 'Date', 'Customer', 'Total']); // Headers
  }
  
  var data = sheet.getDataRange().getValues();
  var orders = [];
  
  // Start from row 1 (skip header)
  for (var i = 1; i < data.length; i++) {
    var jsonCell = data[i][0];
    if (jsonCell && jsonCell !== "") {
      try {
        orders.push(JSON.parse(jsonCell));
      } catch (e) {
        // Skip invalid rows
      }
    }
  }
  
  // Return JSON sorted by date (newest first logic handled in frontend)
  return ContentService.createTextOutput(JSON.stringify(orders))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Orders');
  if (!sheet) {
    sheet = SpreadsheetApp.getActiveSpreadsheet().insertSheet('Orders');
    sheet.appendRow(['JSON_DATA', 'Date', 'Customer', 'Total']);
  }
  
  var jsonString = e.postData.contents;
  var order = JSON.parse(jsonString);
  
  // Store raw JSON in first column, and readable fields in others
  sheet.appendRow([
    jsonString, 
    order.date, 
    order.customerName, 
    order.totalPrice
  ]);
  
  return ContentService.createTextOutput("Success")
    .setMimeType(ContentService.MimeType.TEXT);
}
`;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(GAS_CODE);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-2xl flex flex-col max-h-[90vh] shadow-2xl">
        
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
          <div className="flex items-center gap-3 text-slate-800">
            <div className="bg-emerald-100 p-2 rounded-lg">
               <Database className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold">ตั้งค่าการเชื่อมต่อ Cloud</h2>
              <p className="text-xs text-slate-500">เชื่อมต่อกับ Google Sheet เพื่อใช้งานหลายคน</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <X className="w-6 h-6 text-slate-500" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
          {/* Step 1 */}
          <div className="space-y-3">
            <h3 className="font-semibold text-slate-800 flex items-center gap-2">
              <span className="bg-slate-800 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs">1</span>
              สร้าง Google Sheet (ทำครั้งแรกครั้งเดียว)
            </h3>
            <p className="text-sm text-slate-600 ml-8">
              สร้างไฟล์ Google Sheet ในบัญชี Google ของคุณ (บัญชีที่จะเป็นเจ้าของข้อมูล) <br/>
              จากนั้นไปที่เมนู <strong>Extensions (ส่วนขยาย)</strong> {'>'} <strong>Apps Script</strong>
            </p>
          </div>

          {/* Step 2 */}
          <div className="space-y-3">
            <h3 className="font-semibold text-slate-800 flex items-center gap-2">
              <span className="bg-slate-800 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs">2</span>
              วางโค้ดสคริปต์
            </h3>
            <div className="ml-8 relative group">
              <div className="absolute right-2 top-2">
                <button 
                  onClick={handleCopyCode}
                  className="bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded text-xs backdrop-blur-md border border-white/20 flex items-center gap-2 transition-all"
                >
                  {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  {copied ? "คัดลอกแล้ว" : "คัดลอกโค้ด"}
                </button>
              </div>
              <pre className="bg-slate-900 text-slate-300 p-4 rounded-xl text-xs overflow-x-auto font-mono leading-relaxed border border-slate-800">
                {GAS_CODE}
              </pre>
            </div>
          </div>

          {/* Step 3 */}
          <div className="space-y-3">
            <h3 className="font-semibold text-slate-800 flex items-center gap-2">
              <span className="bg-slate-800 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs">3</span>
              Deploy (สำคัญมาก!)
            </h3>
            <div className="ml-8 bg-amber-50 border border-amber-100 p-4 rounded-xl text-sm text-slate-700 space-y-2">
              <p className="font-bold text-amber-800 flex items-center gap-2">
                <ShieldAlert className="w-4 h-4"/> ต้องตั้งค่าตามนี้เพื่อให้พนักงานอื่นใช้ได้:
              </p>
              <ul className="list-disc list-inside space-y-1 pl-1">
                <li>กดปุ่ม <strong>Deploy</strong> (สีฟ้า) {'>'} <strong>New deployment</strong></li>
                <li>เลือก type เป็น <strong>Web app</strong></li>
                <li>ช่อง <strong>Execute as</strong>: เลือก <strong>Me (ตัวเราเอง)</strong></li>
                <li>ช่อง <strong>Who has access</strong>: เลือก <strong>Anyone (ทุกคน)</strong></li>
                <li>กด Deploy แล้วคัดลอก <strong>Web app URL</strong></li>
              </ul>
            </div>
          </div>

          {/* Step 4 */}
          <div className="space-y-3">
             <h3 className="font-semibold text-slate-800 flex items-center gap-2">
              <span className="bg-slate-800 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs">4</span>
              การใช้งานร่วมกันหลายคน
            </h3>
            <div className="ml-8 flex gap-3 items-start text-sm text-slate-600">
               <Users className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" />
               <p>
                 นำ <strong>Web App URL</strong> ที่ได้ ไปใส่ในหน้าตั้งค่าของเครื่องพนักงานหรือเครื่องอื่นๆ ได้เลย 
                 ข้อมูลจะถูกบันทึกลง Sheet เดียวกันทันที <strong className="text-indigo-600">โดยที่เครื่องอื่นไม่ต้อง Login บัญชี Google</strong>
               </p>
            </div>
          </div>

          {/* URL Input */}
          <div className="pt-6 border-t border-slate-100">
             <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
               <Globe className="w-4 h-4 text-emerald-600" />
               Web App URL
             </label>
             <input
               type="text"
               value={url}
               onChange={(e) => setUrl(e.target.value)}
               placeholder="https://script.google.com/macros/s/..."
               className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent font-mono text-sm bg-slate-50 text-slate-600"
             />
             <p className="text-xs text-slate-400 mt-2">วาง URL ที่นี่แล้วกดบันทึก</p>
          </div>
        </div>

        <div className="p-6 border-t border-slate-100 bg-slate-50 rounded-b-2xl flex justify-end gap-3">
          <button 
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl text-slate-600 font-medium hover:bg-slate-200 transition-colors"
          >
            ยกเลิก
          </button>
          <button 
            onClick={() => onSave({ scriptUrl: url })}
            className="px-5 py-2.5 rounded-xl bg-emerald-600 text-white font-medium hover:bg-emerald-700 shadow-lg shadow-emerald-200 flex items-center gap-2 transition-transform active:scale-95"
          >
            <Save className="w-4 h-4" />
            บันทึกการตั้งค่า
          </button>
        </div>
      </div>
    </div>
  );
};
