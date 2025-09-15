import { useState, useEffect } from 'react'
import './App.css'
import AIChat from './components/AIChat'
import FileManager from './components/FileManager'
import Discussions from './components/Discussions'
import InitialScreen from './components/InitialScreen'

function App() {
  const [activeTab, setActiveTab] = useState('ai')
  const [initialized, setInitialized] = useState(false)
  const [inviteCode, setInviteCode] = useState('')
  const [country, setCountry] = useState('')
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000'
  
  // 檢查是否已經初始化
  useEffect(() => {
    const savedInviteCode = localStorage.getItem('munInviteCode')
    const savedCountry = localStorage.getItem('munCountry')
    
    if (savedInviteCode && savedCountry) {
      setInviteCode(savedInviteCode)
      setCountry(savedCountry)
      setInitialized(true)
    }
  }, [])

  // 完成初始設置
  const handleInitialSetupComplete = (code, selectedCountry) => {
    setInviteCode(code)
    setCountry(selectedCountry)
    setInitialized(true)
  }
  
  // 如果未初始化，顯示初始畫面
  if (!initialized) {
    return <InitialScreen onComplete={handleInitialSetupComplete} />
  }
  
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-blue-600 text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-3xl font-bold">MUN Website</h1>
          <div className="text-sm">
            <span className="mr-2">邀請碼: {inviteCode}</span>
            <span>國家: {country}</span>
          </div>
        </div>
      </header>
      
      <main className="container mx-auto p-4">
        {/* 導航標籤 */}
        <div className="flex border-b mb-6">
          <button
            className={`px-4 py-2 font-medium ${activeTab === 'ai' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('ai')}
          >
            AI 聊天
          </button>
          <button
            className={`px-4 py-2 font-medium ${activeTab === 'files' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('files')}
          >
            文件管理
          </button>
          <button
            className={`px-4 py-2 font-medium ${activeTab === 'discussions' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('discussions')}
          >
            討論區
          </button>
        </div>
        
        {/* 內容區域 */}
        <div className="mb-6">
          {activeTab === 'ai' && <AIChat country={country} />}
          {activeTab === 'files' && <FileManager />}
          {activeTab === 'discussions' && <Discussions />}
        </div>
        
        {/* 頁腳信息 */}
        <div className="text-center text-gray-500 text-sm mt-8">
          <p>API URL: {apiUrl}</p>
          <p className="mt-2">© {new Date().getFullYear()} MUN Website. 保留所有權利。</p>
        </div>
      </main>
    </div>
  )
}

export default App