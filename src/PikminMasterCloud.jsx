import React, { useState, useEffect, useMemo } from 'react';
import { 
  Train, Pill, Coffee, Store, Utensils, Scissors, ShoppingBag, 
  Croissant, Candy, MapPin, CheckCircle2, Plane, Palette, 
  Trees, Waves, Info, Star, UploadCloud, DownloadCloud, Loader2, 
  Settings, GraduationCap, Landmark, Drama, Hotel, Clapperboard, 
  Fish, Sparkles, UserCircle, LogOut, LogIn, Smartphone,
  Mail, ShoppingBasket, Zap, Bus, CloudRain, Snowflake, 
  Mountain, Ticket, Trophy, Pizza, Ghost, Gamepad2, Coins,
  ChevronRight, Search, Map, Bot, Lock, Filter, LayoutDashboard, PieChart,
  ChevronDown, ChevronUp, BarChart3, Share2, Eye, EyeOff, Medal, X,
  HelpCircle, FileText, AlertCircle, Ban
} from 'lucide-react';

// --- 風格指南 (Cinematic Brick Red) ---
const THEME = {
  primary: '#a94438',   // 沉穩磚紅 (Action)
  accent: '#3a4a61',    // 靜謐灰藍 (Logic)
  highlight: '#f4f1ea', // 暖調米色 (Texture)
  base: '#fcfbf9',      // 暖白色 (Background)
  text: '#3c3633',      // 深棕灰 (Readability)
  dark: '#2a2522',      // 深色基底
};

// 電影顆粒質感濾鏡
const cinematicGrainStyle = {
  position: 'absolute',
  top: 0, left: 0, width: '100%', height: '100%',
  pointerEvents: 'none',
  opacity: 0.06,
  backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
};

// --- 設定區 ---
const DEFAULT_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxxZ5PdhzrsLN5p6_n_BXGcc7hZ1yliK7xyuzVPP6XEG1IftkIhQfVRIbZNRjwJcsMV/exec'; 
const LAST_UPDATED = '2025.11.19 Tri-State Ops';

// 全域顏色定義 (全開 8 色)
const PIKMIN_COLORS = [
  { id: 'red', name: '紅', color: 'bg-red-500', border: 'border-red-500' },
  { id: 'yellow', name: '黃', color: 'bg-yellow-400', border: 'border-yellow-400' },
  { id: 'blue', name: '藍', color: 'bg-blue-500', border: 'border-blue-500' },
  { id: 'purple', name: '紫', color: 'bg-purple-600', border: 'border-purple-600' },
  { id: 'white', name: '白', color: 'bg-gray-100', border: 'border-gray-300' },
  { id: 'pink', name: '羽', color: 'bg-pink-400', border: 'border-pink-400' },
  { id: 'rock', name: '岩', color: 'bg-gray-600', border: 'border-gray-600' },
  { id: 'ice', name: '冰', color: 'bg-cyan-300', border: 'border-cyan-300' } 
];

