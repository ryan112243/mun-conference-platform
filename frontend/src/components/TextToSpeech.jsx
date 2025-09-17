import { useState, useEffect } from 'react';

const TextToSpeech = () => {
  const [text, setText] = useState('');
  const [voices, setVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState('');
  const [rate, setRate] = useState(1);
  const [pitch, setPitch] = useState(1);
  const [volume, setVolume] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  // 獲取可用的語音
  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = speechSynthesis.getVoices();
      setVoices(availableVoices);
      
      // 預設選擇英文語音
      const englishVoice = availableVoices.find(voice => 
        voice.lang.includes('en') && voice.lang.includes('US')
      ) || availableVoices.find(voice => 
        voice.lang.includes('en')
      );
      
      if (englishVoice) {
        setSelectedVoice(englishVoice.name);
      } else if (availableVoices.length > 0) {
        setSelectedVoice(availableVoices[0].name);
      }
    };

    loadVoices();
    speechSynthesis.addEventListener('voiceschanged', loadVoices);

    return () => {
      speechSynthesis.removeEventListener('voiceschanged', loadVoices);
    };
  }, []);

  const handleSpeak = () => {
    if (!text.trim()) {
      alert('請輸入要朗讀的文字');
      return;
    }

    // 停止當前播放
    speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    
    // 設置語音參數
    const voice = voices.find(v => v.name === selectedVoice);
    if (voice) {
      utterance.voice = voice;
    }
    
    utterance.rate = rate;
    utterance.pitch = pitch;
    utterance.volume = volume;

    // 事件監聽
    utterance.onstart = () => {
      setIsPlaying(true);
      setIsPaused(false);
    };

    utterance.onend = () => {
      setIsPlaying(false);
      setIsPaused(false);
    };

    utterance.onerror = (event) => {
      console.error('語音合成錯誤:', event);
      setIsPlaying(false);
      setIsPaused(false);
      alert('語音播放失敗，請檢查瀏覽器設置');
    };

    speechSynthesis.speak(utterance);
  };

  const handlePause = () => {
    if (speechSynthesis.speaking && !speechSynthesis.paused) {
      speechSynthesis.pause();
      setIsPaused(true);
    }
  };

  const handleResume = () => {
    if (speechSynthesis.paused) {
      speechSynthesis.resume();
      setIsPaused(false);
    }
  };

  const handleStop = () => {
    speechSynthesis.cancel();
    setIsPlaying(false);
    setIsPaused(false);
  };

  const handleClear = () => {
    setText('');
    handleStop();
  };

  const sampleTexts = [
    '歡迎使用文字朗讀功能！',
    'Welcome to the text-to-speech feature!',
    '這是一個測試文本，用於演示語音合成功能。',
    'This is a test text to demonstrate the speech synthesis functionality.'
  ];

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">文字朗讀</h2>

          {/* 文字輸入區域 */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-medium text-gray-700">輸入文字</label>
              <button
                onClick={handleClear}
                className="text-sm text-red-600 hover:text-red-800"
              >
                清空
              </button>
            </div>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="輸入要朗讀的文字..."
              className="w-full h-40 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
            <div className="text-right text-sm text-gray-500 mt-1">
              字數: {text.length}
            </div>
          </div>

          {/* 快速示例 */}
          <div className="mb-6">
            <label className="text-sm font-medium text-gray-700 mb-2 block">快速示例</label>
            <div className="flex flex-wrap gap-2">
              {sampleTexts.map((sample, index) => (
                <button
                  key={index}
                  onClick={() => setText(sample)}
                  className="text-sm bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded border"
                >
                  {sample.length > 20 ? sample.substring(0, 20) + '...' : sample}
                </button>
              ))}
            </div>
          </div>

          {/* 語音設置 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* 語音選擇 */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">選擇語音</label>
              <select
                value={selectedVoice}
                onChange={(e) => setSelectedVoice(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {voices.map((voice) => (
                  <option key={voice.name} value={voice.name}>
                    {voice.name} ({voice.lang})
                  </option>
                ))}
              </select>
            </div>

            {/* 語速控制 */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                語速: {rate.toFixed(1)}x
              </label>
              <input
                type="range"
                min="0.5"
                max="2"
                step="0.1"
                value={rate}
                onChange={(e) => setRate(parseFloat(e.target.value))}
                className="w-full"
              />
            </div>

            {/* 音調控制 */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                音調: {pitch.toFixed(1)}
              </label>
              <input
                type="range"
                min="0.5"
                max="2"
                step="0.1"
                value={pitch}
                onChange={(e) => setPitch(parseFloat(e.target.value))}
                className="w-full"
              />
            </div>

            {/* 音量控制 */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                音量: {Math.round(volume * 100)}%
              </label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={volume}
                onChange={(e) => setVolume(parseFloat(e.target.value))}
                className="w-full"
              />
            </div>
          </div>

          {/* 控制按鈕 */}
          <div className="flex justify-center space-x-4 mb-6">
            <button
              onClick={handleSpeak}
              disabled={!text.trim() || isPlaying}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed font-medium flex items-center space-x-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1.586a1 1 0 01.707.293l2.414 2.414a1 1 0 00.707.293H15a2 2 0 002-2V9a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293L10.293 4.293A1 1 0 009.586 4H8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              <span>開始朗讀</span>
            </button>

            {isPlaying && !isPaused && (
              <button
                onClick={handlePause}
                className="bg-yellow-600 text-white px-6 py-3 rounded-lg hover:bg-yellow-700 font-medium flex items-center space-x-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6" />
                </svg>
                <span>暫停</span>
              </button>
            )}

            {isPaused && (
              <button
                onClick={handleResume}
                className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 font-medium flex items-center space-x-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1.586a1 1 0 01.707.293l2.414 2.414a1 1 0 00.707.293H15a2 2 0 002-2V9a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293L10.293 4.293A1 1 0 009.586 4H8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                <span>繼續</span>
              </button>
            )}

            {isPlaying && (
              <button
                onClick={handleStop}
                className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 font-medium flex items-center space-x-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 10h6v4H9z" />
                </svg>
                <span>停止</span>
              </button>
            )}
          </div>

          {/* 使用說明 */}
          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="text-sm font-medium text-gray-900 mb-2">使用說明：</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• 支援多種語言和語音選擇</li>
              <li>• 可調整語速、音調和音量</li>
              <li>• 支援播放、暫停、繼續和停止控制</li>
              <li>• 使用快速示例可快速測試功能</li>
              <li>• 建議使用 Chrome 或 Edge 瀏覽器以獲得最佳體驗</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TextToSpeech;