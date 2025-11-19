import React, { useState, useEffect } from 'react';
import { 
  Train, Pill, Coffee, Store, Utensils, Scissors, ShoppingBag, 
  Croissant, Candy, MapPin, CheckCircle2, Plane, Palette, 
  Trees, Waves, Info, Star, UploadCloud, DownloadCloud, Loader2, 
  Settings, GraduationCap, Landmark, Drama, Hotel, Clapperboard, 
  Fish, Sparkles, UserCircle, LogOut, LogIn, Smartphone,
  Mail, ShoppingBasket, Zap, Bus, CloudRain, Snowflake, 
  Mountain, Ticket, Trophy, Pizza, Ghost, Gamepad2, Coins,
  ChevronRight, Search, Map, Bot, Lock
} from 'lucide-react';

// --- 設定區 ---
const DEFAULT_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxxZ5PdhzrsLN5p6_n_BXGcc7hZ1yliK7xyuzVPP6XEG1IftkIhQfVRIbZNRjwJcsMV/exec'; 

const PIKMIN_COLORS = [
  { id: 'red', name: '紅', color: 'bg-red-500', border: 'border-red-500', text: 'text-red-600' },
  { id: 'yellow', name: '黃', color: 'bg-yellow-400', border: 'border-yellow-400', text: 'text-yellow-600' },
  { id: 'blue', name: '藍', color: 'bg-blue-500', border: 'border-blue-500', text: 'text-blue-600' },
  { id: 'purple', name: '紫', color: 'bg-purple-600', border: 'border-purple-600', text: 'text-purple-600' },
  { id: 'white', name: '白', color: 'bg-gray-100', border: 'border-gray-300', text: 'text-gray-500' },
  { id: 'pink', name: '羽', color: 'bg-pink-400', border: 'border-pink-400', text: 'text-pink-500' },
  { id: 'rock', name: '岩', color: 'bg-gray-600', border: 'border-gray-600', text: 'text-gray-600' },
];

// --- 台南攻略資料庫 ---
const TAINAN_GUIDE_DATA = [
  {
    category: '文化與觀光 (台南強項)',
    color: 'bg-red-50',
    items: [
      { type: '神社/寺廟', icon: <Landmark className="w-4 h-4 text-red-600"/>, places: '孔廟、大天后宮、祀典武廟、延平郡王祠', desc: '中西區密度最高，幾乎是「保送」的分類。' },
      { type: '美術館', icon: <Palette className="w-4 h-4 text-rose-600"/>, places: '南美館 1&2館、奇美博物館', desc: '穩定點；部分私人藝廊（如勝利路附近）也可。' },
      { type: '圖書館', icon: <Store className="w-4 h-4 text-amber-700"/>, places: '市立圖書館(新總館)、台灣文學館', desc: '文學館有時會判定為美術館或圖書館。' },
      { type: '橋梁', icon: <MapPin className="w-4 h-4 text-gray-500"/>, places: '安億橋、漁光大橋 (安平區)', desc: '運河沿岸非常容易掃到。' },
      { type: '公園', icon: <Trees className="w-4 h-4 text-green-600"/>, places: '台南公園、巴克禮紀念公園', desc: '大型公園容易同時出現「公園」與「森林」。' },
      { type: '古蹟/觀光', icon: <Star className="w-4 h-4 text-yellow-500"/>, places: '赤崁樓、安平古堡', desc: '遊戲無古蹟飾品，通常判定為「公園」或「觀光景點」。' },
    ]
  },
  {
    category: '自然與戶外 (安平/濱海區)',
    color: 'bg-cyan-50',
    items: [
      { type: '水邊', icon: <Fish className="w-4 h-4 text-cyan-600"/>, places: '台南運河沿岸、漁光島', desc: '運河旁走路很容易取得魚餌飾品。' },
      { type: '海邊', icon: <Waves className="w-4 h-4 text-blue-500"/>, places: '黃金海岸、漁光島、觀汐平台', desc: '需靠近沙灘區域。' },
      { type: '森林', icon: <Trees className="w-4 h-4 text-green-700"/>, places: '成大校園(部分)、巴克禮公園', desc: '市區少大森林，成大校園大樹區偶爾出現。' },
      { type: '山', icon: <Mountain className="w-4 h-4 text-stone-600"/>, places: '關子嶺、梅嶺', desc: '市區無法取得。需前往白河、楠西等山區。' },
      { type: '動物園', icon: <Trees className="w-4 h-4 text-emerald-600"/>, places: '頑皮世界 (學甲)', desc: '市區極難取得。推薦停車場或藪貓館附近。' },
      { type: '主題樂園', icon: <Ticket className="w-4 h-4 text-purple-500"/>, places: '頑皮世界 (偶爾判定)', desc: '台南缺大型樂園，建議去義大或兒童新樂園。' },
    ]
  },
  {
    category: '美食與購物 (市區/商圈)',
    color: 'bg-orange-50',
    items: [
      { type: '甜點店', icon: <Candy className="w-4 h-4 text-pink-500"/>, places: '國華街、正興街、安平老街', desc: '全糖城市！冰店、布丁、豆花都有機會。' },
      { type: '咖啡廳', icon: <Coffee className="w-4 h-4 text-amber-700"/>, places: '中西區巷弄', desc: '數量極多，常與餐廳混雜出現。' },
      { type: '壽司', icon: <Fish className="w-4 h-4 text-red-400"/>, places: '爭鮮、壽司郎、藏壽司', desc: '連鎖店判定最準確。' },
      { type: '漢堡', icon: <Utensils className="w-4 h-4 text-orange-600"/>, places: '丹丹漢堡、麥當勞', desc: '必試丹丹漢堡能不能種出漢堡皮克敏！' },
      { type: '義式餐廳', icon: <Pizza className="w-4 h-4 text-yellow-600"/>, places: '百貨公司美食街', desc: '大遠百/新光三越內成功率較高。' },
      { type: '咖哩', icon: <Utensils className="w-4 h-4 text-amber-800"/>, places: '成大商圈', desc: '需尋找標註 Indian 或 Curry 的小店。' },
      { type: '麵包店', icon: <Croissant className="w-4 h-4 text-yellow-700"/>, places: '葡吉麵包、連鎖店', desc: '台南老牌麵包店多，容易取得。' },
    ]
  },
  {
    category: '交通與其他設施',
    color: 'bg-slate-50',
    items: [
      { type: '車站', icon: <Train className="w-4 h-4 text-blue-600"/>, places: '台南火車站、高鐵、保安', desc: '公車不算此類，必須是鐵路/高鐵。' },
      { type: '機場', icon: <Plane className="w-4 h-4 text-sky-600"/>, places: '台南航空站 (TNN)', desc: '必須前往機場範圍。' },
      { type: '公車站', icon: <Bus className="w-4 h-4 text-indigo-600"/>, places: '台南轉運站 (兵工廠)', desc: '最穩定的公車飾品點。' },
      { type: '百貨公司', icon: <ShoppingBag className="w-4 h-4 text-pink-600"/>, places: '南紡、新光三越、林百貨', desc: '可能出現服飾、美妝或甜點。' },
      { type: '電影院', icon: <Clapperboard className="w-4 h-4 text-purple-600"/>, places: '全美戲院、南紡威秀', desc: '全美戲院很有復古風味。' },
      { type: '家電行', icon: <Zap className="w-4 h-4 text-yellow-500"/>, places: '燦坤、全國電子', desc: '找路邊獨立建築的大型賣場。' },
    ]
  }
];