// --- 資料結構 ---
const LOCATIONS = {
  work: {
    title: '奇美 / 南台商圈',
    icon: <Pill className="w-5 h-5" />,
    desc: '交通與生活機能核心。',
    targets: [
      { 
        id: 'station', name: '火車站', category: '交通', icon: <Train className="w-5 h-5 text-[#3a4a61]" />, 
        subType: '紙火車 / 車票', 
        variants: [{ id: 'paper_train', name: '紙火車' }, { id: 'ticket', name: '車票' }],
        tip: '大橋/台南車站。車票印有日期。', priority: 'SSR' 
      },
      { id: 'pharmacy', name: '藥局', category: '日常', icon: <Pill className="w-5 h-5 text-teal-600" />, subType: '牙刷', tip: '醫院大廳或藥局。', priority: 'High' },
      { id: 'restaurant', name: '餐廳', category: '餐飲', icon: <Utensils className="w-5 h-5 text-[#a94438]" />, subType: '廚師帽', tip: '南台街美食區。', priority: 'Mid', hasRare: true },
      { 
        id: 'convenience', name: '便利商店', category: '日常', icon: <Store className="w-5 h-5 text-orange-500" />, 
        subType: '瓶蓋 / 零食', variants: [{ id: 'bottle_cap', name: '瓶蓋' }, { id: 'snack', name: '零食' }],
        tip: '7-11 或全家。', priority: 'Mid' 
      },
      { id: 'post_office', name: '郵局', category: '日常', icon: <Mail className="w-5 h-5 text-red-600" />, subType: '郵票', tip: '大橋郵局。', priority: 'High' },
      { id: 'bus', name: '公車站', category: '交通', icon: <Bus className="w-5 h-5 text-indigo-600" />, subType: '公車模型', tip: '主要幹道站牌。', priority: 'Low' },
      { id: 'cafe', name: '咖啡店', category: '餐飲', icon: <Coffee className="w-5 h-5 text-amber-700" />, subType: '咖啡杯', tip: '星巴克、路易莎。', priority: 'Mid' }
    ]
  },
  home: {
    title: '南應大商圈',
    icon: <MapPin className="w-5 h-5" />,
    desc: '全糖生活圈，甜點密集。',
    targets: [
      { 
        id: 'sweetshop', name: '甜點店', category: '餐飲', icon: <Candy className="w-5 h-5 text-pink-500" />, 
        subType: '馬卡龍 / 甜甜圈', variants: [{ id: 'macaron', name: '馬卡龍' }, { id: 'donut', name: '甜甜圈' }],
        tip: '豆花、冰店。', priority: 'High' 
      },
      { 
        id: 'supermarket', name: '超市', category: '日常', icon: <ShoppingBasket className="w-5 h-5 text-green-600" />, 
        subType: '蘑菇 / 香蕉', variants: [{ id: 'mushroom', name: '蘑菇' }, { id: 'banana', name: '香蕉' }],
        tip: '全聯、家樂福。', priority: 'High' 
      },
      { 
          id: 'burger', name: '漢堡店', category: '餐飲', icon: <Utensils className="w-5 h-5 text-[#a94438]" />, 
          subType: '漢堡', 
          tip: '早餐店稀有判定。', priority: 'SR' 
      },
      { 
        id: 'appliance', name: '家電行', category: '日常', icon: <Zap className="w-5 h-5 text-yellow-500" />, 
        subType: '電池 / 燈串', variants: [{ id: 'battery', name: '電池' }, { id: 'lights', name: '燈串' }],
        tip: '全國電子、手機行。', priority: 'Mid' 
      },
      { id: 'sushi', name: '壽司店', category: '餐飲', icon: <Fish className="w-5 h-5 text-red-400" />, subType: '壽司', tip: '壽司郎、爭鮮。', priority: 'Mid' },
      { id: 'bakery', name: '麵包店', category: '餐飲', icon: <Croissant className="w-5 h-5 text-yellow-700" />, subType: '法棍', tip: '麵包店。', priority: 'Mid', hasRare: true },
      { id: 'salon', name: '理髮廳', category: '日常', icon: <Scissors className="w-5 h-5 text-purple-600" />, subType: '剪刀', tip: '百元剪髮。', priority: 'Mid', hasRare: true },
      { id: 'clothing', name: '服飾店', category: '購物', icon: <ShoppingBag className="w-5 h-5 text-indigo-600" />, subType: '髮圈', tip: '服飾店。', priority: 'Low' }
    ]
  },
  chengda: {
    title: '成大 / 後站',
    icon: <GraduationCap className="w-5 h-5" />,
    desc: '校園生態與異國料理。',
    targets: [
      { id: 'waterside', name: '水邊', category: '自然', icon: <Fish className="w-5 h-5 text-cyan-600" />, subType: '魚餌', tip: '成功湖。', priority: 'SR', hasRare: true },
      { 
        id: 'forest', name: '森林', category: '自然', icon: <Trees className="w-5 h-5 text-green-700" />, 
        subType: '鍬形蟲 / 橡實', variants: [{ id: 'stag_beetle', name: '鍬形蟲' }, { id: 'acorn', name: '橡實' }],
        tip: '榕園、大樹區。', priority: 'Mid' 
      },
      { id: 'pizza', name: '義式餐廳', category: '餐飲', icon: <Pizza className="w-5 h-5 text-orange-500" />, subType: '披薩', tip: '義大利麵店。', priority: 'Mid' },
      { id: 'curry', name: '咖哩店', category: '餐飲', icon: <Utensils className="w-5 h-5 text-yellow-800" />, subType: '咖哩', tip: '咖哩專賣。', priority: 'Low' },
      { id: 'book', name: '圖書館', category: '文教', icon: <Store className="w-5 h-5 text-amber-800" />, subType: '書本', tip: '圖書館。', priority: 'Mid' }
    ]
  },
  museum: {
    title: '奇美博物館',
    icon: <Landmark className="w-5 h-5" />,
    desc: '最強熱點：美術館、機場。',
    targets: [
      { id: 'art', name: '美術館', category: '文教', icon: <Palette className="w-5 h-5 text-rose-600" />, subType: '畫框', priority: 'SSR' },
      { id: 'airport', name: '機場', category: '交通', icon: <Plane className="w-5 h-5 text-sky-600" />, subType: '飛機', priority: 'SSR' },
      { id: 'waterside_mu', name: '水邊', category: '自然', icon: <Fish className="w-5 h-5 text-cyan-600" />, subType: '魚餌', priority: 'SR', hasRare: true },
      { 
        id: 'park', name: '公園', category: '自然', icon: <Trees className="w-5 h-5 text-green-500" />, 
        subType: '幸運草', variants: [{ id: 'clover', name: '三葉' }, { id: 'four_leaf', name: '四葉' }],
        tip: '都會公園。', priority: 'Low' 
      }
    ]
  },
  west_central: {
    title: '中西區百貨',
    icon: <ShoppingBag className="w-5 h-5" />,
    desc: '文化、娛樂與古蹟。',
    targets: [
      { id: 'shrine', name: '神社/寺廟', category: '文教', icon: <Landmark className="w-5 h-5 text-red-700" />, subType: '籤詩', tip: '孔廟、天后宮。', priority: 'High' },
      { id: 'movie', name: '電影院', category: '娛樂', icon: <Clapperboard className="w-5 h-5 text-purple-600" />, subType: '爆米花', tip: '新光影城。', priority: 'SR' },
      { id: 'hotel', name: '飯店', category: '休閒', icon: <Hotel className="w-5 h-5 text-indigo-500" />, subType: '備品', tip: '晶英、和逸。', priority: 'SR' },
      { id: 'art_gal', name: '美術館', category: '文教', icon: <Palette className="w-5 h-5 text-rose-500" />, subType: '畫框', tip: '南美館。', priority: 'Mid' },
      { id: 'stadium', name: '體育場', category: '休閒', icon: <Trophy className="w-5 h-5 text-orange-600" />, subType: '鑰匙圈', tip: '棒球場。', priority: 'Mid' },
      { id: 'makeup', name: '美妝店', category: '購物', icon: <Sparkles className="w-5 h-5 text-pink-400" />, subType: '化妝品', tip: '百貨專櫃。', priority: 'Low' }
    ]
  },
  weekend: {
    title: '假日遠征',
    icon: <Trees className="w-5 h-5" />,
    desc: '動物園與海邊。',
    targets: [
      { id: 'zoo', name: '動物園', category: '休閒', icon: <Trees className="w-5 h-5 text-green-700" />, subType: '蒲公英', tip: '頑皮世界。', priority: 'SSR' },
      { id: 'beach', name: '沙灘', category: '自然', icon: <Waves className="w-5 h-5 text-cyan-500" />, subType: '貝殼', tip: '漁光島。', priority: 'SR' },
      { id: 'mountain', name: '山', category: '自然', icon: <Mountain className="w-5 h-5 text-stone-600" />, subType: '山徽章', tip: '關子嶺。', priority: 'SSR' },
      { id: 'theme_park', name: '主題樂園', category: '娛樂', icon: <Ticket className="w-5 h-5 text-purple-500" />, subType: '門票', tip: '義大。', priority: 'SSR' },
      { id: 'bridge', name: '橋樑', category: '交通', icon: <MapPin className="w-5 h-5 text-gray-500" />, subType: '橋樑', tip: '大型橋樑。', priority: 'Mid' }
    ]
  },
  special: {
    title: '特殊/天氣',
    icon: <Star className="w-5 h-5" />,
    desc: '特定條件觸發。',
    targets: [
      { 
          id: 'weather_rain', name: '雨天', category: '天氣', icon: <CloudRain className="w-5 h-5 text-blue-400" />, 
          subType: '葉子帽', 
          tip: '下雨時。', priority: 'SSR' 
      },
      { 
          id: 'weather_snow', name: '雪地', category: '天氣', icon: <Snowflake className="w-5 h-5 text-sky-200" />, 
          subType: '雪', 
          tip: '下雪時。', priority: 'SSR' 
      },
      { 
        id: 'roadside', name: '路邊', category: '其他', icon: <MapPin className="w-5 h-5 text-gray-400" />, 
        subType: '貼紙/硬幣', variants: [{ id: 'sticker', name: '貼紙' }, { id: 'coin', name: '硬幣' }, { id: 'winter', name: '冬季貼紙' }],
        tip: '隨機出現。', priority: 'Low' 
      }
    ]
  }
};

