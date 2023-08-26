import React, { useState, useRef } from 'react';

import axios from 'axios';

const FileUploadBox: React.FC = () => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Replace with your actual Dataverse API URL
  const dataverseApiUrl = 'https://your-dataverse-instance/api/';
  const accessToken = 'your-access-token'; // Replace with your actual access token

  const handleFileChange = (newFiles: File[]) => {
    setSelectedFiles((prevFiles) => [...prevFiles, ...newFiles]);
  };

  const handleRemoveFile = (index: number) => {
    setSelectedFiles((prevFiles) => {
      const updatedFiles = [...prevFiles];
      updatedFiles.splice(index, 1);
      return updatedFiles;
    });
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const newFiles = Array.from(e.dataTransfer.files);
    handleFileChange(newFiles);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleBoxClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleUploadFiles = async () => {
    for (const file of selectedFiles) {
      const formData = new FormData();
      formData.append('file', file);

      try {
        const response = await axios.post(
          `${dataverseApiUrl}files`, // Replace with appropriate endpoint
          formData,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              'Content-Type': 'multipart/form-data',
            },
          }
        );

        // Use response data to associate the file with relevant records
        const fileId = response.data.data.id;
        console.log(`File uploaded with ID: ${fileId}`);
      } catch (error) {
        console.error('Error uploading file:', error);
      }
    }

    // Clear selectedFiles after uploading
    setSelectedFiles([]);
  };
  
  return (
    <div className="file-upload-box">
      <div
        className="rectangle-box"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onClick={handleBoxClick}
      >
        {selectedFiles.length === 0 ? (
          <p className='text'>Click to upload or drag and drop</p>
        ) : (
          selectedFiles.map((file, index) => (
            <div key={index} className="file-preview">
              <button
                className="remove-button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveFile(index);
                }}
              >
                x
              </button>
              <div className="preview-content">
                {file.type.startsWith('image/') ? (
                  <img
                    src={URL.createObjectURL(file)}
                    alt={`File ${index}`}
                    className="file-preview-image"
                  />
                ) : file.type === 'application/pdf' ? (
                  <div className="pdf-preview">
                    <div className="custom-pdf-preview">
                      <img
                        src="https://i.postimg.cc/5tQ8xgJ9/PDF_file_icon.svg.png"
                        alt={`PDF Icon ${index}`}
                        className="pdf-icon"
                      />
                    </div>
                  </div>
                ) : file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ? (
                  <div className="word-preview">
                    <div className="custom-word-preview">
                      <img
                        src="https://i.postimg.cc/XNZ50QVr/Microsoft-Office-Word-2019-present-svg.pnghttps://i.postimg.cc/XNZ50QVr/Microsoft-Office-Word-2019-present-svg.png"
                        alt={`Word Icon ${index}`}
                        className="word-icon"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="other-file-type">
                    <p>{file.name}</p>
                  </div>
                )}
                <p className="file-name">{file.name}</p>
              </div>
            </div>
          ))
        )}
        <input
          ref={fileInputRef}
          type="file"
          multiple
          style={{ display: 'none' }}
          onChange={(e) => handleFileChange(Array.from(e.target.files || []))}
          accept="image/*, application/pdf, application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        />
      </div>
    </div>
  );
};

export default FileUploadBox;