// 擴充後的完整地點資料 (支援亞種 ID)
const LOCATIONS = {
  work: {
    title: '奇美 / 南台商圈',
    icon: <Pill className="w-6 h-6" />,
    desc: '交通與生活機能核心。包含車站、郵局與各式餐廳。',
    color: 'bg-blue-50',
    targets: [
      { 
        id: 'station', name: '火車站 (Station)', icon: <Train className="w-5 h-5 text-blue-600" />, 
        subType: '紙火車 / 車票', 
        variants: [
          { id: 'paper_train', name: '紙火車' }, 
          { id: 'ticket', name: '車票 (印日期)' }
        ],
        tip: '大橋車站/台南車站。車票會印有取得當日的日期與站名。', priority: 'SSR' 
      },
      { 
        id: 'pharmacy', name: '藥局 (Pharmacy)', icon: <Pill className="w-5 h-5 text-teal-600" />, 
        subType: '牙刷', 
        tip: '醫院大廳或中華路藥局。', priority: 'High' 
      },
      { 
        id: 'restaurant', name: '餐廳 (Restaurant)', icon: <Utensils className="w-5 h-5 text-red-500" />, 
        subType: '廚師帽', 
        tip: '南台街美食區。有稀有「閃亮廚師帽」(Rare)。', priority: 'Mid', hasRare: true 
      },
      { 
        id: 'convenience', name: '便利商店 (Corner Store)', icon: <Store className="w-5 h-5 text-orange-500" />, 
        subType: '瓶蓋 / 零食', 
        variants: [
          { id: 'bottle_cap', name: '瓶蓋' },
          { id: 'snack', name: '零食' }
        ],
        tip: '7-11 或全家。隨機出現兩種亞種。', priority: 'Mid' 
      },
      { 
        id: 'post_office', name: '郵局 (Post Office)', icon: <Mail className="w-5 h-5 text-red-600" />, 
        subType: '郵票', 
        tip: '大橋郵局或學校代辦所。', priority: 'High' 
      },
      { 
        id: 'bus', name: '公車站 (Bus Stop)', icon: <Bus className="w-5 h-5 text-indigo-600" />, 
        subType: '公車紙模型', 
        tip: '主要幹道公車站牌。', priority: 'Low' 
      },
      { 
        id: 'cafe', name: '咖啡店 (Cafe)', icon: <Coffee className="w-5 h-5 text-amber-700" />, 
        subType: '咖啡杯', 
        tip: '星巴克、路易莎。', priority: 'Mid' 
      }
    ]
  },
  home: {
    title: '南應大商圈',
    icon: <MapPin className="w-6 h-6" />,
    desc: '全糖生活圈。甜點、超市與各類生活商店。',
    color: 'bg-green-50',
    targets: [
      { 
        id: 'sweetshop', name: '甜點店 (Sweetshop)', icon: <Candy className="w-5 h-5 text-pink-500" />, 
        subType: '馬卡龍 / 甜甜圈', 
        variants: [
          { id: 'macaron', name: '馬卡龍' },
          { id: 'donut', name: '甜甜圈' }
        ],
        tip: '豆花、冰店。這兩個亞種圖示相同，需等拔出後確認。', priority: 'High' 
      },
      { 
        id: 'supermarket', name: '超市 (Supermarket)', icon: <ShoppingBasket className="w-5 h-5 text-green-600" />, 
        subType: '蘑菇 / 香蕉', 
        variants: [
          { id: 'mushroom', name: '蘑菇' },
          { id: 'banana', name: '香蕉' }
        ],
        tip: '全聯、家樂福。香蕉有分整根和切片造型。', priority: 'High' 
      },
      { 
        id: 'burger', name: '漢堡店 (Burger)', icon: <Utensils className="w-5 h-5 text-orange-600" />, 
        subType: '漢堡', 
        tip: '早餐店或摩斯。只有紅黃藍三色。', priority: 'SR' 
      },
      { 
        id: 'appliance', name: '家電行 (Appliance)', icon: <Zap className="w-5 h-5 text-yellow-500" />, 
        subType: '電池 / 燈串', 
        variants: [
          { id: 'battery', name: '電池' },
          { id: 'lights', name: '燈串' }
        ],
        tip: '全國電子、燦坤或手機行。', priority: 'Mid' 
      },
      { 
        id: 'sushi', name: '壽司店 (Sushi)', icon: <Fish className="w-5 h-5 text-red-400" />, 
        subType: '壽司', 
        tip: '壽司郎、爭鮮。', priority: 'Mid' 
      },
      { 
        id: 'bakery', name: '麵包店 (Bakery)', icon: <Croissant className="w-5 h-5 text-yellow-700" />, 
        subType: '法式長棍', 
        tip: '有稀有異色版本。', priority: 'Mid', hasRare: true 
      },
      { 
        id: 'salon', name: '理髮廳 (Hair Salon)', icon: <Scissors className="w-5 h-5 text-purple-600" />, 
        subType: '剪刀', 
        tip: '有稀有異色版本。', priority: 'Mid', hasRare: true 
      },
      { 
        id: 'clothing', name: '服飾店 (Clothing)', icon: <ShoppingBag className="w-5 h-5 text-indigo-600" />, 
        subType: '髮圈', 
        tip: '服飾店或百貨專櫃。', priority: 'Low' 
      }
    ]
  },
  chengda: {
    title: '成大 / 後火車站',
    icon: <GraduationCap className="w-6 h-6" />,
    desc: '校園生態與義式料理。',
    color: 'bg-orange-50',
    targets: [
      { 
        id: 'waterside', name: '水邊 (Waterside)', icon: <Fish className="w-5 h-5 text-cyan-600" />, 
        subType: '魚餌', 
        tip: '成功湖。有稀有「閃亮魚餌」。', priority: 'SR', hasRare: true 
      },
      { 
        id: 'forest', name: '森林 (Forest)', icon: <Trees className="w-5 h-5 text-green-700" />, 
        subType: '鍬形蟲 / 橡實', 
        variants: [
          { id: 'stag_beetle', name: '鍬形蟲' },
          { id: 'acorn', name: '橡實' }
        ],
        tip: '榕園、校園樹木區。', priority: 'Mid' 
      },
      { 
        id: 'pizza', name: '義式餐廳 (Italian)', icon: <Pizza className="w-5 h-5 text-orange-500" />, 
        subType: '披薩', 
        tip: '校園周邊義大利麵店、必勝客。', priority: 'Mid' 
      },
      { 
        id: 'curry', name: '咖哩店 (Curry)', icon: <Utensils className="w-5 h-5 text-yellow-800" />, 
        subType: '咖哩', 
        tip: '咖哩專賣店。', priority: 'Low' 
      },
      { 
        id: 'book', name: '圖書館 (Library)', icon: <Store className="w-5 h-5 text-amber-800" />, 
        subType: '書本', 
        tip: '圖書館或書店。', priority: 'Mid' 
      }
    ]
  },
  west_central: {
    title: '中西區 / 藍晒圖',
    icon: <ShoppingBag className="w-6 h-6" />,
    desc: '文化、娛樂與古蹟。',
    color: 'bg-purple-50',
    targets: [
      { 
        id: 'shrine', name: '神社/寺廟 (Shrine)', icon: <Landmark className="w-5 h-5 text-red-700" />, 
        subType: '籤詩 (Fortune)', 
        tip: '孔廟、媽祖廟等各大廟宇。', priority: 'High' 
      },
      { 
        id: 'movie', name: '電影院 (Movie)', icon: <Clapperboard className="w-5 h-5 text-purple-600" />, 
        subType: '爆米花', 
        tip: '新光影城、全美戲院。', priority: 'SR' 
      },
      { 
        id: 'hotel', name: '飯店 (Hotel)', icon: <Hotel className="w-5 h-5 text-indigo-500" />, 
        subType: '備品', 
        tip: '晶英、和逸等飯店。', priority: 'SR' 
      },
      { 
        id: 'art', name: '美術館 (Art Gallery)', icon: <Palette className="w-5 h-5 text-rose-500" />, 
        subType: '畫框', 
        tip: '美術館、畫廊。', priority: 'Mid' 
      },
      { 
        id: 'stadium', name: '體育場 (Stadium)', icon: <Trophy className="w-5 h-5 text-orange-600" />, 
        subType: '鑰匙圈', 
        tip: '台南棒球場。', priority: 'Mid' 
      },
      { 
        id: 'makeup', name: '美妝店 (Makeup)', icon: <Sparkles className="w-5 h-5 text-pink-400" />, 
        subType: '化妝品', 
        tip: '寶雅、百貨化妝品櫃。', priority: 'Low' 
      }
    ]
  },
  museum: {
    title: '奇美博物館特區',
    icon: <Landmark className="w-6 h-6" />,
    desc: '最強熱點：美術館、機場、公園。',
    color: 'bg-rose-50',
    targets: [
      { id: 'art', name: '美術館', icon: <Palette className="w-5 h-5 text-rose-600" />, subType: '畫框', priority: 'SSR' },
      { id: 'airport', name: '機場', icon: <Plane className="w-5 h-5 text-sky-600" />, subType: '飛機玩具', priority: 'SSR' },
      { id: 'waterside', name: '水邊', icon: <Fish className="w-5 h-5 text-cyan-600" />, subType: '魚餌', priority: 'SR', hasRare: true },
      { 
        id: 'park', name: '公園 (Park)', icon: <Trees className="w-5 h-5 text-green-500" />, 
        subType: '幸運草', 
        variants: [
          { id: 'clover', name: '三葉幸運草' },
          { id: 'four_leaf', name: '四葉 (稀有)' }
        ],
        tip: '都會公園。四葉為稀有版本。', priority: 'Low' 
      }
    ]
  },
  weekend: {
    title: '假日郊區遠征',
    icon: <Trees className="w-6 h-6" />,
    desc: '動物園、海邊與特殊地形。',
    color: 'bg-indigo-50',
    targets: [
      { 
        id: 'zoo', name: '動物園 (Zoo)', icon: <Trees className="w-5 h-5 text-green-700" />, 
        subType: '蒲公英', 
        tip: '頑皮世界。', priority: 'SSR' 
      },
      { 
        id: 'beach', name: '沙灘 (Beach)', icon: <Waves className="w-5 h-5 text-cyan-500" />, 
        subType: '貝殼', 
        tip: '漁光島。', priority: 'SR' 
      },
      { 
        id: 'mountain', name: '山 (Mountain)', icon: <Mountain className="w-5 h-5 text-stone-600" />, 
        subType: '山徽章', 
        tip: '需至特定山區。', priority: 'SSR' 
      },
      { 
        id: 'theme_park', name: '主題樂園 (Theme Park)', icon: <Ticket className="w-5 h-5 text-purple-500" />, 
        subType: '樂園門票', 
        tip: '義大世界等。', priority: 'SSR' 
      },
      { 
        id: 'bridge', name: '橋樑 (Bridge)', icon: <MapPin className="w-5 h-5 text-gray-500" />, 
        subType: '橋樑徽章', 
        tip: '大型橋樑附近。', priority: 'Mid' 
      }
    ]
  },
  special: {
    title: '特殊 / 天氣 / 路邊',
    icon: <Star className="w-6 h-6" />,
    desc: '天氣限定與路邊隨機飾品。',
    color: 'bg-slate-100',
    targets: [
      { 
        id: 'weather_rain', name: '雨天 (Rain)', icon: <CloudRain className="w-5 h-5 text-blue-400" />, 
        subType: '葉子帽', 
        tip: '遊戲內天氣為下雨時出現 (僅藍/紅/黃)。', priority: 'SSR' 
      },
      { 
        id: 'weather_snow', name: '雪地 (Snow)', icon: <Snowflake className="w-5 h-5 text-sky-200" />, 
        subType: '雪', 
        tip: '下雪天氣或滑雪場。', priority: 'SSR' 
      },
      { 
        id: 'roadside', name: '路邊 (Roadside)', icon: <MapPin className="w-5 h-5 text-gray-400" />, 
        subType: '貼紙 / 硬幣', 
        variants: [
          { id: 'sticker', name: '貼紙 (綠/藍/黃)' },
          { id: 'coin', name: '硬幣' },
          { id: 'winter', name: '冬季貼紙' }
        ],
        tip: '非特定地點時出現。', priority: 'Low' 
      }
    ]
  },
  guide: {
    title: '攻略搜尋',
    icon: <Search className="w-6 h-6" />,
    desc: '輸入飾品名稱，尋找台南最佳去處',
    color: 'bg-slate-100',
    targets: [] 
  }
};

