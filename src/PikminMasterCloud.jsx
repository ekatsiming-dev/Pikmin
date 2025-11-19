import React, { useState, useEffect } from 'react';
import { 
  Train, Pill, Coffee, Store, Utensils, Scissors, ShoppingBag, 
  Croissant, Candy, MapPin, CheckCircle2, Plane, Palette, 
  TentTree, Waves, Info, Star, CloudUpload, CloudDownload, Loader2, 
  Settings, Link as LinkIcon, Copy, Check, HelpCircle, ChevronDown, ChevronUp,
  GraduationCap, Landmark, Drama, Hotel, Clapperboard, Fish, Sparkles
} from 'lucide-react';

// --- 設定區 ---
const DEFAULT_SCRIPT_URL = ''; 

// 這是要給使用者複製的後端程式碼
const BACKEND_CODE_TEMPLATE = `
// --- 請複製以下整段程式碼 ---
const SHEET_ID = '請在此填入您的GoogleSheetID'; 
const DATA_SHEET_NAME = 'CollectionData';
const LOG_SHEET_NAME = 'LocationLogs';

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.tryLock(10000);
  try {
    const params = JSON.parse(e.postData.contents);
    const action = params.action;
    const ss = SpreadsheetApp.openById(SHEET_ID);

    if (action === 'save_collection') {
      let sheet = ss.getSheetByName(DATA_SHEET_NAME);
      if (!sheet) sheet = ss.insertSheet(DATA_SHEET_NAME);
      sheet.getRange(1, 1, 1, 2).setValues([[new Date(), JSON.stringify(params.data)]]);
      return ContentService.createTextOutput(JSON.stringify({status: 'success'}));
    }
  } catch (e) {
    return ContentService.createTextOutput(JSON.stringify({status: 'error'}));
  } finally {
    lock.releaseLock();
  }
}

function doGet(e) {
  const action = e.parameter.action;
  if (action === 'load_collection') {
    const ss = SpreadsheetApp.openById(SHEET_ID);
    const sheet = ss.getSheetByName(DATA_SHEET_NAME);
    if (!sheet) return ContentService.createTextOutput(JSON.stringify({}));
    const data = sheet.getRange(1, 2).getValue();
    return ContentService.createTextOutput(data).setMimeType(ContentService.MimeType.JSON);
  }
}
// --- 程式碼結束 ---
`;

const PIKMIN_COLORS = [
  { id: 'red', name: '紅', color: 'bg-red-500', border: 'border-red-500' },
  { id: 'yellow', name: '黃', color: 'bg-yellow-400', border: 'border-yellow-400' },
  { id: 'blue', name: '藍', color: 'bg-blue-500', border: 'border-blue-500' },
  { id: 'purple', name: '紫', color: 'bg-purple-600', border: 'border-purple-600' },
  { id: 'white', name: '白', color: 'bg-gray-100', border: 'border-gray-300' },
  { id: 'pink', name: '羽', color: 'bg-pink-400', border: 'border-pink-400' },
  { id: 'rock', name: '岩', color: 'bg-gray-600', border: 'border-gray-600' },
];

