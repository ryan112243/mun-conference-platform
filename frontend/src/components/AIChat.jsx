import { useState, useEffect, useImperativeHandle, forwardRef, useRef } from 'react';
import axios from 'axios';

const AIChat = forwardRef(({ country, language = 'zh' }, ref) => {
  const [prompt, setPrompt] = useState('');
  const [nextPrompt, setNextPrompt] = useState('');
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedResponse, setSelectedResponse] = useState(null);
  const [wordToTranslate, setWordToTranslate] = useState('');
  const [translations, setTranslations] = useState([]);
  const [translating, setTranslating] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [textToSpeak, setTextToSpeak] = useState('');
  const selectedTextRef = useRef('');
  
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  
  // 處理文本選擇事件
  const handleTextSelection = () => {
    const selection = window.getSelection();
    if (selection && selection.toString().trim().length > 0) {
      selectedTextRef.current = selection.toString().trim();
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
  };

  // 朗讀功能
  const handleSpeak = (text) => {
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      setTextToSpeak('');
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'zh-TW';
    utterance.rate = 0.8;
    
    utterance.onstart = () => {
      setIsSpeaking(true);
      setTextToSpeak(text);
    };
    
    utterance.onend = () => {
      setIsSpeaking(false);
      setTextToSpeak('');
    };
    
    utterance.onerror = () => {
      setIsSpeaking(false);
      setTextToSpeak('');
    };
    
    window.speechSynthesis.speak(utterance);
  };

  // 新的對話功能
  const handleNewConversation = () => {
    setConversations([]);
    setPrompt('');
    setNextPrompt('');
    setSelectedResponse(null);
    setWordToTranslate('');
    setTranslations([]);
  };

  // 刪除單個對話
  const handleDeleteConversation = (conversationId) => {
    setConversations(conversations.filter(conv => conv.id !== conversationId));
    // 如果刪除的是當前選中的對話，清除選擇狀態
    if (selectedResponse && selectedResponse.conversationId === conversationId) {
      setSelectedResponse(null);
      setNextPrompt('');
    }
  };

  // 清除所有對話（用於離開會議時調用）
  const clearAllConversations = () => {
    setConversations([]);
    setPrompt('');
    setNextPrompt('');
    setSelectedResponse(null);
    setWordToTranslate('');
    setTranslations([]);
  };

  // 暴露清除函數給父組件
  useEffect(() => {
    if (window.clearAIConversations) {
      window.clearAIConversations = clearAllConversations;
    } else {
      window.clearAIConversations = clearAllConversations;
    }
  }, []);

  // 發送問題給所有AI模型
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    
    // 如果有選定的回答，則發送給其他AI模型進行評估
    if (selectedResponse) {
      await handleContinueConversation();
      return;
    }
    
    setLoading(true);
    
    try {
      const response = await axios.post(`${apiUrl}/api/ai/all`, { prompt, country });
      
      // 添加新的對話
      const newConversation = {
        id: Date.now(),
        prompt,
        responses: response.data.responses,
        selectedModel: null,
        continuationPrompt: null,
        continuationResponses: null
      };
      
      setConversations([...conversations, newConversation]);
      setPrompt('');
    } catch (error) {
      console.error('AI API錯誤:', error);
      alert('請求AI服務時出錯: ' + (error.response?.data?.error || error.message));
    } finally {
      setLoading(false);
    }
  };
  
  // 選擇最佳回答
  const handleSelectResponse = (conversationId, model) => {
    setConversations(conversations.map(conv => {
      if (conv.id === conversationId) {
        return { ...conv, selectedModel: model };
      }
      return conv;
    }));
    
    // 設置選定的回答，以便下一次提問時使用
    const conversation = conversations.find(conv => conv.id === conversationId);
    if (conversation) {
      const responseText = conversation.responses[model]?.text;
      if (responseText) {
        setSelectedResponse({
          conversationId,
          model,
          text: responseText,
          prompt: conversation.prompt
        });
      }
    }
  };
  
  // 取消選擇
  const handleCancelSelection = () => {
    setSelectedResponse(null);
    setNextPrompt('');
  };
  
  // 繼續對話
  const handleContinueConversation = async () => {
    if (!selectedResponse || !nextPrompt.trim()) return;
    
    setLoading(true);
    
    try {
      const response = await axios.post(`${apiUrl}/api/ai/evaluate`, {
        prompt: selectedResponse.prompt,
        selectedResponse: selectedResponse.text,
        selectedModel: selectedResponse.model,
        country,
        options: {
          nextPrompt
        }
      });
      
      // 更新對話
      setConversations(conversations.map(conv => {
        if (conv.id === selectedResponse.conversationId) {
          return {
            ...conv,
            continuationPrompt: nextPrompt,
            continuationResponses: response.data.responses
          };
        }
        return conv;
      }));
      
      // 重置狀態，準備新的對話
      setSelectedResponse(null);
      setNextPrompt('');
      setPrompt('');
    } catch (error) {
      console.error('AI評估錯誤:', error);
      alert('請求AI評估服務時出錯: ' + (error.response?.data?.error || error.message));
    } finally {
      setLoading(false);
    }
  };
  
  // 渲染AI回答 (隱藏AI身份)
  const renderAIResponse = (model, response, isSelected, onSelect) => {
    return (
      <div 
        key={model}
        className={`p-4 rounded-lg mb-3 ${isSelected ? 'border-2 border-blue-500 bg-blue-50' : 'border border-gray-200 bg-gray-50'}`}
        onMouseUp={handleTextSelection}
      >
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-medium text-lg">AI回答</h3>
          <div className="flex space-x-2">
            {!isSelected && !selectedResponse && (
              <button 
                onClick={() => onSelect(model)}
                className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
              >
                選擇此回答
              </button>
            )}
            {isSelected && (
              <span className="text-blue-500 text-sm font-medium">✓ 已選擇</span>
            )}
          </div>
        </div>
        
        {response.error ? (
          <div className="text-red-500">
            <p>錯誤: {response.message}</p>
          </div>
        ) : (
          <div>
            <div className="flex justify-between items-center mb-2">
              <button 
                onClick={() => handleSpeak(response.text)}
                className="text-blue-500 hover:text-blue-700 text-sm"
                disabled={isSpeaking}
              >
                {isSpeaking && textToSpeak === response.text ? '朗讀中...' : '朗讀全文'}
              </button>
            </div>
            <div className="whitespace-pre-wrap">{response.text}</div>
          </div>
        )}
      </div>
    );
  };
  
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">AI 聊天</h2>
        <button 
          onClick={handleNewConversation}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          新的對話
        </button>
      </div>
      
      {/* 翻譯功能 */}
      <div className="mb-4 flex items-center flex-wrap gap-2">
        <button 
          onClick={handleTranslate}
          className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
          disabled={!selectedTextRef.current}
        >
          翻譯選定文字
        </button>
        <span className="text-sm text-gray-500">(選擇文字後點擊按鈕)</span>
      </div>
      
      {/* 翻譯結果 */}
      {wordToTranslate && (
        <div className="mb-4 p-3 border rounded bg-yellow-50">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-medium">「{wordToTranslate}」的翻譯:</h3>
            <button 
              onClick={closeTranslation}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>
          
          {translating ? (
            <p>翻譯中...</p>
          ) : (
            <div className="space-y-2">
              {translations.map((item, index) => (
                <div key={index} className="border-b pb-2">
                  <div>
                    <p><strong>定義:</strong> {item.definition}</p>
                  </div>
                  <p><strong>翻譯:</strong> {item.translation}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      
      {/* 對話歷史 */}
      <div 
        className="mb-6 max-h-[60vh] overflow-y-auto border border-gray-200 rounded p-4"
        onMouseUp={handleTextSelection}
      >
        {conversations.length === 0 ? (
          <p className="text-gray-500 italic">對話將顯示在這裡</p>
        ) : (
          conversations.map((conversation) => (
            <div key={conversation.id} className="mb-8 pb-6 border-b border-gray-200">
              {/* 對話標題和刪除按鈕 */}
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-medium text-lg">對話 #{conversation.id}</h3>
                <button
                  onClick={() => handleDeleteConversation(conversation.id)}
                  className="text-red-500 hover:text-red-700 text-sm px-2 py-1 border border-red-300 rounded hover:bg-red-50"
                  title="刪除此對話"
                >
                  🗑️ 刪除
                </button>
              </div>
              
              {/* 用戶問題 */}
              <div className="bg-blue-100 p-3 rounded-lg mb-4">
                <div className="mb-2">
                  <p className="font-medium">你:</p>
                </div>
                <p>{conversation.prompt}</p>
              </div>
              
              {/* AI回答 */}
              <div className="mb-4">
                <h3 className="font-medium mb-2">AI回答:</h3>
                {Object.entries(conversation.responses).map(([model, response]) => 
                  renderAIResponse(
                    model, 
                    response, 
                    model === conversation.selectedModel,
                    (model) => handleSelectResponse(conversation.id, model)
                  )
                )}
              </div>
              
              {/* 繼續對話 */}
              {conversation.continuationPrompt && (
                <div className="mt-6">
                  <div className="bg-blue-100 p-3 rounded-lg mb-4">
                    <div className="mb-2">
                      <p className="font-medium">你 (繼續對話):</p>
                    </div>
                    <p>{conversation.continuationPrompt}</p>
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-2">其他AI的回答:</h3>
                    {Object.entries(conversation.continuationResponses || {}).map(([model, response]) => 
                      renderAIResponse(model, response, false, () => {})
                    )}
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
      
      {/* 輸入區域 */}
      {selectedResponse ? (
        <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="mb-2">
            <span className="font-medium">已選擇AI回答</span>
            <button 
              onClick={handleCancelSelection}
              className="ml-2 text-sm text-red-500 hover:text-red-700"
            >
              取消選擇
            </button>
          </p>
          <p className="text-sm text-gray-600">請輸入後續問題，AI將基於選定的回答繼續對話</p>
        </div>
      ) : null}
      
      <form onSubmit={handleSubmit} className="flex flex-col">
        {selectedResponse ? (
          <>
            <div className="mb-3 p-3 bg-blue-50 rounded border border-blue-200">
              <p className="text-sm text-blue-700 mb-1">繼續與選定的回答對話:</p>
              <p className="font-medium">{selectedResponse.text.substring(0, 100)}...</p>
              <p className="text-sm text-gray-500 mt-1">使用國家: {country}</p>
            </div>
            <textarea
              value={nextPrompt}
              onChange={(e) => setNextPrompt(e.target.value)}
              placeholder="輸入您的後續問題..."
              className="border p-2 rounded mb-3 h-24"
              required
            />
            <div className="flex space-x-2">
              <button 
                type="button" 
                onClick={handleCancelSelection}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                取消
              </button>
              <button 
                type="submit" 
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 flex-1"
                disabled={loading}
              >
                {loading ? '處理中...' : '發送'}
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="mb-2 text-sm text-gray-600">
              使用國家: {country}
            </div>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="輸入您的問題..."
              className="border p-2 rounded mb-3 h-24"
              required
            />
            <button 
              type="submit" 
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              disabled={loading}
            >
              {loading ? '處理中...' : '發送問題給所有AI'}
            </button>
          </>
        )}
      </form>
    </div>
  );
})

export default AIChat;