import { useState } from 'react';

const Translation = () => {
  const [sourceText, setSourceText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [sourceLang, setSourceLang] = useState('auto');
  const [targetLang, setTargetLang] = useState('en');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const languages = [
    { code: 'auto', name: '自動檢測' },
    { code: 'zh', name: '中文' },
    { code: 'en', name: 'English' },
    { code: 'ja', name: '日本語' },
    { code: 'ko', name: '한국어' },
    { code: 'fr', name: 'Français' },
    { code: 'de', name: 'Deutsch' },
    { code: 'es', name: 'Español' },
    { code: 'ru', name: 'Русский' },
    { code: 'ar', name: 'العربية' }
  ];

  const handleTranslate = async () => {
    if (!sourceText.trim()) {
      setError('請輸入要翻譯的文字');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // 使用 Google Translate API 或其他翻譯服務
      // 這裡使用 MyMemory API 作為示例（免費但有限制）
      const response = await fetch(
        `https://api.mymemory.translated.net/get?q=${encodeURIComponent(sourceText)}&langpair=${sourceLang}|${targetLang}`
      );
      
      const data = await response.json();
      
      if (data.responseStatus === 200) {
        setTranslatedText(data.responseData.translatedText);
      } else {
        throw new Error('翻譯失敗');
      }
    } catch (error) {
      console.error('翻譯錯誤:', error);
      setError('翻譯服務暫時不可用，請稍後再試');
    } finally {
      setLoading(false);
    }
  };

  const handleSwapLanguages = () => {
    if (sourceLang !== 'auto') {
      setSourceLang(targetLang);
      setTargetLang(sourceLang);
      setSourceText(translatedText);
      setTranslatedText(sourceText);
    }
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      // 可以添加提示訊息
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">文字翻譯</h2>
          
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}

          {/* 語言選擇 */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <select
                value={sourceLang}
                onChange={(e) => setSourceLang(e.target.value)}
                className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {languages.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.name}
                  </option>
                ))}
              </select>
              
              <button
                onClick={handleSwapLanguages}
                disabled={sourceLang === 'auto'}
                className="p-2 text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                title="交換語言"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
              </button>
              
              <select
                value={targetLang}
                onChange={(e) => setTargetLang(e.target.value)}
                className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {languages.filter(lang => lang.code !== 'auto').map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* 翻譯區域 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* 原文輸入 */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium text-gray-700">原文</label>
                <button
                  onClick={() => handleCopy(sourceText)}
                  disabled={!sourceText}
                  className="text-sm text-blue-600 hover:text-blue-800 disabled:opacity-50"
                >
                  複製
                </button>
              </div>
              <textarea
                value={sourceText}
                onChange={(e) => setSourceText(e.target.value)}
                placeholder="輸入要翻譯的文字..."
                className="w-full h-40 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
            </div>

            {/* 翻譯結果 */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium text-gray-700">翻譯結果</label>
                <button
                  onClick={() => handleCopy(translatedText)}
                  disabled={!translatedText}
                  className="text-sm text-blue-600 hover:text-blue-800 disabled:opacity-50"
                >
                  複製
                </button>
              </div>
              <textarea
                value={translatedText}
                readOnly
                placeholder="翻譯結果將顯示在這裡..."
                className="w-full h-40 border border-gray-300 rounded px-3 py-2 bg-gray-50 resize-none"
              />
            </div>
          </div>

          {/* 翻譯按鈕 */}
          <div className="mt-6 text-center">
            <button
              onClick={handleTranslate}
              disabled={loading || !sourceText.trim()}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed font-medium"
            >
              {loading ? '翻譯中...' : '翻譯'}
            </button>
          </div>

          {/* 使用說明 */}
          <div className="mt-8 p-4 bg-gray-50 rounded-lg">
            <h3 className="text-sm font-medium text-gray-900 mb-2">使用說明：</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• 支援多種語言之間的翻譯</li>
              <li>• 選擇「自動檢測」可自動識別原文語言</li>
              <li>• 點擊交換按鈕可快速切換翻譯方向</li>
              <li>• 使用複製按鈕可快速複製文字</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Translation;