const LOCATIONS = {
  work: {
    title: '奇美 / 南台商圈',
    icon: <Pill className="w-6 h-6" />,
    desc: '交通樞紐與學生美食街的結合。大橋車站是核心。',
    color: 'bg-blue-50',
    targets: [
      { id: 'station', name: '火車站 (Station)', subType: '改札車票 / 紙火車', icon: <Train className="w-5 h-5 text-blue-600" />, tip: '奇美靠鐵軌側/大橋站。目標：印有「大橋」的紀念車票。', priority: 'SSR' },
      { id: 'pharmacy', name: '藥局 (Pharmacy)', subType: '牙刷 / 牙膏', icon: <Pill className="w-5 h-5 text-teal-600" />, tip: '辦公室內、醫院大廳或中華路藥局。', priority: 'High' },
      { id: 'restaurant', name: '餐廳 (Restaurant)', subType: '廚師帽', icon: <Utensils className="w-5 h-5 text-red-500" />, tip: '南台街學生餐廳美食密集區。', priority: 'Mid', hasRare: true },
      { id: 'cafe', name: '咖啡店 (Cafe)', subType: '咖啡杯', icon: <Coffee className="w-5 h-5 text-amber-700" />, tip: '醫院內星巴克、南台街咖啡店。', priority: 'Mid' }
    ]
  },
  home: {
    title: '南應大商圈',
    icon: <MapPin className="w-6 h-6" />,
    desc: '全糖生活圈。這裡甜點店密度最高，適合收集馬卡龍。',
    color: 'bg-green-50',
    targets: [
      { id: 'sweetshop', name: '甜點店 (Sweetshop)', subType: '馬卡龍 (Macaron)', icon: <Candy className="w-5 h-5 text-pink-500" />, tip: '豆花、嫩仙草、冰店皆可判定。拼全套 7 色首選。', priority: 'High' },
      { id: 'burger', name: '漢堡店 (Burger)', subType: '漢堡裝', icon: <Utensils className="w-5 h-5 text-red-600" />, tip: '家附近稀有判定（摩斯或早餐店）。只有紅黃藍三色。', priority: 'SR' },
      { id: 'bakery', name: '麵包店 (Bakery)', subType: '法國麵包', icon: <Croissant className="w-5 h-5 text-yellow-700" />, tip: '買早餐或消夜時順便偵測。', priority: 'Mid', hasRare: true },
      { id: 'salon', name: '理髮廳 (Hair Salon)', subType: '剪刀 / 梳子', icon: <Scissors className="w-5 h-5 text-purple-600" />, tip: '學校周邊百元剪髮或髮廊。', priority: 'Mid', hasRare: true },
      { id: 'clothing', name: '服飾店 (Clothing)', subType: '髮圈', icon: <ShoppingBag className="w-5 h-5 text-indigo-600" />, tip: '南應大周邊流行服飾店。', priority: 'Low' }
    ]
  },
  chengda: {
    title: '成大 / 後火車站',
    icon: <GraduationCap className="w-6 h-6" />,
    desc: '生態豐富的大學校園。適合步行補給水邊與森林資源。',
    color: 'bg-orange-50',
    targets: [
      { id: 'waterside', name: '水邊 (Waterside)', subType: '魚餌', icon: <Fish className="w-5 h-5 text-cyan-600" />, tip: '光復校區「成功湖」畔。若奇美沒抓到可來這補。', priority: 'SR', hasRare: true },
      { id: 'forest', name: '森林 (Forest)', subType: '鍬形蟲 / 橡實', icon: <TentTree className="w-5 h-5 text-green-700" />, tip: '榕園大草皮、成大校園內樹木密集區。', priority: 'Mid' },
      { id: 'station_tn', name: '火車站 (Tainan)', subType: '改札車票', icon: <Train className="w-5 h-5 text-blue-600" />, tip: '光復校區門口/前鋒路側。目標：印有「台南」的車票。', priority: 'High' },
      { id: 'book', name: '圖書館 (Library)', subType: '書本', icon: <Store className="w-5 h-5 text-amber-800" />, tip: '成功校區總圖書館周邊。', priority: 'Mid' }
    ]
  },
  museum: {
    title: '奇美博物館特區',
    icon: <Landmark className="w-6 h-6" />,
    desc: '一箭三鵰的最強熱點：美術館、機場、水邊同時滿足。',
    color: 'bg-rose-50',
    targets: [
      { id: 'art', name: '美術館 (Art Gallery)', subType: '畫框', icon: <Palette className="w-5 h-5 text-rose-600" />, tip: '博物館本館建築物周圍。', priority: 'SSR' },
      { id: 'airport', name: '機場 (Airport)', subType: '飛機', icon: <Plane className="w-5 h-5 text-sky-600" />, tip: '靠近文華路停車場 / 都會公園邊緣 (免進機場)。', priority: 'SSR' },
      { id: 'waterside', name: '水邊 (Waterside)', subType: '魚餌', icon: <Fish className="w-5 h-5 text-cyan-600" />, tip: '博物館周圍的「繆思湖」與護城河。', priority: 'SR', hasRare: true },
      { id: 'park', name: '公園 (Park)', subType: '四葉草', icon: <TentTree className="w-5 h-5 text-green-500" />, tip: '都會公園廣大綠地。', priority: 'Low' }
    ]
  },
  west_central: {
    title: '中西區：新天地/藍晒圖',
    icon: <ShoppingBag className="w-6 h-6" />,
    desc: '百貨時尚與文創園區。收集永康較少的電影院與飯店。',
    color: 'bg-purple-50',
    targets: [
      { id: 'movie', name: '電影院 (Movie)', subType: '爆米花', icon: <Clapperboard className="w-5 h-5 text-purple-600" />, tip: '新光三越新天地 (新光影城)。', priority: 'SR' },
      { id: 'hotel', name: '飯店 (Hotel)', subType: '各種備品', icon: <Hotel className="w-5 h-5 text-indigo-500" />, tip: '和逸飯店 (Cozzi) / 藍晒圖周邊旅宿。', priority: 'SR' },
      { id: 'art_blue', name: '美術館 (Art Gallery)', subType: '畫框', icon: <Palette className="w-5 h-5 text-rose-500" />, tip: '藍晒圖文創園區 (有時判定為公園或商店)。', priority: 'Mid' },
      { id: 'clothing_dept', name: '服飾店/餐廳', subType: '髮圈/廚師帽', icon: <ShoppingBag className="w-5 h-5 text-pink-600" />, tip: '新光三越百貨公司內部。', priority: 'Mid' }
    ]
  },
  weekend: {
    title: '假日郊區遠征',
    icon: <TentTree className="w-6 h-6" />,
    desc: '動物園與真正的「海邊」。',
    color: 'bg-indigo-50',
    targets: [
      { id: 'zoo', name: '動物園 (Zoo)', subType: '蒲公英', icon: <TentTree className="w-5 h-5 text-green-700" />, tip: '頑皮世界野生動物園 (學甲)。', priority: 'SSR' },
      { id: 'beach', name: '沙灘 (Beach)', subType: '貝殼', icon: <Waves className="w-5 h-5 text-cyan-500" />, tip: '觀夕平台、漁光島。(注意：水邊給魚餌，海邊才給貝殼)', priority: 'SR' }
    ]
  }
};

