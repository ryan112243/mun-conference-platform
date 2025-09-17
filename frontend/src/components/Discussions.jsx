import { useState, useEffect } from 'react';
import axios from 'axios';

const Discussions = () => {
  const [discussions, setDiscussions] = useState([]);
  const [selectedDiscussion, setSelectedDiscussion] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // 新討論表單
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  
  // 新評論
  const [commentContent, setCommentContent] = useState('');
  
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  
  // 刪除討論
  const handleDeleteDiscussion = async (discussionId, e) => {
    e.stopPropagation(); // 防止觸發選擇討論
    if (!confirm('確定要刪除這個討論嗎？此操作無法撤銷。')) {
      return;
    }
    
    try {
      await axios.delete(`${apiUrl}/api/discussions/${discussionId}`);
      setDiscussions(discussions.filter(d => d._id !== discussionId));
      if (selectedDiscussion && selectedDiscussion._id === discussionId) {
        setSelectedDiscussion(null);
        setComments([]);
      }
    } catch (error) {
      console.error('刪除討論錯誤:', error);
      setError('無法刪除討論');
    }
  };
  
  // 獲取所有討論
  const fetchDiscussions = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${apiUrl}/api/discussions`);
      setDiscussions(response.data);
    } catch (error) {
      console.error('獲取討論列表錯誤:', error);
      setError('無法獲取討論列表');
    } finally {
      setLoading(false);
    }
  };
  
  // 初始加載討論
  useEffect(() => {
    fetchDiscussions();
  }, []);
  
  // 獲取單個討論的評論
  const fetchComments = async (discussionId) => {
    try {
      const response = await axios.get(`${apiUrl}/api/discussions/${discussionId}/comments`);
      setComments(response.data);
    } catch (error) {
      console.error('獲取評論錯誤:', error);
      setError('無法獲取評論');
    }
  };
  
  // 選擇討論
  const handleSelectDiscussion = async (discussion) => {
    setSelectedDiscussion(discussion);
    await fetchComments(discussion._id);
  };
  
  // 創建新討論
  const handleCreateDiscussion = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;
    
    setLoading(true);
    setError('');
    
    try {
      const tagsArray = tags.split(',').map(tag => tag.trim()).filter(tag => tag);
      
      const response = await axios.post(`${apiUrl}/api/discussions`, {
        title,
        content,
        tags: tagsArray
      });
      
      // 重置表單
      setTitle('');
      setContent('');
      setTags('');
      
      // 更新討論列表
      setDiscussions([response.data, ...discussions]);
    } catch (error) {
      console.error('創建討論錯誤:', error);
      setError('創建討論失敗');
    } finally {
      setLoading(false);
    }
  };
  
  // 添加評論
  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!commentContent.trim() || !selectedDiscussion) return;
    
    try {
      const response = await axios.post(`${apiUrl}/api/discussions/${selectedDiscussion._id}/comments`, {
        content: commentContent
      });
      
      // 更新評論列表
      setComments([...comments, response.data]);
      setCommentContent('');
    } catch (error) {
      console.error('添加評論錯誤:', error);
      setError('添加評論失敗');
    }
  };
  
  // 返回討論列表
  const handleBackToList = () => {
    setSelectedDiscussion(null);
    setComments([]);
  };
  
  // 格式化日期
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };
  
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4">討論區</h2>
      
      {/* 錯誤信息 */}
      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
          {error}
        </div>
      )}
      
      {selectedDiscussion ? (
        // 討論詳情和評論
        <div>
          <button 
            onClick={handleBackToList}
            className="mb-4 text-blue-500 hover:text-blue-700 flex items-center"
          >
            &larr; 返回討論列表
          </button>
          
          <div className="border-b pb-4 mb-4">
            <h3 className="text-xl font-semibold mb-2">{selectedDiscussion.title}</h3>
            <p className="mb-2 whitespace-pre-wrap">{selectedDiscussion.content}</p>
            <div className="flex items-center text-sm text-gray-500">
              <span>由 {selectedDiscussion.createdBy || '匿名'} 發布於 {formatDate(selectedDiscussion.createdAt)}</span>
            </div>
            {selectedDiscussion.tags && selectedDiscussion.tags.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1">
                {selectedDiscussion.tags.map((tag, index) => (
                  <span key={index} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
          
          {/* 評論列表 */}
          <div className="mb-6">
            <h4 className="text-lg font-medium mb-3">評論 ({comments.length})</h4>
            
            {comments.length === 0 ? (
              <p className="text-gray-500 italic">還沒有評論</p>
            ) : (
              <div className="space-y-4">
                {comments.map((comment) => (
                  <div key={comment._id} className="border-b pb-3">
                    <p className="mb-1 whitespace-pre-wrap">{comment.content}</p>
                    <div className="text-sm text-gray-500">
                      <span>{comment.createdBy || '匿名'} • {formatDate(comment.createdAt)}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* 添加評論表單 */}
          <form onSubmit={handleAddComment}>
            <div className="mb-3">
              <label className="block text-gray-700 mb-1">添加評論:</label>
              <textarea
                value={commentContent}
                onChange={(e) => setCommentContent(e.target.value)}
                className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="3"
                required
              />
            </div>
            <button 
              type="submit" 
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-blue-300"
              disabled={!commentContent.trim()}
            >
              發布評論
            </button>
          </form>
        </div>
      ) : (
        // 討論列表和創建表單
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* 創建討論表單 */}
          <div className="md:col-span-1">
            <div className="bg-gray-50 p-4 rounded border">
              <h3 className="text-lg font-medium mb-3">創建新討論</h3>
              <form onSubmit={handleCreateDiscussion}>
                <div className="mb-3">
                  <label className="block text-gray-700 mb-1">標題:</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                
                <div className="mb-3">
                  <label className="block text-gray-700 mb-1">內容:</label>
                  <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows="5"
                    required
                  />
                </div>
                
                <div className="mb-4">
                  <label className="block text-gray-700 mb-1">標籤 (用逗號分隔):</label>
                  <input
                    type="text"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    placeholder="例如: 問題, 建議, 討論"
                    className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <button 
                  type="submit" 
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-blue-300 w-full"
                  disabled={loading || !title.trim() || !content.trim()}
                >
                  {loading ? '創建中...' : '創建討論'}
                </button>
              </form>
            </div>
          </div>
          
          {/* 討論列表 */}
          <div className="md:col-span-2">
            <h3 className="text-lg font-medium mb-3">所有討論</h3>
            
            {loading && <p className="text-gray-500">加載中...</p>}
            
            {!loading && discussions.length === 0 ? (
              <p className="text-gray-500 italic">還沒有討論</p>
            ) : (
              <div className="space-y-4">
                {discussions.map((discussion) => (
                  <div 
                    key={discussion._id} 
                    className="border rounded p-4 hover:bg-gray-50 cursor-pointer relative"
                    onClick={() => handleSelectDiscussion(discussion)}
                  >
                    <button
                      onClick={(e) => handleDeleteDiscussion(discussion._id, e)}
                      className="absolute top-2 right-2 text-red-500 hover:text-red-700 p-1"
                      title="刪除討論"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                    <h4 className="text-lg font-medium mb-1 pr-8">{discussion.title}</h4>
                    <p className="text-gray-600 mb-2 line-clamp-2">{discussion.content}</p>
                    
                    <div className="flex justify-between items-center text-sm text-gray-500">
                      <span>{discussion.createdBy || '匿名'} • {formatDate(discussion.createdAt)}</span>
                    </div>
                    
                    {discussion.tags && discussion.tags.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {discussion.tags.map((tag, index) => (
                          <span key={index} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Discussions;