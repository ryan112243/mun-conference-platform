import { useState } from 'react';

const InitialScreen = ({ onMeetingStart }) => {
  const [mode, setMode] = useState(''); // 'create' or 'join'
  const [country, setCountry] = useState('');
  const [customCountry, setCustomCountry] = useState('');
  const [inviteCode, setInviteCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [language, setLanguage] = useState('zh'); // 'zh' for Chinese, 'en' for English

  const countries = [
    // 亞洲主要國家
    '中國', '日本', '韓國', '印度', '泰國', '越南', '新加坡', '馬來西亞', '印尼', '菲律賓',
    '緬甸', '柬埔寨', '老撾', '孟加拉', '斯里蘭卡', '尼泊爾', '不丹', '馬爾地夫', '巴基斯坦', '阿富汗',
    '伊朗', '伊拉克', '沙烏地阿拉伯', '阿聯酋', '卡達', '科威特', '巴林', '阿曼', '葉門', '約旦',
    '敘利亞', '黎巴嫩', '以色列', '土耳其', '哈薩克', '烏茲別克', '吉爾吉斯', '塔吉克', '土庫曼',
    
    // 歐洲主要國家
    '德國', '法國', '英國', '義大利', '西班牙', '荷蘭', '比利時', '瑞士', '奧地利', '瑞典',
    '挪威', '丹麥', '芬蘭', '波蘭', '捷克', '匈牙利', '希臘', '葡萄牙', '愛爾蘭', '冰島',
    '俄羅斯', '烏克蘭', '白俄羅斯', '立陶宛', '拉脫維亞', '愛沙尼亞', '羅馬尼亞', '保加利亞',
    '塞爾維亞', '克羅埃西亞', '斯洛維尼亞', '斯洛伐克', '波士尼亞和黑塞哥維那', '蒙特內哥羅',
    '北馬其頓', '阿爾巴尼亞', '摩爾多瓦', '盧森堡', '摩納哥', '安道爾', '聖馬利諾', '梵蒂岡',
    
    // 美洲主要國家
    '美國', '加拿大', '墨西哥', '巴西', '阿根廷', '智利', '秘魯', '哥倫比亞', '委內瑞拉', '厄瓜多',
    '玻利維亞', '巴拉圭', '烏拉圭', '蘇利南', '蓋亞那', '法屬圭亞那', '古巴', '牙買加', '海地',
    '多明尼加', '巴拿馬', '哥斯大黎加', '尼加拉瓜', '宏都拉斯', '薩爾瓦多', '瓜地馬拉', '貝里斯',
    
    // 非洲主要國家
    '南非', '埃及', '奈及利亞', '肯亞', '摩洛哥', '阿爾及利亞', '突尼西亞', '利比亞', '蘇丹',
    '衣索比亞', '加納', '象牙海岸', '塞內加爾', '馬利', '布吉納法索', '尼日', '查德', '喀麥隆',
    '中非共和國', '剛果民主共和國', '剛果共和國', '加彭', '赤道幾內亞', '聖多美和普林西比',
    '安哥拉', '尚比亞', '辛巴威', '波札那', '納米比亞', '史瓦帝尼', '賴索托', '馬拉威', '莫三比克',
    '坦尚尼亞', '烏干達', '盧安達', '蒲隆地', '吉布地', '索馬利亞', '厄利垂亞', '馬達加斯加',
    '模里西斯', '塞席爾', '葛摩', '維德角', '幾內亞比索', '幾內亞', '獅子山', '賴比瑞亞', '多哥', '貝南',
    
    // 大洋洲主要國家
    '澳洲', '紐西蘭', '斐濟', '巴布亞紐幾內亞', '索羅門群島', '萬那杜', '薩摩亞', '東加',
    '吐瓦魯', '諾魯', '帛琉', '馬紹爾群島', '密克羅尼西亞', '吉里巴斯',
    
    // 其他選項
    '其他'
  ];

  const translations = {
    zh: {
      title: 'MUN 會議系統',
      subtitle: '模擬聯合國會議平台',
      createMeeting: '建立會議',
      joinMeeting: '加入會議',
      selectCountry: '選擇代表國家',
      customCountryPlaceholder: '請輸入國家名稱',
      inviteCodePlaceholder: '請輸入邀請碼',
      create: '建立',
      join: '加入',
      back: '返回',
      loading: '處理中...',
      copyright: '© 2025 MUN 會議系統. 版權所有.',
      languageSelect: '語言選擇'
    },
    en: {
      title: 'MUN Meeting System',
      subtitle: 'Model United Nations Conference Platform',
      createMeeting: 'Create Meeting',
      joinMeeting: 'Join Meeting',
      selectCountry: 'Select Representing Country',
      customCountryPlaceholder: 'Enter country name',
      inviteCodePlaceholder: 'Enter invite code',
      create: 'Create',
      join: 'Join',
      back: 'Back',
      loading: 'Processing...',
      copyright: '© 2025 MUN Meeting System. All rights reserved.',
      languageSelect: 'Language'
    }
  };

  const t = translations[language];

  const generateInviteCode = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  };

  const handleCreateMeeting = async () => {
    const selectedCountry = country === '其他' ? customCountry : country;
    if (!selectedCountry) return;

    setLoading(true);
    
    try {
      // 調用後端API創建會議
      const response = await fetch('http://localhost:3001/api/users/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ country: selectedCountry }),
      });

      if (response.ok) {
        const data = await response.json();
        const meetingData = {
          type: 'create',
          country: selectedCountry,
          inviteCode: data.inviteCode,
          language: language
        };
        
        onMeetingStart(meetingData);
      } else {
        const errorData = await response.json();
        alert(language === 'zh' ? '創建會議失敗，請重試' : 'Failed to create meeting, please try again');
      }
    } catch (error) {
      console.error('創建會議時發生錯誤:', error);
      alert(language === 'zh' ? '網絡錯誤，請稍後重試' : 'Network error, please try again later');
    } finally {
      setLoading(false);
    }
  };

  const handleJoinMeeting = async () => {
    if (!inviteCode.trim()) return;

    setLoading(true);
    
    try {
      // 驗證邀請碼是否存在
      const response = await fetch('http://localhost:3001/api/users/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ inviteCode: inviteCode.trim() }),
      });

      if (response.ok) {
        const data = await response.json();
        const meetingData = {
          type: 'join',
          inviteCode: inviteCode.trim(),
          language: language,
          hostCountry: data.country
        };
        
        onMeetingStart(meetingData);
      } else {
        const errorData = await response.json();
        alert(language === 'zh' ? '無效的邀請碼，請檢查後重試' : 'Invalid invite code, please check and try again');
      }
    } catch (error) {
      console.error('驗證邀請碼時發生錯誤:', error);
      alert(language === 'zh' ? '網絡錯誤，請稍後重試' : 'Network error, please try again later');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* 語言選擇器 */}
      <div className="absolute top-4 right-4">
        <div className="flex items-center space-x-2 bg-white rounded-lg shadow-md px-3 py-2">
          <span className="text-sm font-medium text-gray-700">{t.languageSelect}:</span>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="border-0 bg-transparent text-sm font-medium text-blue-600 focus:outline-none cursor-pointer"
          >
            <option value="zh">中文</option>
            <option value="en">English</option>
          </select>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* 標題區域 */}
          <div className="text-center mb-12">
            <div className="mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full mx-auto mb-4 flex items-center justify-center shadow-lg">
                <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
            <h1 className="text-4xl font-bold text-gray-800 mb-3">{t.title}</h1>
            <p className="text-xl text-gray-600">{t.subtitle}</p>
          </div>

          {/* 主要內容卡片 */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            {!mode ? (
              // 選擇模式
              <div className="space-y-6">
                <h2 className="text-2xl font-semibold text-center text-gray-800 mb-8">
                  請選擇操作
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <button
                    onClick={() => setMode('create')}
                    className="group relative overflow-hidden bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold py-8 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                  >
                    <div className="relative z-10">
                      <div className="text-3xl mb-3">🏛️</div>
                      <div className="text-xl">{t.createMeeting}</div>
                    </div>
                    <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                  </button>
                  
                  <button
                    onClick={() => setMode('join')}
                    className="group relative overflow-hidden bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-8 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                  >
                    <div className="relative z-10">
                      <div className="text-3xl mb-3">🤝</div>
                      <div className="text-xl">{t.joinMeeting}</div>
                    </div>
                    <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                  </button>
                </div>
              </div>
            ) : mode === 'create' ? (
              // 建立會議
              <div className="space-y-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-semibold text-gray-800">{t.createMeeting}</h2>
                  <button
                    onClick={() => setMode('')}
                    className="text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    {t.selectCountry}
                  </label>
                  <select
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    required
                  >
                    <option value="">請選擇國家</option>
                    {countries.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                {country === '其他' && (
                  <div>
                    <input
                      type="text"
                      value={customCountry}
                      onChange={(e) => setCustomCountry(e.target.value)}
                      placeholder={t.customCountryPlaceholder}
                      className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      required
                    />
                  </div>
                )}

                <div className="flex space-x-4 pt-4">
                  <button
                    onClick={() => setMode('')}
                    className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-3 px-6 rounded-lg transition-colors"
                  >
                    {t.back}
                  </button>
                  <button
                    onClick={handleCreateMeeting}
                    disabled={loading || !country || (country === '其他' && !customCountry)}
                    className="flex-1 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-lg transition-colors"
                  >
                    {loading ? t.loading : t.create}
                  </button>
                </div>
              </div>
            ) : (
              // 加入會議
              <div className="space-y-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-semibold text-gray-800">{t.joinMeeting}</h2>
                  <button
                    onClick={() => setMode('')}
                    className="text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    邀請碼
                  </label>
                  <input
                    type="text"
                    value={inviteCode}
                    onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
                    placeholder={t.inviteCodePlaceholder}
                    className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-center text-lg font-mono tracking-wider"
                    maxLength={6}
                    required
                  />
                </div>

                <div className="flex space-x-4 pt-4">
                  <button
                    onClick={() => setMode('')}
                    className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-3 px-6 rounded-lg transition-colors"
                  >
                    {t.back}
                  </button>
                  <button
                    onClick={handleJoinMeeting}
                    disabled={loading || !inviteCode.trim()}
                    className="flex-1 bg-green-500 hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-lg transition-colors"
                  >
                    {loading ? t.loading : t.join}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* 版權信息 */}
          <div className="text-center mt-8">
            <p className="text-sm text-gray-500">{t.copyright}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InitialScreen;