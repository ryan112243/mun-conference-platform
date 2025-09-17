import { useState, useRef } from 'react';
import axios from 'axios';

const ReadingFeature = ({ country }) => {
  const [textToRead, setTextToRead] = useState('');
  const [textToSpeak, setTextToSpeak] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [selectedText, setSelectedText] = useState('');
  const [wordToTranslate, setWordToTranslate] = useState('');
  const [translations, setTranslations] = useState([]);
  const [translating, setTranslating] = useState(false);
  const [speechRate, setSpeechRate] = useState(0.9);
  const [speechLang, setSpeechLang] = useState('en-US');
  const selectedTextRef = useRef('');
  
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  
  // 處理文本選擇事件
  const handleTextSelection = () => {
    const selection = window.getSelection();
    if (selection && selection.toString().trim().length > 0) {
      const text = selection.toString().trim();
      selectedTextRef.current = text;
      setSelectedText(text);
    }
  };

  // 翻譯選定的單詞
  const handleTranslate = async () => {
    const word = selectedTextRef.current;
    if (!word) return;
    
    setWordToTranslate(word);
    setTranslating(true);
    
    try {
      const response = await axios.post(`${apiUrl}/api/ai/translate`, { word });
      setTranslations(response.data.translations);
    } catch (error) {
      console.error('翻譯錯誤:', error);
      setTranslations([{ definition: word, translation: '翻譯失敗' }]);
    } finally {
      setTranslating(false);
    }
  };

  // 關閉翻譯結果
  const closeTranslation = () => {
    setWordToTranslate('');
    setTranslations([]);
    selectedTextRef.current = '';
    setSelectedText('');
  };
  
  // 朗讀文字功能
  const handleSpeak = (text) => {
    if (!text) return;
    
    // 停止當前朗讀
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
    }
    
    setTextToSpeak(text);
    setIsSpeaking(true);
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = speechLang;
    utterance.rate = speechRate;
    
    utterance.onend = () => {
      setIsSpeaking(false);
    };
    
    utterance.onerror = () => {
      setIsSpeaking(false);
    };
    
    window.speechSynthesis.speak(utterance);
  };
  
  // 停止朗讀
  const stopSpeaking = () => {
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };
  
  // 更改語音速率
  const handleRateChange = (e) => {
    setSpeechRate(parseFloat(e.target.value));
  };
  
  // 更改語音語言
  const handleLanguageChange = (lang) => {
    setSpeechLang(lang);
  };

  return (
    <div className="reading-feature p-6 max-w-4xl mx-auto bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">朗讀功能</h2>
      
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-semibold">輸入文本</h3>
          <div className="flex space-x-2">
            <button
              onClick={() => setTextToRead('')}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-3 py-1 rounded text-sm"
            >
              清空
            </button>
            <button
              onClick={() => handleSpeak(textToRead)}
              disabled={!textToRead.trim() || isSpeaking}
              className={`px-3 py-1 rounded text-sm ${isSpeaking && textToSpeak === textToRead ? 'bg-red-500 hover:bg-red-600 text-white' : 'bg-blue-500 hover:bg-blue-600 text-white'} ${!textToRead.trim() ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isSpeaking && textToSpeak === textToRead ? '朗讀中...' : '朗讀全文'}
            </button>
          </div>
        </div>
        <textarea
          value={textToRead}
          onChange={(e) => setTextToRead(e.target.value)}
          onMouseUp={handleTextSelection}
          className="w-full h-40 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="在此輸入或粘貼要朗讀的文本..."
        />
      </div>
      
      {selectedText && (
        <div className="mb-6 flex justify-between items-center">
          <div>
            <span className="font-medium">已選擇: </span>
            <span className="italic">「{selectedText}」</span>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => handleSpeak(selectedText)}
              className={`px-3 py-1 rounded text-sm ${isSpeaking && textToSpeak === selectedText ? 'bg-red-500 hover:bg-red-600 text-white' : 'bg-blue-500 hover:bg-blue-600 text-white'}`}
            >
              {isSpeaking && textToSpeak === selectedText ? '朗讀中...' : '朗讀選擇'}
            </button>
            <button
              onClick={handleTranslate}
              disabled={translating}
              className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm"
            >
              {translating ? '翻譯中...' : '翻譯'}
            </button>
          </div>
        </div>
      )}
      
      {wordToTranslate && translations.length > 0 && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-semibold">「{wordToTranslate}」的翻譯</h3>
            <button
              onClick={closeTranslation}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>
          <div className="space-y-2">
            {translations.map((item, index) => (
              <div key={index} className="p-2 bg-white rounded border border-gray-200">
                <div className="flex justify-between">
                  <div>
                    <span className="font-medium">{item.definition}</span>
                    {item.partOfSpeech && <span className="text-gray-500 text-sm ml-2">({item.partOfSpeech})</span>}
                  </div>
                  <button
                    onClick={() => handleSpeak(item.definition)}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    🔊
                  </button>
                </div>
                <p className="text-gray-700 mt-1">{item.translation}</p>
              </div>
            ))}
          </div>
        </div>
      )}
      
      <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold mb-3">朗讀設置</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">語音速率</label>
            <div className="flex items-center space-x-2">
              <span className="text-sm">慢</span>
              <input
                type="range"
                min="0.5"
                max="1.5"
                step="0.1"
                value={speechRate}
                onChange={handleRateChange}
                className="w-full"
              />
              <span className="text-sm">快</span>
              <span className="text-sm font-medium ml-2">{speechRate.toFixed(1)}</span>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">語音語言</label>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => handleLanguageChange('en-US')}
                className={`py-1 px-2 rounded text-sm ${speechLang === 'en-US' ? 'bg-blue-100 text-blue-800 border border-blue-300' : 'bg-gray-100 hover:bg-gray-200'}`}
              >
                英語 (美國)
              </button>
              <button
                onClick={() => handleLanguageChange('en-GB')}
                className={`py-1 px-2 rounded text-sm ${speechLang === 'en-GB' ? 'bg-blue-100 text-blue-800 border border-blue-300' : 'bg-gray-100 hover:bg-gray-200'}`}
              >
                英語 (英國)
              </button>
              <button
                onClick={() => handleLanguageChange('zh-CN')}
                className={`py-1 px-2 rounded text-sm ${speechLang === 'zh-CN' ? 'bg-blue-100 text-blue-800 border border-blue-300' : 'bg-gray-100 hover:bg-gray-200'}`}
              >
                中文 (簡體)
              </button>
              <button
                onClick={() => handleLanguageChange('zh-TW')}
                className={`py-1 px-2 rounded text-sm ${speechLang === 'zh-TW' ? 'bg-blue-100 text-blue-800 border border-blue-300' : 'bg-gray-100 hover:bg-gray-200'}`}
              >
                中文 (繁體)
              </button>
              <button
                onClick={() => handleLanguageChange('ja-JP')}
                className={`py-1 px-2 rounded text-sm ${speechLang === 'ja-JP' ? 'bg-blue-100 text-blue-800 border border-blue-300' : 'bg-gray-100 hover:bg-gray-200'}`}
              >
                日語
              </button>
              <button
                onClick={() => handleLanguageChange('ko-KR')}
                className={`py-1 px-2 rounded text-sm ${speechLang === 'ko-KR' ? 'bg-blue-100 text-blue-800 border border-blue-300' : 'bg-gray-100 hover:bg-gray-200'}`}
              >
                韓語
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {isSpeaking && (
        <div className="fixed bottom-4 right-4 bg-blue-600 text-white px-4 py-2 rounded-full shadow-lg flex items-center space-x-2">
          <span className="animate-pulse">🔊</span>
          <span>朗讀中...</span>
          <button
            onClick={stopSpeaking}
            className="ml-2 bg-white text-blue-600 rounded-full w-6 h-6 flex items-center justify-center hover:bg-gray-200"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
};

export default ReadingFeature;