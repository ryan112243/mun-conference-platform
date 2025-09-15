import { useState } from 'react';
import axios from 'axios';

const InitialScreen = ({ onComplete }) => {
  const [mode, setMode] = useState('select'); // select, create, join
  const [country, setCountry] = useState('');
  const [inviteCode, setInviteCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  
  // 國家列表
  const countries = [
    '台灣', '中國', '美國', '英國', '法國', '俄羅斯', '日本', '韓國', 
    '加拿大', '澳洲', '德國', '義大利', '西班牙', '巴西', '印度',
    '新加坡', '馬來西亞', '泰國', '越南', '印尼', '菲律賓', 
    '墨西哥', '阿根廷', '智利', '南非', '埃及', '土耳其', 
    '沙烏地阿拉伯', '阿聯酋', '以色列', '瑞典', '挪威', '芬蘭', 
    '丹麥', '荷蘭', '比利時', '瑞士', '奧地利', '葡萄牙', '希臘', 
    '波蘭', '烏克蘭', '捷克', '匈牙利', '其他'
  ];

  // 創建新邀請碼
  // 自定義國家輸入狀態
  const [customCountry, setCustomCountry] = useState('');

  const handleCreate = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    // 檢查國家選擇
    let selectedCountry = country;
    if (country === '其他' && !customCountry.trim()) {
      setError('請輸入您的國家');
      return;
    } else if (country === '其他') {
      selectedCountry = customCountry.trim();
    }
    
    if (!selectedCountry) {
      setError('請選擇國家');
      return;
    }
    
    setLoading(true);
    
    try {
      const response = await axios.post(`${apiUrl}/api/users/create`, { country: selectedCountry });
      setSuccess(`成功創建邀請碼: ${response.data.inviteCode}`);
      setInviteCode(response.data.inviteCode);
      
      // 將邀請碼和國家保存到本地存儲
      localStorage.setItem('munInviteCode', response.data.inviteCode);
      localStorage.setItem('munCountry', selectedCountry);
      
      // 通知父組件完成初始設置
      setTimeout(() => {
        onComplete(response.data.inviteCode, selectedCountry);
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.error || '創建邀請碼時出錯');
    } finally {
      setLoading(false);
    }
  };

  // 使用現有邀請碼
  const handleJoin = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    if (!inviteCode) {
      setError('請輸入邀請碼');
      return;
    }
    
    setLoading(true);
    
    try {
      const response = await axios.post(`${apiUrl}/api/users/verify`, { inviteCode });
      
      if (response.data.valid) {
        setSuccess('邀請碼有效！');
        
        // 將邀請碼和國家保存到本地存儲
        localStorage.setItem('munInviteCode', inviteCode);
        localStorage.setItem('munCountry', response.data.country);
        
        // 通知父組件完成初始設置
        setTimeout(() => {
          onComplete(inviteCode, response.data.country);
        }, 2000);
      }
    } catch (err) {
      setError(err.response?.data?.error || '無效的邀請碼');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6">歡迎使用 MUN 網站</h1>
        
        {mode === 'select' && (
          <div className="space-y-4">
            <p className="text-gray-600 text-center mb-4">請選擇一個選項開始使用</p>
            <button
              onClick={() => setMode('create')}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded transition duration-200"
            >
              創建新邀請碼
            </button>
            <button
              onClick={() => setMode('join')}
              className="w-full bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded transition duration-200"
            >
              使用現有邀請碼
            </button>
          </div>
        )}
        
        {mode === 'create' && (
          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <label className="block text-gray-700 mb-2">選擇您的國家</label>
              <select
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">-- 請選擇國家 --</option>
                {countries.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            
            {country === '其他' && (
              <div className="mt-3">
                <label className="block text-gray-700 mb-2">請輸入您的國家</label>
                <input
                  type="text"
                  value={customCountry}
                  onChange={(e) => setCustomCountry(e.target.value)}
                  placeholder="請輸入您的國家"
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            )}
            
            {error && <p className="text-red-500">{error}</p>}
            {success && <p className="text-green-500">{success}</p>}
            
            <div className="flex space-x-4">
              <button
                type="button"
                onClick={() => setMode('select')}
                className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 px-4 rounded transition duration-200"
              >
                返回
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded transition duration-200 disabled:bg-blue-300"
              >
                {loading ? '處理中...' : '創建'}
              </button>
            </div>
          </form>
        )}
        
        {mode === 'join' && (
          <form onSubmit={handleJoin} className="space-y-4">
            <div>
              <label className="block text-gray-700 mb-2">輸入邀請碼</label>
              <input
                type="text"
                value={inviteCode}
                onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
                placeholder="例如: ABC12345"
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            
            {error && <p className="text-red-500">{error}</p>}
            {success && <p className="text-green-500">{success}</p>}
            
            <div className="flex space-x-4">
              <button
                type="button"
                onClick={() => setMode('select')}
                className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 px-4 rounded transition duration-200"
              >
                返回
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded transition duration-200 disabled:bg-green-300"
              >
                {loading ? '驗證中...' : '加入'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default InitialScreen;