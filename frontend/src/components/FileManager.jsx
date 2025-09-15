import { useState, useEffect } from 'react';
import axios from 'axios';

const FileManager = ({ discussionId = null }) => {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState('');
  
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  
  // 獲取文件列表
  const fetchFiles = async () => {
    try {
      let url = `${apiUrl}/api/files`;
      if (discussionId) {
        url += `?discussionId=${discussionId}`;
      }
      
      const response = await axios.get(url);
      setFiles(response.data);
    } catch (error) {
      console.error('獲取文件列表錯誤:', error);
      setError('無法獲取文件列表');
    }
  };
  
  // 初始加載文件
  useEffect(() => {
    fetchFiles();
  }, [discussionId]);
  
  // 處理文件上傳
  const handleFileUpload = async (e) => {
    e.preventDefault();
    if (!selectedFile) return;
    
    setUploading(true);
    setError('');
    
    const formData = new FormData();
    formData.append('file', selectedFile);
    
    if (discussionId) {
      formData.append('discussionId', discussionId);
    }
    
    try {
      await axios.post(`${apiUrl}/api/files/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      setSelectedFile(null);
      fetchFiles(); // 重新獲取文件列表
    } catch (error) {
      console.error('文件上傳錯誤:', error);
      setError('文件上傳失敗');
    } finally {
      setUploading(false);
    }
  };
  
  // 處理文件刪除
  const handleDeleteFile = async (fileId) => {
    if (!window.confirm('確定要刪除此文件嗎？')) return;
    
    try {
      await axios.delete(`${apiUrl}/api/files/${fileId}`);
      fetchFiles(); // 重新獲取文件列表
    } catch (error) {
      console.error('文件刪除錯誤:', error);
      setError('文件刪除失敗');
    }
  };
  
  // 處理文件下載
  const handleDownloadFile = (fileId, fileName) => {
    window.open(`${apiUrl}/api/files/${fileId}`, '_blank');
  };
  
  // 格式化文件大小
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };
  
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4">文件管理</h2>
      
      {/* 文件上傳表單 */}
      <form onSubmit={handleFileUpload} className="mb-6">
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">選擇文件:</label>
          <input 
            type="file" 
            onChange={(e) => setSelectedFile(e.target.files[0])}
            className="border border-gray-300 p-2 w-full rounded"
            disabled={uploading}
          />
        </div>
        
        <button 
          type="submit" 
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-blue-300"
          disabled={!selectedFile || uploading}
        >
          {uploading ? '上傳中...' : '上傳文件'}
        </button>
      </form>
      
      {/* 錯誤信息 */}
      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
          {error}
        </div>
      )}
      
      {/* 文件列表 */}
      <div>
        <h3 className="text-xl font-medium mb-3">文件列表</h3>
        
        {files.length === 0 ? (
          <p className="text-gray-500 italic">沒有上傳的文件</p>
        ) : (
          <div className="border rounded overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">文件名</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">大小</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">上傳日期</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {files.map((file) => (
                  <tr key={file._id}>
                    <td className="px-6 py-4 whitespace-nowrap">{file.originalName}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{formatFileSize(file.size)}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{new Date(file.uploadDate).toLocaleString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap space-x-2">
                      <button 
                        onClick={() => handleDownloadFile(file._id, file.originalName)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        下載
                      </button>
                      <button 
                        onClick={() => handleDeleteFile(file._id)}
                        className="text-red-600 hover:text-red-900 ml-2"
                      >
                        刪除
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default FileManager;