const ProgressBar = ({ total, current }) => {
  const percent = Math.round((current / total) * 100) || 0;
  return (
    <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
      <div className="bg-green-600 h-2.5 rounded-full transition-all duration-500" style={{ width: `${percent}%` }}></div>
      <div className="text-xs text-gray-500 mt-1 text-right">{percent}% 完成 ({current}/{total})</div>
    </div>
  );
};

const LoginScreen = ({ onLogin }) => {
  const [inputVal, setInputVal] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputVal.trim()) {
      setError('請輸入人事號');
      return;
    }
    if (inputVal.length < 2) {
      setError('人事號格式似乎太短了');
      return;
    }
    onLogin(inputVal.trim().toUpperCase());
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-600 to-teal-800 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-sm rounded-2xl shadow-2xl p-8 animate-in fade-in zoom-in duration-300">
        <div className="text-center mb-6">
          <div className="inline-flex p-3 bg-emerald-100 rounded-full text-emerald-600 mb-4">
            <Trees className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-black text-gray-800">歡迎回來</h1>
          <p className="text-gray-500 text-sm mt-1">請輸入人事號以存取您的皮克敏進度</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">
              人事號 (User ID)
            </label>
            <div className="relative">
              <UserCircle className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                placeholder="例如：A88888"
                className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-0 outline-none transition font-mono text-lg uppercase"
              />
            </div>
            {error && <p className="text-red-500 text-xs mt-2 pl-1">{error}</p>}
          </div>

          <button
            type="submit"
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl shadow-lg shadow-emerald-200 transition-all transform active:scale-95 flex items-center justify-center gap-2"
          >
            <LogIn className="w-5 h-5" />
            登入系統
          </button>
        </form>
        
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-400">
            系統將自動同步您的雲端資料
          </p>
        </div>
      </div>
    </div>
  );
};