// ★ 擴充後的台南攻略資料庫
const TAINAN_GUIDE_DATA = [
  { 
    category: '文化與觀光', color: 'text-red-600', 
    items: [
      { type: '神社/寺廟', places: '中西區（孔廟、天后宮）、北區', desc: '台南廟宇密度高，籤詩飾品很容易取得。' }, 
      { type: '美術館', places: '南美館 1&2館、奇美博物館', desc: '奇美博物館判定範圍大且穩定。' },
      { type: '圖書館', places: '市圖新總館(永康)、台灣文學館', desc: '新總館環境優美，適合散步。' }
    ] 
  },
  { 
    category: '自然與戶外', color: 'text-cyan-600', 
    items: [
      { type: '水邊', places: '台南運河、成功湖、繆思湖', desc: '運河沿岸非常容易出現魚餌飾品。' }, 
      { type: '海邊', places: '漁光島、觀夕平台、黃金海岸', desc: '需靠近沙灘區域，堤防上有時會判偏。' },
      { type: '森林', places: '成大榕園、巴克禮公園', desc: '市區大樹密集區，成大榕園最穩定。' },
      { type: '山', places: '關子嶺、梅嶺', desc: '市區無，需前往白河或楠西山區。' }
    ] 
  },
  { 
    category: '美食', color: 'text-orange-600', 
    items: [
      { type: '甜點店', places: '國華街、安平老街、冰果室', desc: '冰店、豆花、布丁都算。有馬卡龍/甜甜圈。' }, 
      { type: '漢堡', places: '丹丹漢堡、麥當勞', desc: '必試丹丹漢堡！南部特有樂趣。' },
      { type: '咖啡廳', places: '中西區巷弄、成大周邊', desc: '密度極高，隨緣即可遇到。' }
    ] 
  },
  { 
    category: '交通', color: 'text-blue-600', 
    items: [
      { type: '車站', places: '台南車站、大橋、保安、高鐵', desc: '需為鐵路車站。車票印有日期與站名。' }, 
      { type: '公車站', places: '台南轉運站、各公車站牌', desc: '不用去總站，路邊站牌也有機會。' },
      { type: '機場', places: '台南航空站', desc: '奇美博物館近機場側停車場可偵測到。' }
    ] 
  },
  { 
    category: '生活與購物', color: 'text-purple-600', 
    items: [
      { type: '便利商店', places: '7-11、全家', desc: '到處都有，瓶蓋/零食兩種隨機出。' }, 
      { type: '超市', places: '全聯、家樂福', desc: '全聯密度高，蘑菇/香蕉補貨點。' },
      { type: '藥局', places: '醫院周邊、連鎖藥局', desc: '奇美/成大醫院附近很多。' }
    ] 
  }
];

// --- 元件 ---

const ProgressBar = ({ total, current, colorClass = 'bg-[#a94438]' }) => {
  const percent = Math.round((current / total) * 100) || 0;
  return (
    <div className="w-full bg-gray-200 rounded-full h-1.5 mt-3 overflow-hidden">
      <div className={`h-1.5 rounded-full transition-all duration-700 ease-out ${colorClass}`} style={{ width: `${percent}%` }}></div>
    </div>
  );
};

