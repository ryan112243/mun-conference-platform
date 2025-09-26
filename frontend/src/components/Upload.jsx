import { useState } from 'react';
import axios from 'axios';

const Upload = () => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [dragOver, setDragOver] = useState(false);

  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  // 處理文件選擇
  const handleFileSelect = (event) => {
    const files = Array.from(event.target.files);
    setSelectedFiles(prev => [...prev, ...files]);
  };

  // 處理拖拽上傳
  const handleDragOver = (event) => {
    event.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (event) => {
    event.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setDragOver(false);
    const files = Array.from(event.dataTransfer.files);
    setSelectedFiles(prev => [...prev, ...files]);
  };

  // 移除選中的文件
  const removeFile = (index) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  // 格式化文件大小
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // 上傳文件
  const handleUpload = async () => {
    if (selectedFiles.length === 0) return;

    setUploading(true);
    const newProgress = {};

    try {
      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i];
        const formData = new FormData();
        formData.append('file', file);

        newProgress[file.name] = 0;
        setUploadProgress({ ...newProgress });

        try {
          const response = await axios.post(`${apiUrl}/api/upload`, formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
            onUploadProgress: (progressEvent) => {
              const progress = Math.round(
                (progressEvent.loaded * 100) / progressEvent.total
              );
              newProgress[file.name] = progress;
              setUploadProgress({ ...newProgress });
            },
          });

          // 上傳成功
          setUploadedFiles(prev => [...prev, {
            name: file.name,
            size: file.size,
            type: file.type,
            url: response.data.url,
            uploadTime: new Date().toISOString()
          }]);

          newProgress[file.name] = 100;
          setUploadProgress({ ...newProgress });

        } catch (error) {
          console.error(`上傳文件 ${file.name} 失敗:`, error);
          newProgress[file.name] = -1; // 表示上傳失敗
          setUploadProgress({ ...newProgress });
        }
      }

      // 清除已選擇的文件
      setSelectedFiles([]);
      
    } catch (error) {
      console.error('上傳過程中發生錯誤:', error);
    } finally {
      setUploading(false);
    }
  };

  // 清除上傳歷史
  const clearHistory = () => {
    setUploadedFiles([]);
    setUploadProgress({});
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-6">文件上傳</h2>

      {/* 拖拽上傳區域 */}
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center mb-6 transition-colors ${
          dragOver
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="space-y-4">
          <div className="text-6xl text-gray-400">📁</div>
          <div>
            <p className="text-lg font-medium text-gray-700">
              拖拽文件到此處或點擊選擇文件
            </p>
            <p className="text-sm text-gray-500 mt-2">
              支持多種文件格式：文檔、圖片、音頻、視頻等
            </p>
          </div>
          <input
            type="file"
            multiple
            onChange={handleFileSelect}
            className="hidden"
            id="file-input"
          />
          <label
            htmlFor="file-input"
            className="inline-block bg-blue-500 text-white px-6 py-2 rounded-lg cursor-pointer hover:bg-blue-600 transition-colors"
          >
            選擇文件
          </label>
        </div>
      </div>

      {/* 已選擇的文件列表 */}
      {selectedFiles.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-3">已選擇的文件 ({selectedFiles.length})</h3>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {selectedFiles.map((file, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="text-2xl">
                    {file.type.startsWith('image/') ? '🖼️' :
                     file.type.startsWith('video/') ? '🎥' :
                     file.type.startsWith('audio/') ? '🎵' :
                     file.type.includes('pdf') ? '📄' :
                     file.type.includes('word') ? '📝' :
                     file.type.includes('excel') ? '📊' : '📁'}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{file.name}</p>
                    <p className="text-sm text-gray-500">{formatFileSize(file.size)}</p>
                  </div>
                </div>
                <button
                  onClick={() => removeFile(index)}
                  className="text-red-500 hover:text-red-700 p-1"
                  title="移除文件"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
          
          <div className="mt-4 flex space-x-3">
            <button
              onClick={handleUpload}
              disabled={uploading}
              className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {uploading ? '上傳中...' : '開始上傳'}
            </button>
            <button
              onClick={() => setSelectedFiles([])}
              className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-colors"
            >
              清除選擇
            </button>
          </div>
        </div>
      )}

      {/* 上傳進度 */}
      {Object.keys(uploadProgress).length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-3">上傳進度</h3>
          <div className="space-y-3">
            {Object.entries(uploadProgress).map(([fileName, progress]) => (
              <div key={fileName} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">{fileName}</span>
                  <span className={
                    progress === -1 ? 'text-red-500' :
                    progress === 100 ? 'text-green-500' : 'text-blue-500'
                  }>
                    {progress === -1 ? '上傳失敗' :
                     progress === 100 ? '上傳完成' : `${progress}%`}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${
                      progress === -1 ? 'bg-red-500' :
                      progress === 100 ? 'bg-green-500' : 'bg-blue-500'
                    }`}
                    style={{ width: `${Math.max(0, progress)}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 已上傳的文件 */}
      {uploadedFiles.length > 0 && (
        <div>
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-medium">已上傳的文件 ({uploadedFiles.length})</h3>
            <button
              onClick={clearHistory}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              清除歷史
            </button>
          </div>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {uploadedFiles.map((file, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="text-2xl">
                    {file.type.startsWith('image/') ? '🖼️' :
                     file.type.startsWith('video/') ? '🎥' :
                     file.type.startsWith('audio/') ? '🎵' :
                     file.type.includes('pdf') ? '📄' :
                     file.type.includes('word') ? '📝' :
                     file.type.includes('excel') ? '📊' : '📁'}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{file.name}</p>
                    <p className="text-sm text-gray-500">
                      {formatFileSize(file.size)} • 
                      上傳於 {new Date(file.uploadTime).toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-green-500 text-sm">✓ 已上傳</span>
                  {file.url && (
                    <a
                      href={file.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:text-blue-700 text-sm"
                    >
                      查看
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 使用說明 */}
      <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h4 className="font-medium text-blue-900 mb-2">使用說明</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• 支持拖拽上傳和點擊選擇文件</li>
          <li>• 可以同時選擇多個文件進行批量上傳</li>
          <li>• 支持各種文件格式：文檔、圖片、音頻、視頻等</li>
          <li>• 實時顯示上傳進度和狀態</li>
          <li>• 上傳完成後可以查看和管理文件</li>
        </ul>
      </div>
    </div>
  );
};

export default Upload;