export default function PikminCloudApp() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState('');
  const [activeTab, setActiveTab] = useState('work');
  const [collection, setCollection] = useState({});
  const [isSyncing, setIsSyncing] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');
  const scriptUrl = DEFAULT_SCRIPT_URL; 
  const [showSettings, setShowSettings] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [aiAdvice, setAiAdvice] = useState('');
  const [isLoadingAi, setIsLoadingAi] = useState(false);
  
  const [isVip, setIsVip] = useState(false);

  // --- 核心函式：檢查 VIP 並同步資料 ---
  // 將 loadFromCloud 的邏輯獨立出來，方便重複使用
  const checkVipAndSync = async (currentId) => {
    setIsSyncing(true);
    setStatusMsg('連線中...');
    try {
      const response = await fetch(`${scriptUrl}?action=load_collection&userId=${currentId}`);
      const data = await response.json();
      
      if (data.collection !== undefined) {
        // 如果雲端有資料，就用雲端的覆蓋；如果沒有，保留本地的
        if (Object.keys(data.collection).length > 0) {
          setCollection(data.collection);
        }
        setIsVip(data.isVip); 
        setStatusMsg(data.isVip ? '✅ VIP 登入' : '✅ 登入成功');
      } else {
        setStatusMsg('⚠️ 連線異常');
      }
    } catch (error) {
      console.error(error);
      setStatusMsg('❌ 連線失敗，使用離線模式');
    } finally {
      setIsSyncing(false);
      setTimeout(() => setStatusMsg(''), 3000);
    }
  };

  useEffect(() => {
    const savedUser = localStorage.getItem('pikmin_user_id');
    if (savedUser) {
      setUserId(savedUser);
      setIsLoggedIn(true);
      const savedCollection = localStorage.getItem(`pikmin_collection_${savedUser}`);
      if (savedCollection) setCollection(JSON.parse(savedCollection));
      
      // 自動檢查一次 (保持 session 時)
      // 延遲一點點執行，避免跟 rendering 搶資源
      setTimeout(() => checkVipAndSync(savedUser), 1000);
    }
  }, []);

  useEffect(() => {
    if (isLoggedIn && userId) {
      localStorage.setItem(`pikmin_collection_${userId}`, JSON.stringify(collection));
    }
  }, [collection, userId, isLoggedIn]);

  const handleLogin = (id) => {
    setUserId(id);
    setIsLoggedIn(true);
    localStorage.setItem('pikmin_user_id', id);
    const savedCollection = localStorage.getItem(`pikmin_collection_${id}`);
    if (savedCollection) {
      setCollection(JSON.parse(savedCollection));
    } else {
      setCollection({});
    }
    // 登入時立即觸發檢查
    checkVipAndSync(id);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserId('');
    setCollection({});
    setIsVip(false); 
    localStorage.removeItem('pikmin_user_id');
    setShowSettings(false);
  };

  const toggleDecor = (targetId, colorId, variantId = null) => {
    const key = variantId 
      ? `${targetId}-${variantId}-${colorId}` 
      : `${targetId}-${colorId}`;
    setCollection(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const getCollectedCount = (targetId, variants) => {
    if (variants) {
      let count = 0;
      variants.forEach(v => {
        count += PIKMIN_COLORS.filter(c => collection[`${targetId}-${v.id}-${c.id}`]).length;
      });
      return count;
    }
    return PIKMIN_COLORS.filter(c => collection[`${targetId}-${c.id}`]).length;
  };

  // --- AI 智慧行程規劃 (後端代理版) ---
  const generateAiItinerary = async () => {
    setIsLoadingAi(true);
    setAiAdvice('');

    const missingItems = [];
    Object.keys(LOCATIONS).forEach(locKey => {
        if (locKey === 'guide') return;
        LOCATIONS[locKey].targets.forEach(target => {
            if (target.variants) {
                target.variants.forEach(variant => {
                    const hasMissing = PIKMIN_COLORS.some(c => !collection[`${target.id}-${variant.id}-${c.id}`]);
                    if (hasMissing) missingItems.push(`${target.name} (${variant.name})`);
                });
            } else {
                const hasMissing = PIKMIN_COLORS.some(c => !collection[`${target.id}-${c.id}`]);
                if (hasMissing) missingItems.push(target.name);
            }
        });
    });

    const missingSummary = missingItems.slice(0, 15).join(", ");

    const prompt = `
      我正在台南玩 Pikmin Bloom 遊戲。
      請扮演一位專業的「台南旅遊與皮克敏收集顧問」。
      
      目前我還缺少以下類型的飾品：
      ${missingSummary} ${missingItems.length > 15 ? '...等等' : ''}。
      
      請根據台南的地理位置 (重點區域：永康、南應大、成大、中西區、安平)，
      為我規劃一個「半日遊」或「一日遊」的收集路線。
      
      要求：
      1. 路線要順路，不要東奔西跑。
      2. 針對我缺少的飾品，推薦具体的台南景點或店家。
      3. 語氣要活潑有趣，像個遊戲攻略專家。
      4. 請用繁體中文回答。
      5. 不要長篇大論，重點是路線建議。
    `;

    try {
      // ★ 改為呼叫 Apps Script 的 ask_ai 功能
      const response = await fetch(scriptUrl, {
        method: 'POST',
        mode: 'no-cors', // Google Script POST 需要 no-cors
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'ask_ai',
          userId: userId, // 必須傳送 ID 供後端驗證 VIP
          prompt: prompt
        })
      });

      // 注意：no-cors 模式下無法直接讀取 response。
      // 但 Apps Script 作為後端時，通常我們會用 GET 請求或允許 CORS 的 POST。
      // 為了取得回應資料，這裡我們需要改用標準的 fetch 處理方式
      // 如果上面的 no-cors 導致拿不到資料，我們改用下面這個特殊的 POST 技巧
      
      // 重發一次請求 (這次不加 no-cors，因為我們需要回傳值)
      // 如果遇到 CORS 錯誤，通常是因為 Apps Script 部署權限問題 (必須是 Anyone)
      const dataResponse = await fetch(scriptUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' }, // 這是規避 CORS 的小技巧
        body: JSON.stringify({
          action: 'ask_ai',
          userId: userId,
          prompt: prompt
        })
      });

      const data = await dataResponse.json();
      
      if (data.status === 'success') {
        setAiAdvice(data.data);
      } else {
        setAiAdvice(`錯誤：${data.message || '無法取得 AI 回應'}`);
      }

    } catch (error) {
      console.error("AI Error:", error);
      setAiAdvice("連線發生錯誤，請確認網路或稍後再試。");
    } finally {
      setIsLoadingAi(false);
    }
  };

  // --- Cloud Functions ---
  const saveToCloud = async () => {
    setIsSyncing(true);
    setStatusMsg('雲端儲存中...');
    try {
      await fetch(scriptUrl, {
        method: 'POST',
        mode: 'no-cors', 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'save_collection',
          userId: userId, 
          data: collection
        })
      });
      setTimeout(() => {
        setStatusMsg('✅ 已上傳');
        setIsSyncing(false);
        setTimeout(() => setStatusMsg(''), 3000);
      }, 1500);
    } catch (error) {
      console.error(error);
      setStatusMsg('❌ 上傳失敗');
      setIsSyncing(false);
    }
  };

  const renderColorButtons = (targetId, variantId = null, restrictedColors = null) => {
    return (
      <div className="flex flex-wrap gap-2 mt-1">
        {PIKMIN_COLORS.map(color => {
          if (restrictedColors && !restrictedColors.includes(color.id)) return null;
          const key = variantId ? `${targetId}-${variantId}-${color.id}` : `${targetId}-${color.id}`;
          const isChecked = collection[key];
          return (
            <button
              key={color.id}
              onClick={() => toggleDecor(targetId, color.id, variantId)}
              className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${
                isChecked ? `${color.color} border-transparent text-white shadow-md scale-110` : `bg-white ${color.border} opacity-30 hover:opacity-100`
              }`}
              title={`${variantId ? variantId : ''} ${color.name}`}
            >
              {isChecked && <CheckCircle2 className="w-5 h-5" />}
            </button>
          );
        })}
      </div>
    );
  };

  const renderTargetCard = (target) => {
    const collectedCount = getCollectedCount(target.id, target.variants);
    let totalCount = 7;
    let restrictedColors = null;
    if (target.id === 'burger' || target.id === 'weather_rain') {
      totalCount = 3;
      restrictedColors = ['red', 'yellow', 'blue'];
    }
    if (target.variants) {
      totalCount = target.variants.length * (restrictedColors ? 3 : 7);
    }
    const isComplete = collectedCount === totalCount;
    
    return (
      <div key={target.id} className={`bg-white p-4 rounded-xl shadow-sm border-l-4 ${isComplete ? 'border-green-500' : 'border-gray-200'} mb-4`}>
        <div className="flex justify-between items-start mb-2">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-gray-100 rounded-full">{target.icon}</div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-gray-800">{target.name}</h3>
                {target.hasRare && (
                  <span className="flex items-center gap-1 text-[10px] bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full font-bold border border-yellow-300 whitespace-nowrap">
                    <Sparkles className="w-3 h-3" /> 稀有
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-500 font-bold">{target.subType}</p>
            </div>
          </div>
          {target.priority && (
            <span className={`px-2 py-1 rounded text-xs font-bold whitespace-nowrap ${
              target.priority === 'SSR' ? 'bg-yellow-100 text-yellow-700 border border-yellow-300' :
              target.priority === 'SR' ? 'bg-purple-100 text-purple-700' :
              target.priority === 'High' ? 'bg-red-100 text-red-700' :
              'bg-gray-100 text-gray-600'
            }`}>
              {target.priority}
            </span>
          )}
        </div>
        <div className="mt-3">
          {target.variants ? (
            <div className="flex flex-col gap-3">
              {target.variants.map(v => (
                <div key={v.id} className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                  <div className="flex items-center gap-2 mb-1">
                    <ChevronRight className="w-3 h-3 text-slate-400" />
                    <span className="text-xs font-bold text-slate-700">{v.name}</span>
                  </div>
                  {renderColorButtons(target.id, v.id, restrictedColors)}
                </div>
              ))}
            </div>
          ) : (
            renderColorButtons(target.id, null, restrictedColors)
          )}
        </div>
        <div className="mt-4 space-y-2">
          <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded flex items-start gap-2">
            <Info className="w-3 h-3 mt-0.5 flex-shrink-0 text-blue-400" />
            {target.tip}
          </div>
          <ProgressBar total={totalCount} current={collectedCount} />
        </div>
      </div>
    );
  };

  const renderGuideView = () => {
    const filteredData = TAINAN_GUIDE_DATA.map(cat => ({
      ...cat,
      items: cat.items.filter(item => 
        item.type.includes(searchTerm) || 
        item.places.includes(searchTerm) || 
        item.desc.includes(searchTerm)
      )
    })).filter(cat => cat.items.length > 0);

    return (
      <div className="space-y-4">
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-4 rounded-xl text-white shadow-lg mb-4">
            <div className="flex justify-between items-start">
                <div>
                    <h3 className="font-bold text-lg flex items-center gap-2">
                        <Bot className="w-5 h-5" /> 
                        AI 探險顧問 
                        {!isVip && <Lock className="w-4 h-4 opacity-50"/>}
                    </h3>
                    <p className="text-xs opacity-80 mt-1">
                        {isVip ? "已依據您的收集進度解鎖專屬建議" : "此功能僅限 VIP 會員使用"}
                    </p>
                </div>
            </div>
            
            {isVip ? (
                <button 
                    onClick={generateAiItinerary}
                    disabled={isLoadingAi}
                    className="mt-3 w-full bg-white text-indigo-600 py-2 rounded-lg font-bold text-sm shadow flex items-center justify-center gap-2 hover:bg-indigo-50 disabled:opacity-70"
                >
                    {isLoadingAi ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                    {isLoadingAi ? "AI 正在思考路線..." : "生成今日補給路線"}
                </button>
            ) : (
                <button disabled className="mt-3 w-full bg-gray-400/50 text-white py-2 rounded-lg font-bold text-sm cursor-not-allowed">
                    權限不足 (請聯繫管理員)
                </button>
            )}

            {aiAdvice && (
                <div className="mt-4 bg-white/10 p-3 rounded-lg text-sm leading-relaxed animate-in fade-in">
                   <div className="whitespace-pre-line">{aiAdvice}</div>
                </div>
            )}
        </div>

        <div className="relative mb-4">
          <Search className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
          <input 
            type="text" 
            placeholder="搜尋飾品 (例如: 甜點、美術館)..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-slate-200 focus:border-emerald-500 outline-none shadow-sm text-slate-700"
          />
        </div>

        {filteredData.length === 0 ? (
          <div className="text-center py-10 text-gray-400">
            <Map className="w-12 h-12 mx-auto mb-2 opacity-20" />
            <p>找不到相關地點，換個關鍵字試試？</p>
          </div>
        ) : (
          filteredData.map((cat, catIdx) => (
            <div key={catIdx} className="space-y-2">
              <h3 className="text-xs font-bold text-gray-500 bg-white/50 px-2 py-1 rounded inline-block mb-1">
                {cat.category}
              </h3>
              {cat.items.map((item, itemIdx) => (
                <div key={itemIdx} className={`p-4 rounded-xl border-l-4 border-slate-300 shadow-sm bg-white flex flex-col gap-2`}>
                  <div className="flex items-center gap-2">
                    <div className={`p-2 rounded-full ${cat.color}`}>
                      {item.icon}
                    </div>
                    <h4 className="font-bold text-gray-800">{item.type}</h4>
                  </div>
                  <div className="ml-10">
                    <p className="text-sm text-gray-800 font-medium mb-1">📍 {item.places}</p>
                    <p className="text-xs text-gray-500">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          ))
        )}
      </div>
    );
  };

  if (!isLoggedIn) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-gray-100 font-sans max-w-md mx-auto shadow-2xl overflow-hidden flex flex-col relative">
      <header className="bg-gradient-to-br from-emerald-600 to-teal-700 text-white p-6 pb-8 rounded-b-[2rem] shadow-lg z-10 relative">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-black tracking-tight">你今天皮皮了嗎？</h1>
            <p className="text-emerald-100 text-xs mt-1 flex items-center gap-1">
              <UserCircle className="w-3 h-3" /> ID: {userId} {isVip && <span className="bg-yellow-400 text-black px-1 rounded text-[10px] font-bold">VIP</span>}
            </p>
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
        
        {showSettings && (
          <div className="mt-4 bg-black/20 rounded-xl p-4 backdrop-blur-md border border-white/10 mb-2 animate-in fade-in slide-in-from-top-2">
            <h3 className="text-xs font-bold text-emerald-100 mb-3">帳號管理</h3>
            <button 
              onClick={handleLogout}
              className="w-full bg-red-500/80 hover:bg-red-600 text-white py-2 rounded-lg text-xs flex items-center justify-center gap-1 transition"
            >
              <LogOut className="w-3 h-3" /> 登出 / 切換使用者
            </button>
          </div>
        )}

        <div className="mt-4">
           <div className="bg-emerald-800/30 rounded-lg p-3 mb-2 border border-emerald-400/20">
              <p className="text-[11px] text-emerald-100 leading-relaxed flex items-start gap-2">
                <Smartphone className="w-4 h-4 text-emerald-300 shrink-0 mt-0.5" />
                <span>
                  <strong>已啟用本機自動儲存：</strong> 進度即時保存。<br/>
                  <span className="opacity-80 mt-1 block">👇 若需換手機，請使用下方按鈕轉移。</span>
                </span>
              </p>
           </div>

            <div className="bg-white/10 rounded-xl p-3 backdrop-blur-md border border-white/10">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs text-emerald-100 font-medium">雲端轉移 (ID: {userId})</span>
                <span className="text-xs text-emerald-200 font-bold">{statusMsg}</span>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={saveToCloud}
                  disabled={isSyncing}
                  className="flex-1 bg-white/20 hover:bg-white/30 text-white text-xs py-2 rounded-lg flex items-center justify-center gap-1 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSyncing ? <Loader2 className="w-3 h-3 animate-spin" /> : <UploadCloud className="w-3 h-3" />}
                  上傳備份
                </button>
                <button 
                  // 這裡保持呼叫 checkVipAndSync 以便手動同步時也能更新 VIP
                  onClick={() => checkVipAndSync(userId)}
                  disabled={isSyncing}
                  className="flex-1 bg-white/20 hover:bg-white/30 text-white text-xs py-2 rounded-lg flex items-center justify-center gap-1 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSyncing ? <Loader2 className="w-3 h-3 animate-spin" /> : <DownloadCloud className="w-3 h-3" />}
                  下載進度/同步權限
                </button>
              </div>
            </div>
        </div>
      </header>

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
            {key === 'special' ? <Star className="w-4 h-4" /> : null}
            {key === 'guide' ? (
              <>
                <Search className="w-4 h-4" />
                攻略搜尋
              </>
            ) : (
               LOCATIONS[key].title.split('：')[1] || LOCATIONS[key].title.split(' / ')[0]
            )}
          </button>
        ))}
      </div>

      <main className="flex-1 p-4 overflow-y-auto">
        <div className="mb-4">
          <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
             {LOCATIONS[activeTab].icon}
             {LOCATIONS[activeTab].title}
          </h2>
          <p className="text-sm text-gray-500 mt-1">{LOCATIONS[activeTab].desc}</p>
        </div>

        {activeTab === 'guide' ? (
          renderGuideView()
        ) : (
          <div className="space-y-2">
            {LOCATIONS[activeTab].targets.map(target => renderTargetCard(target))}
          </div>
        )}
      </main>

      <footer className="p-4 text-center text-xs text-gray-400 bg-gray-50 border-t border-gray-200">
        台南皮克敏攻略 • ID: {userId} • Powered by Apps Script & Gemini AI-V11411191644
      </footer>
    </div>
  );
}