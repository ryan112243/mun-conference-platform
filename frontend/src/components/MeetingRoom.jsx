import { useState, useEffect } from 'react';
import Discussions from './Discussions';
import FileManager from './FileManager';
import Translation from './Translation';
import TextToSpeech from './TextToSpeech';
import Upload from './Upload';

const MeetingRoom = ({ meetingData, onLeaveMeeting }) => {
  const [mode, setMode] = useState('discussion'); // 'discussion', 'files', 'translation', 'tts', 'upload'
  const [dialogues, setDialogues] = useState([]);
  const [currentDialogue, setCurrentDialogue] = useState(null);
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [language, setLanguage] = useState(meetingData?.language || 'zh');

  const translations = {
    zh: {
      meetingTitle: 'MUN 會議室',
      country: '代表國家',
      inviteCode: '邀請碼',
      discussion: '討論區',
      fileManager: '文件管理',
      translation: '翻譯',
      textToSpeech: '朗讀',
      upload: '上傳',
      leaveMeeting: '離開會議',
      copyright: '© 2025 MUN 會議系統. 版權所有.',
      languageSelect: '語言',
      allRightsReserved: '版權所有',
      poweredBy: '技術支持:'
    },
    en: {
      meetingTitle: 'MUN Meeting Room',
      country: 'Representing Country',
      inviteCode: 'Invite Code',
      discussion: 'Discussion',
      fileManager: 'File Manager',
      translation: 'Translation',
      textToSpeech: 'Text to Speech',
      upload: 'Upload',
      leaveMeeting: 'Leave Meeting',
      copyright: '© 2025 MUN Meeting System. All rights reserved.',
      languageSelect: 'Language',
      allRightsReserved: 'All rights reserved',
      poweredBy: 'Powered by'
    }
  };

  const t = translations[language];

  // 從localStorage載入對話資料
  useEffect(() => {
    const savedDialogues = localStorage.getItem('munDialogues');
    if (savedDialogues) {
      try {
        setDialogues(JSON.parse(savedDialogues));
      } catch (error) {
        console.error('載入對話資料失敗:', error);
      }
    }
  }, []);

  // 儲存對話到localStorage
  const saveDialogues = (newDialogues) => {
    localStorage.setItem('munDialogues', JSON.stringify(newDialogues));
    setDialogues(newDialogues);
  };

  // 發送訊息到當前對話
  const sendMessage = async (message) => {
    if (!currentDialogue) return;

    const newMessage = {
      id: Date.now(),
      text: message,
      sender: 'user',
      timestamp: new Date().toISOString()
    };

    const updatedDialogue = {
      ...currentDialogue,
      messages: [...currentDialogue.messages, newMessage]
    };

    const updatedDialogues = dialogues.map(d => 
      d.id === currentDialogue.id ? updatedDialogue : d
    );

    saveDialogues(updatedDialogues);
    setCurrentDialogue(updatedDialogue);
  };

  const handleLeaveMeeting = () => {
    // 清除本地存儲的對話數據
    localStorage.removeItem('munDialogues');
    
    // 重置狀態
    setDialogues([]);
    setCurrentDialogue(null);
    setPrompt('');
    setLoading(false);
    
    // 調用父組件的離開會議函數
    onLeaveMeeting();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* 頂部導航欄 */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-bold text-gray-900">
                {t.meetingTitle}: {meetingData.name}
              </h1>
              <span className="text-sm text-gray-500">
                {t.country}: {meetingData.country}
              </span>
              {meetingData.inviteCode && (
                <div className="flex items-center space-x-2 bg-blue-50 px-3 py-1 rounded-lg">
                  <span className="text-sm text-gray-600">{t.inviteCode}:</span>
                  <span className="text-sm font-mono font-bold text-blue-600 bg-white px-2 py-1 rounded border">
                    {meetingData.inviteCode}
                  </span>
                </div>
              )}
            </div>
            
            <div className="flex items-center space-x-4">
              {/* 語言選擇器 */}
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="zh">中文</option>
                <option value="en">English</option>
              </select>
              
              <button
                onClick={handleLeaveMeeting}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                {t.leaveMeeting}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 主要內容區域 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* 功能選項卡 */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6">
              <button
                onClick={() => setMode('discussion')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  mode === 'discussion'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {t.discussion}
              </button>
              <button
                onClick={() => setMode('files')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  mode === 'files'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {t.fileManager}
              </button>
              <button
                onClick={() => setMode('translation')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  mode === 'translation'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {t.translation}
              </button>
              <button
                onClick={() => setMode('tts')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  mode === 'tts'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {t.textToSpeech}
              </button>
              <button
                onClick={() => setMode('upload')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  mode === 'upload'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {t.upload}
              </button>
            </nav>
          </div>
          
          {/* 選項卡內容 */}
          <div className="p-6">
            {mode === 'discussion' && <Discussions />}
            {mode === 'files' && <FileManager />}
            {mode === 'translation' && <Translation />}
            {mode === 'tts' && <TextToSpeech />}
            {mode === 'upload' && <Upload />}
          </div>
        </div>
      </div>

      {/* 底部版權信息 */}
      <footer className="bg-white border-t mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center text-sm text-gray-500">
            <p>© 2025 MUN Conference Platform. {t.allRightsReserved}</p>
            <p className="mt-1">{t.poweredBy} React & Node.js</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MeetingRoom;