const LoginScreen = ({ onLogin }) => {
  const [inputVal, setInputVal] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputVal.length < 2) return setError('ID 太短了');
    onLogin(inputVal.trim().toUpperCase());
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden" style={{ backgroundColor: THEME.primary }}>
      <div style={cinematicGrainStyle}></div>
      <div className="bg-[#fcfbf9] w-full max-w-sm rounded-2xl shadow-2xl p-8 relative z-10">
        <div className="text-center mb-8">
          <div className="inline-flex p-4 bg-[#f4f1ea] rounded-full text-[#a94438] mb-4 shadow-inner">
            <Bot className="w-10 h-10" />
          </div>
          <h1 className="text-3xl font-black text-[#3c3633] tracking-wider">PIKMIN<br/>MASTER</h1>
          <p className="text-[#3a4a61] text-xs mt-2 font-bold tracking-widest uppercase">Cinematic Edition</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[10px] font-bold text-[#3a4a61] uppercase tracking-widest mb-1">User Identity</label>
            <input
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder="ENTER ID..."
              className="w-full px-4 py-3 bg-[#f4f1ea] border-2 border-transparent focus:border-[#a94438] rounded-lg outline-none transition font-mono text-lg text-[#3c3633] placeholder-gray-400 text-center uppercase"
            />
          </div>
          {error && <p className="text-[#a94438] text-xs text-center font-bold">{error}</p>}
          <button type="submit" className="w-full bg-[#3c3633] hover:bg-[#2a2522] text-[#f4f1ea] font-bold py-3 rounded-lg transition-all shadow-lg flex items-center justify-center gap-2">
            <LogIn className="w-4 h-4" /> START MISSION
          </button>
        </form>
      </div>
    </div>
  );
};

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState('');
  const [isVip, setIsVip] = useState(false);
  const [collection, setCollection] = useState({});
  
  // View State
  const [viewMode, setViewMode] = useState('category'); 
  const [activeTab, setActiveTab] = useState('work');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showSettings, setShowSettings] = useState(false);
  const [expandDashboard, setExpandDashboard] = useState(false);
  const [showMissingOnly, setShowMissingOnly] = useState(false); 
  const [categorySearch, setCategorySearch] = useState(''); 
  const [showHelp, setShowHelp] = useState(false); 

  // Async State
  const [isSyncing, setIsSyncing] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');
  const [aiAdvice, setAiAdvice] = useState('');
  const [isLoadingAi, setIsLoadingAi] = useState(false);
  const [guideSearch, setGuideSearch] = useState('');

  useEffect(() => {
    const savedUser = localStorage.getItem('pikmin_user_id');
    if (savedUser) {
      setUserId(savedUser);
      setIsLoggedIn(true);
      const savedCol = localStorage.getItem(`pikmin_collection_${savedUser}`);
      if (savedCol) setCollection(JSON.parse(savedCol));
      setTimeout(() => syncCloud(savedUser), 1000);
    }
  }, []);

  useEffect(() => {
    if (isLoggedIn && userId) {
      localStorage.setItem(`pikmin_collection_${userId}`, JSON.stringify(collection));
    }
  }, [collection, userId, isLoggedIn]);

  // --- Logic Functions ---

  const syncCloud = async (uid) => {
    setIsSyncing(true);
    setStatusMsg('連線中...');
    try {
      const res = await fetch(`${DEFAULT_SCRIPT_URL}?action=load_collection&userId=${uid}`);
      const data = await res.json();
      if (data.collection) {
        if (Object.keys(data.collection).length > 0) setCollection(data.collection);
        setIsVip(data.isVip);
        setStatusMsg(data.isVip ? 'VIP ACCESS' : 'ONLINE');
      }
    } catch (e) {
      console.error(e);
      setStatusMsg('OFFLINE MODE');
    } finally {
      setIsSyncing(false);
      setTimeout(() => setStatusMsg(''), 3000);
    }
  };

  const saveToCloud = async () => {
    setIsSyncing(true);
    setStatusMsg('UPLOADING...');
    try {
      await fetch(DEFAULT_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'save_collection', userId, data: collection })
      });
      setTimeout(() => {
        setStatusMsg('SAVED');
        setIsSyncing(false);
        setTimeout(() => setStatusMsg(''), 2000);
      }, 1500);
    } catch (e) {
      setStatusMsg('ERROR');
      setIsSyncing(false);
    }
  };

  // ★ 核心修改：三態切換邏輯 (Tri-State Logic)
  // 狀態: undefined (未收集) -> true (已收集) -> 'nil' (無此顏色) -> undefined
  const toggleDecor = (targetId, colorId, variantId = null) => {
    const key = variantId ? `${targetId}-${variantId}-${colorId}` : `${targetId}-${colorId}`;
    setCollection(prev => {
        const currentVal = prev[key];
        let newVal;

        if (currentVal === true) {
            newVal = 'nil'; // 轉為無此顏色
        } else if (currentVal === 'nil') {
            newVal = undefined; // 轉為未收集 (刪除 key)
        } else {
            newVal = true; // 轉為已收集
        }

        // 為了避免物件累積太多 undefined 鍵，如果 newVal 是 undefined，建議刪除該屬性
        // 但 React state 更新用解構最簡單，這裡直接賦值 undefined 即可，JSON.stringify 會忽略 undefined
        // 若要嚴謹刪除：
        if (newVal === undefined) {
            const nextState = { ...prev };
            delete nextState[key];
            return nextState;
        }

        return { ...prev, [key]: newVal };
    });
  };

  const getCollectedCount = (targetId, variants) => {
    if (variants) {
      let count = 0;
      variants.forEach(v => {
        const colorsToCheck = v.validColors || PIKMIN_COLORS.map(c => c.id);
        colorsToCheck.forEach(colorId => {
            // ★ 修改：true 算收集，'nil' 也算收集 (視為完成)
            const val = collection[`${targetId}-${v.id}-${colorId}`];
            if (val === true || val === 'nil') count++;
        });
      });
      return count;
    }
    return PIKMIN_COLORS.filter(c => {
        const val = collection[`${targetId}-${c.id}`];
        return val === true || val === 'nil';
    }).length;
  };

  const generateAiItinerary = async () => {
    setIsLoadingAi(true);
    setAiAdvice('');
    const prompt = `我是皮克敏玩家(ID:${userId})。請根據台南地圖，針對我尚未收集到的飾品，規劃一條高效率路線。請用繁體中文，語氣像特務簡報。`;
    try {
      const res = await fetch(DEFAULT_SCRIPT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({ action: 'ask_ai', userId, prompt })
      });
      const data = await res.json();
      setAiAdvice(data.status === 'success' ? data.data : '通訊中斷');
    } catch {
      setAiAdvice('連線失敗');
    } finally {
      setIsLoadingAi(false);
    }
  };

  const stats = useMemo(() => {
    let total = 0;
    let current = 0;
    const catStats = {};

    Object.values(LOCATIONS).forEach(loc => {
      loc.targets.forEach(t => {
        const cat = t.category || '其他';
        if (!catStats[cat]) catStats[cat] = { total: 0, current: 0 };

        let itemTotal = 0;
        let itemCurrent = 0;

        if (t.variants) {
            t.variants.forEach(v => {
                const vTotal = v.validColors ? v.validColors.length : PIKMIN_COLORS.length;
                itemTotal += vTotal;
                
                const colorsToCheck = v.validColors || PIKMIN_COLORS.map(c => c.id);
                colorsToCheck.forEach(cid => {
                    const val = collection[`${t.id}-${v.id}-${cid}`];
                    if (val === true || val === 'nil') itemCurrent++;
                });
            });
        } else {
            itemTotal = t.validColors ? t.validColors.length : PIKMIN_COLORS.length;
            const colorsToCheck = t.validColors || PIKMIN_COLORS.map(c => c.id);
            colorsToCheck.forEach(cid => {
                const val = collection[`${t.id}-${cid}`];
                if (val === true || val === 'nil') itemCurrent++;
            });
        }

        total += itemTotal;
        current += itemCurrent;
        
        catStats[cat].total += itemTotal;
        catStats[cat].current += itemCurrent;
      });
    });

    Object.keys(catStats).forEach(k => {
        catStats[k].percent = Math.round((catStats[k].current / catStats[k].total) * 100) || 0;
    });

    return { 
        total, 
        current, 
        percent: Math.round((current / total) * 100) || 0,
        byCategory: catStats
    };
  }, [collection]);

  const handleShare = async () => {
    const completedCategories = Object.entries(stats.byCategory)
      .filter(([_, data]) => data.percent === 100)
      .map(([cat]) => cat);
    
    let report = `Pikmin Master 戰報 📊\nID: ${userId}\n總收集率: ${stats.percent}%\n`;
    if (completedCategories.length > 0) {
      report += `已制霸: ${completedCategories.join(', ')} ✨\n`;
    }
    report += `\n#PikminMaster #Tainan`;

    if (navigator.share) {
      try {
        await navigator.share({ title: 'Pikmin Progress', text: report });
      } catch (err) { }
    } else {
      navigator.clipboard.writeText(report);
      setStatusMsg('戰報已複製！');
      setTimeout(() => setStatusMsg(''), 2000);
    }
  };

  const targetsByCategory = useMemo(() => {
    const groups = {};
    Object.values(LOCATIONS).forEach(loc => {
      loc.targets.forEach(t => {
        const cat = t.category || '其他';
        if (!groups[cat]) groups[cat] = [];
        groups[cat].push({ ...t, locationName: loc.title });
      });
    });
    return groups;
  }, []);

  // --- Render Components ---

  const ColorButtons = ({ targetId, variantId = null, validColors }) => (
    <div className="flex flex-wrap gap-1.5 mt-2">
      {PIKMIN_COLORS.map(color => {
        if (validColors && !validColors.includes(color.id)) return null;
        const key = variantId ? `${targetId}-${variantId}-${color.id}` : `${targetId}-${color.id}`;
        const status = collection[key]; // undefined | true | 'nil'
        
        // ★ UI 渲染邏輯：根據三種狀態改變樣式
        let btnClass = `w-7 h-7 rounded-full border flex items-center justify-center transition-all duration-300 `;
        let icon = null;

        if (status === true) {
            // 狀態 1: 已收集 (原有樣式)
            btnClass += `${color.color} border-transparent text-white shadow-sm scale-110`;
            icon = <CheckCircle2 className="w-4 h-4" />;
        } else if (status === 'nil') {
            // 狀態 2: 無此顏色 (灰色 + 禁止符號)
            btnClass += `bg-gray-200 border-gray-300 text-gray-400 opacity-60`;
            icon = <Ban className="w-3.5 h-3.5" />; // 使用 Ban (禁止) 或 X icon
        } else {
            // 狀態 0: 未收集 (半透明)
            btnClass += `bg-[#fcfbf9] ${color.border} opacity-30 hover:opacity-80`;
        }

        return (
          <button
            key={color.id}
            onClick={() => toggleDecor(targetId, color.id, variantId)}
            className={btnClass}
          >
            {icon}
          </button>
        );
      })}
    </div>
  );

  const Card = ({ target, showLocTag }) => {
    let total = 0;
    let current = 0;

    if (target.variants) {
        target.variants.forEach(v => {
            total += v.validColors ? v.validColors.length : PIKMIN_COLORS.length;
            const colorsToCheck = v.validColors || PIKMIN_COLORS.map(c => c.id);
            colorsToCheck.forEach(cid => {
                const val = collection[`${target.id}-${v.id}-${cid}`];
                if (val === true || val === 'nil') current++;
            });
        });
    } else {
        total = target.validColors ? target.validColors.length : PIKMIN_COLORS.length;
        const colorsToCheck = target.validColors || PIKMIN_COLORS.map(c => c.id);
        colorsToCheck.forEach(cid => {
            const val = collection[`${target.id}-${cid}`];
            if (val === true || val === 'nil') current++;
        });
    }

    const isComplete = current === total && total > 0;

    if (showMissingOnly && isComplete) return null;

    if (categorySearch) {
        const query = categorySearch.toLowerCase();
        const matchName = target.name.toLowerCase().includes(query);
        const matchSub = target.subType && target.subType.toLowerCase().includes(query);
        const matchVar = target.variants && target.variants.some(v => v.name.toLowerCase().includes(query));
        if (!matchName && !matchSub && !matchVar) return null;
    }

    return (
      <div className={`bg-white p-4 rounded-lg border-l-4 mb-3 transition-all duration-500 relative overflow-hidden ${
        isComplete 
          ? 'border-yellow-400 shadow-[0_0_15px_rgba(250,204,21,0.3)] ring-1 ring-yellow-100' 
          : 'border-gray-200 shadow-sm'
      }`}>
        {isComplete && (
           <div className="absolute -right-6 -top-6 bg-yellow-400 w-20 h-20 transform rotate-45 flex items-end justify-center pb-1 shadow-sm z-0">
              <Medal className="w-4 h-4 text-white transform -rotate-45 translate-y-1" />
           </div>
        )}

        <div className="flex justify-between items-start mb-2 relative z-10">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-full border transition-colors duration-500 ${isComplete ? 'bg-yellow-100 text-yellow-600 border-yellow-200' : 'bg-[#f4f1ea] text-[#3c3633] border-[#e0dad0]'}`}>
              {target.icon}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className={`font-bold transition-colors duration-500 ${isComplete ? 'text-yellow-700' : 'text-[#3c3633]'}`}>
                  {target.name}
                </h3>
                {isComplete && <span className="text-[9px] bg-yellow-100 text-yellow-700 px-1.5 rounded font-bold border border-yellow-200">COMPLETED</span>}
                {target.hasRare && !isComplete && (
                  <span className="flex items-center gap-1 text-[9px] bg-purple-50 text-purple-700 px-1.5 py-0.5 rounded font-bold border border-purple-200">
                    <Sparkles className="w-2.5 h-2.5" /> 稀有
                  </span>
                )}
              </div>
              <div className="flex gap-2 items-center mt-0.5">
                 {showLocTag && <span className="text-[9px] text-white bg-[#3a4a61] px-1.5 py-0.5 rounded">{target.locationName.split(' / ')[0]}</span>}
                 <p className="text-xs text-gray-400">{target.subType}</p>
              </div>
            </div>
          </div>
          <span className={`px-2 py-1 rounded text-[10px] font-bold ${
            target.priority === 'SSR' ? 'bg-[#a94438] text-white' :
            target.priority === 'SR' ? 'bg-[#3a4a61] text-white' :
            'bg-[#fcfbf9] text-gray-500 border border-gray-200'
          }`}>
            {target.priority}
          </span>
        </div>

        {target.variants ? (
          <div className="space-y-2 mt-2 relative z-10">
            {target.variants.map(v => (
              <div key={v.id} className="bg-[#fcfbf9] p-2 rounded border border-gray-100">
                <span className="text-xs font-bold text-[#3a4a61] flex items-center gap-1"><ChevronRight className="w-3 h-3"/> {v.name}</span>
                <ColorButtons targetId={target.id} variantId={v.id} validColors={v.validColors} />
              </div>
            ))}
          </div>
        ) : (
          <div className="relative z-10">
             <ColorButtons targetId={target.id} validColors={target.validColors} />
          </div>
        )}
        
        <div className="mt-3 relative z-10">
          <div className="flex justify-between text-[10px] text-gray-400 mb-1">
             <span>{target.tip}</span>
             <span className={isComplete ? 'font-bold text-yellow-600' : ''}>{Math.round(current/total*100)}%</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-1">
            <div className={`h-1 rounded-full transition-all duration-500 ${isComplete ? 'bg-yellow-400 shadow-[0_0_8px_rgba(250,204,21,0.6)]' : 'bg-[#3a4a61]'}`} style={{ width: `${current/total*100}%` }}></div>
          </div>
        </div>
      </div>
    );
  };

  if (!isLoggedIn) return <LoginScreen onLogin={(id) => { setUserId(id); setIsLoggedIn(true); syncCloud(id); }} />;

  return (
    <div className="min-h-screen font-sans max-w-md mx-auto shadow-2xl overflow-hidden flex flex-col relative" style={{ backgroundColor: THEME.base, color: THEME.text }}>
      
      {/* Header */}
      <header className="relative overflow-hidden rounded-b-[2rem] shadow-lg z-10 pb-6">
        <div className="absolute inset-0 bg-gradient-to-br from-[#a94438] to-[#8a3229]"></div>
        <div style={cinematicGrainStyle}></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
        
        <div className="relative p-6 text-white">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h1 className="text-xl font-black tracking-wider flex items-center gap-2">
                 <div className="w-1.5 h-5 bg-[#f4f1ea] rounded-full"></div>
                 PIKMIN OPS
              </h1>
              <p className="text-[#f4f1ea]/70 text-[10px] mt-0.5 pl-3.5 flex items-center gap-1">
                <UserCircle className="w-3 h-3"/> {userId} {isVip && <span className="bg-yellow-400 text-black px-1 rounded font-bold">VIP</span>}
              </p>
            </div>
            <div className="flex gap-2">
                <button onClick={handleShare} className="p-2 bg-white/10 rounded-full backdrop-blur-sm hover:bg-white/20 transition">
                   <Share2 className="w-5 h-5" />
                </button>
                <button onClick={() => setShowSettings(!showSettings)} className="p-2 bg-white/10 rounded-full backdrop-blur-sm hover:bg-white/20 transition">
                   <Settings className="w-5 h-5" />
                </button>
            </div>
          </div>

          {/* Feature: 使用手冊與設定面板 */}
          {showSettings && (
             <div className="mb-4 bg-black/30 p-4 rounded-lg backdrop-blur-md border border-white/10 animate-in slide-in-from-top-2 space-y-4">
                {/* 雲端同步控制 */}
                <div className="flex gap-2">
                   <button onClick={saveToCloud} disabled={isSyncing} className="flex-1 bg-white/20 hover:bg-white/30 py-2 rounded text-xs flex items-center justify-center gap-1">
                      {isSyncing ? <Loader2 className="w-3 h-3 animate-spin"/> : <UploadCloud className="w-3 h-3"/>} 上傳
                   </button>
                   <button onClick={() => syncCloud(userId)} disabled={isSyncing} className="flex-1 bg-white/20 hover:bg-white/30 py-2 rounded text-xs flex items-center justify-center gap-1">
                      {isSyncing ? <Loader2 className="w-3 h-3 animate-spin"/> : <DownloadCloud className="w-3 h-3"/>} 下載
                   </button>
                   <button onClick={() => {localStorage.removeItem('pikmin_user_id'); window.location.reload()}} className="bg-red-500/50 px-3 rounded">
                      <LogOut className="w-4 h-4"/>
                   </button>
                </div>
                
                {/* 使用說明區塊 (Toggle) */}
                <div className="border-t border-white/10 pt-3">
                    <button 
                        onClick={() => setShowHelp(!showHelp)} 
                        className="w-full flex justify-between items-center text-xs text-[#f4f1ea] font-bold hover:text-white"
                    >
                        <span className="flex items-center gap-1"><HelpCircle className="w-3 h-3" /> 戰情室操作手冊</span>
                        {showHelp ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                    </button>

                    {showHelp && (
                        <div className="mt-3 space-y-3 text-[11px] text-white/80 bg-black/20 p-3 rounded leading-relaxed">
                            <div>
                                <h4 className="font-bold text-yellow-400 mb-1 flex items-center gap-1"><DownloadCloud className="w-3 h-3" /> 雲端同步時機</h4>
                                <ul className="list-disc list-inside space-y-0.5 pl-1">
                                    <li><strong>上傳 (Upload)：</strong> 當您在手機上點擊收集了很多新皮克敏，想把進度備份到雲端時，請按上傳。</li>
                                    <li><strong>下載 (Download)：</strong> 當您換了新手機，或是想在電腦上看手機的進度時，請按下載。</li>
                                    <li><span className="text-emerald-300">小提示：</span> 平常操作會自動存在這台裝置上，只有要換裝置或備份時才需要手動同步喔！</li>
                                </ul>
                            </div>
                            <div>
                                <h4 className="font-bold text-yellow-400 mb-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> 狀態標示 (三段切換)</h4>
                                <p>您可以透過點擊按鈕來切換三種狀態，方便管理缺少的顏色：</p>
                                <ul className="list-disc list-inside space-y-0.5 pl-1 mt-1">
                                    <li>🟡 <strong>未收集 (半透明)：</strong> 預設狀態。</li>
                                    <li>🟢 <strong>已收集 (打勾)：</strong> 點一下，代表抓到了！</li>
                                    <li>⚪ <strong>無此顏色 (禁止符號)：</strong> 再點一下，代表這個種類沒有這種顏色 (例如漢堡沒有紫色)。</li>
                                </ul>
                                <p className="mt-1 text-emerald-300">⚠️ 注意：「已收集」和「無此顏色」都會被視為該目標已完成 (100%)。</p>
                            </div>
                        </div>
                    )}
                </div>
                
                <p className="text-[10px] text-center mt-2 opacity-70">{statusMsg || 'SYSTEM READY'}</p>
             </div>
          )}

          <div className="bg-[#3a4a61]/40 backdrop-blur-md rounded-xl p-4 border border-white/10 transition-all duration-500">
            <div className="flex justify-between items-end mb-2">
              <span className="text-xs text-white/70 font-bold tracking-widest uppercase flex items-center gap-1">
                <BarChart3 className="w-3 h-3" /> Total Progress
              </span>
              <span className="text-2xl font-bold tabular-nums">{stats.percent}<span className="text-sm">%</span></span>
            </div>
            <div className="w-full bg-black/20 rounded-full h-1.5 overflow-hidden mb-3">
              <div className="bg-[#f4f1ea] h-1.5 rounded-full shadow-[0_0_10px_rgba(244,241,234,0.5)] transition-all duration-1000" style={{ width: `${stats.percent}%` }}></div>
            </div>

            <button onClick={() => setExpandDashboard(!expandDashboard)} className="w-full flex justify-center items-center py-1 text-white/40 hover:text-white/80 transition-colors">
                {expandDashboard ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            {expandDashboard && (
                <div className="grid grid-cols-2 gap-x-4 gap-y-3 mt-2 pt-2 border-t border-white/10 animate-in fade-in slide-in-from-top-1">
                    {Object.entries(stats.byCategory).map(([cat, data]) => (
                        <div key={cat} className="flex flex-col">
                            <div className="flex justify-between text-[10px] text-white/80 mb-1">
                                <span className={`font-bold ${data.percent === 100 ? 'text-yellow-400' : ''}`}>{cat}</span>
                                <span>{data.current}/{data.total}</span>
                            </div>
                            <div className="w-full bg-black/20 rounded-full h-1">
                                <div 
                                    className={`h-1 rounded-full transition-all duration-500 ${data.percent === 100 ? 'bg-yellow-400 shadow-[0_0_5px_rgba(250,204,21,0.8)]' : 'bg-[#a94438]'}`} 
                                    style={{ width: `${data.percent}%` }}
                                ></div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
          </div>
        </div>
      </header>

      <div className="px-4 -mt-5 relative z-20">
        <div className="bg-white rounded-xl shadow-lg p-1.5 flex gap-1">
          {[
            { id: 'category', label: '種類戰', icon: PieChart },
            { id: 'location', label: '地點戰', icon: Map },
            { id: 'guide', label: '攻略庫', icon: Search }
          ].map(mode => (
            <button 
              key={mode.id}
              onClick={() => setViewMode(mode.id)}
              className={`flex-1 py-2.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                viewMode === mode.id 
                  ? 'bg-[#3a4a61] text-white shadow-md' 
                  : 'text-gray-400 hover:bg-gray-50'
              }`}
            >
              <mode.icon className="w-3.5 h-3.5" /> {mode.label}
            </button>
          ))}
        </div>
      </div>

      <main className="flex-1 p-4 overflow-y-auto pb-20">
        
        {viewMode === 'category' && (
          <div className="animate-in fade-in slide-in-from-bottom-4">
             <div className="flex flex-col gap-3 mb-4">
                <div className="flex justify-between items-center">
                   <h3 className="text-xs font-bold text-[#3a4a61] uppercase tracking-widest">FILTERS</h3>
                   <button 
                     onClick={() => setShowMissingOnly(!showMissingOnly)}
                     className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all border ${
                       showMissingOnly 
                        ? 'bg-[#a94438] text-white border-[#a94438] shadow-sm' 
                        : 'bg-white text-gray-500 border-gray-200'
                     }`}
                   >
                     {showMissingOnly ? <EyeOff className="w-3 h-3"/> : <Eye className="w-3 h-3"/>}
                     {showMissingOnly ? '只顯示未收集' : '顯示全部'}
                   </button>
                </div>

                <div className="relative">
                    <Search className="absolute left-3 top-3 text-gray-400 w-4 h-4" />
                    <input 
                      type="text" 
                      value={categorySearch}
                      onChange={e => setCategorySearch(e.target.value)}
                      placeholder="搜尋種類 (例: 漢堡、水邊)..."
                      className="w-full pl-9 pr-8 py-2.5 rounded-lg border border-gray-200 focus:border-[#a94438] outline-none text-sm shadow-sm transition-all"
                    />
                    {categorySearch && (
                        <button onClick={() => setCategorySearch('')} className="absolute right-3 top-3 text-gray-400 hover:text-gray-600">
                            <X className="w-4 h-4" />
                        </button>
                    )}
                </div>

                <div className="flex flex-wrap gap-2">
                    <button onClick={() => setSelectedCategory('All')} className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors ${selectedCategory === 'All' ? 'bg-[#3c3633] text-white border-[#3c3633]' : 'bg-white text-gray-500 border-gray-200'}`}>全部</button>
                    {Object.keys(targetsByCategory).map(cat => (
                      <button key={cat} onClick={() => setSelectedCategory(cat)} className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors ${selectedCategory === cat ? 'bg-[#3c3633] text-white border-[#3c3633]' : 'bg-white text-gray-500 border-gray-200'}`}>
                        {cat} <span className="opacity-50 ml-1">{targetsByCategory[cat].length}</span>
                      </button>
                    ))}
                </div>
             </div>

             <div className="space-y-6">
                {selectedCategory === 'All' ? (
                   Object.entries(targetsByCategory).map(([cat, targets]) => {
                     const visibleTargets = targets.filter(t => {
                        let total = 0;
                        let current = 0;
                        if (t.variants) {
                            t.variants.forEach(v => {
                                total += v.validColors ? v.validColors.length : PIKMIN_COLORS.length;
                                const colorsToCheck = v.validColors || PIKMIN_COLORS.map(c => c.id);
                                colorsToCheck.forEach(cid => { if (collection[`${t.id}-${v.id}-${cid}`] === true || collection[`${t.id}-${v.id}-${cid}`] === 'nil') current++; });
                            });
                        } else {
                            total = t.validColors ? t.validColors.length : PIKMIN_COLORS.length;
                            const colorsToCheck = t.validColors || PIKMIN_COLORS.map(c => c.id);
                            colorsToCheck.forEach(cid => { if (collection[`${t.id}-${cid}`] === true || collection[`${t.id}-${cid}`] === 'nil') current++; });
                        }

                        if (showMissingOnly && current >= total && total > 0) return false;
                        
                        if (categorySearch) {
                            const query = categorySearch.toLowerCase();
                            const matchName = t.name.toLowerCase().includes(query);
                            const matchSub = t.subType && t.subType.toLowerCase().includes(query);
                            const matchVar = t.variants && t.variants.some(v => v.name.toLowerCase().includes(query));
                            if (!matchName && !matchSub && !matchVar) return false;
                        }

                        return true;
                     });
                     
                     if (visibleTargets.length === 0) return null;

                     return (
                       <div key={cat}>
                          <h3 className="text-[#a94438] font-bold text-sm mb-3 flex items-center gap-2 border-b border-[#a94438]/20 pb-1">
                            <Filter className="w-3 h-3" /> {cat} 系列
                          </h3>
                          {visibleTargets.map(t => <Card key={t.id} target={t} showLocTag={true} />)}
                       </div>
                     );
                   })
                ) : (
                   targetsByCategory[selectedCategory].filter(t => {
                        let total = 0;
                        let current = 0;
                        if (t.variants) {
                            t.variants.forEach(v => {
                                total += v.validColors ? v.validColors.length : PIKMIN_COLORS.length;
                                const colorsToCheck = v.validColors || PIKMIN_COLORS.map(c => c.id);
                                colorsToCheck.forEach(cid => { if (collection[`${t.id}-${v.id}-${cid}`] === true || collection[`${t.id}-${v.id}-${cid}`] === 'nil') current++; });
                            });
                        } else {
                            total = t.validColors ? t.validColors.length : PIKMIN_COLORS.length;
                            const colorsToCheck = t.validColors || PIKMIN_COLORS.map(c => c.id);
                            colorsToCheck.forEach(cid => { if (collection[`${t.id}-${cid}`] === true || collection[`${t.id}-${cid}`] === 'nil') current++; });
                        }

                       if (showMissingOnly && current >= total && total > 0) return false;
                       if (categorySearch) {
                           const query = categorySearch.toLowerCase();
                           const matchName = t.name.toLowerCase().includes(query);
                           const matchSub = t.subType && t.subType.toLowerCase().includes(query);
                           const matchVar = t.variants && t.variants.some(v => v.name.toLowerCase().includes(query));
                           if (!matchName && !matchSub && !matchVar) return false;
                       }
                       return true;
                   }).map(t => <Card key={t.id} target={t} showLocTag={true} />)
                )}
             </div>
          </div>
        )}

        {viewMode === 'location' && (
          <div className="animate-in fade-in slide-in-from-bottom-4">
            <div className="flex gap-2 overflow-x-auto pb-2 mb-2 no-scrollbar">
              {Object.keys(LOCATIONS).map(key => (
                <button
                  key={key}
                  onClick={() => setActiveTab(key)}
                  className={`flex-none py-2 px-4 rounded-full font-bold text-xs transition-all border whitespace-nowrap ${
                    activeTab === key 
                      ? 'bg-[#a94438] text-white border-[#a94438]' 
                      : 'bg-white text-gray-500 border-gray-200'
                  }`}
                >
                  {LOCATIONS[key].title.split(' / ')[0]}
                </button>
              ))}
            </div>
            
            <div className="mb-4 ml-1 mt-2">
               <h2 className="text-lg font-bold text-[#3a4a61] flex items-center gap-2">
                 {LOCATIONS[activeTab].icon} {LOCATIONS[activeTab].title}
               </h2>
               <p className="text-xs text-gray-400">{LOCATIONS[activeTab].desc}</p>
            </div>
            
            <div>
              {LOCATIONS[activeTab].targets.map(target => (
                <Card key={target.id} target={target} showLocTag={false} />
              ))}
            </div>
          </div>
        )}

        {viewMode === 'guide' && (
           <div className="animate-in fade-in slide-in-from-bottom-4 space-y-4">
              <div className="bg-gradient-to-r from-[#3a4a61] to-[#2a2522] p-5 rounded-xl text-white shadow-lg relative overflow-hidden">
                  <div style={cinematicGrainStyle}></div>
                  <div className="relative z-10">
                      <h3 className="font-bold text-lg flex items-center gap-2">
                          <Bot className="w-5 h-5" /> AI 戰術顧問 
                          {!isVip && <Lock className="w-3 h-3 opacity-50"/>}
                      </h3>
                      <p className="text-xs opacity-70 mt-1 mb-4">根據缺少的飾品分析最佳路徑 (VIP限定)</p>
                      
                      <button 
                          onClick={generateAiItinerary}
                          disabled={!isVip || isLoadingAi}
                          className={`w-full py-2 rounded-lg font-bold text-xs flex items-center justify-center gap-2 transition-all ${
                            isVip ? 'bg-white text-[#3a4a61] hover:bg-gray-100' : 'bg-white/10 text-gray-400 cursor-not-allowed'
                          }`}
                      >
                          {isLoadingAi ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                          {isLoadingAi ? "AI 運算中..." : "生成今日補給路線"}
                      </button>
                      
                      {aiAdvice && (
                          <div className="mt-4 bg-black/20 p-3 rounded border border-white/10 text-xs leading-relaxed whitespace-pre-line">
                             {aiAdvice}
                          </div>
                      )}
                  </div>
              </div>

              <div className="relative">
                  <Search className="absolute left-3 top-3 text-gray-400 w-4 h-4" />
                  <input 
                    type="text" 
                    value={guideSearch}
                    onChange={e => setGuideSearch(e.target.value)}
                    placeholder="搜尋關鍵字 (例: 美術館)..."
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-[#a94438] outline-none text-sm"
                  />
              </div>

              <div className="space-y-3">
                  {TAINAN_GUIDE_DATA.map(cat => {
                      const filtered = cat.items.filter(i => i.type.includes(guideSearch) || i.places.includes(guideSearch) || i.desc.includes(guideSearch));
                      if (filtered.length === 0) return null;
                      return (
                          <div key={cat.category} className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                              <h4 className={`font-bold text-sm mb-2 ${cat.color.replace('text-', 'text-[#a94438]')}`}>{cat.category}</h4>
                              <div className="space-y-2">
                                  {filtered.map((item, idx) => (
                                      <div key={idx} className="flex justify-between text-xs border-b border-dashed border-gray-100 pb-1 last:border-0 flex-wrap gap-1">
                                          <div className="w-full flex justify-between">
                                              <span className="font-bold text-gray-700">{item.type}</span>
                                              <span className="text-gray-500 text-right">{item.places}</span>
                                          </div>
                                          <p className="text-[10px] text-gray-400 w-full">{item.desc}</p>
                                      </div>
                                  ))}
                              </div>
                          </div>
                      )
                  })}
              </div>
           </div>
        )}

      </main>

      <footer className="p-4 text-center text-[9px] text-gray-400 border-t border-gray-200 bg-[#fcfbf9]">
        TAINAN PIKMIN OPS • VER {LAST_UPDATED} • {userId}
      </footer>
    </div>
  );
}