const ProgressBar = ({ total, current }) => {
  const percent = Math.round((current / total) * 100) || 0;
  return (
    <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
      <div className="bg-green-600 h-2.5 rounded-full transition-all duration-500" style={{ width: `${percent}%` }}></div>
      <div className="text-xs text-gray-500 mt-1 text-right">{percent}% 完成</div>
    </div>
  );
};

export default function PikminCloudApp() {
  const [activeTab, setActiveTab] = useState('work');
  const [collection, setCollection] = useState({});
  const [isSyncing, setIsSyncing] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');
  const [scriptUrl, setScriptUrl] = useState(DEFAULT_SCRIPT_URL);
  const [showSettings, setShowSettings] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('pikmin_collection_yongkang');
    if (saved) setCollection(JSON.parse(saved));
    
    const savedUrl = localStorage.getItem('pikmin_script_url');
    if (savedUrl) setScriptUrl(savedUrl);
  }, []);

  useEffect(() => {
    localStorage.setItem('pikmin_collection_yongkang', JSON.stringify(collection));
  }, [collection]);

  const handleUrlChange = (e) => {
    const url = e.target.value;
    setScriptUrl(url);
    localStorage.setItem('pikmin_script_url', url);
  };

  const toggleDecor = (targetId, colorId) => {
    const key = `${targetId}-${colorId}`;
    setCollection(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const getCollectedCount = (targetId) => {
    return PIKMIN_COLORS.filter(c => collection[`${targetId}-${c.id}`]).length;
  };

  const copyBackendCode = () => {
    navigator.clipboard.writeText(BACKEND_CODE_TEMPLATE);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // --- Cloud Functions ---

  const saveToCloud = async () => {
    if (!scriptUrl || !scriptUrl.includes('/exec')) {
      setStatusMsg('請先設定正確的 API URL');
      setShowSettings(true);
      return;
    }

    setIsSyncing(true);
    setStatusMsg('雲端儲存中...');
    
    try {
      await fetch(scriptUrl, {
        method: 'POST',
        mode: 'no-cors', 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'save_collection',
          data: collection
        })
      });
      
      setTimeout(() => {
        setStatusMsg('✅ 已上傳至 Google Sheet');
        setIsSyncing(false);
        setTimeout(() => setStatusMsg(''), 3000);
      }, 1500);
      
    } catch (error) {
      console.error(error);
      setStatusMsg('❌ 上傳失敗');
      setIsSyncing(false);
    }
  };

  const loadFromCloud = async () => {
    if (!scriptUrl || !scriptUrl.includes('/exec')) {
      setStatusMsg('請先設定正確的 API URL');
      setShowSettings(true);
      return;
    }

    setIsSyncing(true);
    setStatusMsg('從雲端下載中...');

    try {
      const response = await fetch(`${scriptUrl}?action=load_collection`);
      const data = await response.json();
      
      if (data) {
        setCollection(data);
        setStatusMsg('✅ 下載完成');
      } else {
        setStatusMsg('⚠️ 雲端無資料');
      }
    } catch (error) {
      console.error(error);
      setStatusMsg('❌ 下載失敗');
    } finally {
      setIsSyncing(false);
      setTimeout(() => setStatusMsg(''), 3000);
    }
  };

  // --- Render Functions ---

  const renderTargetCard = (target) => {
    const collectedCount = getCollectedCount(target.id);
    const isComplete = collectedCount === (target.id === 'burger' ? 3 : 7);
    
    return (
      <div key={target.id} className={`bg-white p-4 rounded-xl shadow-sm border-l-4 ${isComplete ? 'border-green-500' : 'border-gray-200'} mb-4`}>
        <div className="flex justify-between items-start mb-2">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-gray-100 rounded-full">{target.icon}</div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-gray-800">{target.name}</h3>
                {target.hasRare && (
                  <span className="flex items-center gap-1 text-[10px] bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full font-bold border border-yellow-300">
                    <Sparkles className="w-3 h-3" /> 集滿解鎖稀有
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-500">{target.subType}</p>
            </div>
          </div>
          {target.priority && (
            <span className={`px-2 py-1 rounded text-xs font-bold ${
              target.priority === 'SSR' ? 'bg-yellow-100 text-yellow-700 border border-yellow-300' :
              target.priority === 'SR' ? 'bg-purple-100 text-purple-700' :
              target.priority === 'High' ? 'bg-red-100 text-red-700' :
              'bg-gray-100 text-gray-600'
            }`}>
              {target.priority}
            </span>
          )}
        </div>

        <div className="text-sm text-gray-600 bg-gray-50 p-2 rounded mb-3 flex items-start gap-2">
          <Info className="w-4 h-4 mt-0.5 flex-shrink-0 text-blue-400" />
          {target.tip}
        </div>

        <div className="flex flex-wrap gap-2 mt-2">
          {PIKMIN_COLORS.map(color => {
            if (target.id === 'burger' && !['red', 'yellow', 'blue'].includes(color.id)) return null;
            const key = `${target.id}-${color.id}`;
            const isChecked = collection[key];
            return (
              <button
                key={color.id}
                onClick={() => toggleDecor(target.id, color.id)}
                className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${
                  isChecked ? `${color.color} border-transparent text-white shadow-md scale-110` : `bg-white ${color.border} opacity-40 hover:opacity-100`
                }`}
              >
                {isChecked && <CheckCircle2 className="w-5 h-5" />}
              </button>
            );
          })}
        </div>
        <ProgressBar total={target.id === 'burger' ? 3 : 7} current={collectedCount} />
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 font-sans max-w-md mx-auto shadow-2xl overflow-hidden flex flex-col relative">
      
      {/* Header */}
      <header className="bg-gradient-to-br from-emerald-600 to-teal-700 text-white p-6 pb-8 rounded-b-[2rem] shadow-lg z-10 relative">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-black tracking-tight">永康皮克敏大師</h1>
            <p className="text-emerald-100 text-sm mt-1">雲端戰情中心</p>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => setShowSettings(!showSettings)}
              className={`p-2 rounded-full backdrop-blur-sm hover:bg-white/30 transition ${showSettings ? 'bg-white/40 ring-2 ring-white' : 'bg-white/20'}`}
            >
              <Settings className="text-white w-6 h-6" />
            </button>
          </div>
        </div>
        
        {/* Settings Panel */}
        {showSettings && (
          <div className="mt-4 bg-black/20 rounded-xl p-4 backdrop-blur-md border border-white/10 mb-2 animate-in fade-in slide-in-from-top-2">
            
            {/* URL Input */}
            <div className="mb-4">
              <label className="text-xs text-emerald-100 font-medium mb-1 block flex items-center gap-1">
                <LinkIcon className="w-3 h-3" /> 您的 Google Script API 網址
              </label>
              <input 
                type="text" 
                value={scriptUrl}
                onChange={handleUrlChange}
                placeholder="https://script.google.com/macros/s/.../exec"
                className="w-full text-xs p-2 rounded bg-white/90 text-gray-800 outline-none border focus:border-emerald-400 font-mono"
              />
            </div>

            {/* Tutorial Accordion */}
            <div className="border-t border-white/10 pt-2">
              <button 
                onClick={() => setShowTutorial(!showTutorial)}
                className="w-full flex justify-between items-center text-xs text-emerald-200 hover:text-white py-1"
              >
                <span className="flex items-center gap-1"><HelpCircle className="w-3 h-3"/> 如何建立自己的雲端資料庫？</span>
                {showTutorial ? <ChevronUp className="w-3 h-3"/> : <ChevronDown className="w-3 h-3"/>}
              </button>

              {showTutorial && (
                <div className="mt-2 text-[11px] text-emerald-100 space-y-3 bg-black/20 p-3 rounded-lg">
                  <div>
                    <p className="font-bold mb-1 text-white">步驟 1：建立 Google Sheet</p>
                    <p>新增一個空白的 Google 試算表，記下網址中的 ID。</p>
                  </div>
                  <div>
                    <p className="font-bold mb-1 text-white">步驟 2：複製後端程式碼</p>
                    <button 
                      onClick={copyBackendCode}
                      className="bg-emerald-600/80 hover:bg-emerald-500 text-white px-2 py-1 rounded flex items-center gap-1 text-xs w-full justify-center mb-1"
                    >
                      {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                      {copied ? "已複製！" : "點此複製程式碼"}
                    </button>
                    <p>在 Sheet 點擊 [擴充功能] {'>'} [Apps Script]，貼上代碼，並填入您的 ID。</p>
                  </div>
                  <div>
                    <p className="font-bold mb-1 text-white">步驟 3：部署</p>
                    <p>點擊右上角 [部署] {'>'} [新增部署] {'>'} 選擇 [網頁應用程式]。</p>
                    <p className="text-yellow-300">⚠️ 權限務必設為「所有人」 (Anyone)。</p>
                    <p>複製產生的網址 (exec 結尾)，貼回上方的輸入框即可！</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Cloud Sync Controls */}
        <div className="mt-4 bg-white/10 rounded-xl p-3 backdrop-blur-md border border-white/10">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs text-emerald-100 font-medium">Google Sheet 同步</span>
            <span className="text-xs text-emerald-200 font-bold">{statusMsg}</span>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={saveToCloud}
              disabled={isSyncing}
              className="flex-1 bg-white/20 hover:bg-white/30 text-white text-xs py-2 rounded-lg flex items-center justify-center gap-1 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSyncing ? <Loader2 className="w-3 h-3 animate-spin" /> : <CloudUpload className="w-3 h-3" />}
              上傳備份
            </button>
            <button 
              onClick={loadFromCloud}
              disabled={isSyncing}
              className="flex-1 bg-white/20 hover:bg-white/30 text-white text-xs py-2 rounded-lg flex items-center justify-center gap-1 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
               {isSyncing ? <Loader2 className="w-3 h-3 animate-spin" /> : <CloudDownload className="w-3 h-3" />}
              下載進度
            </button>
          </div>
        </div>
      </header>

      {/* Tab Navigation */}
      <div className="flex px-4 -mt-6 z-20 gap-2 overflow-x-auto pb-2 no-scrollbar">
        {Object.keys(LOCATIONS).map(key => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`flex-1 py-3 px-4 rounded-xl font-bold text-sm shadow-md transition-all whitespace-nowrap flex items-center justify-center gap-2 ${
              activeTab === key 
                ? 'bg-white text-emerald-700 translate-y-0 ring-2 ring-emerald-500/20' 
                : 'bg-gray-200/80 text-gray-500 translate-y-1 hover:bg-gray-200'
            }`}
          >
            {LOCATIONS[key].title.split('：')[1] || LOCATIONS[key].title}
          </button>
        ))}
      </div>

      {/* Main Content Area */}
      <main className="flex-1 p-4 overflow-y-auto">
        <div className="mb-4">
          <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
             {LOCATIONS[activeTab].icon}
             {LOCATIONS[activeTab].title}
          </h2>
          <p className="text-sm text-gray-500 mt-1">{LOCATIONS[activeTab].desc}</p>
        </div>

        <div className="space-y-2">
          {LOCATIONS[activeTab].targets.map(target => renderTargetCard(target))}
        </div>
      </main>

      <footer className="p-4 text-center text-xs text-gray-400 bg-gray-50 border-t border-gray-200">
        台南皮克敏攻略 • 專屬 永康/南應大/奇美 生活圈 • Powered by Google Apps Script
      </footer>
    </div>
  );
}
